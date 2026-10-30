import { gerarContornoDoCoracao } from "./contornoDoCoracao";

// O contorno vem com y para cima; no SVG o y cresce para baixo, então inverte para a ponta ficar embaixo.
// O giro segue a convenção do rotate() do SVG: positivo gira no sentido horário da tela.
export function criarCaminhoDoCoracao(quantidadeDePontos: number, altura: number, giroEmRadianos = 0): string {
  const cosseno = Math.cos(giroEmRadianos);
  const seno = Math.sin(giroEmRadianos);
  const verticesDoCaminho = gerarContornoDoCoracao(quantidadeDePontos).map(([x, y]) => {
    const xNaTela = x * altura;
    const yNaTela = -y * altura;
    const xGirado = xNaTela * cosseno - yNaTela * seno;
    const yGirado = xNaTela * seno + yNaTela * cosseno;
    return `${xGirado.toFixed(2)},${yGirado.toFixed(2)}`;
  });
  return `M${verticesDoCaminho.join("L")}Z`;
}
