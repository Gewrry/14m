import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Props {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export default function FloatingParticles({
  count = 30,
  colors = ["rgba(248,200,216,0.3)", "rgba(212,165,116,0.25)", "rgba(232,213,245,0.2)", "rgba(255,248,240,0.15)"],
  minSize = 2,
  maxSize = 6,
  className = "",
}: Props) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (maxSize - minSize) + minSize,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 5,
      xDrift: (Math.random() - 0.5) * 60,
      yDrift: -(Math.random() * 80 + 40),
    }));
  }, [count, colors, minSize, maxSize]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          animate={{
            y: [0, p.yDrift, 0],
            x: [0, p.xDrift, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
