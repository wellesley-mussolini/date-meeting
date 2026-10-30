export const DISTANCIA_DA_CAMERA_NO_VIDEO = 6.4;

const PROPORCAO_DO_VIDEO = 4 / 3;

// Em tela larga a altura do vídeo preenche a tela e as laterais mostram mais cena. Em tela estreita
// (celular em pé) a câmera recua até caber a largura inteira do vídeo, sem cortar o túnel nas bordas.
export function calcularDistanciaDaCamera(proporcaoDaTela: number): number {
  return DISTANCIA_DA_CAMERA_NO_VIDEO * Math.max(1, PROPORCAO_DO_VIDEO / proporcaoDaTela);
}
