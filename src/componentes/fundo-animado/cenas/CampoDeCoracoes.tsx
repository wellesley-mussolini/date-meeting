"use client";

import { useId, useRef } from "react";
import { useAnimacaoDaCena } from "../animacaoDaCena";
import { criarCaminhoDoCoracao } from "../caminhoDoCoracao";

// Medidas no quadro de referência (960 × 720): coração de 300 de altura, colunas a 230, passo vertical
// de 315 com colunas vizinhas defasadas meio passo. A grade sobe um passo a cada 1,875 s.
const PERIODO_DA_SUBIDA_EM_SEGUNDOS = 1.875;
const PASSO_VERTICAL = 315;
const ESPACO_ENTRE_COLUNAS = 230;
const ALTURA_DO_CORACAO = 300;
// O coração do campo é mais alto que largo, diferente do contorno do túnel.
const ESTREITAMENTO_DO_CORACAO = 0.82;
// Colunas e linhas de sobra cobrem tela larga e celular em pé, que mostram além do quadro 4:3.
const COLUNAS_POR_LADO = 6;
const LINHAS_POR_LADO = 5;

const CAMINHO_DO_CORACAO = criarCaminhoDoCoracao(120, ALTURA_DO_CORACAO);

const POSICOES_DOS_CORACOES = Array.from({ length: 2 * COLUNAS_POR_LADO + 1 }, (_, indiceDaColuna) => {
  const coluna = indiceDaColuna - COLUNAS_POR_LADO;
  const defasagemDaColuna = coluna % 2 === 0 ? 0 : PASSO_VERTICAL / 2;
  return Array.from({ length: 2 * LINHAS_POR_LADO + 2 }, (_, indiceDaLinha) => ({
    x: coluna * ESPACO_ENTRE_COLUNAS,
    y: (indiceDaLinha - LINHAS_POR_LADO) * PASSO_VERTICAL + defasagemDaColuna,
  }));
}).flat();

export function CampoDeCoracoes() {
  const gradeQueSobe = useRef<SVGGElement>(null);
  const idDoCoracao = useId();
  const idDoDegradeDaFace = useId();

  const grupoDaCena = useAnimacaoDaCena("campo", (segundos) => {
    const fracaoDoPeriodo = (segundos % PERIODO_DA_SUBIDA_EM_SEGUNDOS) / PERIODO_DA_SUBIDA_EM_SEGUNDOS;
    gradeQueSobe.current?.setAttribute("transform", `translate(0 ${-fracaoDoPeriodo * PASSO_VERTICAL})`);
  });

  return (
    <g ref={grupoDaCena} data-cena="campo">
      <defs>
        <linearGradient id={idDoDegradeDaFace} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffbfe" />
          <stop offset="1" stopColor="#fbeaf3" />
        </linearGradient>
        <g id={idDoCoracao} transform={`scale(${ESTREITAMENTO_DO_CORACAO} 1)`}>
          {/* Sombra no chão, jogada para a esquerda pela luz que vem da direita. */}
          <path d={CAMINHO_DO_CORACAO} transform="translate(-46 20)" className="fill-[#e9989c]" />
          {/* Parede lateral: a espessura do coração, rosada pela luz rebatida do chão. */}
          <path d={CAMINHO_DO_CORACAO} transform="translate(-16 7)" className="fill-[#f8c4cc]" />
          <path d={CAMINHO_DO_CORACAO} fill={`url(#${idDoDegradeDaFace})`} />
        </g>
      </defs>
      <rect x={-5000} y={-5000} width={10000} height={10000} className="fill-[#ffb2b5]" />
      <g ref={gradeQueSobe}>
        {POSICOES_DOS_CORACOES.map(({ x, y }) => (
          <use key={`${x}:${y}`} href={`#${idDoCoracao}`} x={x} y={y} />
        ))}
      </g>
    </g>
  );
}
