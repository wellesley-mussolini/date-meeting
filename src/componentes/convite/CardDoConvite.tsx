"use client";

import { useRef, useState } from "react";
import { AvisoTemCerteza, TAMANHO_DO_AVISO } from "./AvisoTemCerteza";
import { EmojiImplorando } from "./EmojiImplorando";
import { EmojiPinguim } from "./EmojiPinguim";
import { EmojiSeduzindo } from "./EmojiSeduzindo";
import { ESTILO_DO_BOTAO_PRINCIPAL, ESTILO_DO_TITULO } from "./estilosDoConvite";
import { EtapaDaEscolhaDaData } from "./EtapaDaEscolhaDaData";
import { EtapaDaEscolhaDoPrograma } from "./EtapaDaEscolhaDoPrograma";
import { EtapaDoResumo } from "./EtapaDoResumo";
import { sortearPosicaoForaDoCard, type Posicao } from "./posicaoDoAviso";
import { PROGRAMAS_DO_DATE } from "./programasDoDate";

type EtapaDoConvite = "pergunta" | "disseSim" | "escolhaDaData" | "escolhaDoPrograma" | "resumo";

// Posição do emoji que fica em cima do card, menor no celular para tudo caber na tela.
const ESTILO_DO_EMOJI_EM_CIMA = "absolute top-0 left-1/2 z-10 h-32 -translate-x-1/2 drop-shadow-xl sm:h-40";

export function CardDoConvite() {
  // Mede o card junto com o emoji que fica em cima dele, para o aviso não tampar nenhum dos dois.
  const cardComEmoji = useRef<HTMLDivElement>(null);
  const [etapaDoConvite, definirEtapaDoConvite] = useState<EtapaDoConvite>("pergunta");
  const [posicaoDoAviso, definirPosicaoDoAviso] = useState<Posicao | null>(null);
  const [dataDoDate, definirDataDoDate] = useState("");
  const [horarioDoDate, definirHorarioDoDate] = useState("");
  const [nomesDosProgramasEscolhidos, definirNomesDosProgramasEscolhidos] = useState<string[]>([]);

  const mostrarAvisoEmLugarAleatorio = () => {
    if (!cardComEmoji.current) return;
    const contornoDoCard = cardComEmoji.current.getBoundingClientRect();
    definirPosicaoDoAviso(
      sortearPosicaoForaDoCard(
        { largura: window.innerWidth, altura: window.innerHeight },
        { x: contornoDoCard.left, y: contornoDoCard.top, largura: contornoDoCard.width, altura: contornoDoCard.height },
        TAMANHO_DO_AVISO,
      ),
    );
  };

  // Quem disse sim não precisa mais ver o Tem certeza? pela tela.
  const aceitarConvite = () => {
    definirPosicaoDoAviso(null);
    definirEtapaDoConvite("disseSim");
  };

  const alternarPrograma = (nomeDoPrograma: string) =>
    definirNomesDosProgramasEscolhidos((nomesEscolhidos) =>
      nomesEscolhidos.includes(nomeDoPrograma)
        ? nomesEscolhidos.filter((nomeEscolhido) => nomeEscolhido !== nomeDoPrograma)
        : [...nomesEscolhidos, nomeDoPrograma],
    );

  const temEmojiEmCima = ["pergunta", "disseSim", "resumo"].includes(etapaDoConvite);
  // A escolha do programa tem a grade de opções: no monitor o card alarga para caber quatro por linha.
  const larguraDoCard = etapaDoConvite === "escolhaDoPrograma" ? "max-w-sm sm:max-w-xl" : "max-w-sm";

  return (
    <>
      <div ref={cardComEmoji} className={`relative w-full ${larguraDoCard} ${temEmojiEmCima ? "pt-16 sm:pt-20" : ""}`}>
        {etapaDoConvite === "pergunta" && <EmojiImplorando className={`${ESTILO_DO_EMOJI_EM_CIMA} w-32 sm:w-40`} />}
        {etapaDoConvite === "disseSim" && <EmojiSeduzindo className={`${ESTILO_DO_EMOJI_EM_CIMA} w-44 sm:w-52`} />}
        {etapaDoConvite === "resumo" && <EmojiPinguim className={`${ESTILO_DO_EMOJI_EM_CIMA} w-32 sm:w-40`} />}
        <section
          className={`rounded-3xl bg-white/85 px-5 pb-6 text-center shadow-2xl ring-1 ring-white/60 backdrop-blur-md sm:px-6 sm:pb-8 ${
            temEmojiEmCima ? "pt-20 sm:pt-24" : "pt-6 sm:pt-8"
          }`}
        >
          {etapaDoConvite === "pergunta" && (
            <>
              <h1 className={ESTILO_DO_TITULO}>Você aceitaria ir a um date comigo?</h1>
              <div className="mt-6 flex justify-center gap-4 sm:mt-8">
                <button type="button" onClick={aceitarConvite} className={ESTILO_DO_BOTAO_PRINCIPAL}>
                  SIM
                </button>
                {/* O NÃO só pode ser dito uma vez: depois dele resta o Tem certeza? pela tela. */}
                {!posicaoDoAviso && (
                  <button
                    type="button"
                    onClick={mostrarAvisoEmLugarAleatorio}
                    className="rounded-full border-2 border-rose-300 bg-white px-8 py-3 text-lg font-bold text-rose-500 shadow transition hover:bg-rose-50 active:scale-95"
                  >
                    NÃO
                  </button>
                )}
              </div>
            </>
          )}

          {etapaDoConvite === "disseSim" && (
            <>
              <h1 className={ESTILO_DO_TITULO}>VOCÊ DISSE SIM? 😳</h1>
              <p className="mt-3 text-base text-rose-500 sm:text-lg">Eu estava esperando você dizer não kkkk</p>
              <button
                type="button"
                onClick={() => definirEtapaDoConvite("escolhaDaData")}
                className={`mt-6 sm:mt-8 ${ESTILO_DO_BOTAO_PRINCIPAL}`}
              >
                PRÓXIMO 🖤
              </button>
            </>
          )}

          {etapaDoConvite === "escolhaDaData" && (
            <EtapaDaEscolhaDaData
              data={dataDoDate}
              horario={horarioDoDate}
              aoMudarData={definirDataDoDate}
              aoMudarHorario={definirHorarioDoDate}
              aoConfirmarData={() => definirEtapaDoConvite("escolhaDoPrograma")}
            />
          )}

          {etapaDoConvite === "escolhaDoPrograma" && (
            <EtapaDaEscolhaDoPrograma
              nomesDosProgramasEscolhidos={nomesDosProgramasEscolhidos}
              aoAlternarPrograma={alternarPrograma}
              aoConfirmarProgramas={() => definirEtapaDoConvite("resumo")}
            />
          )}

          {etapaDoConvite === "resumo" && (
            <EtapaDoResumo
              data={dataDoDate}
              horario={horarioDoDate}
              programasEscolhidos={PROGRAMAS_DO_DATE.filter(({ nome }) => nomesDosProgramasEscolhidos.includes(nome))}
            />
          )}
        </section>
      </div>
      {posicaoDoAviso && <AvisoTemCerteza posicao={posicaoDoAviso} aoArrastar={definirPosicaoDoAviso} />}
    </>
  );
}
