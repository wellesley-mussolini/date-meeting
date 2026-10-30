export const PERIODO_DO_GIRO_EM_SEGUNDOS = 1.875;

// Pular 7 posições por período espalha o giro pela cena, como no vídeo, em vez de passar para o vizinho.
const SALTO_ENTRE_CORACOES_QUE_GIRAM = 7;
const PRIMEIRO_CORACAO_QUE_GIRA = 3;

export function calcularGiroDoCoracao(segundos: number, indiceDoCoracao: number, totalDeCoracoes: number): number {
  const periodoAtual = Math.floor(segundos / PERIODO_DO_GIRO_EM_SEGUNDOS);
  const coracaoDaVez = (periodoAtual * SALTO_ENTRE_CORACOES_QUE_GIRAM + PRIMEIRO_CORACAO_QUE_GIRA) % totalDeCoracoes;
  if (indiceDoCoracao !== coracaoDaVez) return 0;
  const fracaoDoPeriodo = (segundos % PERIODO_DO_GIRO_EM_SEGUNDOS) / PERIODO_DO_GIRO_EM_SEGUNDOS;
  return fracaoDoPeriodo * 2 * Math.PI;
}
