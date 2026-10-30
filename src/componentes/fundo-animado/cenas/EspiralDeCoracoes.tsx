"use client";

import { useId, useRef } from "react";
import { useAnimacaoDaCena } from "../animacaoDaCena";
import { criarCaminhoDoCoracao } from "../caminhoDoCoracao";
import { calcularGiroNaPassagemDaOnda } from "../giroDosCoracoes";

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

// No vídeo o giro corre em dominó no sentido anti-horário: a cada 0,9375 s a onda avança uma posição
// (30°) e vira, em todos os anéis, os corações daquele ângulo. Às 17,5 s ela está nas 4h30 da tela.
const DURACAO_DO_GIRO_EM_SEGUNDOS = 0.9375;
const VELOCIDADE_DA_ONDA_EM_RADIANOS_POR_SEGUNDO = (2 * Math.PI) / CORACOES_POR_ANEL / DURACAO_DO_GIRO_EM_SEGUNDOS;
const PERIODO_DA_ONDA_EM_SEGUNDOS = (2 * Math.PI) / VELOCIDADE_DA_ONDA_EM_RADIANOS_POR_SEGUNDO;
const ANGULO_DA_ONDA_AOS_17_5_SEGUNDOS = Math.PI / 4;
const ANGULO_DA_ONDA_NO_INICIO = ANGULO_DA_ONDA_AOS_17_5_SEGUNDOS + VELOCIDADE_DA_ONDA_EM_RADIANOS_POR_SEGUNDO * 17.5;

// Seno e cosseno variam na última casa entre o Node do servidor e o navegador; arredondar evita
// atributo diferente na hidratação.
const arredondarCoordenada = (coordenada: number) => Number(coordenada.toFixed(2));

type CoracaoDaEspiral = {
  x: number;
  y: number;
  giroDoDesenhoEmGraus: number;
  caminhoDaFace: string;
  deslocamentoDaLateral: { x: number; y: number };
  atrasoDoGiro: number;
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
      // A onda anda no sentido anti-horário da tela, que no SVG (y para baixo) é o ângulo diminuindo.
      atrasoDoGiro: (ANGULO_DA_ONDA_NO_INICIO - anguloNoAnel) / VELOCIDADE_DA_ONDA_EM_RADIANOS_POR_SEGUNDO,
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
      const { giroDoDesenhoEmGraus, atrasoDoGiro } = CORACOES_DA_ESPIRAL[indiceDoCoracao];
      const giro = calcularGiroNaPassagemDaOnda(
        segundos,
        atrasoDoGiro,
        PERIODO_DA_ONDA_EM_SEGUNDOS,
        DURACAO_DO_GIRO_EM_SEGUNDOS,
      );
      const larguraAparente = Math.max(Math.abs(Math.cos(giro)), LARGURA_MINIMA_DE_LADO);
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
