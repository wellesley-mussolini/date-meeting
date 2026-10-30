import { describe, expect, it } from "vitest";
import { criarCaminhoDoCoracao } from "./caminhoDoCoracao";

function lerVerticesDoCaminho(caminho: string): Array<[x: number, y: number]> {
  return [...caminho.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map(([, x, y]) => [Number(x), Number(y)]);
}

describe("criarCaminhoDoCoracao", () => {
  const caminho = criarCaminhoDoCoracao(24, 300);
  const vertices = lerVerticesDoCaminho(caminho);

  it("desenha um polígono fechado com um vértice por ponto do contorno", () => {
    expect(caminho.startsWith("M")).toBe(true);
    expect(caminho.endsWith("Z")).toBe(true);
    expect(vertices).toHaveLength(24);
  });

  it("tem a altura pedida, centrado na origem do coração", () => {
    const alturas = vertices.map(([, y]) => y);
    expect(Math.max(...alturas) - Math.min(...alturas)).toBeCloseTo(300, 0);
    expect(Math.max(...alturas) + Math.min(...alturas)).toBeCloseTo(0, 0);
  });

  it("põe a ponta embaixo, já que no SVG o eixo y cresce para baixo", () => {
    const pontaDeBaixo = vertices.reduce((maisBaixo, vertice) => (vertice[1] > maisBaixo[1] ? vertice : maisBaixo));
    expect(pontaDeBaixo[0]).toBeCloseTo(0, 1);
    expect(pontaDeBaixo[1]).toBeGreaterThan(0);
  });

  // A espiral desenha cada coração já girado para o degradê de luz ficar no mesmo canto da tela em todos.
  it("gira o desenho no sentido horário: um quarto de volta leva a ponta para a esquerda", () => {
    const verticesGirados = lerVerticesDoCaminho(criarCaminhoDoCoracao(24, 300, Math.PI / 2));
    const pontaGirada = verticesGirados.reduce((maisAEsquerda, vertice) =>
      vertice[0] < maisAEsquerda[0] ? vertice : maisAEsquerda,
    );
    expect(pontaGirada[1]).toBeCloseTo(0, 1);
    expect(pontaGirada[0]).toBeCloseTo(-150, 0);
  });
});
