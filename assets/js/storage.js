(() => {
  const F = FirstCode;
  const KEY = 'learning-platform:v1';
  const defaults = () => ({ version: 1, currentLesson: 'html-text', introStep: 0, introDone: false, lessons: {}, percentage: 0, lastActivity: null, activityDays: [], preferences: { theme: 'dark', fontSize: 15, autoRun: true, sidebar: true } });
  const integer = (value, max = 1000000) => Number.isInteger(value) && value >= 0 && value <= max;
  function normalize(input) {
    if (!input || typeof input !== 'object' || input.version !== 1 || !input.lessons || typeof input.lessons !== 'object') throw new Error('Este arquivo não é um progresso da versão 1.');
    const result = defaults();
    if (typeof input.currentLesson === 'string' && F.lessons.some(l => l.available && l.id === input.currentLesson)) result.currentLesson = input.currentLesson;
    result.introStep = integer(input.introStep, F.intro.length - 1) ? input.introStep : 0;
    result.introDone = input.introDone === true;
    result.lastActivity = typeof input.lastActivity === 'string' && Number.isFinite(Date.parse(input.lastActivity)) ? input.lastActivity : null;
    result.activityDays = Array.isArray(input.activityDays) ? [...new Set(input.activityDays.filter(d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)))].slice(-366) : [];
    const p = input.preferences || {};
    result.preferences = { theme: p.theme === 'light' ? 'light' : 'dark', fontSize: [13, 15, 17, 19].includes(p.fontSize) ? p.fontSize : 15, autoRun: p.autoRun !== false, sidebar: p.sidebar !== false };
    for (const lesson of F.lessons.filter(l => l.available)) {
      const entry = input.lessons[lesson.id];
      if (!entry || typeof entry !== 'object') continue;
      if (!entry.code || ['html', 'css', 'javascript'].some(k => typeof entry.code[k] !== 'string' || entry.code[k].length > 200000)) throw new Error('O arquivo contém código ausente ou muito grande.');
      result.lessons[lesson.id] = {
        code: { html: entry.code.html, css: entry.code.css, javascript: entry.code.javascript },
        completed: entry.completed === true, attempts: integer(entry.attempts) ? entry.attempts : 0,
        hints: integer(entry.hints, 3) ? entry.hints : 0, solutionViewed: entry.solutionViewed === true,
        percentage: typeof entry.percentage === 'number' && Number.isFinite(entry.percentage) ? Math.max(0, Math.min(100, entry.percentage)) : 0
      };
    }
    result.percentage = Math.round(Object.values(result.lessons).filter(l => l.completed).length / F.lessons.length * 100);
    return result;
  }
  F.storage = {
    key: KEY, defaults, normalize,
    migrate(input) { return normalize(input); },
    load(adapter = globalThis.localStorage) {
      try { const value = adapter.getItem(KEY); return { data: value ? this.migrate(JSON.parse(value)) : defaults(), error: null }; }
      catch { return { data: defaults(), error: 'Não foi possível ler o progresso. Os dados antigos não foram apagados; exporte seu trabalho antes de sair.' }; }
    },
    save(data, adapter) {
      try { (adapter || globalThis.localStorage).setItem(KEY, JSON.stringify(normalize(data))); return true; }
      catch { return false; }
    },
    parse(text) { if (text.length > 5000000) throw new Error('O arquivo é grande demais (limite: 5 MB).'); return this.migrate(JSON.parse(text)); },
    export(data) {
      const url = URL.createObjectURL(new Blob([JSON.stringify(normalize(data), null, 2)], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = 'primeiro-codigo-progresso.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    clear() { try { localStorage.removeItem(KEY); return true; } catch { return false; } }
  };
})();
