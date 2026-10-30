import { describe, expect, it } from "vitest";
import { DISTANCIA_DA_CAMERA_NO_VIDEO, calcularDistanciaDaCamera } from "./enquadramentoDaCamera";

const PROPORCAO_DO_VIDEO = 4 / 3;

describe("calcularDistanciaDaCamera", () => {
  it("mantém o enquadramento do vídeo numa tela 4:3", () => {
    expect(calcularDistanciaDaCamera(PROPORCAO_DO_VIDEO)).toBeCloseTo(DISTANCIA_DA_CAMERA_NO_VIDEO);
  });

  it("não aproxima nem afasta em tela larga: a altura do vídeo preenche e as laterais mostram mais cena", () => {
    expect(calcularDistanciaDaCamera(16 / 9)).toBeCloseTo(DISTANCIA_DA_CAMERA_NO_VIDEO);
    expect(calcularDistanciaDaCamera(21 / 9)).toBeCloseTo(DISTANCIA_DA_CAMERA_NO_VIDEO);
  });

  it("afasta no celular em pé para caber a largura inteira do vídeo", () => {
    const proporcaoDoCelularEmPe = 9 / 19.5;
    expect(calcularDistanciaDaCamera(proporcaoDoCelularEmPe)).toBeCloseTo(
      DISTANCIA_DA_CAMERA_NO_VIDEO * (PROPORCAO_DO_VIDEO / proporcaoDoCelularEmPe),
    );
  });
});
