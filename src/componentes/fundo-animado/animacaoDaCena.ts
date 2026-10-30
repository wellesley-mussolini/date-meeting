"use client";

import { useFrame, type RootState } from "@react-three/fiber";
import { createContext, useContext, useRef } from "react";
import type { Group } from "three";
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
export function useAnimacaoDaCena(
  cena: Cena,
  animarQuadro: (segundos: number, estadoDoCanvas: RootState) => void,
) {
  const grupoDaCena = useRef<Group>(null);
  const { segundoInicial, congelado } = useContext(ContextoDoRelogioDaAnimacao);

  useFrame((estadoDoCanvas) => {
    if (!grupoDaCena.current) return;
    const segundos = segundoInicial + (congelado ? 0 : estadoDoCanvas.clock.elapsedTime);
    const cenaEstaNoAr = buscarCenaNoInstante(segundos) === cena;
    grupoDaCena.current.visible = cenaEstaNoAr;
    if (cenaEstaNoAr) animarQuadro(segundos, estadoDoCanvas);
  });

  return grupoDaCena;
}
