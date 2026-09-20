(() => {
  const F = FirstCode;
  F.modules = [
    { id: 'html', title: 'Primeiros passos com HTML', label: 'Estrutura', symbol: '<>', description: 'Dê significado e organização ao conteúdo.' },
    { id: 'css', title: 'Introdução ao CSS', label: 'Aparência', symbol: '{ }', description: 'Aprenda a escolher cores, espaços e layouts.' },
    { id: 'javascript', title: 'Introdução ao JavaScript', label: 'Interação', symbol: '( )', description: 'Faça suas páginas responderem às pessoas.' }
  ];
  F.htmlLessons = [...F.htmlLessons, ...F.htmlMore];
  F.lessons = [...F.htmlLessons, ...F.cssLessons, ...F.javascriptLessons];
  // O catálogo ordenado é a única fonte da sequência, inclusive entre módulos.
  F.lessons.forEach((lesson, index) => { lesson.unlocks = F.lessons[index + 1] ? [F.lessons[index + 1].id] : []; });
  F.intro = [
    ['O que é um site?', 'Um site é um conjunto de páginas que você pode visitar. Cada página combina conteúdo, como textos e imagens. Você vai criar uma pequena página, começando por uma única frase.'],
    ['O que é um navegador?', 'É o programa que abre páginas: Firefox, Chrome, Edge e Safari são exemplos. Ele lê o código de uma página e transforma as instruções em algo que você vê. Código é um texto com instruções.'],
    ['Arquivo, pasta e extensão', 'Um arquivo guarda conteúdo e tem um nome. Uma pasta organiza arquivos, como uma gaveta. A extensão é a parte final do nome depois do ponto: em index.html, .html informa que o arquivo contém HTML, a linguagem que organiza uma página.'],
    ['Crie uma pasta', 'No gerenciador de arquivos do seu computador, escolha uma localização fácil, como Documentos. Use “Nova pasta” e dê o nome minha-pagina. Este passo é opcional para praticar aqui: o editor da plataforma já está pronto.'],
    ['O que é um editor de texto?', 'É um programa para escrever texto simples. Use o Bloco de Notas ou outro editor em modo texto simples. Um processador de documentos com formatação não serve para salvar HTML diretamente. No macOS, use Formatar → Converter em Texto Simples no Editor de Texto.'],
    ['Crie index.html', 'No editor de texto, escreva apenas Olá, mundo! e escolha “Salvar como”. Selecione a pasta minha-pagina e o nome index.html. No Bloco de Notas, escolha “Todos os arquivos” para evitar index.html.txt. index é um nome comum para a página inicial.'],
    ['Abra no navegador', 'Na pasta, abra index.html com seu navegador, usando “Abrir com” se necessário. Você verá a frase que escreveu. O navegador interpreta o arquivo; por enquanto ele encontrou somente texto.'],
    ['Salve uma alteração', 'Volte ao editor e mude a frase. Use Arquivo → Salvar, ou Ctrl + S (Cmd + S no macOS). Salvar grava a alteração no arquivo. Aqui na plataforma, seu código é salvo automaticamente neste navegador.'],
    ['Atualize a página', 'Volte ao navegador e use o botão de atualizar, normalmente uma seta circular. Ele lê o arquivo novamente. Na plataforma, o painel Resultado atualiza sozinho depois de uma pequena pausa na digitação.'],
    ['Entenda uma mensagem de erro', 'Se o resultado não for o esperado, leia a mensagem e confira uma coisa por vez. O navegador tenta corrigir HTML incompleto e pode não mostrar um erro. Nosso painel de avaliação aponta o próximo passo sem apagar o seu trabalho.'],
    ['Três responsabilidades', 'HTML organiza o conteúdo. CSS cuida da aparência, como cores e espaços. JavaScript descreve ações e respostas. Você aprenderá nessa ordem, sem bibliotecas. O curso segue as regras atuais dessas três linguagens e prioriza recursos que funcionam nos navegadores modernos. Primeiro, vamos usar só HTML.'],
    ['Sua primeira tag', 'Observe <h1>Olá, mundo!</h1>. A tag <h1> marca o início do título; Olá, mundo! é o texto; a tag </h1> marca o fim. Os sinais < e > delimitam cada tag; / indica o fechamento. O conjunto inteiro é um elemento HTML. O navegador mostra apenas o texto como título. Na primeira aula, vamos praticar cada uma dessas partes.']
  ];
})();
