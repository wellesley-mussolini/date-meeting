import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FundoAnimado } from "./FundoAnimado";

function buscarCenasVisiveis(fundo: HTMLElement) {
  return [...fundo.querySelectorAll<SVGElement>("[data-cena]")]
    .filter((cena) => cena.getAttribute("display") !== "none")
    .map((cena) => cena.dataset.cena);
}

describe("FundoAnimado", () => {
  it.each([
    { segundo: 2, cenaNoAr: "campo" },
    { segundo: 13, cenaNoAr: "tunel" },
    { segundo: 21, cenaNoAr: "espiral" },
  ])("mostra só o $cenaNoAr aos $segundo s, como no vídeo", ({ segundo, cenaNoAr }) => {
    const { container } = render(<FundoAnimado segundoInicial={segundo} congelado />);

    expect(buscarCenasVisiveis(container)).toEqual([cenaNoAr]);
  });
});
