(() => {
  const F = FirstCode;
  let loaded;
  try { loaded = F.storage.load(); } catch { loaded = { data: F.storage.defaults(), error: 'O armazenamento está indisponível. Exporte seu progresso antes de fechar a página.' }; }
  let state = loaded.data, cleanup = () => {}, flush = () => {}, toastTimer;
  if (matchMedia('(max-width: 900px)').matches) state.preferences.sidebar = false;
  const root = document.querySelector('#app');
  const notify = text => { const notice = document.querySelector('#notice'); notice.textContent = text; notice.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => notice.classList.remove('visible'), 6500); };
  function save() {
    const success = F.storage.save(state);
    const label = document.querySelector('#save-state');
    if (label) label.textContent = success ? '✓ Salvo neste navegador' : 'Não salvo · exporte seu código';
    if (!success) notify('Não foi possível salvar neste navegador. Use Preferências → Exportar progresso para guardar seu trabalho.');
    return success;
  }
  function refreshNavigation() {
    document.querySelector('#sidebar').innerHTML = F.views.sidebar(state);
    document.querySelector('#streak-count').textContent = F.progress.streak(state);
  }
  function render() {
    flush(); cleanup(); flush = () => {}; cleanup = () => {};
    if (matchMedia('(max-width: 900px)').matches) state.preferences.sidebar = false;
    const route = F.router.read();
    if (route.page === 'aula' && !state.introDone) { F.router.go('/introducao'); return; }
    document.documentElement.dataset.theme = state.preferences.theme;
    root.innerHTML = F.views.shell(state);
    document.querySelector('#toggle-sidebar').onclick = event => {
      state.preferences.sidebar = !state.preferences.sidebar;
      document.querySelector('.app-shell').classList.toggle('sidebar-hidden', !state.preferences.sidebar);
      event.currentTarget.setAttribute('aria-expanded', String(state.preferences.sidebar)); save();
    };
    document.querySelector('#theme-toggle').onclick = () => { state.preferences.theme = state.preferences.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = state.preferences.theme; save(); };
    const main = document.querySelector('#main');
    if (route.page === 'inicio') main.innerHTML = F.views.home(state);
    else if (route.page === 'painel') main.innerHTML = F.views.dashboard(state);
    else if (route.page === 'introducao') {
      main.innerHTML = F.views.intro(state);
      document.querySelector('#intro-back').onclick = () => { state.introStep = Math.max(0, state.introStep - 1); save(); render(); };
      document.querySelector('#intro-next').onclick = () => {
        F.progress.touch(state);
        if (state.introStep === F.intro.length - 1) { state.introDone = true; save(); F.router.go(`/aula/${state.currentLesson}`); }
        else { state.introStep++; save(); render(); }
      };
    } else if (route.page === 'configuracoes') { main.innerHTML = F.views.settings(state); bindSettings(); }
    else if (route.page === 'aula') {
      const lesson = F.lessons.find(l => l.id === route.id);
      if (!lesson || !F.progress.isUnlocked(state, lesson)) { main.innerHTML = '<section class="page"><h1>Um passo de cada vez</h1><p>Esta aula ainda não está disponível. Conclua o percurso anterior ou escolha uma aula publicada.</p><a class="button primary" href="#/painel">Ver meu aprendizado</a></section>'; }
      else { state.currentLesson = lesson.id; const entry = F.progress.entry(state, lesson); F.progress.touch(state); main.innerHTML = F.views.lesson(lesson, state); bindLesson(lesson, entry); refreshNavigation(); save(); }
    } else main.innerHTML = '<section class="page"><h1>Página não encontrada</h1><a href="#/painel">Voltar ao aprendizado</a></section>';
    main.focus({ preventScroll: true }); window.scrollTo(0, 0);
  }
  function bindSettings() {
    document.querySelector('#font-size').onchange = event => { state.preferences.fontSize = Number(event.target.value); save(); };
    document.querySelector('#export-progress').onclick = () => F.storage.export(state);
    document.querySelector('#import-progress').onchange = async event => {
      const input = event.target, file = input.files[0]; if (!file) return;
      try {
        if (file.size > 5000000) throw new Error('Escolha um arquivo de até 5 MB.');
        const imported = F.storage.parse(await file.text());
        if (confirm('Substituir o progresso atual pelo arquivo escolhido?')) { state = imported; save(); render(); notify('Progresso importado. Bom aprendizado!'); }
      } catch (error) { notify(`Não foi possível importar: ${error.message}`); }
      input.value = '';
    };
    document.querySelector('#erase-progress').onclick = () => {
      if (!confirm('Apagar todo o progresso, códigos e preferências deste navegador?')) return;
      if (!F.storage.clear()) { notify('Não foi possível apagar os dados do navegador.'); return; }
      state = F.storage.defaults(); F.router.go('/'); notify('Progresso apagado. Vamos começar de novo.');
    };
  }
  function bindLesson(lesson, entry) {
    let timer, dirty = false, runtime = {}, lastAssessment = null;
    const allowed = F.progress.languages(state, lesson);
    const effectiveCode = () => ({ html: entry.code.html, css: allowed.includes('css') ? entry.code.css : '', javascript: allowed.includes('javascript') ? entry.code.javascript : '' });
    const errors = document.querySelector('#preview-errors');
    const addError = text => { if (errors.children.length < 5) { const p = document.createElement('p'); p.textContent = text; errors.append(p); } };
    const runner = new F.preview.Preview(document.querySelector('#preview-frame'), addError, results => { runtime = results; assess(false); });
    const neutral = F.evaluator.summarize(lesson.challenge.requirements.map(r => ({ ...r, state: 'pending' })), false);
    document.querySelector('#assessment').innerHTML = F.views.assessment(neutral, lesson, entry);
    function assess(count = true) {
      const result = F.evaluator.evaluate(lesson, effectiveCode(), runtime);
      if (count) entry.attempts++;
      entry.percentage = result.percentage;
      const newlyCompleted = !entry.completed && result.status === 'complete';
      if (result.status === 'complete') entry.completed = true;
      document.querySelector('#assessment').innerHTML = F.views.assessment(result, lesson, entry);
      document.querySelector('#attempt-count').textContent = `${entry.attempts} avaliações`;
      lastAssessment = result; F.progress.touch(state); save();
      if (newlyCompleted) { refreshNavigation(); notify('Parabéns! Aula concluída e progresso salvo.'); }
    }
    function run(evaluate = true) {
      clearTimeout(timer); dirty = false; errors.replaceChildren(); runtime = {};
      const code = effectiveCode(); F.evaluator.diagnostics(code.html).forEach(addError);
      runner.run(code, { allowScripts: allowed.includes('javascript'), tests: lesson.challenge.requirements.filter(r => r.type === 'js-behavior') });
      if (evaluate) assess(); else save();
    }
    const editor = new F.Editor(document.querySelector('#editor'), entry.code, allowed, code => {
      entry.code = code; dirty = true; document.querySelector('#save-state').textContent = 'Salvando…'; clearTimeout(timer);
      timer = setTimeout(() => { F.progress.touch(state); if (state.preferences.autoRun) run(); else { dirty = false; assess(); } }, 400);
    }, () => run(), state.preferences.fontSize);
    flush = () => { if (dirty) { clearTimeout(timer); F.progress.touch(state); save(); dirty = false; } };
    document.querySelector('#run-code').onclick = () => run();
    document.querySelector('#refresh-preview').onclick = () => run();
    document.querySelector('#verify-code').onclick = () => run();
    document.querySelector('#restore-code').onclick = () => { if (confirm('Restaurar o código inicial desta aula? Suas alterações de código serão substituídas.')) { editor.replace(F.progress.restore(state, lesson)); run(); notify('Código inicial restaurado. As conquistas anteriores foram mantidas.'); } };
    document.querySelector('#clear-code').onclick = () => { if (confirm('Limpar o código da aba atual?')) { editor.replace({ ...entry.code, [editor.language]: '' }); run(); } };
    document.querySelector('#copy-code').onclick = async () => notify(await editor.copy() ? 'Código copiado.' : 'Selecione o código e use Ctrl/Cmd + C para copiar.');
    document.querySelector('#auto-run').onchange = event => { state.preferences.autoRun = event.target.checked; save(); if (event.target.checked) run(); };
    document.querySelectorAll('[data-device]').forEach(button => { if (button.tagName !== 'BUTTON') return; button.onclick = () => { document.querySelector('.preview-viewport').dataset.device = button.dataset.device; document.querySelectorAll('button[data-device]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); }; });
    const panelTabs = [...document.querySelectorAll('[data-panel]')];
    panelTabs.forEach(button => { button.tabIndex = button.dataset.panel === '0' ? 0 : -1; button.onclick = () => { document.querySelector('.workspace').dataset.activePanel = button.dataset.panel; panelTabs.forEach(b => { b.setAttribute('aria-selected', String(b === button)); b.tabIndex = b === button ? 0 : -1; }); }; });
    document.querySelector('.mobile-tabs').onkeydown = event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault(); const index = panelTabs.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? panelTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + panelTabs.length) % panelTabs.length;
      panelTabs[next].click(); panelTabs[next].focus();
    };
    document.querySelector('#hint-button').onclick = event => {
      if (entry.hints >= 3) return; entry.hints++;
      const li = document.createElement('li'); li.textContent = lesson.challenge.hints[entry.hints - 1]; document.querySelector('#hint-list').append(li);
      event.target.textContent = entry.hints === 3 ? 'Todas as dicas exibidas' : `Ver dica ${entry.hints + 1} de 3`; event.target.disabled = entry.hints === 3; save();
    };
    document.querySelector('#solution-button').onclick = () => {
      if (!confirm('Deseja ver a solução completa? Tente as dicas primeiro. A consulta será registrada e você poderá concluir a aula normalmente.')) return;
      entry.solutionViewed = true; save();
      document.querySelector('#solution-area').innerHTML = `<h3>Uma solução possível</h3><pre><code>${F.escape(lesson.challenge.solution.html)}</code></pre><p>${F.escape(lesson.challenge.explanation)}</p><p class="small muted">Consulta registrada. Escreva sua versão no editor para praticar.</p>`;
      if (lastAssessment) document.querySelector('#assessment').innerHTML = F.views.assessment(lastAssessment, lesson, entry);
    };
    document.querySelector('.example-frame').srcdoc = F.preview.documentSource({ html: lesson.example, css: '', javascript: '' }, 'example', { allowScripts: false });
    const removeResizers = bindResizers();
    const keyboardRun = event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && event.target !== editor.input) { event.preventDefault(); run(); } };
    document.addEventListener('keydown', keyboardRun);
    cleanup = () => { clearTimeout(timer); runner.destroy(); removeResizers(); document.removeEventListener('keydown', keyboardRun); };
    run(false);
    if (entry.attempts > 0) assess(false);
  }
  function bindResizers() {
    const workspace = document.querySelector('.workspace');
    const listeners = [];
    for (const [selector, property, initial, min, max, horizontal] of [
      ['#theory-resize', '--theory-width', 30, 20, 45, false], ['#preview-resize', '--result-width', 32, 22, 48, false], ['.horizontal-resize', '--preview-height', 320, 180, 700, true]
    ]) {
      const handle = document.querySelector(selector); let value = initial, start, origin;
      const set = next => { value = Math.max(min, Math.min(max, next)); workspace.style.setProperty(property, `${value}${horizontal ? 'px' : '%'}`); handle.setAttribute('aria-valuenow', String(Math.round(value))); };
      const move = event => { if (start === undefined) return; const delta = horizontal ? event.clientY - start : (event.clientX - start) / workspace.clientWidth * 100 * (selector === '#preview-resize' ? -1 : 1); set(origin + delta); };
      const up = () => { start = undefined; workspace.classList.remove('resizing'); };
      handle.onpointerdown = event => { start = horizontal ? event.clientY : event.clientX; origin = value; handle.setPointerCapture(event.pointerId); workspace.classList.add('resizing'); };
      handle.onpointermove = move; handle.onpointerup = up; handle.onpointercancel = up;
      handle.onkeydown = event => { if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return; event.preventDefault(); set(value + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) * (horizontal ? 20 : 2)); };
      listeners.push(() => { handle.onpointerdown = handle.onpointermove = handle.onpointerup = handle.onpointercancel = handle.onkeydown = null; });
    }
    return () => listeners.forEach(remove => remove());
  }
  addEventListener('hashchange', render);
  document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); document.querySelector('#main')?.focus(); });
  addEventListener('pagehide', () => flush());
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
  render(); if (loaded.error) notify(loaded.error);
})();
