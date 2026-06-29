const BAYER_8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46,
  6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49,
  17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
] as const;

function BayerMaskPattern({ id }: { id: string }) {
  return (
    <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
      {BAYER_8.map((value, index) => {
        const x = index % 8;
        const y = Math.floor(index / 8);
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={1}
            height={1}
            fill="white"
            fillOpacity={(value + 0.5) / 64}
          />
        );
      })}
    </pattern>
  );
}

export function AuthDitherBackground() {
  const patternId = "auth-bayer8";
  const maskId = "auth-bayer-mask";
  const glowId = "auth-emerald-glow";
  const glowSecondaryId = "auth-emerald-glow-secondary";
  const grainId = "auth-grain";

  return (
    <div className="pointer-events-none absolute inset-0 bg-background" aria-hidden>
      <div className="absolute left-0 top-0 h-[min(55vh,22rem)] w-[min(80%,20rem)] -translate-x-1/4 rounded-full bg-primary/20 blur-[90px]" />
      <div className="absolute bottom-0 left-0 h-72 w-72 translate-y-1/4 rounded-full bg-primary/10 blur-[80px]" />

      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <BayerMaskPattern id={patternId} />

          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </mask>

          <radialGradient id={glowId} cx="32%" cy="28%" r="70%" fx="32%" fy="28%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={glowSecondaryId} cx="18%" cy="88%" r="55%" fx="18%" fy="88%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>

          <filter id={grainId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.035 0"
            />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${glowId})`} mask={`url(#${maskId})`} />
        <rect width="100%" height="100%" fill={`url(#${glowSecondaryId})`} mask={`url(#${maskId})`} />
        <rect width="100%" height="100%" filter={`url(#${grainId})`} opacity={0.9} />
      </svg>

      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/70 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background/40 to-transparent" />
    </div>
  );
}
