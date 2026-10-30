"use client";

import { useMemo, useRef } from "react";
import { Color, DoubleSide, ShapeGeometry, type Mesh } from "three";
import { useAnimacaoDaCena } from "../animacaoDaCena";
import { criarFormaDoCoracao } from "../formaDoCoracao";

const COR_DO_FUNDO = new Color("#ffbafc");

// No vídeo cada anel tem 0,72 do tamanho do anel de fora e um novo nasce no centro a cada 0,152 s.
const RAZAO_ENTRE_ANEIS = 0.72;
const INTERVALO_ENTRE_ANEIS_EM_SEGUNDOS = 0.152;
// O anel de fora passa da tela até no celular em pé; os de dentro somem no ponto de fuga.
const QUANTIDADE_DE_ANEIS = 28;
const ALTURA_DO_ANEL_MAIS_EXTERNO = 40;
const ESPESSURA_DO_ANEL = 0.045;

export function TunelDeCoracoes() {
  const aneisDoTunel = useRef<Array<Mesh | null>>([]);

  const geometriaDoAnel = useMemo(() => {
    const contornoExterno = criarFormaDoCoracao(26);
    contornoExterno.holes.push(criarFormaDoCoracao(26, 1 - 2 * ESPESSURA_DO_ANEL));
    return new ShapeGeometry(contornoExterno);
  }, []);

  const grupoDaCena = useAnimacaoDaCena("tunel", (segundos, { scene }) => {
    scene.background = COR_DO_FUNDO;
    const avancoDoZoom = (segundos % INTERVALO_ENTRE_ANEIS_EM_SEGUNDOS) / INTERVALO_ENTRE_ANEIS_EM_SEGUNDOS;
    aneisDoTunel.current.forEach((anel, posicaoNoTunel) => {
      const alturaDoAnel = ALTURA_DO_ANEL_MAIS_EXTERNO * RAZAO_ENTRE_ANEIS ** (posicaoNoTunel - avancoDoZoom);
      anel?.scale.setScalar(alturaDoAnel);
    });
  });

  return (
    <group ref={grupoDaCena}>
      {Array.from({ length: QUANTIDADE_DE_ANEIS }, (_, posicaoNoTunel) => (
        <mesh
          key={posicaoNoTunel}
          ref={(anel) => {
            aneisDoTunel.current[posicaoNoTunel] = anel;
          }}
          geometry={geometriaDoAnel}
        >
          <meshBasicMaterial color="white" side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
