import { describe, expect, it } from "vitest";
import { PERIODO_DO_GIRO_EM_SEGUNDOS, calcularGiroDoCoracao } from "./giroDosCoracoes";

const TOTAL_DE_CORACOES = 36;

function buscarCoracoesGirando(segundos: number) {
  return Array.from({ length: TOTAL_DE_CORACOES }, (_, indice) => indice).filter(
    (indice) => calcularGiroDoCoracao(segundos, indice, TOTAL_DE_CORACOES) !== 0,
  );
}

describe("calcularGiroDoCoracao", () => {
  it("gira um único coração por vez, no meio do período", () => {
    expect(buscarCoracoesGirando(PERIODO_DO_GIRO_EM_SEGUNDOS * 0.5)).toHaveLength(1);
    expect(buscarCoracoesGirando(PERIODO_DO_GIRO_EM_SEGUNDOS * 3.25)).toHaveLength(1);
  });

  it("dá uma volta completa ao longo do período", () => {
    const [coracaoGirando] = buscarCoracoesGirando(PERIODO_DO_GIRO_EM_SEGUNDOS * 0.5);
    expect(calcularGiroDoCoracao(PERIODO_DO_GIRO_EM_SEGUNDOS * 0.25, coracaoGirando, TOTAL_DE_CORACOES)).toBeCloseTo(Math.PI / 2);
    expect(calcularGiroDoCoracao(PERIODO_DO_GIRO_EM_SEGUNDOS * 0.5, coracaoGirando, TOTAL_DE_CORACOES)).toBeCloseTo(Math.PI);
    expect(calcularGiroDoCoracao(PERIODO_DO_GIRO_EM_SEGUNDOS * 0.999, coracaoGirando, TOTAL_DE_CORACOES)).toBeGreaterThan(
      Math.PI * 1.99,
    );
  });

  it("troca de coração a cada período", () => {
    const [primeiroQueGira] = buscarCoracoesGirando(PERIODO_DO_GIRO_EM_SEGUNDOS * 0.5);
    const [segundoQueGira] = buscarCoracoesGirando(PERIODO_DO_GIRO_EM_SEGUNDOS * 1.5);
    expect(segundoQueGira).not.toBe(primeiroQueGira);
  });

  it("espalha o giro pela cena em vez de andar para o vizinho", () => {
    const [primeiroQueGira] = buscarCoracoesGirando(PERIODO_DO_GIRO_EM_SEGUNDOS * 0.5);
    const [segundoQueGira] = buscarCoracoesGirando(PERIODO_DO_GIRO_EM_SEGUNDOS * 1.5);
    expect(Math.abs(segundoQueGira - primeiroQueGira)).toBeGreaterThan(1);
  });
});
