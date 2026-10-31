export type Retangulo = { x: number; y: number; largura: number; altura: number };
type Tamanho = { largura: number; altura: number };
export type Posicao = { x: number; y: number };
type FaixaLivre = { xMinimo: number; xMaximo: number; yMinimo: number; yMaximo: number };

// Divide a tela em quatro faixas onde o aviso cabe inteiro sem encostar no card (esquerda, direita,
// acima e abaixo dele) e sorteia uma, com chance proporcional à área, e depois o ponto dentro dela.
export function sortearPosicaoForaDoCard(
  tela: Tamanho,
  card: Retangulo,
  tamanhoDoAviso: Tamanho,
  sortearNumero: () => number = Math.random,
): Posicao {
  const xMaximoNaTela = tela.largura - tamanhoDoAviso.largura;
  const yMaximoNaTela = tela.altura - tamanhoDoAviso.altura;
  const faixasLivres: FaixaLivre[] = [
    { xMinimo: 0, xMaximo: card.x - tamanhoDoAviso.largura, yMinimo: 0, yMaximo: yMaximoNaTela },
    { xMinimo: card.x + card.largura, xMaximo: xMaximoNaTela, yMinimo: 0, yMaximo: yMaximoNaTela },
    { xMinimo: 0, xMaximo: xMaximoNaTela, yMinimo: 0, yMaximo: card.y - tamanhoDoAviso.altura },
    { xMinimo: 0, xMaximo: xMaximoNaTela, yMinimo: card.y + card.altura, yMaximo: yMaximoNaTela },
  ].filter(({ xMinimo, xMaximo, yMinimo, yMaximo }) => xMaximo >= xMinimo && yMaximo >= yMinimo);

  // Tela pequena demais para caber fora do card: fica no topo, centrado, sem sair da tela.
  if (faixasLivres.length === 0) return { x: Math.max(0, xMaximoNaTela / 2), y: 0 };

  const calcularPesoDaFaixa = (faixa: FaixaLivre) =>
    (faixa.xMaximo - faixa.xMinimo + 1) * (faixa.yMaximo - faixa.yMinimo + 1);
  const pesoTotal = faixasLivres.reduce((somaDosPesos, faixa) => somaDosPesos + calcularPesoDaFaixa(faixa), 0);
  let pesoRestante = sortearNumero() * pesoTotal;
  // A última faixa só fica como padrão para o arredondamento quando o sorteio cai bem no fim do peso total.
  let faixaSorteada = faixasLivres[faixasLivres.length - 1];
  for (const faixa of faixasLivres) {
    const pesoDaFaixa = calcularPesoDaFaixa(faixa);
    if (pesoRestante < pesoDaFaixa) {
      faixaSorteada = faixa;
      break;
    }
    pesoRestante -= pesoDaFaixa;
  }

  return {
    x: faixaSorteada.xMinimo + sortearNumero() * (faixaSorteada.xMaximo - faixaSorteada.xMinimo),
    y: faixaSorteada.yMinimo + sortearNumero() * (faixaSorteada.yMaximo - faixaSorteada.yMinimo),
  };
}
