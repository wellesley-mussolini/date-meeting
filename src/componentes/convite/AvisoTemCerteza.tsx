"use client";

import type { PointerEvent as EventoDoPonteiroDoReact } from "react";
import type { Posicao } from "./posicaoDoAviso";

// Igual às classes w-44 h-14 do aviso: o sorteio da posição precisa saber o tamanho antes de desenhar.
export const TAMANHO_DO_AVISO = { largura: 176, altura: 56 };

type PropriedadesDoAviso = {
  posicao: Posicao;
  aoArrastar: (novaPosicao: Posicao) => void;
};

// Não é botão de propósito: não dá para clicar, só arrastar pela tela (mouse, dedo ou caneta).
export function AvisoTemCerteza({ posicao, aoArrastar }: PropriedadesDoAviso) {
  const iniciarArraste = (toqueInicial: EventoDoPonteiroDoReact<HTMLDivElement>) => {
    toqueInicial.preventDefault();
    const pontoDoToqueInicial = { x: toqueInicial.clientX, y: toqueInicial.clientY };
    const posicaoNoInicioDoArraste = posicao;

    // O movimento é ouvido na janela inteira: arrastando rápido o ponteiro sai de cima do aviso.
    const moverAviso = (movimento: PointerEvent) => {
      const deslocamentoDoDedo = {
        x: movimento.clientX - pontoDoToqueInicial.x,
        y: movimento.clientY - pontoDoToqueInicial.y,
      };
      aoArrastar({
        x: posicaoNoInicioDoArraste.x + deslocamentoDoDedo.x,
        y: posicaoNoInicioDoArraste.y + deslocamentoDoDedo.y,
      });
    };
    const soltarAviso = () => {
      window.removeEventListener("pointermove", moverAviso);
      window.removeEventListener("pointerup", soltarAviso);
      window.removeEventListener("pointercancel", soltarAviso);
    };
    window.addEventListener("pointermove", moverAviso);
    window.addEventListener("pointerup", soltarAviso);
    window.addEventListener("pointercancel", soltarAviso);
  };

  return (
    <div
      data-aviso-tem-certeza
      role="status"
      onPointerDown={iniciarArraste}
      style={{ left: posicao.x, top: posicao.y }}
      className="fixed z-10 flex h-14 w-44 cursor-grab touch-none items-center justify-center rounded-full bg-white/90 text-xl font-extrabold text-rose-600 shadow-xl ring-2 ring-rose-200 select-none active:cursor-grabbing"
    >
      Tem certeza?
    </div>
  );
}
