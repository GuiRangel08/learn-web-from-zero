"""Verificação opcional com Python padrão e Chrome já instalado. Sem dependências.
Execute na raiz: python3 tools/check.py
"""
import base64
import http.server
import json
import os
from pathlib import Path
import shutil
import socket
import struct
import subprocess
import tempfile
import threading
import time
import urllib.request


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class Browser:
    def __init__(self, url):
        from urllib.parse import urlparse
        address = urlparse(url)
        self.socket = socket.create_connection((address.hostname, address.port), timeout=15)
        key = base64.b64encode(os.urandom(16)).decode()
        self.socket.sendall((f'GET {address.path} HTTP/1.1\r\nHost: {address.netloc}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n').encode())
        response = b''
        while not response.endswith(b'\r\n\r\n'):
            response += self.socket.recv(1)
        if b'101' not in response:
            raise RuntimeError('Não foi possível conectar ao navegador')
        self.counter = 0
        self.errors = []

    def receive(self, size):
        data = b''
        while len(data) < size:
            chunk = self.socket.recv(size - len(data))
            if not chunk:
                raise RuntimeError('Conexão encerrada')
            data += chunk
        return data

    def call(self, method, params=None):
        self.counter += 1
        payload = json.dumps({'id': self.counter, 'method': method, 'params': params or {}}).encode()
        mask = os.urandom(4)
        size = len(payload)
        header = bytes([0x81, 0x80 | size]) if size < 126 else bytes([0x81, 0x80 | 126]) + struct.pack('!H', size)
        self.socket.sendall(header + mask + bytes(byte ^ mask[i % 4] for i, byte in enumerate(payload)))
        while True:
            header = self.receive(2)
            length = header[1] & 127
            if length == 126:
                length = struct.unpack('!H', self.receive(2))[0]
            elif length == 127:
                length = struct.unpack('!Q', self.receive(8))[0]
            message = json.loads(self.receive(length))
            if message.get('method') == 'Runtime.exceptionThrown':
                self.errors.append(message['params'])
            if message.get('method') == 'Log.entryAdded' and message['params']['entry']['level'] == 'error':
                self.errors.append(message['params']['entry']['text'])
            if message.get('id') == self.counter:
                if 'error' in message:
                    raise RuntimeError(message['error'])
                return message.get('result', {})

    def evaluate(self, expression):
        result = self.call('Runtime.evaluate', {'expression': expression, 'returnByValue': True, 'awaitPromise': True})
        if 'exceptionDetails' in result:
            raise RuntimeError(result['exceptionDetails'])
        return result.get('result', {}).get('value')

    def wait(self, expression, seconds=10):
        deadline = time.time() + seconds
        while time.time() < deadline:
            try:
                value = self.evaluate(f'(() => {{ const value = ({expression}); return typeof value === "object" ? Boolean(value) : value; }})()')
            except RuntimeError:
                value = None  # O contexto é recriado durante a navegação.
            if value:
                return value
            time.sleep(.1)
        details = self.evaluate('({url: location.href, assessment: document.querySelector("#assessment")?.textContent, errors: document.querySelector("#preview-errors")?.textContent})')
        raise RuntimeError(f'Tempo esgotado: {expression}\n{details}\n{self.errors[-10:]}')


