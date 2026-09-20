# Primeiro Código

**Aprenda a criar para a web, começando do zero.**

Plataforma interativa em português com **63 aulas de HTML, CSS e JavaScript**, explicações passo a passo, editor integrado, exemplos executáveis e desafios com avaliação automática.

Construída com as linguagens nativas da web, sem frameworks, dependências externas, gerenciador de pacotes ou compilação. Pode ser publicada em uma hospedagem estática, incluindo GitHub Pages.

## Começar

1. Baixe ou clone o repositório. Extraia o conteúdo se baixar um ZIP.
2. Abra **`index.html`** em um navegador moderno com JavaScript habilitado.
3. Clique em **Começar a aprender** e percorra a introdução.
4. Leia a aula, escreva no editor e acompanhe **Resultado** e **Avaliação**.
5. Ao concluir, use **Próxima aula** para continuar.

Mantenha as pastas junto dos arquivos HTML. A aplicação e a imagem didática fornecida funcionam offline. Não é necessário instalar nada.

### Acesso por HTTP

`servidor.html` carrega os mesmos arquivos usando ES Modules nativos. Essa entrada exige um servidor HTTP:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra **http://127.0.0.1:8000/servidor.html**. No Windows, o comando também pode ser `py -m http.server 8000 --bind 127.0.0.1`.

Para publicar no GitHub Pages, sirva a pasta do projeto com `index.html` na raiz. Não há etapa de build nem backend.

## Percurso completo

Todas as aulas abaixo possuem conteúdo e desafio. O desbloqueio é sequencial, inclusive nas transições entre módulos.

### HTML — 18 aulas

1. Títulos e parágrafos
2. Estrutura básica do HTML
3. Links e seus destinos
4. Imagens e texto alternativo
5. Listas e organização
6. Texto simples e revisão de tags
7. Quebras de linha
8. Ênfase com `<strong>` e `<em>`
9. Atributos: revisão
10. Caminhos relativos: prática
11. `<div>` e `<span>`
12. Elementos semânticos
13. Tabelas
14. Formulários
15. Rótulos com `<label>`
16. Tipos de `<input>`
17. Acessibilidade básica
18. Projeto completo em HTML

### CSS — 21 aulas

Ligação com `style.css`; seletores; propriedades e valores; cores; background; fontes; tamanho do texto; dimensões e unidades; bordas; margin; padding; box model; classes; IDs; display; Flexbox; Grid; position; pseudo-classes; responsividade e media queries; projeto completo com HTML e CSS.

### JavaScript — 24 aulas

Ligação com `script.js`; `console.log`; valores; strings; números; booleanos; variáveis; operadores; comparações; condicionais; funções; arrays; objetos; repetições; DOM; `querySelector`; `textContent`; `classList`; `addEventListener`; cliques; campos de formulário; validação; criação de elementos; projeto final com HTML, CSS e JavaScript.

O projeto final é uma lista de estudos que recebe tarefas, rejeita entradas vazias, cria itens e atualiza o total.

### Progressão e didática

- A introdução tem 12 pequenos passos para quem nunca programou.
- HTML diferencia **tag, elemento, atributo, valor e conteúdo**. Referências às tags usam `< >` também nas explicações.
- CSS começa pela ligação entre HTML e estilos, explicando seletor, propriedade, valor e os símbolos da sintaxe.
- JavaScript começa pelos fundamentos e pela saída de `console.log`, antes de manipular o DOM.
- Cada aula tem exemplo, prática, critérios de avaliação, três dicas, solução comentada, erros comuns e resumo.
- CSS é habilitado após as 18 aulas de HTML; JavaScript, após as 21 de CSS.
- **Ver minhas conquistas** aparece no encerramento da última aula. A aula 5 agora continua para a aula 6.
- O progresso salvo na versão com cinco aulas é preservado. **Continuar aprendendo** encontra a próxima aula pendente.

