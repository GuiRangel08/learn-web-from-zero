/* O namespace permite reutilizar o conteúdo tanto via file:// como via ES Modules. */
globalThis.FirstCode = globalThis.FirstCode || {};
(() => {
  const code = html => ({ html, css: '', javascript: '' });
  const requirement = (id, description, type, options, success, failure) => ({
    id, description, type, ...options, weight: 1, feedback: { success, failure }
  });
  const element = (id, selector, description, minimum = 1) => requirement(id, description, 'html-element', { selector, minimum }, `Você criou ${description.toLowerCase()}.`, `Use ${selector} para ${description.toLowerCase()}.`);
  const text = (id, selector, description) => requirement(id, description, 'html-text', { selector }, 'Esse elemento tem texto. Muito bem!', `Escreva um texto entre a abertura e o fechamento de ${selector}.`);
  const attribute = (id, selector, name, description, value) => requirement(id, description, 'html-attribute', { selector, attribute: name, value }, `${name} está preenchido corretamente.`, `Confira o atributo ${name} em ${selector}. ${value ? `O valor pedido é "${value}".` : 'Ele precisa ter um valor.'}`);
  const documentSolution = '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Minha primeira página</title>\n</head>\n<body>\n  <h1>Olá, mundo!</h1>\n</body>\n</html>';
  FirstCode.htmlLessons = [
    {
      id: 'html-text', moduleId: 'html', order: 1, title: 'Títulos e parágrafos', duration: '8 min', description: 'Transforme palavras em sua primeira página.', available: true,
      theory: [
        ['O que vamos aprender', 'Texto simples já aparece no navegador. Para dizer que uma parte é um título, usamos uma marca chamada tag. Vamos criar um título e, depois, um parágrafo.'],
        ['Por que isso existe?', 'O navegador precisa saber qual texto é o título e qual é o conteúdo. HTML é a linguagem que dá essa estrutura à página.'],
        ['Um conceito: tag', 'Em <h1>, os sinais < e > delimitam a marca. h1 é o nome da tag. <h1> abre o título. </h1> fecha: a barra / indica o final. O texto fica entre as duas.'],
        ['Analogia cotidiana', 'Pense na capa de um caderno: o título identifica o assunto; as frases abaixo contam a história.'],
        ['Um conceito: elemento', 'A abertura, o texto e o fechamento juntos formam um elemento: <h1>Olá, mundo!</h1>. O navegador mostra o texto maior; as marcas não aparecem.'],
        ['Depois do título: parágrafo', 'A tag p marca um parágrafo, um bloco de texto. Ela também abre e fecha: <p>Estou aprendendo.</p>. h1 é o título principal; h2 até h6 são níveis de subtítulos, não escolhas de tamanho.'],
        ['Exercício guiado', 'No editor, escreva <h1>Olá, mundo!</h1>. Observe o resultado. Em uma nova linha, adicione <p>Estou aprendendo.</p>. Depois crie seu próprio texto para o desafio.']
      ],
      syntax: '<h1>Olá, mundo!</h1>', example: '<h1>Meu caderno</h1>\n<p>Hoje escrevi minha primeira página.</p>', visual: 'Um título grande “Meu caderno” e uma frase abaixo dele.',
      commonMistakes: ['Não esquecer a barra no fechamento: </h1>.', 'Uma quebra de linha no código não cria outro parágrafo: use p.'], bestPractices: ['Use um h1 para o assunto principal.', 'Títulos organizados ajudam pessoas que usam leitores de tela, programas que leem o conteúdo em voz alta.'],
      starterCode: code(''), challenge: {
        title: 'Sua primeira mensagem', description: 'Apresente sua página com exatamente um título principal e pelo menos um parágrafo abaixo. Escolha suas próprias palavras.',
        requirements: [requirement('one-h1', 'Exatamente um título h1', 'html-element', { selector: 'h1', exact: 1 }, 'Você criou um único título principal.', 'Crie apenas um título principal usando h1.'), text('title-text', 'h1', 'Título com texto'), element('paragraph', 'p', 'Um parágrafo'), text('paragraph-text', 'p', 'Parágrafo com texto'), requirement('order', 'Título antes do primeiro parágrafo', 'html-order', { selector: 'h1', before: 'p' }, 'O título aparece antes do parágrafo.', 'Coloque o título acima do primeiro parágrafo.')],
        hints: ['Separe o nome da página da frase que a apresenta.', 'Use h1 para o título e p para o parágrafo. Ambas precisam de fechamento.', 'Um subtítulo seria <h2>Meu assunto</h2>. Para o título principal, use o nível 1.'],
        solution: code('<h1>Minha primeira página</h1>\n<p>Estou aprendendo a criar para a web.</p>'), explanation: 'h1 identifica o assunto principal. p contém uma frase. A ordem no arquivo determina a ordem de leitura.'
      }, summary: 'Tags dão significado ao texto. h1 é o título principal; p é um parágrafo.', unlocks: ['html-document']
    },
    {
      id: 'html-document', moduleId: 'html', order: 2, title: 'Estrutura básica do HTML', duration: '12 min', description: 'Dê uma casa para os elementos da sua página.', available: true,
      theory: [
        ['O que vamos aprender', 'Você já criou um título. Agora vamos colocá-lo em um documento completo. Leia uma linha por vez; você não precisa decorar tudo.'],
        ['Por que isso existe?', 'Um documento guarda informações sobre a página e separa essas informações do conteúdo que será mostrado.'],
        ['Analogia cotidiana', 'Um livro tem uma ficha com idioma e título, e páginas com a história. head é a ficha; body guarda o conteúdo visível.'],
        ['Linha 1: declaração', '<!DOCTYPE html> avisa que usamos o HTML atual. Não é uma tag de conteúdo e não tem fechamento.'],
        ['Linha 2: html e um atributo', 'html envolve a página. Um atributo é uma informação extra na abertura de uma tag. Em lang="pt-BR", lang informa o idioma; = liga o nome ao valor; as aspas delimitam o valor pt-BR (português do Brasil).'],
        ['Linha 3: head', 'head abre a área de informações sobre a página. Esse conteúdo não é o texto principal exibido.'],
        ['Linha 4: letras e acentos', 'meta informa configurações. charset="UTF-8" permite interpretar letras e acentos. meta não tem tag de fechamento.'],
        ['Linha 5: tela do dispositivo', 'Outra meta usa name="viewport" para identificar a configuração de tela. Em content, width=device-width pede a largura do aparelho e initial-scale=1.0 começa sem ampliação. A vírgula separa essas duas configurações; o ponto em 1.0 separa a parte decimal.'],
        ['Linha 6: título da aba', 'title define o nome mostrado na aba do navegador. Não substitui o título h1 dentro da página.'],
        ['Linha 7: fim das informações', '</head> fecha a área de configurações.'],
        ['Linhas 8 e 9: conteúdo', 'body abre o corpo da página. Dentro dele, o h1 que você já conhece será mostrado ao visitante.'],
        ['Linhas 10 e 11: fechamento', '</body> fecha o conteúdo. </html> fecha o documento. Feche os elementos internos antes dos externos.'],
        ['Exercício guiado', 'Observe o exemplo completo. No editor, a estrutura já está começada. Acrescente lang na abertura de html, as configurações dentro de head e um título dentro de body.']
      ], syntax: '<head>\n  <title>Minha página</title>\n</head>\n<body>\n  <h1>Olá!</h1>\n</body>', example: documentSolution, visual: 'A página exibe “Olá, mundo!”. O title dá nome à aba quando você abre o arquivo fora desta plataforma.',
      commonMistakes: ['Colocar conteúdo visível em head em vez de body.', 'Esquecer lang ou usar uma codificação que não reconhece acentos.'], bestPractices: ['Informe o idioma para ajudar leitores de tela.', 'Mantenha as linhas internas recuadas com espaços para facilitar a leitura.'],
      starterCode: code('<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n</body>\n</html>'), challenge: {
        title: 'Uma casa para sua página', description: 'Complete o documento com idioma, configurações de acentos e tela, título da aba e um h1 visível.',
        requirements: [requirement('structure', 'Declarar doctype, html, head e body', 'html-document', {}, 'As partes do documento estão presentes e na ordem certa.', 'Mantenha <!DOCTYPE html>, html, head e body com seus fechamentos, nessa ordem.'), attribute('language', 'html', 'lang', 'Idioma pt-BR', 'pt-BR'), attribute('charset', 'head meta[charset]', 'charset', 'Codificação UTF-8', 'UTF-8'), requirement('viewport', 'Configuração de tela do dispositivo', 'html-attribute', { selector: 'head meta[name="viewport"]', attribute: 'content', includes: 'width=device-width' }, 'A largura acompanha o aparelho.', 'Adicione a meta viewport com content="width=device-width, initial-scale=1.0".'), text('page-title', 'head title', 'Título da aba preenchido'), text('body-title', 'body h1', 'Título h1 dentro de body')],
        hints: ['Separe informações da página e conteúdo visível.', 'lang pertence a html; meta e title ficam em head; h1 fica em body.', 'Para informar outro idioma, escreveríamos <html lang="es">. Aqui, use português do Brasil.'], solution: code(documentSolution), explanation: 'A declaração inicia o arquivo. html informa o idioma, head configura a página e body contém o título visível.'
      }, summary: 'Um documento tem configurações em head e conteúdo em body. Atributos acrescentam informações às tags.', unlocks: ['html-links']
    },
    {
      id: 'html-links', moduleId: 'html', order: 3, title: 'Links e seus destinos', duration: '8 min', description: 'Conecte sua página a outro lugar.', available: true,
      theory: [
        ['O que vamos aprender', 'Um link é um texto que pode ser acionado para abrir outro endereço. A tag a cria esse elemento.'],
        ['Por que isso existe?', 'Links conectam páginas. Sem eles, precisaríamos digitar cada endereço à mão.'],
        ['Explicação simples', 'URL é o endereço de um recurso na web, como https://developer.mozilla.org/pt-BR/. O atributo href informa o destino do link. https indica uma conexão protegida; : e // separam essa indicação do nome do site. Os pontos separam partes do nome; / separa partes do caminho.'],
        ['Analogia cotidiana', 'O texto do link é a placa de uma estrada. href é o endereço para onde ela aponta.'],
        ['Lendo os símbolos', 'Em href="https://example.com", = liga o atributo ao seu valor. As aspas guardam o endereço inteiro. O texto entre <a> e </a> é o que a pessoa vê e aciona.'],
        ['Exercício guiado', 'Escreva <a href="https://example.com">Visitar exemplo</a>. Troque primeiro o texto. Para o desafio, troque também o destino pelo endereço solicitado. Na prévia isolada, a navegação externa é bloqueada; isso não significa que seu link está errado.']
      ], syntax: '<a href="https://example.com">Visitar exemplo</a>', example: '<h1>Minha leitura</h1>\n<p>Um lugar para aprender:</p>\n<a href="https://example.com">Conhecer o site de exemplo</a>', visual: 'Um texto sublinhado indica o link. A tecla Tab pode levar o foco até ele.',
      commonMistakes: ['Escrever o endereço fora de href.', 'Usar um texto vago como “clique aqui”, sem dizer o destino.'], bestPractices: ['Descreva o destino no texto do link.', 'Atributos comuns: href é o destino; title é uma informação complementar e não substitui um texto claro.'],
      starterCode: code('<h1>Meu guia de estudos</h1>\n<p>Encontre uma referência de HTML:</p>\n'), challenge: {
        title: 'Uma referência para aprender', description: 'Mantenha o título e o parágrafo. Adicione um link com texto para https://developer.mozilla.org/pt-BR/.',
        requirements: [text('heading', 'h1', 'Título preenchido'), text('paragraph', 'p', 'Parágrafo preenchido'), element('link', 'a', 'Um link'), attribute('destination', 'a', 'href', 'Destino solicitado', 'https://developer.mozilla.org/pt-BR/'), text('link-text', 'a', 'Texto do link preenchido')],
        hints: ['Um link precisa de um destino e de uma descrição visível.', 'A tag é a. O destino vai no atributo href, na abertura.', 'Exemplo de outro destino: <a href="https://example.org">Site de exemplo</a>.'], solution: code('<h1>Meu guia de estudos</h1>\n<p>Encontre uma referência de HTML:</p>\n<a href="https://developer.mozilla.org/pt-BR/">Ler a documentação da Web</a>'), explanation: 'a cria o link; href guarda o endereço. O texto descreve a referência que será aberta.'
      }, summary: 'Um link usa a, recebe um endereço em href e oferece um texto descritivo.', unlocks: ['html-images']
    },
    {
      id: 'html-images', moduleId: 'html', order: 4, title: 'Imagens e texto alternativo', duration: '10 min', description: 'Mostre uma imagem sem deixar ninguém de fora.', available: true,
      theory: [
        ['O que vamos aprender', 'img coloca uma imagem na página. Ela precisa de src, que informa o arquivo, e alt, que descreve a imagem em texto.'],
        ['Por que isso existe?', 'Uma imagem pode comunicar algo que o texto sozinho não mostra. A descrição alternativa leva essa informação a quem não pode vê-la.'],
        ['Analogia cotidiana', 'src é a localização de uma foto no álbum; alt é alguém explicando o que há nela.'],
        ['Um conceito: caminho relativo', 'Um caminho é uma indicação de onde está um arquivo. imagens/jardim.svg significa: entre na pasta imagens e abra jardim.svg. É relativo porque começa na pasta da página, em vez de indicar um endereço completo. / separa as partes. .svg é uma extensão de imagem.'],
        ['Uma tag sem fechamento', 'img é um elemento vazio: não envolve texto e não usa </img>. src e alt ficam entre < e >, cada um com = e um valor entre aspas.'],
        ['A imagem deste exercício', 'A plataforma fornece imagens/jardim.svg: uma ilustração de uma planta verde em um vaso. Esse caminho funciona aqui e na pasta do projeto. Para criar sua própria página, coloque também a pasta imagens junto de index.html.'],
        ['Exercício guiado', 'Adicione <img src="imagens/jardim.svg" alt="Planta verde em um vaso">. Veja a imagem e leia a descrição. Depois escreva sua própria descrição no desafio.']
      ], syntax: '<img src="imagens/jardim.svg" alt="Planta verde em um vaso">', example: '<h1>Meu jardim</h1>\n<img src="imagens/jardim.svg" alt="Planta de folhas verdes em vaso">\n<p>Uma planta para cuidar.</p>', visual: 'Uma ilustração de folhas verdes em um vaso, entre o título e uma frase.',
      commonMistakes: ['Trocar src por href: img usa src.', 'Usar alt="imagem" sem descrever seu conteúdo.', 'Escrever </img>, que não é necessário.'], bestPractices: ['Descreva o conteúdo importante de modo curto.', 'Uma imagem apenas decorativa pode usar alt="". Neste exercício a imagem informa conteúdo e deve ser descrita.', 'width e height podem informar dimensões; aparência será estudada em CSS.'],
      starterCode: code('<h1>Meu jardim</h1>\n<p>Uma planta para cuidar.</p>'), challenge: {
        title: 'Uma imagem que também pode ser lida', description: 'Adicione a imagem imagens/jardim.svg com uma descrição. Mantenha um título e um parágrafo.',
        requirements: [element('image', 'img', 'Uma imagem'), attribute('source', 'img', 'src', 'Caminho da imagem', 'imagens/jardim.svg'), attribute('alternative', 'img', 'alt', 'Descrição alternativa não vazia'), text('heading', 'h1', 'Título preenchido'), text('paragraph', 'p', 'Parágrafo preenchido')],
        hints: ['Pense no arquivo que será mostrado e em como descreveria essa imagem por telefone.', 'Use img com src e alt. Essa tag não tem fechamento.', 'Para outra foto: <img src="imagens/gato.jpg" alt="Gato dormindo no sofá">.'], solution: code('<h1>Meu jardim</h1>\n<img src="imagens/jardim.svg" alt="Planta de folhas verdes em um vaso">\n<p>Uma planta para cuidar.</p>'), explanation: 'src aponta para o arquivo da planta. alt descreve seu conteúdo, inclusive quando a imagem não carrega.'
      }, summary: 'img exibe a imagem de src. alt comunica o significado. Caminhos relativos partem da pasta da página.', unlocks: ['html-lists']
    },
    {
      id: 'html-lists', moduleId: 'html', order: 5, title: 'Listas e organização', duration: '8 min', description: 'Organize ideias em itens e passos.', available: true,
      theory: [
        ['O que vamos aprender', 'Listas agrupam itens. ul cria uma lista sem ordem obrigatória. Dentro dela, cada li é um item. Depois veremos ol, para passos em ordem.'],
        ['Por que isso existe?', 'Uma lista mostra que várias informações pertencem ao mesmo grupo. Isso ajuda a leitura visual e a leitura por voz.'],
        ['Analogia cotidiana', 'Compras podem vir em qualquer ordem: ul. Uma receita tem etapas numeradas: ol. Cada compra ou etapa é um li.'],
        ['Elementos dentro de elementos', 'Estar dentro significa escrever entre a abertura e o fechamento de outro elemento. Abra ul, escreva os li com seus fechamentos, e só então feche ul.'],
        ['Agora, lista ordenada', 'ol funciona como ul, mas mostra números. Use quando a sequência tem significado, como um passo a passo.'],
        ['Exercício guiado', 'Copie a sintaxe mínima e veja um marcador. Adicione outro li dentro de ul. Para o desafio, crie também uma lista ol com dois passos.']
      ], syntax: '<ul>\n  <li>Caderno</li>\n</ul>', example: '<ul>\n  <li>Lápis</li>\n  <li>Papel</li>\n</ul>\n<ol>\n  <li>Escrever</li>\n  <li>Revisar</li>\n</ol>', visual: 'A primeira lista tem marcadores; a segunda tem os números 1 e 2.',
      commonMistakes: ['Escrever li fora de uma lista.', 'Fechar ul antes de terminar os itens.'], bestPractices: ['Use ol quando trocar a ordem alterar o sentido.', 'Não simule listas digitando números em parágrafos; tags de lista comunicam a estrutura.', 'ol pode receber start para iniciar de outro número. Não é necessário neste desafio.'],
      starterCode: code('<h1>Meu plano de estudo</h1>\n'), challenge: {
        title: 'Prepare sua próxima descoberta', description: 'Crie uma lista ul de pelo menos três materiais e uma lista ol de pelo menos dois passos de estudo. Preencha todos os itens.',
        requirements: [element('unordered', 'ul', 'Uma lista sem ordem'), element('materials', 'ul > li', 'Três itens de materiais', 3), element('ordered', 'ol', 'Uma lista ordenada'), element('steps', 'ol > li', 'Dois passos', 2), text('items-text', 'li', 'Todos os itens com texto'), requirement('nesting', 'Todos os itens dentro de listas', 'html-parent', { selector: 'li', parent: 'ul, ol' }, 'Todos os itens pertencem a listas.', 'Coloque cada li diretamente dentro de ul ou ol.')],
        hints: ['Separe o que você precisa da sequência do que vai fazer.', 'Use ul para materiais, ol para passos e li para cada item.', 'Uma lista de outro assunto: <ul><li>Maçã</li><li>Pera</li></ul>.'], solution: code('<h1>Meu plano de estudo</h1>\n<ul>\n  <li>Caderno</li>\n  <li>Lápis</li>\n  <li>Computador</li>\n</ul>\n<ol>\n  <li>Ler a explicação</li>\n  <li>Praticar no editor</li>\n</ol>'), explanation: 'ul agrupa materiais e ol ordena ações. Cada li fica dentro da lista e contém um texto.'
      }, summary: 'ul agrupa itens, ol ordena passos e li representa cada item. Você concluiu o primeiro percurso!', unlocks: []
    }
  ];
  for (const lesson of FirstCode.htmlLessons) {
    lesson.challenge.requirements.push(requirement(
      'explicit-closing', 'Escrever os fechamentos e respeitar sua ordem', 'html-explicit-closing', {},
      'Você escreveu os fechamentos e fechou primeiro os elementos internos.',
      'Escreva os elementos com abertura e fechamento. Tags vazias, como img, br e meta, não precisam de fechamento.'
    ));
    lesson.bestPractices.push('Regra destes exercícios: escreva os fechamentos, inclusive </p> e </li>. O HTML permite omitir alguns deles em situações específicas, mas aqui vamos escrevê-los para aprender a estrutura com clareza. Tags vazias, como img, br e meta, não recebem fechamento.');
  }
})();
