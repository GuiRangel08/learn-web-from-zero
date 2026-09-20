(() => {
  const F = FirstCode;
  const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  F.escape = escape;
  function token() { const bytes = new Uint32Array(4); crypto.getRandomValues(bytes); return [...bytes].map(x => x.toString(16)).join(''); }
  function validMessage(event, frame, id) {
    const d = event.data;
    if (event.source !== frame.contentWindow || event.origin !== 'null' || !d || typeof d !== 'object' || Array.isArray(d) || d.channel !== 'first-code' || d.token !== id) return false;
    if (d.type === 'ready') return Object.keys(d).length === 3;
    if (d.type === 'error') return typeof d.message === 'string' && d.message.length <= 500 && Number.isInteger(d.line) && d.line >= 0 && d.line <= 1000000 && Object.keys(d).length === 5;
    if (d.type === 'results') return Object.keys(d).length === 4 && d.results && typeof d.results === 'object' && !Array.isArray(d.results) && Object.keys(d.results).length <= 100 && Object.entries(d.results).every(([key, value]) => /^[a-z0-9-]{1,80}$/.test(key) && typeof value === 'boolean');
    return false;
  }
  function documentSource(code, id, options = {}) {
    const doc = new DOMParser().parseFromString(code.html, 'text/html');
    // A base e políticas pertencem ao runner, nunca ao documento do aluno.
    doc.querySelectorAll('base, meta[http-equiv]').forEach(el => el.remove());
    // As abas representam os arquivos locais dos exercícios de conexão.
    doc.querySelectorAll('link[rel="stylesheet"][href="style.css"]').forEach(el => el.remove());
    const nonce = token();
    const policy = doc.createElement('meta'); policy.httpEquiv = 'Content-Security-Policy';
    policy.content = `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src data: blob: file: http: https:; connect-src 'none'; font-src 'none'; media-src 'none'; frame-src 'none'; worker-src 'none'; object-src 'none'; form-action 'none'; base-uri 'none'`;
    doc.head.prepend(policy);
    // Recursos didáticos funcionam offline sem conceder acesso ao disco ao iframe.
    doc.querySelectorAll('img[src]').forEach(img => {
      const source = img.getAttribute('src');
      const bundled = F.resources?.[source.replace(/^\.\//, '')];
      if (typeof bundled === 'string') img.setAttribute('src', bundled);
      else { try { img.setAttribute('src', new URL(source, document.baseURI).href); } catch { /* O navegador mostrará o alt. */ } }
    });
    doc.querySelectorAll('script').forEach(script => { if (options.allowScripts && !script.src) script.setAttribute('nonce', nonce); else script.remove(); });
    doc.querySelectorAll('*').forEach(el => [...el.attributes].forEach(attr => { if (/^on/i.test(attr.name)) el.removeAttribute(attr.name); }));
    const style = doc.createElement('style'); style.textContent = code.css.replace(/<\/style/gi, '<\\/style'); doc.head.append(style);
    const bridge = doc.createElement('script'); bridge.setAttribute('nonce', nonce);
    bridge.textContent = `(() => {
      const id = ${JSON.stringify(id)};
      const send = data => parent.postMessage({ channel: 'first-code', token: id, ...data }, '*');
      let errors = 0;
      globalThis.__firstCodeLogs = [];
      globalThis.__firstCodeError = false;
      const originalLog = console.log.bind(console);
      let consoleOutput;
      console.log = (...values) => {
        originalLog(...values);
        if (globalThis.__firstCodeLogs.length >= 100) return;
        globalThis.__firstCodeLogs.push(values);
        if (!consoleOutput && document.body) {
          const section = document.createElement('section');
          const heading = document.createElement('h2'); heading.textContent = 'Saída de console.log';
          consoleOutput = document.createElement('pre');
          section.append(heading, consoleOutput); document.body.append(section);
        }
        if (consoleOutput) consoleOutput.textContent += values.map(value => typeof value === 'string' ? value : JSON.stringify(value)).join(' ').slice(0, 2000) + '\\n';
      };
      const report = (message, line = 0) => { globalThis.__firstCodeError = true; if (errors++ < 6) send({ type: 'error', message: String(message).slice(0, 500), line: Math.max(0, Math.min(1000000, Number(line) || 0)) }); };
      addEventListener('error', e => { report(e.message || 'Um recurso não pôde ser carregado.', e.lineno); e.preventDefault(); });
      addEventListener('unhandledrejection', e => { report(e.reason?.message || 'Uma ação não pôde ser concluída.'); e.preventDefault(); });
      document.addEventListener('click', e => { if (e.target.closest('a')) e.preventDefault(); }, true);
      document.addEventListener('submit', e => e.preventDefault(), true);
      addEventListener('DOMContentLoaded', () => send({ type: 'ready' }));
    })();`;
    policy.after(bridge);
    if (options.allowScripts && code.javascript.trim()) {
      const script = doc.createElement('script'); script.setAttribute('nonce', nonce);
      script.textContent = code.javascript.replace(/<\/script/gi, '<\\/script'); doc.body.append(script);
    }
    if (options.tests?.length) {
      const script = doc.createElement('script'); script.setAttribute('nonce', nonce);
      // Descritores vêm do conteúdo confiável, nunca de código importado pelo aluno.
      script.textContent = `addEventListener('DOMContentLoaded', () => {
        const tests = ${JSON.stringify(options.tests).replace(/</g, '\\u003c')}; const results = {};
        for (const test of tests) { try {
          if (test.kind === 'console') {
            results[test.id] = JSON.stringify(globalThis.__firstCodeLogs) === JSON.stringify(test.expectedLogs);
            continue;
          }
          for (const step of test.steps || [test]) {
            if (!step.action) continue;
            const target = document.querySelector(step.selector);
            if (step.action === 'click') target.click();
            if (step.action === 'input') { target.value = step.input; target.dispatchEvent(new Event('input', { bubbles: true })); }
            if (step.action === 'submit') target.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
          const outputs = [...document.querySelectorAll(test.output || test.selector)];
          if (test.count !== undefined) {
            results[test.id] = outputs.length === test.count && (test.expected === undefined || outputs.every(el => el.textContent.trim() === test.expected));
          } else {
            const output = outputs[0];
            results[test.id] = Boolean(output && (test.type === 'css-computed' ? getComputedStyle(output).getPropertyValue(test.property).trim() === test.expected : test.className ? output.classList.contains(test.className) : String(test.property ? output[test.property] : output.textContent).trim() === test.expected));
          }
        } catch { results[test.id] = false; } }
        if (globalThis.__firstCodeError) Object.keys(results).forEach(key => { results[key] = false; });
        parent.postMessage({channel:'first-code', token:${JSON.stringify(id)}, type:'results', results}, '*');
      });`;
      doc.body.append(script);
    }
    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  }
  class Preview {
    constructor(frame, onError, onResults = () => {}) {
      this.frame = frame; this.onError = onError; this.onResults = onResults; this.id = ''; this.errors = 0;
      this.listener = event => {
        if (!validMessage(event, this.frame, this.id)) return;
        if (event.data.type === 'ready') clearTimeout(this.timer);
        if (event.data.type === 'results') this.onResults(event.data.results);
        if (event.data.type === 'error') {
          this.errors++;
          const { line, message } = event.data;
          this.onError(/null|undefined/.test(message) ? 'Não foi possível encontrar o elemento solicitado. Confira seu nome e se ele já existe na página.' : `O JavaScript encontrou um erro${line ? ` na linha ${line} do documento gerado` : ''}: ${message}`);
          if (this.errors >= 5) { this.stop(); this.onError('A prévia foi interrompida após erros repetidos. Corrija o código e pressione Executar.'); }
        }
      };
      addEventListener('message', this.listener);
    }
    run(code, options) {
      clearTimeout(this.timer); this.id = token(); this.errors = 0;
      this.frame.srcdoc = documentSource(code, this.id, options);
      this.timer = setTimeout(() => this.onError('A prévia demorou para responder. Use Executar para tentar novamente.'), 4000);
    }
    invalidate() { clearTimeout(this.timer); this.id = ''; }
    stop() { clearTimeout(this.timer); this.id = ''; this.frame.srcdoc = '<p>Prévia interrompida. Pressione Executar para recomeçar.</p>'; }
    destroy() { clearTimeout(this.timer); removeEventListener('message', this.listener); }
  }
  F.preview = { Preview, documentSource, validMessage };
})();
