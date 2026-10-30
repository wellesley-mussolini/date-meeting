import { act, cleanup, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FundoAnimado } from "./FundoAnimado";

function buscarCenasVisiveis(fundo: HTMLElement) {
  return [...fundo.querySelectorAll<SVGElement>("[data-cena]")]
    .filter((cena) => cena.getAttribute("display") !== "none")
    .map((cena) => cena.dataset.cena);
}

const INSTANTES_DE_CADA_CENA = [
  { segundo: 2, cenaNoAr: "campo" },
  { segundo: 13, cenaNoAr: "tunel" },
  { segundo: 21, cenaNoAr: "espiral" },
];

afterEach(() => {
  cleanup();
});

describe("FundoAnimado", () => {
  it.each(INSTANTES_DE_CADA_CENA)("mostra só o $cenaNoAr aos $segundo s, como no vídeo", ({ segundo, cenaNoAr }) => {
    const { container } = render(<FundoAnimado segundoInicial={segundo} congelado />);

    expect(buscarCenasVisiveis(container)).toEqual([cenaNoAr]);
  });

  // Antes da hidratação só existe o HTML do servidor: se ele trouxer as três cenas, a última (espiral)
  // cobre as outras e pisca na tela até o JavaScript trocar para a cena certa.
  it.each(INSTANTES_DE_CADA_CENA)(
    "já sai do servidor só com o $cenaNoAr visível aos $segundo s",
    ({ segundo, cenaNoAr }) => {
      const htmlDoServidor = document.createElement("div");
      htmlDoServidor.innerHTML = renderToString(<FundoAnimado segundoInicial={segundo} congelado />);

      expect(buscarCenasVisiveis(htmlDoServidor)).toEqual([cenaNoAr]);
    },
  );
});

describe("FundoAnimado com o relógio andando", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("corta do campo para o túnel quando o relógio passa do quadro 209", () => {
    const { container } = render(<FundoAnimado segundoInicial={8.6} />);
    expect(buscarCenasVisiveis(container)).toEqual(["campo"]);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(buscarCenasVisiveis(container)).toEqual(["tunel"]);
  });

  it("para de pedir quadros ao navegador quando sai da tela", () => {
    const { unmount } = render(<FundoAnimado />);
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it("congelado não pede quadro nenhum, porque nada muda", () => {
    render(<FundoAnimado segundoInicial={2} congelado />);

    expect(vi.getTimerCount()).toBe(0);
  });
});
