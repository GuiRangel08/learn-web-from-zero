(() => {
  class Editor {
    constructor(container, code, languages, onChange, onRun, fontSize = 15) {
      this.container = container; this.code = { ...code }; this.language = 'html'; this.onChange = onChange;
      container.innerHTML = `<div class="editor-tabs" role="tablist" aria-label="Linguagem do código">${languages.map(lang => `<button type="button" role="tab" id="language-${lang}" aria-controls="editor-panel" tabindex="${lang === 'html' ? 0 : -1}" aria-selected="${lang === 'html'}" data-language="${lang}">${lang === 'javascript' ? 'JavaScript' : lang.toUpperCase()}</button>`).join('')}<span class="file-label">index.html</span></div><div class="text-editor" id="editor-panel" role="tabpanel" aria-labelledby="language-html"><div class="line-numbers" aria-hidden="true">1</div><textarea id="code-input" aria-label="Editor de código HTML" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-describedby="editor-help"></textarea></div><p id="editor-help" class="editor-help">Tab: recuar · Esc e depois Tab: sair do editor · Ctrl/Cmd + Enter: executar</p>`;
      this.input = container.querySelector('textarea'); this.lines = container.querySelector('.line-numbers');
      this.input.value = code.html; this.input.style.fontSize = `${fontSize}px`; this.lines.style.fontSize = `${fontSize}px`;
      this.updateLines(); this.allowTabExit = false;
      this.input.addEventListener('input', () => { this.code[this.language] = this.input.value; this.updateLines(); onChange({ ...this.code }); });
      this.input.addEventListener('scroll', () => { this.lines.scrollTop = this.input.scrollTop; });
      this.input.addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); onRun(); }
        if (event.key === 'Escape') this.allowTabExit = true;
        else if (event.key === 'Tab' && !event.shiftKey) {
          if (this.allowTabExit) { this.allowTabExit = false; return; }
          event.preventDefault(); this.insert('  ');
        } else this.allowTabExit = false;
      });
      container.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
        this.language = button.dataset.language;
        container.querySelectorAll('[data-language]').forEach(tab => { tab.setAttribute('aria-selected', String(tab === button)); tab.tabIndex = tab === button ? 0 : -1; });
        container.querySelector('#editor-panel').setAttribute('aria-labelledby', button.id);
        container.querySelector('.file-label').textContent = { html: 'index.html', css: 'style.css', javascript: 'script.js' }[this.language];
        this.input.setAttribute('aria-label', `Editor de código ${button.textContent}`);
        this.input.value = this.code[this.language]; this.updateLines();
      }));
      container.querySelector('.editor-tabs').addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const tabs = [...container.querySelectorAll('[data-language]')], index = tabs.indexOf(document.activeElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].click(); tabs[next].focus();
      });
    }
    insert(text) {
      const { selectionStart: start, selectionEnd: end } = this.input;
      this.input.setRangeText(text, start, end, 'end'); this.input.dispatchEvent(new Event('input'));
    }
    updateLines() { this.lines.textContent = Array.from({ length: this.input.value.split('\n').length }, (_, i) => i + 1).join('\n'); }
    replace(code) { this.code = { ...code }; this.input.value = code[this.language]; this.updateLines(); this.onChange({ ...this.code }); }
    async copy() {
      try { await navigator.clipboard.writeText(this.input.value); return true; }
      catch { this.input.focus(); this.input.select(); try { return document.execCommand('copy'); } catch { return false; } }
    }
  }
  FirstCode.Editor = Editor;
})();
