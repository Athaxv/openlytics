"use client";

import { DIGIT_HEIGHT, DIGIT_WIDTH, ScrollingDigit } from "@/components/sessions/scrolling-digit";

type DigitalTimerProps = {
  elapsedSeconds: number;
};

type TimeParts = {
  hourTens: number;
  hourOnes: number;
  minTens: number;
  minOnes: number;
  secTens: number;
  secOnes: number;
};

function getTimeParts(totalSeconds: number): TimeParts {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hourTens: Math.floor(hours / 10),
    hourOnes: hours % 10,
    minTens: Math.floor(minutes / 10),
    minOnes: minutes % 10,
    secTens: Math.floor(seconds / 10),
    secOnes: seconds % 10,
  };
}

function formatAriaLabel(time: TimeParts): string {
  return `${time.hourTens}${time.hourOnes}:${time.minTens}${time.minOnes}:${time.secTens}${time.secOnes}`;
}

function Colon() {
  return (
    <span
      className="inline-flex items-center justify-center text-muted-foreground"
      style={{
        width: DIGIT_WIDTH * 0.45,
        height: DIGIT_HEIGHT,
        fontSize: DIGIT_HEIGHT * 0.72,
        lineHeight: 1,
        fontFamily: "var(--font-digital)",
      }}
      aria-hidden
    >
      :
    </span>
  );
}

function DigitPair({ tens, ones }: { tens: number; ones: number }) {
  return (
    <span className="inline-flex items-center">
      <ScrollingDigit value={tens} />
      <ScrollingDigit value={ones} />
    </span>
  );
}

export function DigitalTimer({ elapsedSeconds }: DigitalTimerProps) {
  const time = getTimeParts(elapsedSeconds);

  return (
    <div
      className="flex w-full max-w-[1200px] items-center justify-center"
      style={{ fontFamily: "var(--font-digital)" }}
      aria-live="polite"
      aria-label={`Timer ${formatAriaLabel(time)}`}
    >
      <DigitPair tens={time.hourTens} ones={time.hourOnes} />
      <Colon />
      <DigitPair tens={time.minTens} ones={time.minOnes} />
      <Colon />
      <DigitPair tens={time.secTens} ones={time.secOnes} />
    </div>
  );
}
