"use client";

import { Canvas } from "@react-three/fiber";
import { RelogioDaAnimacaoContext, type RelogioDaAnimacao } from "./animacaoDaCena";
import { CampoDeCoracoes } from "./cenas/CampoDeCoracoes";
import { EspiralDeCoracoes } from "./cenas/EspiralDeCoracoes";
import { TunelDeCoracoes } from "./cenas/TunelDeCoracoes";

export function FundoAnimado({ segundoInicial = 0, congelado = false }: Partial<RelogioDaAnimacao>) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      {/* flat desliga o tone mapping para as cores saírem iguais às medidas no vídeo. */}
      <Canvas flat shadows="percentage" camera={{ fov: 50 }} dpr={[1, 2]}>
        <RelogioDaAnimacaoContext value={{ segundoInicial, congelado }}>
          <CampoDeCoracoes />
          <TunelDeCoracoes />
          <EspiralDeCoracoes />
        </RelogioDaAnimacaoContext>
      </Canvas>
    </div>
  );
}
