"use client";

import { ContextoDoRelogioDaAnimacao, type RelogioDaAnimacao } from "./animacaoDaCena";
import { CampoDeCoracoes } from "./cenas/CampoDeCoracoes";
import { EspiralDeCoracoes } from "./cenas/EspiralDeCoracoes";
import { TunelDeCoracoes } from "./cenas/TunelDeCoracoes";

// O viewBox é o quadro do vídeo (960 × 720) com a origem no centro. Com "meet" o quadro inteiro cabe em
// qualquer tela, e o que as cenas desenham além dele preenche as sobras: laterais no monitor largo,
// em cima e embaixo no celular em pé.
export function FundoAnimado({ segundoInicial = 0, congelado = false }: Partial<RelogioDaAnimacao>) {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#ffb2b5]">
      <svg
        viewBox="-480 -360 960 720"
        preserveAspectRatio="xMidYMid meet"
        className="size-full overflow-visible"
      >
        <ContextoDoRelogioDaAnimacao value={{ segundoInicial, congelado }}>
          <CampoDeCoracoes />
          <TunelDeCoracoes />
          <EspiralDeCoracoes />
        </ContextoDoRelogioDaAnimacao>
      </svg>
    </div>
  );
}
