"use client";

import { useRef, useState } from "react";
import { AvisoTemCerteza, TAMANHO_DO_AVISO } from "./AvisoTemCerteza";
import { EmojiImplorando } from "./EmojiImplorando";
import { sortearPosicaoForaDoCard, type Posicao } from "./posicaoDoAviso";

export function CardDoConvite() {
  // Mede o card junto com o emoji que fica em cima dele, para o aviso não tampar nenhum dos dois.
  const cardComEmoji = useRef<HTMLDivElement>(null);
  const [posicaoDoAviso, definirPosicaoDoAviso] = useState<Posicao | null>(null);

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

  return (
    <>
      <div ref={cardComEmoji} className="relative w-full max-w-sm pt-20">
        <EmojiImplorando className="absolute top-0 left-1/2 z-10 size-40 -translate-x-1/2 drop-shadow-xl" />
        <section className="rounded-3xl bg-white/85 px-6 pt-24 pb-8 text-center shadow-2xl ring-1 ring-white/60 backdrop-blur-md">
          <h1 className="text-2xl leading-tight font-extrabold text-rose-600 sm:text-3xl">
            Você aceitaria ir a um date comigo?
          </h1>
          <div className="mt-8 flex justify-center gap-4">
            <button
              type="button"
              className="rounded-full bg-rose-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-rose-600 active:scale-95"
            >
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
        </section>
      </div>
      {posicaoDoAviso && <AvisoTemCerteza posicao={posicaoDoAviso} aoArrastar={definirPosicaoDoAviso} />}
    </>
  );
}
