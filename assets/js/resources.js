// Cópia empacotada da imagem didática. Em file://, a origem opaca do sandbox
// não pode ler arquivos vizinhos. A versão data: permite a mesma aula offline.
// O arquivo imagens/jardim.svg continua disponível para a página do aluno.
(() => {
  const garden = '<svg xmlns="http://www.w3.org/2000/svg" width="280" height="190" viewBox="0 0 280 190"><rect width="280" height="190" rx="16" fill="#e8f2e7"/><path d="M140 135V58" stroke="#316447" stroke-width="6"/><path d="M139 91C85 97 85 47 96 41C128 43 145 62 139 91M142 107C184 108 204 70 190 60C158 61 140 78 142 107" fill="#4b8c59"/><path d="M108 122H172L164 171H116Z" fill="#b96b4a"/><path d="M104 120H176V134H104Z" fill="#cf825d"/></svg>';
  FirstCode.resources = { 'imagens/jardim.svg': `data:image/svg+xml,${encodeURIComponent(garden)}` };
})();
