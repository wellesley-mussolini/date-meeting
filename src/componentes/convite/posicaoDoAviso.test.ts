import { describe, expect, it } from "vitest";
import { sortearPosicaoForaDoCard, type Retangulo } from "./posicaoDoAviso";

const TELA_DO_CELULAR = { largura: 390, altura: 844 };
const TELA_DO_MONITOR = { largura: 1440, altura: 900 };
const CARD_NO_CENTRO_DO_MONITOR: Retangulo = { x: 520, y: 250, largura: 400, altura: 400 };
const CARD_NO_CENTRO_DO_CELULAR: Retangulo = { x: 20, y: 272, largura: 350, altura: 300 };
const TAMANHO_DO_AVISO = { largura: 176, altura: 56 };

// Sequência fixa no lugar do Math.random, para o teste ser sempre igual.
function criarSorteioRepetivel() {
  let semente = 7;
  return () => {
    semente = (semente * 16807) % 2147483647;
    return (semente - 1) / 2147483646;
  };
}

function seSobrepoem(primeiro: Retangulo, segundo: Retangulo) {
  return (
    primeiro.x < segundo.x + segundo.largura &&
    segundo.x < primeiro.x + primeiro.largura &&
    primeiro.y < segundo.y + segundo.altura &&
    segundo.y < primeiro.y + primeiro.altura
  );
}

describe("sortearPosicaoForaDoCard", () => {
  it.each([
    { tela: TELA_DO_MONITOR, card: CARD_NO_CENTRO_DO_MONITOR, nomeDaTela: "monitor" },
    { tela: TELA_DO_CELULAR, card: CARD_NO_CENTRO_DO_CELULAR, nomeDaTela: "celular" },
  ])("nunca tampa o card nem sai da tela no $nomeDaTela", ({ tela, card }) => {
    const sortear = criarSorteioRepetivel();
    for (let tentativa = 0; tentativa < 500; tentativa++) {
      const posicao = sortearPosicaoForaDoCard(tela, card, TAMANHO_DO_AVISO, sortear);
      const aviso = { ...posicao, ...TAMANHO_DO_AVISO };

      expect(seSobrepoem(aviso, card)).toBe(false);
      expect(aviso.x).toBeGreaterThanOrEqual(0);
      expect(aviso.y).toBeGreaterThanOrEqual(0);
      expect(aviso.x + aviso.largura).toBeLessThanOrEqual(tela.largura);
      expect(aviso.y + aviso.altura).toBeLessThanOrEqual(tela.altura);
    }
  });

  it("muda de lugar a cada sorteio, em vez de cair sempre no mesmo canto", () => {
    const sortear = criarSorteioRepetivel();
    const posicoesSorteadas = Array.from({ length: 20 }, () =>
      sortearPosicaoForaDoCard(TELA_DO_MONITOR, CARD_NO_CENTRO_DO_MONITOR, TAMANHO_DO_AVISO, sortear),
    );
    const posicoesDiferentes = new Set(posicoesSorteadas.map(({ x, y }) => `${Math.round(x)}:${Math.round(y)}`));

    expect(posicoesDiferentes.size).toBeGreaterThan(10);
  });

  it("em tela sem espaço livre fica no topo, dentro da tela, em vez de quebrar", () => {
    const telaMinuscula = { largura: 200, altura: 300 };
    const cardQueOcupaTudo: Retangulo = { x: 0, y: 0, largura: 200, altura: 300 };

    const posicao = sortearPosicaoForaDoCard(telaMinuscula, cardQueOcupaTudo, TAMANHO_DO_AVISO, criarSorteioRepetivel());

    expect(posicao.y).toBe(0);
    expect(posicao.x).toBeGreaterThanOrEqual(0);
    expect(posicao.x + TAMANHO_DO_AVISO.largura).toBeLessThanOrEqual(telaMinuscula.largura);
  });
});
