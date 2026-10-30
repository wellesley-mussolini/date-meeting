import { describe, expect, it } from "vitest";
import { gerarContornoDoCoracao } from "./contornoDoCoracao";

const PONTOS_DO_CONTORNO = 32;

describe("gerarContornoDoCoracao", () => {
  const contorno = gerarContornoDoCoracao(PONTOS_DO_CONTORNO);
  const coordenadasX = contorno.map(([x]) => x);
  const coordenadasY = contorno.map(([, y]) => y);

  it("devolve a quantidade de vértices pedida, para o coração facetado do vídeo", () => {
    expect(contorno).toHaveLength(PONTOS_DO_CONTORNO);
  });

  it("tem altura 1 e fica centrado na origem, para escalar igual nas três cenas", () => {
    expect(Math.max(...coordenadasY) - Math.min(...coordenadasY)).toBeCloseTo(1);
    expect(Math.max(...coordenadasY) + Math.min(...coordenadasY)).toBeCloseTo(0);
    expect(Math.max(...coordenadasX) + Math.min(...coordenadasX)).toBeCloseTo(0);
  });

  it("é simétrico em relação ao eixo vertical", () => {
    for (const [x, y] of contorno) {
      const temEspelho = contorno.some(([xEspelho, yEspelho]) =>
        Math.abs(xEspelho + x) < 1e-9 && Math.abs(yEspelho - y) < 1e-9,
      );
      expect(temEspelho).toBe(true);
    }
  });

  it("tem a ponta embaixo, no eixo central", () => {
    const pontaDeBaixo = contorno.reduce((maisBaixo, ponto) => (ponto[1] < maisBaixo[1] ? ponto : maisBaixo));
    expect(pontaDeBaixo[0]).toBeCloseTo(0);
  });

  it("tem o vinco no topo central abaixo dos dois lóbulos", () => {
    const vincoDoTopo = contorno.find(([x, y]) => Math.abs(x) < 1e-9 && y > 0);
    expect(vincoDoTopo).toBeDefined();
    expect(vincoDoTopo![1]).toBeLessThan(Math.max(...coordenadasY));
  });

  it("é mais largo que alto, na proporção do coração do vídeo", () => {
    const largura = Math.max(...coordenadasX) - Math.min(...coordenadasX);
    expect(largura).toBeGreaterThan(1.05);
    expect(largura).toBeLessThan(1.2);
  });
});