def main():
    chrome = shutil.which('google-chrome') or shutil.which('chromium') or shutil.which('chromium-browser')
    if not chrome:
        raise SystemExit('Abra testes.html no navegador, ou instale Chrome/Chromium para usar este verificador opcional.')
    root = Path(__file__).resolve().parent.parent
    os.chdir(root)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), QuietHandler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    with tempfile.TemporaryDirectory(prefix='first-code-check-') as profile:
        process = subprocess.Popen([chrome, '--headless', '--no-sandbox', '--disable-gpu', '--remote-debugging-port=0', f'--user-data-dir={profile}', 'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            port_file = Path(profile) / 'DevToolsActivePort'
            for _ in range(100):
                if port_file.exists():
                    break
                time.sleep(.1)
            port = port_file.read_text().splitlines()[0]
            tabs = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json'))
            browser = Browser(next(tab for tab in tabs if tab['type'] == 'page')['webSocketDebuggerUrl'])
            browser.call('Runtime.enable')
            browser.call('Log.enable')
            browser.call('Page.enable')
            for url in [root.as_uri() + '/testes.html', base + '/testes.html']:
                browser.call('Page.navigate', {'url': url})
                status = browser.wait('document.documentElement.dataset.tests', seconds=90)
                print(url, browser.evaluate('document.querySelector("#test-summary").textContent'))
                if status != 'passed':
                    print(browser.evaluate('[...document.querySelectorAll("#test-results li")].filter(x=>x.textContent.startsWith("✕")).map(x=>x.textContent)'))
                    raise RuntimeError('Falha nos testes unitários/de integração')
            # Fluxo real pela entrada de módulos HTTP, com armazenamento do perfil temporário.
            browser.call('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 1000, 'deviceScaleFactor': 1, 'mobile': False})
            browser.call('Page.navigate', {'url': base + '/servidor.html'})
            browser.wait('document.querySelector(".hero-actions a")')
            browser.evaluate('document.querySelector(".hero-actions a").click()')
            for _ in range(12):
                browser.wait('document.querySelector("#intro-next")')
                browser.evaluate('document.querySelector("#intro-next").click()')
            browser.wait('document.querySelector("#code-input")')
            browser.evaluate('(() => { const input = document.querySelector("#code-input"); input.value = "<h1>Minha página</h1>\\n<p>Meu texto"; input.dispatchEvent(new Event("input")); })()')
            browser.wait('document.querySelector(".assessment-summary.almost")')
            assert browser.evaluate('document.querySelector(".requirements").textContent.includes("</p>")'), 'Falta orientação de fechamento'
            assert browser.evaluate('!JSON.parse(localStorage.getItem(FirstCode.storage.key)).lessons["html-text"].completed'), 'Parágrafo sem fechamento foi concluído'
            print('Regressão: parágrafo aberto não conclui a aula e recebe orientação com linha e fechamento.')
            total = browser.evaluate('FirstCode.lessons.length')
            for index in range(total):
                browser.evaluate(f'''(() => {{
                  const lesson = FirstCode.lessons[{index}];
                  for (const [language, value] of Object.entries(lesson.challenge.solution)) {{
                    const tab = document.querySelector('[data-language="' + language + '"]');
                    if (!tab) continue;
                    tab.click();
                    const input = document.querySelector('#code-input');
                    input.value = value; input.dispatchEvent(new Event('input'));
                  }}
                }})()''')
                browser.wait('document.querySelector(".assessment-summary.complete")')
                if index < total - 1:
                    assert browser.evaluate(f'document.querySelector(".congratulations a").getAttribute("href") === "#/aula/" + FirstCode.lessons[{index + 1}].id')
                    browser.evaluate('document.querySelector(".congratulations a").click()')
                    browser.wait(f'document.querySelector(".lesson-heading h1")?.textContent === FirstCode.lessons[{index + 1}].title')
                if index in (4, 17, 38, total - 1):
                    print(f'Progressão: {index + 1}/{total} aulas concluídas; navegação e transições de módulo OK.')
            count = browser.evaluate('Object.values(JSON.parse(localStorage.getItem(FirstCode.storage.key)).lessons).filter(x=>x.completed).length')
            assert count == total, count
            assert browser.evaluate('document.querySelector(".congratulations a").getAttribute("href") === "#/painel"')
            assert browser.evaluate('!document.querySelector("#preview-frame").srcdoc.includes("const tests =")'), 'Testes não devem alterar a prévia interativa'
            browser.call('Page.reload')
            browser.wait('document.querySelector(".assessment-summary.complete")')
            browser.evaluate('confirm = () => true; document.querySelector("#restore-code").click()')
            assert browser.evaluate('document.querySelector("#code-input").value === FirstCode.lessons.at(-1).starterCode.javascript')
            # Viewport pequeno: abas e documento sem rolagem horizontal.
            browser.call('Emulation.setDeviceMetricsOverride', {'width': 390, 'height': 844, 'deviceScaleFactor': 1, 'mobile': True})
            browser.evaluate('document.querySelector("#toggle-sidebar").click(); document.getElementById("mobile-tab-1").click()')
            assert browser.evaluate('getComputedStyle(document.querySelector("#lesson-panel-1")).display !== "none"')
            assert browser.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Overflow no celular'
            browser.evaluate('document.getElementById("mobile-tab-2").click()')
            assert browser.evaluate('getComputedStyle(document.querySelector("#lesson-panel-2")).display !== "none"')
            print(f'Fluxo HTTP/ES Modules: introdução, {total} aulas, persistência, restauração e abas móveis OK.')
            browser.call('Page.navigate', {'url': root.as_uri() + '/index.html'})
            browser.wait('document.querySelector(".hero")')
            print('Entrada file://: aplicação inicializada sem dependências.')
            # Exceções deliberadas dos testes de iframe não são erros da aplicação.
            app_errors = [e for e in browser.errors if '/assets/js/app.js' in str(e) or '/assets/js/views.js' in str(e)]
            assert not app_errors, app_errors
        finally:
            process.terminate()
            process.wait(timeout=10)
            server.shutdown()


if __name__ == '__main__':
    main()
