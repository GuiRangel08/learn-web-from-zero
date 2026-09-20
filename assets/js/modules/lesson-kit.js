(() => {
  const F = FirstCode;
  const code = (html = '', css = '', javascript = '') => ({ html, css, javascript });
  const check = (description, type, options, failure) => ({
    description, type, ...options, weight: 1,
    feedback: { success: 'Este critério foi atendido.', failure }
  });
  const element = (selector, description, minimum = 1) => check(description, 'html-element', { selector, minimum }, `Revise a estrutura pedida: ${description}.`);
  const text = (selector, description) => check(description, 'html-text', { selector }, 'Escreva conteúdo entre a tag de abertura e a tag de fechamento do elemento pedido.');
  const attr = (selector, attribute, value, description) => check(description, 'html-attribute', { selector, attribute, value }, `Na abertura do elemento pedido, use o atributo ${attribute}=${JSON.stringify(value)}.`);
  const css = (selector, property, value) => check(`${selector}: ${property}: ${value}`, 'css-property', { selector, property, value }, `Na regra ${selector}, escreva ${property}: ${value};`);
  const source = (pattern, description) => check(description, 'js-source', { pattern }, `Revise o conceito desta aula: ${description}. Combine-o com o resultado solicitado.`);
  const behavior = (description, options) => check(description, 'js-behavior', options, 'Execute o código e confira o resultado pedido, inclusive depois das interações descritas.');
  function lesson(moduleId, order, data) {
    const [title, concept, analogy, syntax, visual, task, starterCode, solution, requirements, hints, mistakes, explanation] = data;
    const exampleCode = solution;
    return {
      id: `${moduleId}-planned-${order}`, moduleId, order: moduleId === 'html' ? order + 5 : order,
      title, duration: '12 min', description: concept[0][1], available: true,
      theory: [
        ['O que vamos aprender', concept[0][1]],
        ...concept.slice(1),
        ['Uma comparação', analogy],
        ['Leia o exemplo', explanation],
        ['Experimente por partes', `Observe o exemplo abaixo e seu resultado: ${visual} Depois tente o desafio no editor. Altere uma parte por vez e use Executar para conferir.`],
        ['Confira se entendeu', `Antes de escrever, tente explicar com suas palavras: ${concept[0][0]}. Compare sua resposta com as explicações anteriores.`]
      ],
      syntax, example: solution[moduleId === 'html' ? 'html' : moduleId], exampleCode, visual,
      commonMistakes: mistakes,
      bestPractices: ['Use nomes que expressem a intenção do código.', 'Teste uma alteração por vez e leia o feedback de cada requisito.'],
      starterCode,
      challenge: { title, description: task, requirements: requirements.map((r, i) => ({ ...r, id: `step-${i + 1}` })), hints, solution, explanation },
      summary: explanation, unlocks: []
    };
  }
  F.lessonKit = { code, check, element, text, attr, css, source, behavior, lesson };
})();
