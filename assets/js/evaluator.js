(() => {
  const F = FirstCode;
  const hasText = el => Boolean(el?.textContent.trim());
  // Regra didática do código escrito, independente das correções do DOMParser.
  // Não pretende substituir um validador completo da especificação HTML.
  function inspectHtml(source) {
    const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
    const rawTextTags = new Set(['script', 'style', 'textarea', 'title']);
    const stack = [], issues = [];
    let cursor = 0, elements = 0;
    const lineAt = index => source.slice(0, index).split('\n').length;
    const report = (index, message) => { if (issues.length < 10) issues.push(`Linha ${lineAt(index)}: ${message}`); };
    while (cursor < source.length && issues.length < 10) {
      const start = source.indexOf('<', cursor);
      if (start === -1) break;
      if (source.startsWith('<!--', start)) {
        const end = source.indexOf('-->', start + 4);
        if (end === -1) { report(start, 'o comentário não foi terminado. Acrescente --> ao final dele.'); break; }
        cursor = end + 3; continue;
      }
      const opening = /^<(\/?)([a-z][a-z0-9:-]*)(?=[\s/>]|$)/i.exec(source.slice(start));
      const declaration = /^<!doctype\b/i.test(source.slice(start));
      if (!opening && !declaration) { cursor = start + 1; continue; }
      let end = start + 1, quote = '';
      for (; end < source.length; end++) {
        const char = source[end];
        if (quote) { if (char === quote) quote = ''; }
        else if (char === '"' || char === "'") quote = char;
        else if (char === '>') break;
        else if (char === '<') break;
      }
      if (source[end] !== '>') { report(start, quote ? 'uma aspa ficou aberta. Feche o valor do atributo com a mesma aspa e termine a tag com >.' : 'a marca ficou incompleta. Termine a tag com >.'); break; }
      cursor = end + 1;
      if (declaration) continue;
      const closing = Boolean(opening[1]), tag = opening[2].toLowerCase();
      const foreign = tag === 'svg' || tag === 'math' || Boolean(stack.at(-1)?.foreign);
      if (closing) {
        if (voidTags.has(tag) && !foreign) { report(start, `<${tag}> não recebe fechamento. Remova </${tag}>.`); continue; }
        const index = stack.map(item => item.tag).lastIndexOf(tag);
        if (index === -1) { report(start, `encontrei </${tag}>, mas falta uma abertura <${tag}> correspondente.`); continue; }
        if (index !== stack.length - 1) report(start, `antes de </${tag}>, feche <${stack.at(-1).tag}> (aberta na linha ${lineAt(stack.at(-1).start)}). Feche primeiro o elemento que está dentro.`);
        stack.length = index;
      } else {
        elements++;
        if (voidTags.has(tag) && !foreign) continue;
        if (/\/\s*>$/.test(source.slice(start, end + 1))) {
          if (foreign) continue;
          report(start, `<${tag}/> não fecha esse elemento em HTML. Escreva uma abertura <${tag}> e um fechamento </${tag}>.`);
        }
        stack.push({ tag, start, foreign });
        if (rawTextTags.has(tag) && !foreign) {
          const close = new RegExp(`</${tag}\\s*>`, 'gi'); close.lastIndex = cursor;
          const match = close.exec(source);
          cursor = match ? match.index : source.length;
        }
      }
    }
    for (const item of stack.reverse()) report(item.start, `você abriu <${item.tag}>, mas não escreveu </${item.tag}>. Acrescente o fechamento depois do conteúdo desse elemento.`);
    return { elements, issues };
  }
  function cssRules(css) {
    const doc = document.implementation.createHTMLDocument('');
    const style = doc.createElement('style'); style.textContent = css; doc.head.append(style);
    const result = [];
    function walk(rules, media = '') {
      for (const rule of rules || []) {
        if (rule.selectorText) result.push({ selector: rule.selectorText, style: rule.style, media });
        if (rule.cssRules) walk(rule.cssRules, rule.conditionText || media);
      }
    }
    walk(style.sheet?.cssRules); return result;
  }
  const validators = {
    'html-explicit-closing': (r, c) => ({ pass: c.sourceInspection.elements > 0 && c.sourceInspection.issues.length === 0, partial: c.sourceInspection.elements > 0, message: c.sourceInspection.issues[0] }),
    'html-element': (r, c) => { const count = c.doc.querySelectorAll(r.selector).length; const target = r.exact ?? r.minimum ?? 1; return { pass: r.exact !== undefined ? count === target : count >= target, partial: count > 0 }; },
    'html-text': (r, c) => { const elements = [...c.doc.querySelectorAll(r.selector)]; return { pass: elements.length > 0 && elements.every(hasText), partial: elements.some(hasText) }; },
    'html-attribute': (r, c) => {
      const elements = [...c.doc.querySelectorAll(r.selector)];
      return { pass: elements.length > 0 && elements.every(el => {
        const value = el.getAttribute(r.attribute); if (value === null) return false;
        if (r.value !== undefined) return value.trim() === r.value;
        if (r.includes !== undefined) return value.replace(/\s/g, '').includes(r.includes);
        return r.allowEmpty || value.trim().length > 0;
      }), partial: elements.some(el => el.hasAttribute(r.attribute)) };
    },
    'html-order': (r, c) => { const first = c.doc.querySelector(r.selector), second = c.doc.querySelector(r.before); return { pass: Boolean(first && second && first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING) }; },
    'html-parent': (r, c) => { const elements = [...c.doc.querySelectorAll(r.selector)]; const check = el => r.direct === false ? el.parentElement?.closest(r.parent) : el.parentElement?.matches(r.parent); return { pass: elements.length > 0 && elements.every(check), partial: elements.some(check) }; },
    'html-document': (r, c) => ({ pass: /^\s*<!doctype\s+html\s*>\s*<html\b[^>]*>\s*<head\b[^>]*>[\s\S]*?<\/head\s*>\s*<body\b[^>]*>[\s\S]*?<\/body\s*>\s*<\/html\s*>\s*$/i.test(c.clean) }),
    'html-label': (r, c) => { const inputs = [...c.doc.querySelectorAll(r.selector || 'input:not([type=hidden])')]; return { pass: inputs.length > 0 && inputs.every(input => [...c.doc.querySelectorAll('label')].some(label => hasText(label) && (label.contains(input) || Boolean(input.id && label.htmlFor === input.id)))) }; },
    'css-selector': (r, c) => ({ pass: c.rules.some(rule => rule.selector.split(',').map(s => s.trim()).includes(r.selector)) }),
    'css-property': (r, c) => ({ pass: c.rules.some(rule => {
      if (!rule.selector.split(',').map(s => s.trim()).includes(r.selector)) return false;
      const value = rule.style.getPropertyValue(r.property).trim();
      if (r.approximate !== undefined) return Number.isFinite(parseFloat(value)) && Math.abs(parseFloat(value) - r.approximate) <= (r.tolerance || 0) && (!r.unit || value.endsWith(r.unit));
      return r.value === undefined ? Boolean(value) : value.toLowerCase() === r.value.toLowerCase();
    }) }),
    'css-media': (r, c) => ({ pass: c.rules.some(rule => Boolean(rule.media) && (!r.includes || rule.media.includes(r.includes))) }),
    'js-source': (r, c) => ({ pass: new RegExp(r.pattern, r.flags || '').test(c.code.javascript) }),
    'js-behavior': (r, c) => ({ pass: c.runtime?.[r.id] === true })
  };
  function summarize(results, evaluated = true) {
    const totalWeight = results.reduce((sum, r) => sum + (r.weight ?? 1), 0);
    const passed = results.filter(r => r.state === 'completed').length;
    const percentage = totalWeight ? results.reduce((sum, r) => sum + (r.state === 'completed' ? (r.weight ?? 1) : 0), 0) / totalWeight * 100 : 0;
    return { results, passed, percentage, total: results.length, status: !evaluated ? 'neutral' : percentage === 100 ? 'complete' : percentage < 40 ? 'far' : 'almost' };
  }
  function evaluate(lesson, code, runtime = {}) {
    const clean = code.html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
    const context = { doc: new DOMParser().parseFromString(code.html, 'text/html'), code, clean, rules: cssRules(code.css), runtime, sourceInspection: inspectHtml(code.html) };
    return summarize(lesson.challenge.requirements.map(r => {
      let result;
      try { result = validators[r.type]?.(r, context) || { pass: false }; } catch { result = { pass: false }; }
      return { ...r, state: result.pass ? 'completed' : result.partial ? 'partial' : 'pending', message: result.pass ? r.feedback.success : result.message || r.feedback.failure };
    }));
  }
  function diagnostics(html) {
    return inspectHtml(html).issues;
  }
  F.evaluator = { evaluate, summarize, validators, cssRules, diagnostics, inspectHtml };
})();
