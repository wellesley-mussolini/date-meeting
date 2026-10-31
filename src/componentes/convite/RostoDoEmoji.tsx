import { useId } from "react";

// Rosto amarelo com degradê, contorno e bochechas, comum aos emojis do convite (viewBox 0 0 200 200).
export function RostoDoEmoji() {
  const idDoDegradeDoRosto = useId();

  return (
    <>
      <defs>
        <radialGradient id={idDoDegradeDoRosto} cx="42%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff176" />
          <stop offset="0.6" stopColor="#ffd23f" />
          <stop offset="1" stopColor="#f5a623" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="96" r="88" fill={`url(#${idDoDegradeDoRosto})`} className="stroke-[#e59a12]" strokeWidth="3" />
      <ellipse cx="46" cy="122" rx="16" ry="9" className="fill-[#ff8a80] opacity-50" />
      <ellipse cx="154" cy="122" rx="16" ry="9" className="fill-[#ff8a80] opacity-50" />
    </>
  );
}
