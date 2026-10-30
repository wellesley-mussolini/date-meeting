"use client";

import { useMemo, useRef } from "react";
import { Color, ExtrudeGeometry, MeshStandardMaterial, type Mesh } from "three";
import { useAnimacaoDaCena } from "../animacaoDaCena";
import { criarFormaDoCoracao } from "../formaDoCoracao";
import { calcularGiroDoCoracao } from "../giroDosCoracoes";

const COR_DO_FUNDO = new Color("#ffe0fe");
const COR_DO_CORACAO = "#ff8f5a";

// Anéis parados como no vídeo: cada um tem quase o dobro do raio do anterior e corações proporcionais.
const CORACOES_POR_ANEL = 12;
const RAIO_DO_ANEL_INTERNO = 0.46;
const CRESCIMENTO_ENTRE_ANEIS = 1.95;
const QUANTIDADE_DE_ANEIS = 6;
const ALTURA_RELATIVA_AO_RAIO = 0.46;
const PROFUNDIDADE_DO_CORACAO = 0.35;

type CoracaoDaEspiral = { x: number; y: number; anguloNoAnel: number; altura: number };

export function EspiralDeCoracoes() {
  const coracoesQueGiram = useRef<Array<Mesh | null>>([]);

  const geometriaDoCoracao = useMemo(() => {
    const geometria = new ExtrudeGeometry(criarFormaDoCoracao(32), {
      depth: PROFUNDIDADE_DO_CORACAO,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.08,
      bevelSegments: 4,
    });
    // Centraliza a espessura para o coração girar em torno do próprio eixo.
    geometria.translate(0, 0, -PROFUNDIDADE_DO_CORACAO / 2);
    return geometria;
  }, []);

  const materialDoCoracao = useMemo(
    () => new MeshStandardMaterial({ color: COR_DO_CORACAO, roughness: 0.45 }),
    [],
  );

  const coracoesDaEspiral = useMemo(() => {
    const coracoes: CoracaoDaEspiral[] = [];
    for (let anel = 0; anel < QUANTIDADE_DE_ANEIS; anel++) {
      const raioDoAnel = RAIO_DO_ANEL_INTERNO * CRESCIMENTO_ENTRE_ANEIS ** anel;
      const defasagemDoAnel = anel % 2 === 0 ? 0 : Math.PI / CORACOES_POR_ANEL;
      for (let posicaoNoAnel = 0; posicaoNoAnel < CORACOES_POR_ANEL; posicaoNoAnel++) {
        const anguloNoAnel = (posicaoNoAnel / CORACOES_POR_ANEL) * 2 * Math.PI + defasagemDoAnel;
        coracoes.push({
          x: raioDoAnel * Math.cos(anguloNoAnel),
          y: raioDoAnel * Math.sin(anguloNoAnel),
          anguloNoAnel,
          altura: raioDoAnel * ALTURA_RELATIVA_AO_RAIO,
        });
      }
    }
    return coracoes;
  }, []);

  const grupoDaCena = useAnimacaoDaCena("espiral", (segundos, { scene }) => {
    scene.background = COR_DO_FUNDO;
    coracoesQueGiram.current.forEach((coracao, indiceDoCoracao) => {
      if (coracao) coracao.rotation.y = calcularGiroDoCoracao(segundos, indiceDoCoracao, coracoesDaEspiral.length);
    });
  });

  return (
    <group ref={grupoDaCena}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[-3, 5, 6]} intensity={2.4} />
      {coracoesDaEspiral.map(({ x, y, anguloNoAnel, altura }, indiceDoCoracao) => (
        // A ponta aponta para o centro: o eixo vertical do coração fica alinhado ao raio.
        <group key={indiceDoCoracao} position={[x, y, 0]} rotation={[0, 0, anguloNoAnel - Math.PI / 2]} scale={altura}>
          <mesh
            ref={(coracao) => {
              coracoesQueGiram.current[indiceDoCoracao] = coracao;
            }}
            geometry={geometriaDoCoracao}
            material={materialDoCoracao}
          />
        </group>
      ))}
    </group>
  );
}
