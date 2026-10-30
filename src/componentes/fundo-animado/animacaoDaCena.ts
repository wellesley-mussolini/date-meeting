"use client";

import { createContext, useContext, useEffectEvent, useLayoutEffect, useRef } from "react";
import { buscarCenaNoInstante, type Cena } from "./linhaDoTempo";

export type RelogioDaAnimacao = {
  segundoInicial: number;
  // Congelado mantém o fundo parado no segundoInicial, para comparar quadro a quadro com o vídeo.
  congelado: boolean;
};

export const ContextoDoRelogioDaAnimacao = createContext<RelogioDaAnimacao>({
  segundoInicial: 0,
  congelado: false,
});

// Liga a cena só enquanto a linha do tempo a mantém no ar; fora dela o grupo fica oculto e não anima.
// O primeiro quadro é desenhado na montagem, antes da pintura, para a cena já abrir no estado certo.
export function useAnimacaoDaCena(cena: Cena, animarQuadro: (segundos: number) => void) {
  const grupoDaCena = useRef<SVGGElement>(null);
  const { segundoInicial, congelado } = useContext(ContextoDoRelogioDaAnimacao);
  const animarQuadroAtual = useEffectEvent(animarQuadro);

  useLayoutEffect(() => {
    const instanteDaMontagem = performance.now();
    let pedidoDoProximoQuadro = 0;

    const desenharQuadro = () => {
      const segundosDesdeAMontagem = congelado ? 0 : (performance.now() - instanteDaMontagem) / 1000;
      const segundos = segundoInicial + segundosDesdeAMontagem;
      const cenaEstaNoAr = buscarCenaNoInstante(segundos) === cena;
      grupoDaCena.current?.setAttribute("display", cenaEstaNoAr ? "inline" : "none");
      if (cenaEstaNoAr) animarQuadroAtual(segundos);
      if (!congelado) pedidoDoProximoQuadro = requestAnimationFrame(desenharQuadro);
    };

    desenharQuadro();
    return () => cancelAnimationFrame(pedidoDoProximoQuadro);
  }, [cena, segundoInicial, congelado]);

  return grupoDaCena;
}
