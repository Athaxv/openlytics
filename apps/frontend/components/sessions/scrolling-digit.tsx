"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const DIGIT_HEIGHT = 128;
export const DIGIT_WIDTH = 80;

const NORMAL_STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const WRAP_STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;

type ScrollingDigitProps = {
  value: number;
};

export function ScrollingDigit({ value }: ScrollingDigitProps) {
  const reducedMotion = useReducedMotion();
  const prevValueRef = useRef(value);
  const [strip, setStrip] = useState<readonly number[]>(NORMAL_STRIP);
  const [offset, setOffset] = useState(value);

  useEffect(() => {
    const prevValue = prevValueRef.current;
    if (prevValue === value) return;

    if (prevValue === 9 && value === 0) {
      setStrip(WRAP_STRIP);
      setOffset(10);
    } else {
      setStrip(NORMAL_STRIP);
      setOffset(value);
    }

    prevValueRef.current = value;
  }, [value]);

  const handleAnimationComplete = () => {
    if (value === 0 && offset === 10) {
      setStrip(NORMAL_STRIP);
      setOffset(0);
    }
  };

  return (
    <span
      className="relative inline-block overflow-hidden align-top"
      style={{ height: DIGIT_HEIGHT, width: DIGIT_WIDTH }}
    >
      <motion.span
        className="absolute left-0 top-0 w-full"
        animate={{ y: -offset * DIGIT_HEIGHT }}
        initial={false}
        onAnimationComplete={handleAnimationComplete}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
        }
      >
        {strip.map((digit, index) => (
          <span
            key={`${digit}-${index}`}
            className="flex items-center justify-center tabular-nums text-foreground"
            style={{
              height: DIGIT_HEIGHT,
              width: DIGIT_WIDTH,
              fontSize: DIGIT_HEIGHT * 0.82,
              lineHeight: 1,
              fontFamily: "var(--font-digital)",
            }}
          >
            {digit}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
