import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Props {
  count?: number;
  className?: string;
}

const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

export default function HeartParticles({ count = 12, className = "" }: Props) {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 16 + 8,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.3 + 0.1,
      rotation: Math.random() * 40 - 20,
      swayAmount: Math.random() * 40 + 10,
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {hearts.map((h) => (
        <motion.svg
          key={h.id}
          viewBox="0 0 24 24"
          className="absolute"
          style={{
            left: `${h.x}%`,
            bottom: "-5%",
            width: h.size,
            height: h.size,
          }}
          initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: [0, -window.innerHeight * 1.2],
            x: [0, h.swayAmount, -h.swayAmount, 0],
            opacity: [0, h.opacity, h.opacity, 0],
            rotate: [0, h.rotation, -h.rotation, 0],
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: "easeOut",
          }}
        >
          <path d={heartPath} fill="rgba(248,200,216,0.6)" />
        </motion.svg>
      ))}
    </div>
  );
}
