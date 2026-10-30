import { describe, expect, it } from "vitest";
import { calcularGiroNaPassagemDaOnda } from "./giroDosCoracoes";

const PERIODO_DA_ONDA = 2;
const DURACAO_DO_GIRO = 0.5;

function calcularGiro(segundos: number, atrasoDoCoracao: number) {
  return calcularGiroNaPassagemDaOnda(segundos, atrasoDoCoracao, PERIODO_DA_ONDA, DURACAO_DO_GIRO);
}

describe("calcularGiroNaPassagemDaOnda", () => {
  it("fica parado antes de a onda chegar e depois que ela passa", () => {
    expect(calcularGiro(0.9, 1)).toBe(0);
    expect(calcularGiro(1 + DURACAO_DO_GIRO + 0.01, 1)).toBe(0);
  });

  it("dá só meia-volta enquanto a onda passa, um único giro por passagem", () => {
    expect(calcularGiro(1 + DURACAO_DO_GIRO / 2, 1)).toBeCloseTo(Math.PI / 2);
    expect(calcularGiro(1 + DURACAO_DO_GIRO * 0.999, 1)).toBeGreaterThan(Math.PI * 0.99);
    expect(calcularGiro(1 + DURACAO_DO_GIRO * 0.999, 1)).toBeLessThanOrEqual(Math.PI);
  });

  it("começa e termina devagar, como um coração que vira de verdade", () => {
    // No primeiro décimo do tempo anda bem menos que um décimo da meia-volta (um giro uniforme andaria 0,1π).
    const giroNoPrimeiroDecimo = calcularGiro(1 + DURACAO_DO_GIRO * 0.1, 1);
    expect(giroNoPrimeiroDecimo).toBeLessThan(Math.PI * 0.05);
  });

  it("volta a girar a cada passagem da onda", () => {
    expect(calcularGiro(1 + PERIODO_DA_ONDA + DURACAO_DO_GIRO / 2, 1)).toBeCloseTo(Math.PI / 2);
  });

  it("faz efeito dominó: o próximo coração começa quando o anterior termina", () => {
    const atrasoDoPrimeiro = 0;
    const atrasoDoSegundo = DURACAO_DO_GIRO;
    const meioDoPrimeiroGiro = DURACAO_DO_GIRO * 0.5;
    const meioDoSegundoGiro = DURACAO_DO_GIRO * 1.5;

    expect(calcularGiro(meioDoPrimeiroGiro, atrasoDoPrimeiro)).toBeGreaterThan(0);
    expect(calcularGiro(meioDoPrimeiroGiro, atrasoDoSegundo)).toBe(0);
    expect(calcularGiro(meioDoSegundoGiro, atrasoDoPrimeiro)).toBe(0);
    expect(calcularGiro(meioDoSegundoGiro, atrasoDoSegundo)).toBeGreaterThan(0);
  });

  it("aceita atraso maior que o período, para corações longe do ponto de partida da onda", () => {
    expect(calcularGiro(1 + DURACAO_DO_GIRO / 2, 1 + 3 * PERIODO_DA_ONDA)).toBeCloseTo(Math.PI / 2);
  });
});
