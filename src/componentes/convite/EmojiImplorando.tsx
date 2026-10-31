import { useId } from "react";
import { RostoDoEmoji } from "./RostoDoEmoji";

type PropriedadesDoEmoji = { className?: string };

// Desenho próprio do emoji implorando (olhos marejados olhando para cima e mãos juntas), em SVG para
// ficar nítido em qualquer tamanho e não depender de imagem de banco de imagens.
export function EmojiImplorando({ className }: PropriedadesDoEmoji) {
  const idDoDegradeDasMaos = useId();

  return (
    <svg viewBox="0 0 200 200" aria-hidden data-emoji="implorando" className={className}>
      <defs>
        <linearGradient id={idDoDegradeDasMaos} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe066" />
          <stop offset="1" stopColor="#f7b32b" />
        </linearGradient>
      </defs>

      <RostoDoEmoji />

      {/* Sobrancelhas preocupadas: sobem em direção ao centro do rosto. */}
      <path d="M40 58 Q58 46 78 46" className="fill-none stroke-[#8a5a00]" strokeWidth="5" strokeLinecap="round" />
      <path d="M160 58 Q142 46 122 46" className="fill-none stroke-[#8a5a00]" strokeWidth="5" strokeLinecap="round" />

      {[66, 134].map((centroDoOlho) => (
        <g key={centroDoOlho}>
          <ellipse cx={centroDoOlho} cy="88" rx="23" ry="27" className="fill-white stroke-[#8a5a00]" strokeWidth="2.5" />
          <circle cx={centroDoOlho} cy="80" r="18" className="fill-[#3d6fb6]" />
          <circle cx={centroDoOlho} cy="79" r="11" className="fill-[#1b2a4a]" />
          <circle cx={centroDoOlho - 6} cy="72" r="6.5" className="fill-white" />
          <circle cx={centroDoOlho + 6} cy="86" r="3" className="fill-white" />
          {/* Lágrima segurada na borda de baixo do olho. */}
          <path
            d={`M${centroDoOlho - 18} 104 Q${centroDoOlho} 114 ${centroDoOlho + 18} 104`}
            className="fill-none stroke-[#8fd3ff]"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      ))}

      <path d="M89 130 Q100 123 111 130" className="fill-none stroke-[#8a5a00]" strokeWidth="4" strokeLinecap="round" />

      {/* Mãos juntas no queixo, abaixo da boca, como quem pede por favor. */}
      <g transform="translate(100 200) scale(0.82) translate(-100 -196)">
        <path
          d="M100 196 C80 196 76 180 78 164 C80 150 86 142 92 140 C96 139 100 142 100 148 C100 142 104 139 108 140 C114 142 120 150 122 164 C124 180 120 196 100 196 Z"
          fill={`url(#${idDoDegradeDasMaos})`}
          className="stroke-[#e59a12]"
          strokeWidth="3"
        />
        <path d="M100 150 L100 192" className="stroke-[#e59a12]" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M84 168 Q90 166 94 170 M106 170 Q110 166 116 168" className="fill-none stroke-[#e59a12]" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