O conteúdo segue o [HTML Living Standard](https://html.spec.whatwg.org/), os [módulos atuais do CSS](https://www.w3.org/Style/CSS/current-work) e o [ECMAScript](https://tc39.es/ecma262/).

## Editor e prévia

- Abas HTML, CSS e JavaScript habilitadas conforme a progressão.
- A aba do módulo atual abre selecionada; os arquivos anteriores continuam acessíveis.
- Números de linha, recuo com Tab, copiar, limpar e restaurar com confirmação.
- **Ctrl/Cmd + Enter** executa e verifica. **Esc e depois Tab**, ou **Shift + Tab**, sai do editor.
- Atualização automática opcional, tamanhos de prévia Desktop/Tablet/Celular e painéis redimensionáveis.
- Abas Aula, Código, Resultado e Avaliação em telas pequenas.
- Temas claro e escuro e tamanho de texto configurável.
- Saída de `console.log` visível na prévia das práticas de JavaScript.

As abas representam `index.html`, `style.css` e `script.js`. Nos exercícios de ligação, os arquivos CSS e JavaScript são **virtuais**: a plataforma injeta suas abas na prévia, sem buscar esses arquivos na rede. Fora da plataforma, crie os arquivos de verdade e use as ligações ensinadas.

O editor é um `textarea` nativo: não inclui autocomplete, destaque de sintaxe ou formatação automática.

## Avaliação

### HTML

`DOMParser` interpreta o documento. Os critérios verificam elementos, textos, atributos, quantidade, ordem, parentesco, estrutura explícita e associação entre `<label>` e campos.

Há também uma inspeção do código original para exigir fechamentos escritos e na ordem correta. É uma regra didática: HTML permite omitir certos fechamentos, mas os exercícios pedem escrevê-los. Elementos vazios, como `<img>`, `<br>`, `<meta>` e `<input>`, não recebem fechamento.

Essa inspeção não é um validador completo de conformidade HTML.

### CSS

`CSSOM` verifica seletores, propriedades, valores e condições de media queries. Valores esperados são normalizados pelo navegador, incluindo propriedades abreviadas como `outline`.

Critérios de estilo calculado conferem também se uma propriedade aparece no elemento renderizado. Os desafios responsivos devem ser observados nos diferentes tamanhos de prévia; a avaliação não substitui uma auditoria visual completa.

### JavaScript

Combina critérios de código-fonte e execução real em iframe isolado:

- Valores e tipos enviados a `console.log`, na ordem solicitada.
- Estado inicial e resposta a cliques repetidos.
- Digitação, envio de formulário, entradas vazias e válidas.
- Texto, classes, valor de campos e quantidade de elementos criados.

Os testes usam uma prévia separada para que os cliques e envios automáticos não alterem a prévia que o aluno explora. Resultados de uma execução anterior são invalidados ao editar. Erros de execução impedem aprovar os critérios comportamentais.

Os critérios de fonte usam padrões, não um parser completo de JavaScript. A execução complementa essa análise, mas não constitui prova formal de correção nem um mecanismo antifraude.

### Pontuação

```text
percentual = soma dos pesos concluídos / soma dos pesos totais × 100
```

Um critério parcial só ganha peso quando concluído. A interface distingue não avaliado, menos de 40%, quase completo e 100%. Concluir uma aula é uma conquista permanente: editar ou restaurar seu código depois não apaga a conclusão.

## Progresso e dados

O progresso fica no **`localStorage`**, sob a chave **`learning-platform:v1`**. Inclui código, conclusões, tentativas, dicas, consulta à solução, atividade e preferências.

O código é salvo após 400 ms sem digitação, e alterações pendentes também são salvas ao ocultar ou sair da página. Use **Preferências e seus dados → Exportar progresso** para guardar uma cópia em JSON. A importação valida o formato e substitui o progresso após confirmação.

Os dados pertencem ao navegador e ao endereço da aplicação. Trocar de navegador, dispositivo, pasta local ou origem HTTP pode mudar o espaço de armazenamento. Não existe sincronização com servidor. Se o armazenamento estiver indisponível, a aplicação avisa para exportar.

Os IDs históricos foram mantidos, inclusive os que contêm `planned`, para preservar referências e progresso. Esses IDs não significam que a aula ainda esteja em preparação.

## Estrutura

```text
index.html                       Entrada direta, inclusive file://
servidor.html                    Entrada HTTP com ES Modules
testes.html                      Suíte no navegador
assets/css/                      Estilos, componentes e responsividade
assets/js/
  main.js                        Importações da entrada HTTP
  app.js                         Interações e ciclo de vida
  views.js                       Interface e navegação entre aulas
  router.js                      Rotas pelo fragmento da URL
  editor.js                      Editor e atalhos
  evaluator.js                   Validadores e pontuação
  preview.js                     Execução isolada e testes comportamentais
  progress.js                    Desbloqueio, retomada e estatísticas
  storage.js                     Persistência e importação
  resources.js                   Imagem incorporada para uso offline
  lessons.js                     Catálogo ordenado e introdução
  modules/
    lesson-kit.js                Estrutura compartilhada das novas aulas
    html-lessons.js              Cinco aulas introdutórias
    html-more.js                 Treze aulas adicionais de HTML
    css-lessons.js               Vinte e uma aulas de CSS
    javascript-lessons.js        Vinte e quatro aulas de JavaScript
imagens/jardim.svg               Recurso original da aula de imagens
tests/tests.js                   Testes de conteúdo, avaliação e integração
tools/check.py                   Automação com Chrome/Chromium
```

Os arquivos expõem APIs no namespace `FirstCode`, reutilizadas tanto pelos scripts clássicos com `defer` quanto pela entrada com módulos nativos.

## Testes

Abra **`testes.html`** no navegador ou, com Python 3 e Chrome/Chromium instalados, execute:

```sh
python3 tools/check.py
```

O verificador usa apenas a biblioteca padrão do Python e o protocolo de depuração do navegador. Executa a suíte via `file://` e HTTP e percorre as 63 aulas pela interface, incluindo as transições de módulos, persistência, recarga, restauração e abas móveis.

Os testes conferem soluções de todas as aulas, rejeição do código inicial incompleto, progressão, retomada de dados antigos, execução de JavaScript e isolamento. Usam dados isolados; a automação cria um perfil temporário. O Chrome de teste é iniciado com `--no-sandbox` para ambientes isolados de CI.

## Expandir o conteúdo

1. Defina conteúdo, código inicial, solução, três dicas e requisitos no arquivo do módulo correspondente.
2. Use um ID estável e único. A ordem em `FirstCode.lessons` determina os pré-requisitos e o link para a próxima aula.
3. Se criar um arquivo, carregue-o antes de `lessons.js` em `index.html`, `main.js` e `testes.html`.
4. Para novos tipos de requisito, registre o validador em `evaluator.js`; comportamentos executáveis devem continuar no runner isolado.
5. Teste a solução, entradas incorretas, código inicial e variações semanticamente equivalentes.

Apresente cada termo antes de usá-lo e separe tag, atributo, valor e conteúdo. Para JavaScript, explique também os símbolos, parâmetros e valores retornados. Exemplos e desafios usam apenas HTML, CSS e JavaScript nativos.

## Isolamento e limites

- A prévia usa `sandbox="allow-scripts"`, sem `allow-same-origin`. O código do aluno não roda no documento principal.
- Scripts do aluno só são habilitados nas aulas de JavaScript; bibliotecas e scripts externos são bloqueados.
- Uma CSP restringe conexões, fontes, mídia, objetos, frames e formulários. Links e envios externos são bloqueados na prévia.
- Imagens externas podem fazer requisições; a imagem didática fornecida tem uma cópia incorporada para funcionar offline.
- Mensagens são validadas por janela de origem, token, canal, tipo e campos. Uma origem opaca `null` sozinha não autoriza mensagens.
- Conteúdo exibido na interface é escapado ou atribuído com `textContent`.
- Um iframe não garante interromper loops síncronos infinitos; se uma execução travar o navegador, pode ser necessário fechar a aba.
- A linha de um erro corresponde ao documento gerado, não necessariamente à linha do editor.
- Avaliação e progresso são locais e editáveis pela própria pessoa; certificação confiável exigiria outra arquitetura.
