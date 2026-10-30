"use client";

import { useRef } from "react";
import { useAnimacaoDaCena } from "../animacaoDaCena";
import { criarCaminhoDoCoracao } from "../caminhoDoCoracao";

// No vídeo cada anel tem 0,72 do tamanho do anel de fora e um novo nasce no centro a cada 0,152 s.
const RAZAO_ENTRE_ANEIS = 0.72;
const INTERVALO_ENTRE_ANEIS_EM_SEGUNDOS = 0.152;
// O anel de fora passa da tela até no celular em pé; os de dentro somem no ponto de fuga.
const QUANTIDADE_DE_ANEIS = 30;
const ALTURA_DO_ANEL_MAIS_EXTERNO = 4000;
// O desenho base tem altura 100; a escala de cada anel leva junto a espessura do traço.
const ALTURA_DO_DESENHO_BASE = 100;
const ESPESSURA_DO_TRACO = 4.5;

const CAMINHO_DO_ANEL = criarCaminhoDoCoracao(120, ALTURA_DO_DESENHO_BASE);

export function TunelDeCoracoes() {
  const aneisDoTunel = useRef<Array<SVGPathElement | null>>([]);

  const propriedadesDoGrupoDaCena = useAnimacaoDaCena("tunel", (segundos) => {
    const avancoDoZoom = (segundos % INTERVALO_ENTRE_ANEIS_EM_SEGUNDOS) / INTERVALO_ENTRE_ANEIS_EM_SEGUNDOS;
    aneisDoTunel.current.forEach((anel, posicaoNoTunel) => {
      const alturaDoAnel = ALTURA_DO_ANEL_MAIS_EXTERNO * RAZAO_ENTRE_ANEIS ** (posicaoNoTunel - avancoDoZoom);
      anel?.setAttribute("transform", `scale(${alturaDoAnel / ALTURA_DO_DESENHO_BASE})`);
    });
  });

  return (
    <g {...propriedadesDoGrupoDaCena}>
      <rect x={-5000} y={-5000} width={10000} height={10000} className="fill-[#ffbafc]" />
      {Array.from({ length: QUANTIDADE_DE_ANEIS }, (_, posicaoNoTunel) => (
        <path
          key={posicaoNoTunel}
          ref={(anel) => {
            aneisDoTunel.current[posicaoNoTunel] = anel;
          }}
          d={CAMINHO_DO_ANEL}
          strokeWidth={ESPESSURA_DO_TRACO}
          strokeLinejoin="miter"
          className="fill-none stroke-white"
        />
      ))}
    </g>
  );
}
