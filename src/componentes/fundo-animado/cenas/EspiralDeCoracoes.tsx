"use client";

import { useId, useRef } from "react";
import { useAnimacaoDaCena } from "../animacaoDaCena";
import { criarCaminhoDoCoracao } from "../caminhoDoCoracao";
import { calcularGiroDoCoracao } from "../giroDosCoracoes";

// Anéis parados como no vídeo: cada um tem quase o dobro do raio do anterior e corações proporcionais.
const CORACOES_POR_ANEL = 12;
const RAIO_DO_ANEL_INTERNO = 55;
const CRESCIMENTO_ENTRE_ANEIS = 1.95;
// O sexto anel cobre os cantos do celular em pé.
const QUANTIDADE_DE_ANEIS = 6;
const ALTURA_RELATIVA_AO_RAIO = 0.46;
// De lado o coração ainda mostra a espessura, em vez de sumir numa linha.
const LARGURA_MINIMA_DE_LADO = 0.12;
const PONTOS_DO_CONTORNO = 120;

// Seno e cosseno variam na última casa entre o Node do servidor e o navegador; arredondar evita
// atributo diferente na hidratação.
const arredondarCoordenada = (coordenada: number) => Number(coordenada.toFixed(2));

type CoracaoDaEspiral = {
  x: number;
  y: number;
  giroDoDesenhoEmGraus: number;
  caminhoDaFace: string;
  deslocamentoDaLateral: { x: number; y: number };
};

const CORACOES_DA_ESPIRAL: CoracaoDaEspiral[] = Array.from({ length: QUANTIDADE_DE_ANEIS }, (_, anel) => {
  const raioDoAnel = RAIO_DO_ANEL_INTERNO * CRESCIMENTO_ENTRE_ANEIS ** anel;
  const alturaDoCoracao = raioDoAnel * ALTURA_RELATIVA_AO_RAIO;
  const defasagemDoAnel = anel % 2 === 0 ? 0 : Math.PI / CORACOES_POR_ANEL;
  return Array.from({ length: CORACOES_POR_ANEL }, (_, posicaoNoAnel) => {
    const anguloNoAnel = (posicaoNoAnel / CORACOES_POR_ANEL) * 2 * Math.PI + defasagemDoAnel;
    // Um quarto de volta além do ângulo da posição deixa a ponta apontando para o centro.
    const giroDoDesenho = anguloNoAnel + Math.PI / 2;
    return {
      x: arredondarCoordenada(raioDoAnel * Math.cos(anguloNoAnel)),
      y: arredondarCoordenada(raioDoAnel * Math.sin(anguloNoAnel)),
      giroDoDesenhoEmGraus: (giroDoDesenho * 180) / Math.PI,
      caminhoDaFace: criarCaminhoDoCoracao(PONTOS_DO_CONTORNO, alturaDoCoracao, giroDoDesenho),
      // A luz vem do alto à esquerda: a espessura aparece embaixo à direita de todos os corações.
      deslocamentoDaLateral: {
        x: arredondarCoordenada(alturaDoCoracao * 0.05),
        y: arredondarCoordenada(alturaDoCoracao * 0.07),
      },
    };
  });
}).flat();

export function EspiralDeCoracoes() {
  const coracoesQueGiram = useRef<Array<SVGGElement | null>>([]);
  const idDoDegradeDaFace = useId();

  const grupoDaCena = useAnimacaoDaCena("espiral", (segundos) => {
    coracoesQueGiram.current.forEach((coracao, indiceDoCoracao) => {
      const giro = calcularGiroDoCoracao(segundos, indiceDoCoracao, CORACOES_DA_ESPIRAL.length);
      const larguraAparente = Math.max(Math.abs(Math.cos(giro)), LARGURA_MINIMA_DE_LADO);
      const { giroDoDesenhoEmGraus } = CORACOES_DA_ESPIRAL[indiceDoCoracao];
      // Achata o coração ao longo do próprio eixo (ponta–vinco), que é o eixo do giro no vídeo.
      coracao?.setAttribute(
        "transform",
        `rotate(${giroDoDesenhoEmGraus}) scale(${larguraAparente} 1) rotate(${-giroDoDesenhoEmGraus})`,
      );
    });
  });

  return (
    <g ref={grupoDaCena} data-cena="espiral">
      <defs>
        <linearGradient id={idDoDegradeDaFace} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffa774" />
          <stop offset="1" stopColor="#ff8450" />
        </linearGradient>
      </defs>
      <rect x={-5000} y={-5000} width={10000} height={10000} className="fill-[#ffe0fe]" />
      {CORACOES_DA_ESPIRAL.map(({ x, y, caminhoDaFace, deslocamentoDaLateral }, indiceDoCoracao) => (
        <g key={indiceDoCoracao} transform={`translate(${x} ${y})`}>
          <g
            ref={(coracao) => {
              coracoesQueGiram.current[indiceDoCoracao] = coracao;
            }}
          >
            <path
              d={caminhoDaFace}
              transform={`translate(${deslocamentoDaLateral.x} ${deslocamentoDaLateral.y})`}
              className="fill-[#e46f3c]"
            />
            <path d={caminhoDaFace} fill={`url(#${idDoDegradeDaFace})`} />
          </g>
        </g>
      ))}
    </g>
  );
}
