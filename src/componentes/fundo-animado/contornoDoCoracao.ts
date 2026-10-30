export type PontoDoContorno = readonly [x: number, y: number];

// Curva paramétrica clássica do coração. Poucos pontos deixam o contorno facetado como no vídeo;
// uma quantidade par garante que cada vértice tenha o espelho do outro lado.
function calcularPontoDaCurva(angulo: number): PontoDoContorno {
  return [
    16 * Math.sin(angulo) ** 3,
    13 * Math.cos(angulo) - 5 * Math.cos(2 * angulo) - 2 * Math.cos(3 * angulo) - Math.cos(4 * angulo),
  ];
}

export function gerarContornoDoCoracao(quantidadeDePontos: number): PontoDoContorno[] {
  const pontosDaCurva = Array.from({ length: quantidadeDePontos }, (_, indice) =>
    calcularPontoDaCurva((indice / quantidadeDePontos) * 2 * Math.PI),
  );
  const alturasDaCurva = pontosDaCurva.map(([, y]) => y);
  const alturaMaxima = Math.max(...alturasDaCurva);
  const alturaMinima = Math.min(...alturasDaCurva);
  const alturaTotal = alturaMaxima - alturaMinima;
  const centroVertical = (alturaMaxima + alturaMinima) / 2;
  return pontosDaCurva.map(([x, y]) => [x / alturaTotal, (y - centroVertical) / alturaTotal]);
}
