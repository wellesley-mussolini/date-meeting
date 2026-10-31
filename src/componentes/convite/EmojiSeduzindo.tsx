import { useId } from "react";
import { RostoDoEmoji } from "./RostoDoEmoji";

type PropriedadesDoEmoji = { className?: string };

// Sorrisão: o contorno vai do canto esquerdo pelo lábio de baixo e volta pelo de cima.
const CONTORNO_DA_BOCA = "M40 106 Q100 186 162 102 Q100 132 40 106 Z";
// Arcada de cima, entre o lábio de cima e a linha onde os dentes se encontram.
const DENTES_DE_CIMA = "M40 106 Q100 132 162 102 L160 110 Q100 150 42 112 Z";
const POSICOES_DOS_DENTES = [62, 80, 100, 120, 140];

// Desenho próprio do emoji seduzindo (sobrancelha erguida, olhar caído e rosa mordida), em SVG.
// O caule passa por trás dos dentes de cima e por cima dos de baixo: é o que faz parecer mordido.
// O viewBox avança para a esquerda do rosto para caber a flor.
export function EmojiSeduzindo({ className }: PropriedadesDoEmoji) {
  const idDoRecorteDaBoca = useId();

  return (
    <svg viewBox="-64 0 264 200" aria-hidden data-emoji="seduzindo" className={className}>
      <defs>
        <clipPath id={idDoRecorteDaBoca}>
          <path d={CONTORNO_DA_BOCA} />
        </clipPath>
      </defs>

      <RostoDoEmoji />

      {/* Uma sobrancelha erguida e a outra baixa: o olhar de quem está aprontando. */}
      <path d="M40 50 Q58 28 84 40" className="fill-none stroke-[#8a5a00]" strokeWidth="5" strokeLinecap="round" />
      <path d="M118 50 Q140 44 162 54" className="fill-none stroke-[#8a5a00]" strokeWidth="5" strokeLinecap="round" />

      {[66, 134].map((centroDoOlho) => (
        <g key={centroDoOlho}>
          <ellipse cx={centroDoOlho} cy="80" rx="20" ry="13" className="fill-white stroke-[#8a5a00]" strokeWidth="2.5" />
          <circle cx={centroDoOlho + 5} cy="84" r="8" className="fill-[#3d6fb6]" />
          <circle cx={centroDoOlho + 5} cy="84" r="4" className="fill-[#1b2a4a]" />
          {/* Pálpebra caída cobrindo a metade de cima do olho. */}
          <path
            d={`M${centroDoOlho - 21} 80 Q${centroDoOlho} 62 ${centroDoOlho + 21} 80 Z`}
            className="fill-[#ffd23f] stroke-[#8a5a00]"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {/* Arcada de baixo. */}
      <path d={CONTORNO_DA_BOCA} className="fill-white" />
      <g clipPath={`url(#${idDoRecorteDaBoca})`} className="stroke-[#cfcfcf]" strokeWidth="2">
        {POSICOES_DOS_DENTES.map((posicaoDoDente) => (
          <path key={posicaoDoDente} d={`M${posicaoDoDente} 120 L${posicaoDoDente} 180`} />
        ))}
      </g>

      {/* Caule e folha da rosa, mordidos entre as arcadas. */}
      <path d="M-14 118 L188 126" className="fill-none stroke-[#2e7d32]" strokeWidth="7" strokeLinecap="round" />
      <path d="M2 120 Q10 140 30 140 Q26 122 2 120 Z" className="fill-[#43a047] stroke-[#2e7d32]" strokeWidth="2" />

      {/* Arcada de cima por cima do caule. */}
      <g clipPath={`url(#${idDoRecorteDaBoca})`}>
        <path d={DENTES_DE_CIMA} className="fill-white stroke-[#cfcfcf]" strokeWidth="2" />
        {POSICOES_DOS_DENTES.map((posicaoDoDente) => (
          <path key={posicaoDoDente} d={`M${posicaoDoDente} 100 L${posicaoDoDente} 130`} className="stroke-[#cfcfcf]" strokeWidth="2" />
        ))}
      </g>
      <path d={CONTORNO_DA_BOCA} className="fill-none stroke-[#8a5a00]" strokeWidth="3" strokeLinejoin="round" />

      {/* Flor: corpo maciço de pétalas com a borda de cima recortada, espirais das pétalas por cima
          e sépalas verdes prendendo a flor ao caule. */}
      <g transform="translate(-16 116) scale(1.35) translate(16 -116)">
        <path d="M-16 128 L-2 138 L-8 124 Z M-16 128 L-30 138 L-24 124 Z" className="fill-[#43a047] stroke-[#2e7d32]" strokeWidth="1.5" />
        {[-30, -16, -2].map((centroDaPetalaDeCima) => (
          <circle key={centroDaPetalaDeCima} cx={centroDaPetalaDeCima} cy="100" r="11" className="fill-[#c62828] stroke-[#8e0f1c]" strokeWidth="2" />
        ))}
        <path
          d="M-40 104 C-44 124 -32 134 -16 134 C0 134 12 124 8 104 C2 110 -6 112 -16 112 C-26 112 -34 110 -40 104 Z"
          className="fill-[#e53935] stroke-[#8e0f1c]"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <g className="fill-none stroke-[#8e0f1c]" strokeWidth="2" strokeLinecap="round">
          <path d="M-32 116 Q-16 108 0 116" />
          <path d="M-26 124 Q-16 118 -6 124" />
          <path d="M-22 100 Q-16 92 -10 100 Q-16 106 -22 100" />
        </g>
        <ellipse cx="-30" cy="118" rx="3" ry="6" className="fill-white opacity-35" />
      </g>
    </svg>
  );
}
