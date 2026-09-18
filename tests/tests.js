/* Testes executados pelo próprio navegador para usar DOMParser, CSSOM e sandbox reais. */
(async () => {
  const F = FirstCode, tests = [], fixture = document.querySelector('#test-fixture');
  const test = (name, fn) => tests.push({ name, fn });
  const assert = (condition, message = 'Condição não atendida') => { if (!condition) throw new Error(message); };
  const equal = (actual, expected) => assert(actual === expected, `Esperado ${JSON.stringify(expected)}, recebido ${JSON.stringify(actual)}`);
  const code = html => ({ html, css: '', javascript: '' });
  const first = F.htmlLessons[0];
  const check = (requirement, source) => F.evaluator.evaluate({ challenge: { requirements: [{ id: 'test', description: 'Teste', feedback: { success: 'ok', failure: 'ajuste' }, ...requirement }] } }, typeof source === 'string' ? code(source) : source);
  const result = (html) => F.evaluator.evaluate(first, code(html));
  test('Cinco aulas com conteúdo, três dicas e pelo menos quatro requisitos', () => {
    equal(F.htmlLessons.length, 5);
    F.htmlLessons.forEach(l => { assert(l.theory.length >= 6, `Conteúdo ausente: ${l.title}`); equal(l.challenge.hints.length, 3); assert(l.challenge.requirements.length >= 4); equal(F.evaluator.evaluate(l, l.challenge.solution).status, 'complete'); });
  });
  test('Código vazio ou totalmente errado: vermelho e 0%', () => { equal(result('').percentage, 0); equal(result('<button>Oi</button>').status, 'far'); });
  test('Título sem texto: menos de 40%', () => { equal(result('<h1></h1>').passed, 2); equal(result('<h1></h1>').status, 'far'); });
  test('Parcialmente correto: título e fechamentos dão 50%', () => { equal(result('<h1>Olá</h1>').percentage, 50); equal(result('<h1>Olá</h1>').status, 'almost'); });
  test('Sem avaliação: estado neutro', () => equal(F.evaluator.summarize([], false).status, 'neutral'));
  test('Espaços e quebras de linha não alteram a semântica', () => equal(result('<h1>\n  Olá\n</h1>\n\n<p> Meu texto </p>').status, 'complete'));
  test('Elementos extras permitidos, mas exatamente um h1', () => { equal(result('<div><h1>Olá</h1><p>A</p><p>B</p><span>Extra</span></div>').status, 'complete'); equal(result('<h1>A</h1><h1>B</h1><p>C</p>').status, 'almost'); });
  test('Ordem é avaliada pela árvore, e não por texto', () => { const r = result('<p>Antes</p><h1>Depois</h1>'); equal(r.passed, 5); equal(r.results.find(item => item.id === 'order').state, 'pending'); });
  test('Atributos respeitam aspas simples e duplas', () => {
    const r = { type: 'html-attribute', selector: 'a', attribute: 'href', value: 'https://example.com' };
    equal(check(r, '<a href="https://example.com">A</a>').status, 'complete'); equal(check(r, "<a href='https://example.com'>A</a>").status, 'complete'); equal(check(r, '<a>A</a>').status, 'far');
  });
  test('Texto alternativo ausente e vazio são pendentes', () => { const r = { type: 'html-attribute', selector: 'img', attribute: 'alt' }; equal(check(r, '<img src="x">').status, 'far'); equal(check(r, '<img alt="  ">').status, 'far'); equal(check(r, '<img alt="Uma planta">').status, 'complete'); });
  test('DOMParser não deve aprovar estrutura completa inventada pelo navegador', () => { equal(check({ type: 'html-document' }, '<h1>Oi</h1>').status, 'far'); equal(check({ type: 'html-document' }, '<!-- <!DOCTYPE html><html><head></head><body></body></html> -->').status, 'far'); });
  test('Itens precisam estar dentro de listas', () => { const r = { type: 'html-parent', selector: 'li', parent: 'ul,ol' }; equal(check(r, '<ul><li>Um</li></ul>').status, 'complete'); equal(check(r, '<li>Solto</li>').status, 'far'); });
  test('Associação explícita e implícita de label e input', () => { const r = { type: 'html-label' }; equal(check(r, '<label for="nome">Nome</label><input id="nome">').status, 'complete'); equal(check(r, '<label>Nome<input></label>').status, 'complete'); equal(check(r, '<label for="outro">Nome</label><input id="nome">').status, 'far'); });
  test('CSSOM verifica propriedades, Flexbox e seletores', () => { const r = { type: 'css-property', selector: '.box', property: 'display', value: 'flex' }; equal(check(r, { ...code(''), css: '/* comentário */ .box { display: flex; }' }).status, 'complete'); equal(check(r, { ...code(''), css: '.outro { display: flex; }' }).status, 'far'); });
  test('CSSOM verifica Grid, valores aproximados, hover e media query', () => {
    const source = { ...code(''), css: '.grid {display:grid; width:101px} a:hover {color:red} @media (max-width: 600px) {.grid {display:block}}' };
    equal(check({ type: 'css-property', selector: '.grid', property: 'display', value: 'grid' }, source).status, 'complete');
    equal(check({ type: 'css-property', selector: '.grid', property: 'width', approximate: 100, tolerance: 2, unit: 'px' }, source).status, 'complete');
    equal(check({ type: 'css-selector', selector: 'a:hover' }, source).status, 'complete'); equal(check({ type: 'css-media', includes: '600px' }, source).status, 'complete');
  });
  test('Código CSS inválido não interrompe avaliação', () => equal(check({ type: 'css-property', selector: 'p', property: 'color', value: 'red' }, { ...code(''), css: '}{ p { color: definitely-not-a-color; }' }).status, 'far'));
  test('Diagnóstico didático exige fechamentos, mesmo os opcionais na linguagem', () => { assert(F.evaluator.diagnostics('<h1>Oi').length > 0); equal(F.evaluator.diagnostics('<p>Um<p>Dois').length, 2); assert(result('<><h1').status); });
  test('Regressão: parágrafo sem fechamento não conclui o desafio', () => {
    const assessment = result('<h1>Minha página</h1>\n<p>Meu texto');
    equal(assessment.status, 'almost'); equal(assessment.passed, 5); equal(assessment.total, 6);
    const closing = assessment.results.find(r => r.id === 'explicit-closing');
    equal(closing.state, 'partial'); assert(closing.message.includes('Linha 2')); assert(closing.message.includes('</p>'));
    equal(result('<h1>Minha página</h1>\n<p>Meu texto</p>').status, 'complete');
  });
  test('Tags vazias e sua barra opcional não exigem fechamento', () => {
    equal(F.evaluator.diagnostics('<p>Um<br>Dois<br /></p><img src="foto.png" alt="Foto"><meta charset="UTF-8"><input><hr>').length, 0);
    assert(F.evaluator.diagnostics('<img alt="Foto"></img>')[0].includes('não recebe fechamento'));
  });
  test('Fechamentos invertidos, soltos e barras em tags normais geram feedback', () => {
    assert(F.evaluator.diagnostics('<div><p>Texto</div></p>')[0].includes('feche <p>'));
    assert(F.evaluator.diagnostics('<p>Texto</p></p>')[0].includes('falta uma abertura'));
    assert(F.evaluator.diagnostics('<p/>')[0].includes('não fecha esse elemento'));
  });
  test('Comentários, entidades e maior-que em atributos não viram tags', () => {
    equal(F.evaluator.diagnostics('<!-- <p> -->\n<H1 title="a > b">Oi</H1><p>&lt;p&gt;</p>').length, 0);
    assert(F.evaluator.diagnostics('<!-- texto')[0].includes('comentário'));
    assert(F.evaluator.diagnostics('<p title="aberto>Oi</p>')[0].includes('aspa'));
  });
  test('Texto de script, style, textarea e title não é interpretado como tags', () => {
    equal(F.evaluator.diagnostics('<script>const exemplo = "<p>";</script><style>p::after { content: "<div>"; }</style><textarea><h1></textarea><title><p></title>').length, 0);
    assert(F.evaluator.diagnostics('<script>const exemplo = "<p>";')[0].includes('</script>'));
    equal(F.evaluator.diagnostics('<svg><path d="M0 0" /></svg><p>Texto</p>').length, 0);
  });
  test('Todas as cinco aulas rejeitam uma solução com fechamento ausente', () => {
    for (const lesson of F.htmlLessons) {
      const broken = { ...lesson.challenge.solution, html: lesson.challenge.solution.html.replace('</h1>', '') };
      assert(F.evaluator.evaluate(lesson, broken).status !== 'complete', lesson.title);
    }
  });
  test('Limites exatos de pontuação: 39%, 40%, 99% e 100%', () => {
    for (const [weight, status] of [[39, 'far'], [40, 'almost'], [99, 'almost'], [100, 'complete']]) {
      equal(F.evaluator.summarize([{ state: 'completed', weight }, { state: 'pending', weight: 100 - weight }]).status, status);
    }
  });
  test('Pesos futuros e cálculo de percentual', () => { const r = F.evaluator.summarize([{ state: 'completed', weight: 3 }, { state: 'pending', weight: 1 }]); equal(r.percentage, 75); equal(r.status, 'almost'); equal(F.evaluator.summarize([{ state: 'completed' }]).status, 'complete'); });
  test('localStorage: salvar e carregar com adaptador isolado', () => {
    const memory = new Map(), adapter = { getItem: key => memory.get(key), setItem: (key, value) => memory.set(key, value) };
    const state = F.storage.defaults(); F.progress.entry(state, first).code.html = '<h1>Salvo</h1>'; assert(F.storage.save(state, adapter)); equal(F.storage.load(adapter).data.lessons[first.id].code.html, '<h1>Salvo</h1>');
  });
  test('Persistência real com chave isolada e restauração do armazenamento', () => {
    const key = 'first-code:tests', adapter = { getItem: () => localStorage.getItem(key), setItem: (_, value) => localStorage.setItem(key, value) };
    try { const state = F.storage.defaults(); assert(F.storage.save(state, adapter)); equal(F.storage.load(adapter).data.version, 1); } finally { localStorage.removeItem(key); }
  });
  test('Armazenamento corrompido e falta de espaço são tratados', () => { assert(F.storage.load({ getItem: () => '{bad' }).error); equal(F.storage.save(F.storage.defaults(), { setItem: () => { throw new Error('quota'); } }), false); });
  test('Importação valida versão, código e não confia em percentual externo', () => { let rejected = false; try { F.storage.parse('{"version":99,"lessons":{}}'); } catch { rejected = true; } assert(rejected); const state = F.storage.defaults(); state.percentage = 999; equal(F.storage.normalize(state).percentage, 0); });
  test('Desbloqueio é sequencial e aulas futuras continuam bloqueadas', () => { const s = F.storage.defaults(); assert(F.progress.isUnlocked(s, first)); assert(!F.progress.isUnlocked(s, F.htmlLessons[1])); F.progress.entry(s, first).completed = true; assert(F.progress.isUnlocked(s, F.htmlLessons[1])); assert(!F.progress.isUnlocked(s, F.lessons.find(l => !l.available))); equal(F.progress.languages(s, first).join(','), 'html'); });
  test('Restaurar código preserva dicas, tentativas e conquistas', () => { const s = F.storage.defaults(), entry = F.progress.entry(s, first); entry.code.html = 'alteração'; entry.hints = 2; entry.attempts = 4; entry.completed = true; F.progress.restore(s, first); equal(entry.code.html, first.starterCode.html); equal(entry.hints, 2); equal(entry.attempts, 4); assert(entry.completed); });
  test('Editor: alteração, Tab, saída por Esc e execução por atalho', () => {
    const host = document.createElement('div'); fixture.append(host); let changed, runs = 0;
    const editor = new F.Editor(host, code(''), ['html'], c => { changed = c; }, () => runs++);
    editor.input.value = '<h1>Oi</h1>'; editor.input.dispatchEvent(new Event('input')); equal(changed.html, '<h1>Oi</h1>');
    editor.input.setSelectionRange(0, 0); editor.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })); assert(changed.html.startsWith('  '));
    editor.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); const tab = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }); editor.input.dispatchEvent(tab); assert(!tab.defaultPrevented);
    editor.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true })); equal(runs, 1); editor.replace(first.starterCode); equal(editor.input.value, ''); host.remove();
  });
  test('postMessage rejeita origem, janela, token e formato falsos', () => {
    const frame = { contentWindow: {} }; const event = { source: frame.contentWindow, origin: 'null', data: { channel: 'first-code', token: 'abc', type: 'ready' } };
    assert(F.preview.validMessage(event, frame, 'abc')); assert(!F.preview.validMessage({ ...event, origin: 'https://example.com' }, frame, 'abc')); assert(!F.preview.validMessage({ ...event, source: {} }, frame, 'abc')); assert(!F.preview.validMessage(event, frame, 'other')); assert(!F.preview.validMessage({ ...event, data: { ...event.data, extra: true } }, frame, 'abc')); assert(!F.preview.validMessage({ ...event, data: null }, frame, 'abc'));
  });
  test('Preview remove scripts nas aulas HTML e configura CSP', () => {
    const html = F.preview.documentSource(code('<h1 onclick="alert(1)">Oi</h1><script>localStorage.clear()</script>'), 'test');
    assert(html.includes('Content-Security-Policy')); assert(!html.includes('localStorage.clear')); assert(!html.includes('onclick')); assert(html.includes("connect-src 'none'")); assert(!html.includes('allow-same-origin'));
  });
  test('Iframe real: isolamento, execução e comportamento após clique', () => new Promise((resolve, reject) => {
    const frame = document.createElement('iframe'); frame.sandbox = 'allow-scripts'; frame.title = 'Teste isolado'; fixture.append(frame);
    const timeout = setTimeout(() => finish(new Error('Sem resposta do iframe')), 3000);
    const preview = new F.preview.Preview(frame, message => finish(new Error(message)), results => { try { assert(results.click); assert(results.isolated); finish(); } catch (error) { finish(error); } });
    function finish(error) { clearTimeout(timeout); preview.destroy(); frame.remove(); error ? reject(error) : resolve(); }
    preview.run({ html: '<button>Testar</button><p id="output"></p><p id="isolated"></p>', css: '', javascript: `document.querySelector('button').addEventListener('click', function () {document.querySelector('#output').textContent = 'Funcionou';}); try { parent.document.body; } catch { document.querySelector('#isolated').textContent = 'Isolado'; }` }, { allowScripts: true, tests: [{ id: 'click', selector: 'button', action: 'click', output: '#output', expected: 'Funcionou' }, { id: 'isolated', selector: '#isolated', expected: 'Isolado' }] });
  }));
  test('Iframe real: erros JavaScript são recebidos e apresentados', () => new Promise((resolve, reject) => {
    const frame = document.createElement('iframe'); frame.sandbox = 'allow-scripts'; fixture.append(frame);
    const timeout = setTimeout(() => finish(new Error('Erro não foi capturado')), 3000);
    const preview = new F.preview.Preview(frame, message => { try { assert(message.includes('Não foi possível encontrar')); finish(); } catch (error) { finish(error); } });
    function finish(error) { clearTimeout(timeout); preview.destroy(); frame.remove(); error ? reject(error) : resolve(); }
    preview.run({ ...code('<p>Teste</p>'), javascript: "document.querySelector('#ausente').textContent = 'Oi';" }, { allowScripts: true });
  }));
  test('Imagem local do exercício carrega no iframe isolado', () => new Promise((resolve, reject) => {
    const frame = document.createElement('iframe'); frame.sandbox = 'allow-scripts'; fixture.append(frame);
    const timeout = setTimeout(() => finish(new Error('Imagem não respondeu')), 3000);
    function finish(error) { clearTimeout(timeout); removeEventListener('message', receive); frame.remove(); error ? reject(error) : resolve(); }
    function receive(event) { if (F.preview.validMessage(event, frame, 'image-test') && event.data.type === 'results') finish(event.data.results.loaded ? null : new Error('Imagem não carregou')); }
    addEventListener('message', receive);
    frame.srcdoc = F.preview.documentSource({ html: '<img src="imagens/jardim.svg" alt="Planta">', css: '', javascript: `addEventListener('load', () => parent.postMessage({channel:'first-code',token:'image-test',type:'results',results:{loaded:document.querySelector('img').naturalWidth > 0}}, '*'));` }, 'image-test', { allowScripts: true });
  }));
  let passed = 0;
  for (const { name, fn } of tests) {
    const item = document.createElement('li');
    try { await fn(); passed++; item.textContent = `✓ ${name}`; item.className = 'accent'; }
    catch (error) { item.textContent = `✕ ${name}: ${error.message}`; item.style.color = 'var(--red)'; }
    document.querySelector('#test-results').append(item);
  }
  document.querySelector('#test-summary').textContent = `${passed} de ${tests.length} testes passaram.`;
  document.documentElement.dataset.tests = passed === tests.length ? 'passed' : 'failed';
  document.title = `${passed}/${tests.length} testes — Primeiro Código`;
})();
