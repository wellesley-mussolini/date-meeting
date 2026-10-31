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

function avancarAteAEscolhaDaData() {
  render(<CardDoConvite />);
  fireEvent.click(screen.getByRole("button", { name: "SIM" }));
  fireEvent.click(screen.getByRole("button", { name: "PRÓXIMO 🖤" }));
}

function avancarAteAEscolhaDoPrograma() {
  avancarAteAEscolhaDaData();
  fireEvent.change(screen.getByLabelText("Escolha a data"), { target: { value: "2026-11-14" } });
  fireEvent.change(screen.getByLabelText("Escolha o horário"), { target: { value: "19:30" } });
  fireEvent.click(screen.getByRole("button", { name: "SELECIONAR A DATA 🖤" }));
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

  it("ao clicar SIM troca o emoji pelo da rosa e mostra a resposta com o botão PRÓXIMO", () => {
    render(<CardDoConvite />);
    expect(document.querySelector("[data-emoji]")?.getAttribute("data-emoji")).toBe("implorando");

    fireEvent.click(screen.getByRole("button", { name: "SIM" }));

    expect(document.querySelector("[data-emoji]")?.getAttribute("data-emoji")).toBe("seduzindo");
    expect(screen.getByRole("heading", { name: "VOCÊ DISSE SIM? 😳" })).toBeDefined();
    expect(screen.getByText("Eu estava esperando você dizer não kkkk")).toBeDefined();
    expect(screen.getAllByRole("button").map((botao) => botao.textContent)).toEqual(["PRÓXIMO 🖤"]);
  });

  it("ao clicar SIM depois do NÃO tira o Tem certeza? da tela", () => {
    render(<CardDoConvite />);
    fireEvent.click(screen.getByRole("button", { name: "NÃO" }));

    fireEvent.click(screen.getByRole("button", { name: "SIM" }));

    expect(screen.queryByText("Tem certeza?")).toBeNull();
  });

  it("ao clicar PRÓXIMO tira o emoji e pede a data e o horário do date", () => {
    render(<CardDoConvite />);
    fireEvent.click(screen.getByRole("button", { name: "SIM" }));

    fireEvent.click(screen.getByRole("button", { name: "PRÓXIMO 🖤" }));

    expect(document.querySelector("[data-emoji]")).toBeNull();
    expect(screen.getByRole("heading", { name: "📅 Quando você tá livre?" })).toBeDefined();
    expect(screen.getByLabelText("Escolha a data")).toHaveProperty("type", "date");
    expect(screen.getByLabelText("Escolha o horário")).toHaveProperty("type", "time");
    expect(screen.getAllByRole("button").map((botao) => botao.textContent)).toEqual(["SELECIONAR A DATA 🖤"]);
  });

  it("só deixa selecionar a data depois de escolher a data e o horário", () => {
    avancarAteAEscolhaDaData();
    const botaoSelecionarData = screen.getByRole("button", { name: "SELECIONAR A DATA 🖤" });
    expect(botaoSelecionarData).toHaveProperty("disabled", true);

    fireEvent.change(screen.getByLabelText("Escolha a data"), { target: { value: "2026-11-14" } });
    expect(botaoSelecionarData).toHaveProperty("disabled", true);

    fireEvent.change(screen.getByLabelText("Escolha o horário"), { target: { value: "19:30" } });
    expect(botaoSelecionarData).toHaveProperty("disabled", false);
  });

  it("depois da data pergunta o que a pessoa tá afim, com cinema, barzinho, jantar e outras opções", () => {
    avancarAteAEscolhaDoPrograma();

    expect(screen.getByRole("heading", { name: "O que você tá afim?" })).toBeDefined();
    for (const programa of ["Cinema", "Barzinho", "Jantar"]) {
      expect(screen.getByRole("button", { name: programa })).toHaveProperty("ariaPressed", "false");
    }
    expect(screen.getAllByRole("button", { pressed: false }).length).toBeGreaterThan(3);
    expect(screen.getByRole("button", { name: "ISSO PARECE LEGAL! 😎" })).toHaveProperty("disabled", true);
  });

  it("marca e desmarca os programas escolhidos e só segue com pelo menos um", () => {
    avancarAteAEscolhaDoPrograma();
    const opcaoCinema = screen.getByRole("button", { name: "Cinema" });
    const botaoParecerLegal = screen.getByRole("button", { name: "ISSO PARECE LEGAL! 😎" });

    fireEvent.click(opcaoCinema);
    expect(opcaoCinema).toHaveProperty("ariaPressed", "true");
    expect(botaoParecerLegal).toHaveProperty("disabled", false);

    fireEvent.click(opcaoCinema);
    expect(opcaoCinema).toHaveProperty("ariaPressed", "false");
    expect(botaoParecerLegal).toHaveProperty("disabled", true);
  });

  it("termina com o pinguim e o resumo do date: data, horário e programas escolhidos", () => {
    avancarAteAEscolhaDoPrograma();
    fireEvent.click(screen.getByRole("button", { name: "Cinema" }));
    fireEvent.click(screen.getByRole("button", { name: "Jantar" }));

    fireEvent.click(screen.getByRole("button", { name: "ISSO PARECE LEGAL! 😎" }));

    expect(document.querySelector("[data-emoji]")?.getAttribute("data-emoji")).toBe("pinguim");
    expect(screen.getByRole("heading", { name: "TÔ CONTIGO GATINHA. 🖤" })).toBeDefined();
    expect(screen.getByText("Fica pronta que eu vou te buscar 🚗")).toBeDefined();
    expect(screen.getAllByRole("listitem").map((topico) => topico.textContent)).toEqual([
      "📅 14/11/2026 às 19:30",
      "🎬 Cinema",
      "🍽️ Jantar",
    ]);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
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
