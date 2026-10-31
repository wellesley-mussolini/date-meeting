import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CardDoConvite } from "./CardDoConvite";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Fixa o sorteio da posição: o teste de arrastar não pode depender de onde o aviso caiu.
function fixarSorteioDaPosicao() {
  vi.spyOn(Math, "random").mockReturnValue(0.25);
}

function buscarAvisoTemCerteza() {
  return screen.getByText("Tem certeza?").closest<HTMLElement>("[data-aviso-tem-certeza]")!;
}

function lerPosicaoNaTela(aviso: HTMLElement) {
  return { x: parseFloat(aviso.style.left), y: parseFloat(aviso.style.top) };
}

describe("CardDoConvite", () => {
  it("faz o convite com as opções SIM e NÃO, sem aviso antes da resposta", () => {
    render(<CardDoConvite />);

    expect(screen.getByRole("heading", { name: "Você aceitaria ir a um date comigo?" })).toBeDefined();
    expect(screen.getByRole("button", { name: "SIM" })).toBeDefined();
    expect(screen.getByRole("button", { name: "NÃO" })).toBeDefined();
    expect(screen.queryByText("Tem certeza?")).toBeNull();
  });

  it("ao clicar NÃO o botão some e aparece só o Tem certeza?, sem repetir o emoji e sem ser clicável", () => {
    render(<CardDoConvite />);

    fireEvent.click(screen.getByRole("button", { name: "NÃO" }));

    const aviso = buscarAvisoTemCerteza();
    expect(screen.queryByRole("button", { name: "NÃO" })).toBeNull();
    expect(screen.getAllByRole("button").map((botao) => botao.textContent)).toEqual(["SIM"]);
    expect(aviso.querySelector("svg")).toBeNull();
    expect(aviso.closest("button")).toBeNull();
  });

  it("deixa arrastar o aviso pela tela", () => {
    fixarSorteioDaPosicao();
    render(<CardDoConvite />);
    fireEvent.click(screen.getByRole("button", { name: "NÃO" }));
    const aviso = buscarAvisoTemCerteza();
    const posicaoAntesDeArrastar = lerPosicaoNaTela(aviso);

    fireEvent.pointerDown(aviso, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(window, { clientX: 150, clientY: 130, pointerId: 1 });
    fireEvent.pointerUp(window, { clientX: 150, clientY: 130, pointerId: 1 });

    expect(lerPosicaoNaTela(aviso)).toEqual({
      x: posicaoAntesDeArrastar.x + 50,
      y: posicaoAntesDeArrastar.y + 30,
    });
  });

  it("solta o aviso quando o dedo sai da tela, sem continuar arrastando", () => {
    fixarSorteioDaPosicao();
    render(<CardDoConvite />);
    fireEvent.click(screen.getByRole("button", { name: "NÃO" }));
    const aviso = buscarAvisoTemCerteza();

    fireEvent.pointerDown(aviso, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(window, { clientX: 100, clientY: 100, pointerId: 1 });
    const posicaoAoSoltar = lerPosicaoNaTela(aviso);
    fireEvent.pointerMove(window, { clientX: 300, clientY: 300, pointerId: 1 });

    expect(lerPosicaoNaTela(aviso)).toEqual(posicaoAoSoltar);
  });
});
