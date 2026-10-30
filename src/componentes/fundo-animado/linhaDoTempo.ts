export type Cena = "campo" | "tunel" | "espiral";

const QUADROS_POR_SEGUNDO = 24;

// Cortes medidos quadro a quadro no vídeo de referência (24 fps). Cada trecho vai do
// próprio quadro inicial até o quadro inicial do seguinte; o último vai até o fim do ciclo.
const TRECHOS_DO_CICLO: ReadonlyArray<{ cena: Cena; quadroInicial: number }> = [
  { cena: "campo", quadroInicial: 0 },
  { cena: "tunel", quadroInicial: 209 },
  { cena: "espiral", quadroInicial: 414 },
  { cena: "campo", quadroInicial: 622 },
  { cena: "tunel", quadroInicial: 829 },
  { cena: "espiral", quadroInicial: 1032 },
  { cena: "campo", quadroInicial: 1238 },
  { cena: "tunel", quadroInicial: 1445 },
  { cena: "espiral", quadroInicial: 1651 },
  { cena: "campo", quadroInicial: 1858 },
  { cena: "tunel", quadroInicial: 2069 },
  { cena: "espiral", quadroInicial: 2271 },
  { cena: "campo", quadroInicial: 2478 },
  { cena: "tunel", quadroInicial: 2683 },
];

const QUADROS_DO_CICLO = 2782;

export const DURACAO_DO_CICLO_EM_SEGUNDOS = QUADROS_DO_CICLO / QUADROS_POR_SEGUNDO;

export function buscarCenaNoInstante(segundos: number): Cena {
  const quadroNoCiclo = Math.floor(segundos * QUADROS_POR_SEGUNDO) % QUADROS_DO_CICLO;
  const trechoAtual = TRECHOS_DO_CICLO.findLast(({ quadroInicial }) => quadroInicial <= quadroNoCiclo);
  return trechoAtual!.cena;
}
