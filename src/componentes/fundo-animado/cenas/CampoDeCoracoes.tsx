"use client";

import { useId, useRef } from "react";
import { useAnimacaoDaCena } from "../animacaoDaCena";
import { criarCaminhoDoCoracao } from "../caminhoDoCoracao";
import { calcularGiroNaPassagemDaOnda } from "../giroDosCoracoes";

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

// Quadro a quadro no vídeo, uma onda passa da direita para a esquerda inclinando as colunas no próprio
// eixo até uns 50° e devolvendo: chega numa coluna nova a cada 0,19 s, cada coluna leva 0,65 s inclinando
// e voltando (duas ou três se mexem juntas), e a onda recomeça a cada 1,25 s. Em x = 250 ela chega aos 0,29 s.
const PERIODO_DA_ONDA_EM_SEGUNDOS = 1.25;
const INTERVALO_ENTRE_COLUNAS_EM_SEGUNDOS = 0.19;
const DURACAO_DA_INCLINACAO_EM_SEGUNDOS = 0.65;
const INCLINACAO_MAXIMA = 0.9;
const VELOCIDADE_DA_ONDA = ESPACO_ENTRE_COLUNAS / INTERVALO_ENTRE_COLUNAS_EM_SEGUNDOS;
const PONTO_DE_PARTIDA_DA_ONDA = 250 + 0.29 * VELOCIDADE_DA_ONDA;

// O coração é um sólido: fatias empilhadas da traseira até a face, cada uma deslocada por z·sen(giro),
// formam a parede lateral quando ele vira. Parado, o pequeno giro de repouso mostra a parede à esquerda.
const ESPESSURA_DO_CORACAO = 110;
const GIRO_DE_REPOUSO = 0.15;
const QUANTIDADE_DE_FATIAS = 16;
const QUEDA_DA_FATIA_POR_PROFUNDIDADE = 0.07;
const DESLOCAMENTO_DA_SOMBRA = { x: -46, y: 20 };

const CAMINHO_DO_CORACAO = criarCaminhoDoCoracao(120, ALTURA_DO_CORACAO);

const PROFUNDIDADES_DAS_FATIAS = Array.from(
  { length: QUANTIDADE_DE_FATIAS },
  (_, indiceDaFatia) => -ESPESSURA_DO_CORACAO / 2 + (ESPESSURA_DO_CORACAO * indiceDaFatia) / (QUANTIDADE_DE_FATIAS - 1),
);
const PROFUNDIDADE_DA_FACE = ESPESSURA_DO_CORACAO / 2;

const COLUNAS_DE_CORACOES = Array.from({ length: 2 * COLUNAS_POR_LADO + 1 }, (_, indiceDaColuna) => {
  const coluna = indiceDaColuna - COLUNAS_POR_LADO;
  const x = coluna * ESPACO_ENTRE_COLUNAS;
  const defasagemDaColuna = coluna % 2 === 0 ? 0 : PASSO_VERTICAL / 2;
  return {
    x,
    atrasoDaOnda: (PONTO_DE_PARTIDA_DA_ONDA - x) / VELOCIDADE_DA_ONDA,
    alturasDosCoracoes: Array.from(
      { length: 2 * LINHAS_POR_LADO + 2 },
      (_, indiceDaLinha) => (indiceDaLinha - LINHAS_POR_LADO) * PASSO_VERTICAL + defasagemDaColuna,
    ),
  };
});

// Coração simétrico girado de φ é igual ao girado de φ − π: reduzir a (−90°, 90°] mantém a face branca
// sempre por cima e a ordem das fatias fixa.
function reduzirGiroAoLadoDaFace(giro: number) {
  return giro - Math.PI * Math.round(giro / Math.PI);
}

function calcularTransformacaoDaFatia(xDaColuna: number, profundidade: number, giro: number) {
  const deslocamentoHorizontal = profundidade * Math.sin(giro);
  const quedaDaFatia = (PROFUNDIDADE_DA_FACE - profundidade) * QUEDA_DA_FATIA_POR_PROFUNDIDADE;
  return `translate(${xDaColuna + deslocamentoHorizontal} ${quedaDaFatia}) scale(${Math.cos(giro)} 1) translate(${-xDaColuna} 0)`;
}

type CamadasDaColuna = {
  sombra: SVGGElement | null;
  fatias: Array<SVGGElement | null>;
  face: SVGGElement | null;
};

