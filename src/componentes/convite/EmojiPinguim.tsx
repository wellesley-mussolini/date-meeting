type PropriedadesDoEmoji = { className?: string };

const POSICOES_DAS_FLORES = [
  { x: 30, y: 52 },
  { x: 48, y: 44 },
  { x: 40, y: 64 },
  { x: 58, y: 60 },
  { x: 24, y: 70 },
];

// Desenho próprio do pinguim de óculos escuros entregando um buquê de flores vermelhas, em SVG.
export function EmojiPinguim({ className }: PropriedadesDoEmoji) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden data-emoji="pinguim" className={className}>
      {/* Pés. */}
      <ellipse cx="88" cy="190" rx="18" ry="7" className="fill-[#f57c00]" />
      <ellipse cx="130" cy="190" rx="18" ry="7" className="fill-[#f57c00]" />

      {/* Corpo preto e barriga branca. */}
      <ellipse cx="110" cy="122" rx="56" ry="70" className="fill-[#1f1f2b]" />
      <ellipse cx="108" cy="134" rx="40" ry="54" className="fill-white" />
      <ellipse cx="96" cy="118" rx="10" ry="22" className="fill-white opacity-60" />

      {/* Asa na cintura. */}
      <path d="M160 100 Q184 124 164 152 Q158 140 156 118 Z" className="fill-[#1f1f2b]" />

      {/* Cabeça. */}
      <circle cx="110" cy="58" r="40" className="fill-[#1f1f2b]" />
      <ellipse cx="102" cy="66" rx="24" ry="20" className="fill-white" />

      {/* Óculos escuros com reflexo. */}
      <path d="M78 50 L146 46" className="stroke-[#0b0b10]" strokeWidth="5" strokeLinecap="round" />
      <rect x="80" y="46" width="28" height="20" rx="7" className="fill-[#0b0b10]" />
      <rect x="114" y="44" width="28" height="20" rx="7" className="fill-[#0b0b10]" />
      <path d="M86 52 L94 50" className="stroke-white opacity-70" strokeWidth="3" strokeLinecap="round" />
      <path d="M120 50 L128 48" className="stroke-white opacity-70" strokeWidth="3" strokeLinecap="round" />

      {/* Bico. */}
      <path d="M92 70 Q100 64 112 70 Q102 84 88 78 Z" className="fill-[#ffa000] stroke-[#e65100]" strokeWidth="2" />

      {/* Asa estendida segurando o buquê. */}
      <path d="M62 112 Q40 104 36 92 Q52 92 70 100 Z" className="fill-[#1f1f2b]" />

      {/* Buquê: caules verdes saindo da asa e flores vermelhas em cima. */}
      <g className="stroke-[#2e7d32]" strokeWidth="3" strokeLinecap="round">
        <path d="M40 96 L30 60" />
        <path d="M42 96 L48 52" />
        <path d="M42 96 L40 70" />
        <path d="M44 96 L58 66" />
        <path d="M38 96 L24 76" />
      </g>
      {POSICOES_DAS_FLORES.map(({ x, y }) => (
        <g key={`${x}:${y}`}>
          <circle cx={x} cy={y} r="11" className="fill-[#e53935] stroke-[#b71c1c]" strokeWidth="2" />
          <circle cx={x} cy={y} r="5" className="fill-[#c62828]" />
        </g>
      ))}
    </svg>
  );
}
