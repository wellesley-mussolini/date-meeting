"use client";

import { Canvas } from "@react-three/fiber";
import { useSyncExternalStore } from "react";
import { ContextoDoRelogioDaAnimacao, type RelogioDaAnimacao } from "./animacaoDaCena";
import { CampoDeCoracoes } from "./cenas/CampoDeCoracoes";
import { EspiralDeCoracoes } from "./cenas/EspiralDeCoracoes";
import { TunelDeCoracoes } from "./cenas/TunelDeCoracoes";
import { CameraEnquadrada } from "./CameraEnquadrada";

let navegadorTemWebGL: boolean | undefined;

// Com a aceleração de hardware desligada o three.js não cria o renderizador e o erro derrubaria o
// layout inteiro. O contexto de teste é liberado na hora porque o navegador limita quantos existem.
function verificarSuporteAoWebGL(): boolean {
  if (navegadorTemWebGL === undefined) {
    const contextoDeTeste = document.createElement("canvas").getContext("webgl2");
    navegadorTemWebGL = contextoDeTeste !== null;
    contextoDeTeste?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return navegadorTemWebGL;
}

const assinarNada = () => () => {};
const servidorNaoRenderizaWebGL = () => false;

export function FundoAnimado({ segundoInicial = 0, congelado = false }: Partial<RelogioDaAnimacao>) {
  const podeRenderizar3D = useSyncExternalStore(assinarNada, verificarSuporteAoWebGL, servidorNaoRenderizaWebGL);

  return (
    // A cor do chão do campo aparece antes do WebGL carregar e fica como fundo quando ele não existe.
    <div aria-hidden className="fixed inset-0 -z-10 bg-[#ffb2b5]">
      {podeRenderizar3D && (
        // flat desliga o tone mapping para as cores saírem iguais às medidas no vídeo.
        <Canvas flat shadows="percentage" camera={{ fov: 50 }} dpr={[1, 2]}>
          <ContextoDoRelogioDaAnimacao value={{ segundoInicial, congelado }}>
            <CameraEnquadrada />
            <CampoDeCoracoes />
            <TunelDeCoracoes />
            <EspiralDeCoracoes />
          </ContextoDoRelogioDaAnimacao>
        </Canvas>
      )}
    </div>
  );
}
