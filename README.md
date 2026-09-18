# Primeiro Código

**Aprenda a criar para a web, começando do zero.**

Primeiro Código (`learn-web-from-zero`) é uma plataforma interativa, em português, para quem nunca programou. Reúne explicações passo a passo, um editor de código, prévia do resultado e avaliação automática dos desafios no próprio navegador.

Construída com **HTML, CSS e JavaScript puro**, sem bibliotecas, frameworks, gerenciador de pacotes ou compilação. A aplicação é estática e pode ser aberta diretamente pelo arquivo `index.html`.

## Visão geral

- **Aprenda praticando:** introdução guiada e cinco aulas de HTML com exercícios, dicas e soluções comentadas.
- **Veja o resultado:** editor integrado com prévia e feedback por critério do desafio.
- **Continue de onde parou:** progresso e código salvos no navegador, com exportação e importação em JSON.
- **Estude no seu ritmo:** desbloqueio sequencial, temas claro e escuro e interface responsiva.
- **Comece sem instalação:** basta um navegador moderno com JavaScript habilitado e os arquivos do projeto.

**Estado atual:** cinco aulas de HTML estão publicadas. O catálogo prevê 63 aulas entre HTML, CSS e JavaScript; as demais aparecem como **Em preparação**.

## Sumário

- [Abrir e aprender](#abrir-e-aprender)
- [Percurso disponível](#percurso-disponível)
- [Funcionalidades](#funcionalidades)
- [Estrutura dos arquivos](#estrutura-dos-arquivos)
- [Avaliação e regras de negócio](#avaliação-e-regras-de-negócio)
- [Persistência e migração](#persistência-e-migração)
- [Como adicionar uma aula](#como-adicionar-uma-aula)
- [Como adicionar um tipo de requisito](#como-adicionar-um-tipo-de-requisito)
- [Testes](#testes)
- [Segurança e limitações do ambiente de execução](#segurança-e-limitações-do-ambiente-de-execução)
- [Próximos passos](#próximos-passos)

## Compromisso com as linguagens atuais

O conteúdo ensina somente **HTML, CSS e JavaScript nativos**, conforme os padrões atuais:

- **HTML Living Standard**, mantido continuamente pelo WHATWG; “HTML5” é um nome comum, mas não uma versão congelada adotada pelo curso.
- **CSS moderno**, com módulos que evoluem independentemente. Não existe uma única versão “CSS4” para substituir todo o CSS3.
- **JavaScript padronizado em ECMAScript**, priorizando recursos estáveis e disponíveis nos navegadores atuais. Novidades devem informar pré-requisitos e compatibilidade; propostas experimentais não são tratadas como padrão consolidado.

Referências editoriais: [HTML Living Standard](https://html.spec.whatwg.org/), [especificações CSS](https://www.w3.org/Style/CSS/current-work) e [ECMAScript](https://tc39.es/ecma262/).

Os exemplos e desafios do aluno usam as linguagens nativas da web. A implementação da plataforma também utiliza essas tecnologias, sem dependências externas.

## Abrir e aprender

1. Baixe ou clone o repositório. Se baixar um arquivo ZIP, extraia seu conteúdo.
2. Abra **`index.html`** no navegador.
3. Clique em **Começar a aprender**.
4. Percorra a introdução, que explica um conceito por tela.
5. Escreva seu HTML no editor e acompanhe Resultado e Avaliação.

Não é necessário instalar nada. Mantenha as pastas do projeto junto dos arquivos HTML. Não há requisições para fontes, bibliotecas ou serviços de terceiros para iniciar a aplicação. A imagem dos exercícios também funciona offline.

O editor salva o código depois de **400 ms** sem digitação. Ao trocar de página ou ocultar a janela, alterações pendentes também são salvas. O armazenamento é local ao navegador: use **Preferências e seus dados → Exportar progresso** para guardar uma cópia ou mudar de dispositivo.

### Opção HTTP com ES Modules nativos

`servidor.html` importa os mesmos arquivos por `assets/js/main.js`, usando ES Modules do navegador. Para esta entrada é necessário HTTP, pois navegadores restringem módulos em `file://`.

Se Python já estiver disponível, abra um terminal **na pasta deste projeto**:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Em algumas instalações do Windows, o comando é `py -m http.server 8000 --bind 127.0.0.1`.

Abra **http://127.0.0.1:8000/servidor.html**. Qualquer servidor estático equivalente também serve. O terminal é uma opção para quem mantém a plataforma; os alunos não precisam utilizá-lo.

**Instalação:** nenhuma. **Build:** nenhum. Os arquivos já são a aplicação executável; não há comandos npm. Para publicar, copie a pasta para uma hospedagem estática.

## Percurso disponível

### Introdução guiada — 12 pequenos passos

Site; navegador; arquivo, pasta e extensão; criação de pasta; editor de texto; `index.html`; abertura no navegador; salvamento; atualização; mensagens de erro; relação entre HTML/CSS/JavaScript; primeira tag.

### Cinco aulas práticas completas

| Aula | Conceitos e desafio |
| --- | --- |
| Títulos e parágrafos | Tags, elementos, `<h1>` e `<p>`; título com texto antes do parágrafo |
| Estrutura básica do HTML | Cada linha do documento, atributos, idioma, acentos, tela, `head` e `body` |
| Links e seus destinos | Endereço, `a`, `href` e descrição visível |
| Imagens e texto alternativo | `img`, `src`, `alt` e caminhos relativos |
| Listas e organização | `ul`, `ol`, `li`, aninhamento e itens preenchidos |

Cada aula tem explicações, analogia, sintaxe, exemplo renderizado, exercício guiado, desafio, pelo menos cinco critérios, três dicas, solução comentada, erros comuns, boas práticas e resumo. A ordem começa pelo exemplo mínimo, antes do documento completo.

O catálogo contém **63 entradas**: 18 de HTML, 21 de CSS e 24 de JavaScript. Apenas as cinco acima estão publicadas. As outras são identificadas explicitamente como **Em preparação**. Os conceitos introdutórios de texto e atributos aparecem nas aulas disponíveis e também têm revisões previstas no catálogo. O primeiro percurso concentra cinco aulas práticas; os demais tópicos recebem aulas próprias na expansão.

CSS só pode ser habilitado em aulas posteriores quando **todo o módulo HTML** estiver publicado e concluído, incluindo semântica. JavaScript exige também **todo o módulo CSS**. Concluir apenas as cinco aulas do MVP não libera essas abas prematuramente.

## Funcionalidades

- Início, introdução guiada, dashboard, aulas e preferências.
- Navegação com estados não iniciado, em andamento e concluído.
- Desbloqueio sequencial e botão para a próxima aula.
- Editor `textarea`, números de linha sincronizados, recuo com Tab, copiar, limpar com confirmação e restaurar com confirmação.
- Ctrl/Cmd + Enter para executar e verificar; desfazer/refazer da digitação pelos atalhos nativos do navegador.
- Saída do editor com **Esc e depois Tab**, ou **Shift + Tab**.
- Abas de linguagem preparadas, com somente HTML disponível no percurso atual.
- Prévia `iframe.srcDoc`, atualização automática opcional e botão manual.
- Tamanhos de prévia: largura do painel, tablet de 768 px e celular de 375 px. Quando não cabem no painel, há rolagem interna para preservar a largura real do documento.
- Painéis redimensionáveis por arraste ou teclado em telas grandes. Em telas médias, conteúdo acima de editor/resultado. No celular, abas Aula, Código, Resultado e Avaliação.
- Avaliação automática após a pausa, manual e por atalho.
- Feedback individual, sem depender somente de cores; estados neutro, vermelho, amarelo e verde.
- Dicas progressivas e registro de consulta à solução, sem impedir conclusão.
- Progresso, código, tentativas, dicas, solução consultada, última atividade, dias ativos e preferências persistidos.
- Exportação/importação JSON validada e limpeza com confirmação.
- Tema escuro padrão, tema claro e tamanho de texto do editor.
- Foco visível, regiões semânticas, nomes acessíveis, feedback anunciado e respeito a movimento reduzido.

O editor é deliberadamente nativo: não oferece destaque de sintaxe, autocomplete ou formatação de uma IDE. Os exemplos têm sintaxe mínima e os exercícios não dependem dessas ferramentas.

## Estrutura dos arquivos

```text
index.html                     Entrada direta, inclusive file://
servidor.html                  Entrada HTTP com módulos nativos
testes.html                    Testes no próprio navegador
README.md
assets/
  css/
    styles.css                 Entrada dos estilos
    variables.css              Cores, tipografia e regras básicas
    layout.css                 Páginas e painéis
    components.css             Controles, editor e feedback
    responsive.css             Adaptações de tela
  js/
    main.js                    Importações ES Modules
    app.js                     Ciclo de vida e interações
    router.js                  Rotas pelo fragmento da URL
    views.js                   Apresentação das páginas
    editor.js                  Textarea, linhas e atalhos
    preview.js                 Documento isolado e mensagens
    evaluator.js               Registro de validadores e pontuação
    progress.js                Desbloqueio e regras de progresso
    storage.js                 Validação, persistência e importação
    resources.js               Imagem didática incorporada offline
    lessons.js                 Catálogo e introdução
    modules/
      html-lessons.js          Cinco aulas e soluções reais
imagens/
  jardim.svg                   Recurso para a aula de imagens
tests/
  tests.js                     37 testes sem dependências
tools/
  check.py                     Verificação opcional automatizada
```

### Organização técnica

Os arquivos encapsulam suas variáveis em funções e expõem uma API pequena no namespace `FirstCode`. Isso permite reaproveitar **o mesmo código** nas duas entradas:

- `index.html`: scripts clássicos com `defer`, compatíveis com abertura direta;
- `servidor.html`: importações nativas ordenadas em `main.js`, sem empacotador.

Conteúdo não fica nos componentes de apresentação. O avaliador recebe aula e código, e devolve resultados sem modificar a interface. Persistência tem adaptadores testáveis e validação centralizada. O runner cuida exclusivamente do iframe. É possível substituir a persistência local por um serviço remoto posteriormente.

## Avaliação e regras de negócio

### HTML

`DOMParser` interpreta o HTML em um documento separado. Os validadores verificam existência, quantidade, texto, atributos, ordem, parentesco, estrutura do documento e associação de `label`/`input`. Diferenças de recuo, quebras de linha e tipos de aspas não alteram a avaliação.

O navegador pode completar tags ausentes. Por isso, o requisito `html-document` também confere a estrutura explicitamente escrita, excluindo comentários e conteúdo de scripts/estilos.

As cinco aulas possuem ainda o requisito **`html-explicit-closing`**. Ele examina o código original, antes das correções do navegador, e exige fechamentos explícitos e na ordem correta. O feedback informa a linha e o próximo ajuste. Assim, `<h1>Olá</h1><p>Meu texto` não conclui mais o desafio: o requisito de fechamento fica parcial, enquanto os demais acertos são preservados.

**Distinção didática:** o HTML atual permite omitir `</p>`, `</li>` e outros fechamentos em condições específicas. O curso exige escrevê-los para praticar a estrutura — não afirma que toda omissão é inválida na linguagem. Elementos vazios como `img`, `br`, `meta` e `input` não exigem fechamento. Uma barra em `<p/>` não fecha esse elemento HTML.

A inspeção reconhece comentários, atributos entre aspas, conteúdo textual de `script`/`style`/`textarea`/`title`, tags incompletas e ordem de fechamento. Trata-se de uma regra para estes exercícios, **não de um validador completo de conformidade HTML**: regras de conteúdo permitido dentro de cada elemento e todos os casos especiais de namespaces não são integralmente cobertos. A avaliação semântica com DOMParser continua complementar e necessária.

Conquistas de aulas já concluídas permanecem salvas; ao reabrir a aula, o código atual é reavaliado pelo critério novo e pode aparecer como quase completo até ser corrigido.

### CSS

`CSSOM` lê regras em um documento separado. Há validadores para seletor, propriedade/valor, aproximação numérica com unidade e media query. Flexbox e Grid são propriedades `display`; hover é um seletor com pseudo-classe. O motor confere declarações, não prova todo o resultado da cascata ou a qualidade da responsividade. Para aulas futuras de layout, complemente com testes de resultado em diferentes larguras.

### JavaScript

A infraestrutura reúne `js-source` (padrão de código confiável definido pela aula) e `js-behavior` (ação real no iframe e conferência do texto/classe resultante). Os descritores suportam clique, entrada de texto e envio de formulário. **Não há aulas de JavaScript publicadas neste MVP.**

Análise por padrão não substitui um parser: uma declaração pode aparecer em comentário. Ao publicar aulas, combine sempre a análise com comportamento visível e testes específicos. Testes comportamentais usam o mesmo documento, em ordem; forneça um estado inicial previsível. Verificação de retorno de funções e instrumentação detalhada de eventos são extensões futuras, não recursos já completos.

### Pontuação

```text
percentual = soma dos pesos concluídos / soma dos pesos totais × 100
```

Todos os requisitos atuais têm peso 1. Um requisito parcialmente preenchido recebe o estado **Parcial**, mas só ganha o peso quando concluído.

- Não avaliado: neutro, sem incremento de tentativas ao simplesmente abrir pela primeira vez.
- Menos de 40%: vermelho, “Vamos por partes”.
- De 40% a menos de 100%: amarelo, “Quase completo”.
- 100%: verde, “Desafio completo”.

Uma tentativa significa uma rodada de avaliação, automática ou manual. Reabrir a aula reconstitui o feedback sem acrescentar tentativa. A conclusão é uma conquista permanente: editar ou restaurar depois pode reduzir a avaliação do código atual, mas mantém a aula concluída e a próxima desbloqueada.

O dashboard separa **o percurso disponível (5 aulas)** do **catálogo completo (63 entradas)**. Assim, concluir o MVP não aparece como ter concluído HTML, CSS e JavaScript inteiros.

## Persistência e migração

Chave: **`learning-platform:v1`**.

`storage.js` oferece `load`, `save`, `export`, `parse`, `clear`, `normalize` e `migrate`. A importação aceita apenas o formato conhecido, valida códigos, limita tamanho, seleciona campos permitidos e recalcula o progresso geral. Não carrega conteúdo educacional ou regras executáveis do JSON importado.

Quando uma versão futura mudar o formato, adicione uma conversão explícita em `migrate`, antes de `normalize`, e testes com arquivos das versões anteriores. Atualmente somente a versão 1 é aceita; versões desconhecidas geram uma mensagem clara.

Em navegação privada, armazenamento bloqueado ou quota esgotada, a aplicação continua na sessão e avisa para exportar. As regras de armazenamento de `file://` variam entre navegadores; mudar a pasta, trocar de navegador ou alternar de arquivo local para HTTP pode criar outro espaço de armazenamento. Use exportar/importar para transferir o progresso.

## Como adicionar uma aula

1. Adicione um objeto completo em `html-lessons.js` ou em um novo arquivo de conteúdo com a mesma responsabilidade.
2. Registre-o em `FirstCode.lessons`; substitua a entrada planejada correspondente, evitando IDs duplicados. A ordem no catálogo determina os pré-requisitos sequenciais.
3. Defina `available: true`, `moduleId`, título, duração, descrição, blocos de teoria, sintaxe, exemplo, resultado esperado, erros, boas práticas, código inicial, resumo e desafio.
4. No desafio, inclua `title`, `description`, `requirements`, três `hints`, `solution` e `explanation`.
5. Ajuste `unlocks` da aula anterior para o ID da nova aula.
6. Se criar um arquivo, inclua-o **antes de `lessons.js`** no carregamento de `index.html`, `main.js` e `testes.html`.
7. Teste a solução, código vazio, progresso parcial e alternativas semanticamente equivalentes.

Um requisito de existência, por exemplo:

```js
{
  id: 'main-exists',
  description: 'Um conteúdo principal',
  type: 'html-element',
  selector: 'main',
  exact: 1,
  weight: 1,
  feedback: {
    success: 'Você identificou o conteúdo principal.',
    failure: 'Coloque o conteúdo principal dentro de main.'
  }
}
```

**Orientação editorial:** ensine o termo antes de usá-lo, explique os símbolos, apresente exemplos pequenos, mostre o resultado e só então peça um desafio independente. Não introduza estilos HTML antigos, frameworks, abstrações ou comandos de terminal no conteúdo inicial. CSS deve começar pela ligação a `style.css`; JavaScript, pela ligação a `script.js` e pelos fundamentos antes de manipular a página. Esses exemplos serão conteúdo das aulas ainda não publicadas.

## Como adicionar um tipo de requisito

1. Registre uma função em `validators`, em `assets/js/evaluator.js`.
2. A função recebe `(requirement, context)`. O contexto contém `doc`, `code`, `clean`, `rules` e `runtime`.
3. Retorne `{ pass: boolean, partial?: boolean }`. O agregador determina peso, estado e mensagem.
4. Defina no conteúdo os parâmetros e os dois feedbacks.
5. Adicione testes de sucesso, falha, entrada inválida e casos equivalentes.

Exemplo para exigir uma lista com itens (os validadores genéricos existentes normalmente já são suficientes):

```js
'html-list-with-items': (requirement, context) => {
  const list = context.doc.querySelector(requirement.selector);
  return {
    pass: Boolean(list && list.querySelectorAll(':scope > li').length >= 2),
    partial: Boolean(list)
  };
}
```

Nunca execute código de aluno no avaliador principal. Para um requisito de interação, estenda os descritores do runner e teste seu contrato de mensagens; não use `eval`.

## Testes

### Sem ferramentas

Abra **`testes.html`** no navegador. A página executa **37 testes**, inclusive usando iframes reais. Eles não apagam o progresso do aluno. A verificação de armazenamento real usa uma chave de teste separada.

Os testes cobrem soluções das cinco aulas, código errado/parcial/correto, whitespace, elementos extras, atributos, ordem, aninhamento, labels, CSSOM, pesos e estados, persistência, importação, bloqueios, restauração, editor, diagnóstico de HTML inválido, validação de mensagens, execução isolada, erro JavaScript e imagem offline.

### Verificação automatizada opcional

Se Python 3 e Chrome/Chromium já estiverem disponíveis:

```sh
python3 tools/check.py
```

Usa apenas a biblioteca padrão do Python e o protocolo de depuração do navegador. Cria um perfil temporário, inicia um servidor temporário, executa os testes via `file://` e HTTP e percorre o fluxo de introdução, cinco aulas, autosave, recarga, restauração e abas móveis em 390 px. O perfil é removido ao terminar. Este utilitário inicia Chrome com `--no-sandbox` para suportar ambientes de CI isolados; essa opção é exclusiva do processo de teste e não faz parte do uso da plataforma.

A suíte inclui a regressão de parágrafo aberto, que impede concluir uma aula nova e apresenta orientação de fechamento, seguida da conclusão normal das cinco aulas. Execute a verificação para obter o resultado no seu ambiente; ela utiliza recursos reais do navegador, sem bibliotecas de testes externas.

## Segurança e limitações do ambiente de execução

- Código do aluno é interpretado em um documento separado e renderizado apenas em iframe com **`sandbox="allow-scripts"`**, sem `allow-same-origin`, navegação do topo, popups, permissões de formulário ou downloads.
- Nas cinco aulas HTML, scripts do aluno e atributos de eventos são removidos da prévia; CSS/JavaScript de abas bloqueadas não são executados, inclusive após importação.
- Nas futuras aulas de JavaScript, scripts inline autorizados pelo runner executam somente dentro do iframe. Bibliotecas e scripts externos são bloqueados.
- Uma CSP restringe conexões, frames, workers, objetos, fontes, mídia e envio de formulários. Câmera, microfone, geolocalização e clipboard são negados no iframe principal.
- Imagens externas são permitidas e podem fazer requisições à rede. Para privacidade estritamente offline, use os recursos incorporados. Links de exemplo não navegam e formulários não são enviados.
- Não há `eval` na aplicação. Código e mensagens exibidos na interface são escapados ou atribuídos por `textContent`.
- A origem de `srcDoc` com esse sandbox é **opaca**: mensagens chegam como `origin === "null"`. O receptor confere também `event.source === iframe.contentWindow`, token aleatório da execução, canal, tipo, campos e limites. A origem `null` sozinha jamais autoriza uma mensagem.
- O envio do iframe usa `postMessage(..., '*')` porque a versão local pode ter origem opaca. A mensagem não contém dados do progresso. A aplicação principal não envia seu armazenamento ao iframe.
- Erros são limitados e, depois de cinco erros recebidos, o documento é substituído, interrompendo seus temporizadores. Execuções anteriores não têm mensagens aceitas depois de uma reinicialização.
- **Não existe garantia de interromper loops síncronos infinitos em um iframe do mesmo navegador.** Se o processo travar, feche a aba. O timeout da aplicação também depende da thread estar responsiva. Isolamento mais forte e limites de CPU exigem outro ambiente de execução.
- A linha de um erro JavaScript corresponde ao documento gerado, não necessariamente à linha do editor. A mensagem deixa essa distinção explícita.
- O isolamento protege os dados da aplicação, mas não é uma ferramenta antifraude: o aluno pode editar seu armazenamento local ou interferir na avaliação dentro de seu próprio iframe. Certificados confiáveis exigiriam uma arquitetura diferente.
- O iframe opaco não pode ler imagens arbitrárias do disco em `file://`. A imagem fornecida tem uma cópia `data:` em `resources.js`; o arquivo SVG original permanece para o aluno usar fora da plataforma. Para outros recursos locais, prefira HTTP ou registre um recurso didático incorporado.

## Próximos passos

1. Publicar os tópicos restantes de HTML na progressão planejada, com revisão e projeto final antes de CSS.
2. Completar CSS puro, incluindo observação de estilos calculados e desafios em diferentes larguras.
3. Publicar fundamentos de JavaScript antes de DOM, com instrumentação de funções, retornos, eventos e validação.
4. Refinar exercícios em passos ainda menores com pesquisa de uso por iniciantes.
5. Auditar acessibilidade com leitores de tela e ampliar testes para Firefox, Safari e aparelhos reais.
6. Oferecer exportação dos arquivos do projeto do aluno e importação de imagens locais.
7. Evoluir isolamento de execução e limites de recursos antes de exercícios JavaScript mais abertos.
8. Se houver necessidade futura, adicionar sincronização remota por uma nova implementação de armazenamento, mantendo conteúdo e avaliadores independentes.
