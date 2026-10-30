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

function traduzirVisibilidade(cenaEstaNoAr: boolean) {
  return cenaEstaNoAr ? "inline" : "none";
}

// Liga a cena só enquanto a linha do tempo a mantém no ar; fora dela o grupo fica oculto e não anima.
// Devolve as props do <g> da cena: o display já vem certo no HTML do servidor, para não piscar a cena
// errada antes da hidratação, e o primeiro quadro é desenhado antes da pintura.
export function useAnimacaoDaCena(cena: Cena, animarQuadro: (segundos: number) => void) {
  const grupoDaCena = useRef<SVGGElement>(null);
  const { segundoInicial, congelado } = useContext(ContextoDoRelogioDaAnimacao);
  const animarQuadroAtual = useEffectEvent(animarQuadro);
  const visibilidadeInicial = traduzirVisibilidade(buscarCenaNoInstante(segundoInicial) === cena);

  useLayoutEffect(() => {
    const instanteDaMontagem = performance.now();
    let pedidoDoProximoQuadro = 0;
    let visibilidadeAplicada = visibilidadeInicial;

    const desenharQuadro = () => {
      const segundosDesdeAMontagem = congelado ? 0 : (performance.now() - instanteDaMontagem) / 1000;
      const segundos = segundoInicial + segundosDesdeAMontagem;
      const cenaEstaNoAr = buscarCenaNoInstante(segundos) === cena;
      const visibilidade = traduzirVisibilidade(cenaEstaNoAr);
      if (visibilidade !== visibilidadeAplicada) {
        grupoDaCena.current?.setAttribute("display", visibilidade);
        visibilidadeAplicada = visibilidade;
      }
      if (cenaEstaNoAr) animarQuadroAtual(segundos);
      if (!congelado) pedidoDoProximoQuadro = requestAnimationFrame(desenharQuadro);
    };

    desenharQuadro();
    return () => cancelAnimationFrame(pedidoDoProximoQuadro);
  }, [cena, segundoInicial, congelado, visibilidadeInicial]);

  return { ref: grupoDaCena, "data-cena": cena, display: visibilidadeInicial };
}
