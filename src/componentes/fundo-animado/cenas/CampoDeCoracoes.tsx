"use client";

import { useMemo, useRef } from "react";
import { Color, ExtrudeGeometry, MeshStandardMaterial, type Group } from "three";
import { useAnimacaoDaCena } from "../animacaoDaCena";
import { criarFormaDoCoracao } from "../formaDoCoracao";

const COR_DO_CHAO = new Color("#ffb2b5");
const COR_DO_CORACAO = "#fff6fd";
const COR_DA_SOMBRA = "#c46d7a";
// A parede lateral rosada do vídeo é a luz rebatida do chão: o "chão" da luz hemisférica é rosa.
const COR_REBATIDA_DO_CHAO = "#ffc4cc";

// Medidas tiradas do vídeo: a grade sobe 0,222 alturas de tela por segundo e se repete a cada 1,875 s.
const PERIODO_DA_SUBIDA_EM_SEGUNDOS = 1.875;
const ALTURA_DO_CORACAO = 2.2;
const PASSO_VERTICAL = 2.5;
const ESPACO_ENTRE_COLUNAS = 2;
// O coração do campo é mais alto que largo, diferente do contorno do túnel.
const ESTREITAMENTO_DO_CORACAO = 0.82;
const COLUNAS_POR_LADO = 7;
// Linhas sobrando cobrem o celular em pé, onde a câmera recua para caber a largura do vídeo.
const LINHAS_POR_LADO = 7;
const PROFUNDIDADE_DO_CORACAO = 0.45;

export function CampoDeCoracoes() {
  const grupoQueSobe = useRef<Group>(null);

  const geometriaDoCoracao = useMemo(() => {
    const geometria = new ExtrudeGeometry(criarFormaDoCoracao(28, ALTURA_DO_CORACAO), {
      depth: PROFUNDIDADE_DO_CORACAO,
      bevelEnabled: true,
      bevelThickness: 0.18,
      bevelSize: 0.12,
      bevelSegments: 2,
    });
    geometria.scale(ESTREITAMENTO_DO_CORACAO, 1, 1);
    return geometria;
  }, []);

  const materialDoCoracao = useMemo(
    () => new MeshStandardMaterial({ color: COR_DO_CORACAO, roughness: 0.85 }),
    [],
  );

  const posicoesDosCoracoes = useMemo(() => {
    const posicoes: Array<[x: number, y: number]> = [];
    for (let coluna = -COLUNAS_POR_LADO; coluna <= COLUNAS_POR_LADO; coluna++) {
      // Colunas vizinhas ficam defasadas meio passo, como a grade em zigue-zague do vídeo.
      const defasagemDaColuna = coluna % 2 === 0 ? 0 : PASSO_VERTICAL / 2;
      for (let linha = -LINHAS_POR_LADO; linha <= LINHAS_POR_LADO; linha++) {
        posicoes.push([coluna * ESPACO_ENTRE_COLUNAS, linha * PASSO_VERTICAL + defasagemDaColuna]);
      }
    }
    return posicoes;
  }, []);

  const grupoDaCena = useAnimacaoDaCena("campo", (segundos, { scene }) => {
    scene.background = COR_DO_CHAO;
    const fracaoDoPeriodo = (segundos % PERIODO_DA_SUBIDA_EM_SEGUNDOS) / PERIODO_DA_SUBIDA_EM_SEGUNDOS;
    grupoQueSobe.current!.position.y = fracaoDoPeriodo * PASSO_VERTICAL;
  });

  return (
    <group ref={grupoDaCena}>
      <directionalLight
        position={[8, 3, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />
      <hemisphereLight args={["#ffffff", COR_REBATIDA_DO_CHAO, 3]} />
      <group rotation={[0, 0.35, -0.08]}>
        <mesh receiveShadow>
          <planeGeometry args={[60, 60]} />
          <shadowMaterial color={COR_DA_SOMBRA} opacity={0.5} />
        </mesh>
        <group ref={grupoQueSobe}>
          {posicoesDosCoracoes.map(([x, y]) => (
            <mesh
              key={`${x}:${y}`}
              geometry={geometriaDoCoracao}
              material={materialDoCoracao}
              position={[x, y, 0]}
              castShadow
            />
          ))}
        </group>
      </group>
    </group>
  );
}
