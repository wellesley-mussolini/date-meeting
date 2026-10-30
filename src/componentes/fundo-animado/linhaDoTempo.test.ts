import { describe, expect, it } from "vitest";
import { DURACAO_DO_CICLO_EM_SEGUNDOS, buscarCenaNoInstante } from "./linhaDoTempo";

const segundosDoQuadro = (quadro: number) => quadro / 24;

describe("buscarCenaNoInstante", () => {
  it("abre o ciclo no campo de corações", () => {
    expect(buscarCenaNoInstante(0)).toBe("campo");
  });

  it("corta seco do campo para o túnel no quadro 209, como no vídeo", () => {
    expect(buscarCenaNoInstante(segundosDoQuadro(208))).toBe("campo");
    expect(buscarCenaNoInstante(segundosDoQuadro(209))).toBe("tunel");
  });

  it("segue a ordem campo, túnel, espiral nos cortes medidos", () => {
    expect(buscarCenaNoInstante(segundosDoQuadro(413))).toBe("tunel");
    expect(buscarCenaNoInstante(segundosDoQuadro(414))).toBe("espiral");
    expect(buscarCenaNoInstante(segundosDoQuadro(622))).toBe("campo");
    expect(buscarCenaNoInstante(segundosDoQuadro(2068))).toBe("campo");
    expect(buscarCenaNoInstante(segundosDoQuadro(2069))).toBe("tunel");
  });

  it("termina o ciclo no túnel curto que o vídeo corta no meio", () => {
    expect(buscarCenaNoInstante(segundosDoQuadro(2683))).toBe("tunel");
    expect(buscarCenaNoInstante(segundosDoQuadro(2781))).toBe("tunel");
  });

  it("dura os 2782 quadros do vídeo de referência", () => {
    expect(DURACAO_DO_CICLO_EM_SEGUNDOS).toBeCloseTo(2782 / 24);
  });

  it("volta ao campo ao recomeçar o ciclo", () => {
    expect(buscarCenaNoInstante(DURACAO_DO_CICLO_EM_SEGUNDOS)).toBe("campo");
    expect(buscarCenaNoInstante(DURACAO_DO_CICLO_EM_SEGUNDOS + segundosDoQuadro(209))).toBe("tunel");
  });
});