export function CampoDeCoracoes() {
  const gradeQueSobe = useRef<SVGGElement>(null);
  const camadasDasColunas = useRef<CamadasDaColuna[]>(
    COLUNAS_DE_CORACOES.map(() => ({ sombra: null, fatias: [], face: null })),
  );
  const idDaFace = useId();
  const idDaLateral = useId();
  const idDaSombra = useId();
  const idDoDegradeDaFace = useId();

  const grupoDaCena = useAnimacaoDaCena("campo", (segundos) => {
    const fracaoDaSubida = (segundos % PERIODO_DA_SUBIDA_EM_SEGUNDOS) / PERIODO_DA_SUBIDA_EM_SEGUNDOS;
    gradeQueSobe.current?.setAttribute("transform", `translate(0 ${-fracaoDaSubida * PASSO_VERTICAL})`);

    camadasDasColunas.current.forEach(({ sombra, fatias, face }, indiceDaColuna) => {
      const { x, atrasoDaOnda } = COLUNAS_DE_CORACOES[indiceDaColuna];
      const avancoDaOnda = calcularGiroNaPassagemDaOnda(
        segundos,
        atrasoDaOnda,
        PERIODO_DA_ONDA_EM_SEGUNDOS,
        DURACAO_DA_INCLINACAO_EM_SEGUNDOS,
      );
      // O avanço vai de 0 a π com início e fim suaves; o seno dele inclina e devolve a coluna.
      const giro = reduzirGiroAoLadoDaFace(GIRO_DE_REPOUSO + INCLINACAO_MAXIMA * Math.sin(avancoDaOnda));
      const colunaEstaGirando = avancoDaOnda !== 0;

      sombra?.setAttribute(
        "transform",
        `translate(${DESLOCAMENTO_DA_SOMBRA.x} ${DESLOCAMENTO_DA_SOMBRA.y}) ${calcularTransformacaoDaFatia(x, 0, giro)}`,
      );
      fatias.forEach((fatia, indiceDaFatia) => {
        // Parada, só a traseira importa: as fatias do meio ficariam escondidas atrás da face.
        const fatiaAparece = colunaEstaGirando || indiceDaFatia === 0;
        fatia?.setAttribute("display", fatiaAparece ? "inline" : "none");
        if (fatiaAparece) fatia?.setAttribute("transform", calcularTransformacaoDaFatia(x, PROFUNDIDADES_DAS_FATIAS[indiceDaFatia], giro));
      });
      face?.setAttribute("transform", calcularTransformacaoDaFatia(x, PROFUNDIDADE_DA_FACE, giro));
    });
  });

  return (
    <g ref={grupoDaCena} data-cena="campo">
      <defs>
        <linearGradient id={idDoDegradeDaFace} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffbfe" />
          <stop offset="1" stopColor="#fbeaf3" />
        </linearGradient>
        {/* Sombra no chão, jogada para a esquerda pela luz que vem da direita. */}
        <path id={idDaSombra} d={CAMINHO_DO_CORACAO} transform={`scale(${ESTREITAMENTO_DO_CORACAO} 1)`} className="fill-[#e9989c]" />
        {/* Parede lateral: a espessura do coração, rosada pela luz rebatida do chão. */}
        <path id={idDaLateral} d={CAMINHO_DO_CORACAO} transform={`scale(${ESTREITAMENTO_DO_CORACAO} 1)`} className="fill-[#f8c4cc]" />
        <path id={idDaFace} d={CAMINHO_DO_CORACAO} transform={`scale(${ESTREITAMENTO_DO_CORACAO} 1)`} fill={`url(#${idDoDegradeDaFace})`} />
      </defs>
      <rect x={-5000} y={-5000} width={10000} height={10000} className="fill-[#ffb2b5]" />
      <g ref={gradeQueSobe}>
        {COLUNAS_DE_CORACOES.map(({ x, alturasDosCoracoes }, indiceDaColuna) => {
          const desenharColuna = (idDoDesenho: string) =>
            alturasDosCoracoes.map((y) => <use key={y} href={`#${idDoDesenho}`} x={x} y={y} />);
          return (
            <g key={x}>
              <g ref={(sombra) => { camadasDasColunas.current[indiceDaColuna].sombra = sombra; }}>{desenharColuna(idDaSombra)}</g>
              {PROFUNDIDADES_DAS_FATIAS.map((profundidade, indiceDaFatia) => (
                <g key={profundidade} ref={(fatia) => { camadasDasColunas.current[indiceDaColuna].fatias[indiceDaFatia] = fatia; }}>
                  {desenharColuna(idDaLateral)}
                </g>
              ))}
              <g ref={(face) => { camadasDasColunas.current[indiceDaColuna].face = face; }}>{desenharColuna(idDaFace)}</g>
            </g>
          );
        })}
      </g>
    </g>
  );
}
