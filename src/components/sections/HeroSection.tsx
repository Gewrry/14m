import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StarryBackground from "../effects/StarryBackground";
import HeartParticles from "../effects/HeartParticles";
import FloatingParticles from "../effects/FloatingParticles";

const nameLetters = "Deo & Lovely".split("");
const headlineWords = ["Our", "Love", "Story"];

const spring = { type: "spring" as const, stiffness: 120, damping: 18 };

function DayCounter({ startDate }: { startDate: Date }) {
  const [days, setDays] = useState(0);
  const [months, setMonths] = useState(0);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
      
      let m = (now.getFullYear() - startDate.getFullYear()) * 12;
      m += now.getMonth() - startDate.getMonth();
      if (now.getDate() < startDate.getDate()) m--;
      setMonths(Math.max(0, m));
    };
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <motion.div
      className="flex items-center gap-8 md:gap-12 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 2.2 }}
    >
      <div className="text-center">
        <motion.span
          className="block text-4xl md:text-5xl font-display font-bold text-champagne-400"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...spring, delay: 2.4 }}
        >
          {months}
        </motion.span>
        <span className="text-xs md:text-sm font-sans text-blush-300/60 uppercase tracking-[0.2em] mt-1 block">
          Months
        </span>
      </div>
      <div className="w-px h-10 bg-gradient-to-b from-transparent via-champagne-400/40 to-transparent" />
      <div className="text-center">
        <motion.span
          className="block text-4xl md:text-5xl font-display font-bold text-champagne-400"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...spring, delay: 2.6 }}
        >
          {days}
        </motion.span>
        <span className="text-xs md:text-sm font-sans text-blush-300/60 uppercase tracking-[0.2em] mt-1 block">
          Days Together
        </span>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const startDate = new Date("2025-04-05");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <StarryBackground />
      <HeartParticles count={15} />
      <FloatingParticles
        count={20}
        colors={["rgba(248,200,216,0.15)", "rgba(212,165,116,0.12)", "rgba(232,213,245,0.1)"]}
        minSize={1}
        maxSize={4}
      />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #F8C8D8 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #E8D5F5 0%, transparent 70%)" }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Kicker */}
        <motion.p
          className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-champagne-400/70 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          Celebrating Our Love
        </motion.p>

        {/* Headline words */}
        <motion.h1
          className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } },
          }}
        >
          {headlineWords.map((word, i) => (
            <span key={word} className="inline-block overflow-hidden">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: 80, opacity: 0, filter: "blur(16px)" },
                  show: {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { type: "spring", stiffness: 100, damping: 20 },
                  },
                }}
                style={{
                  color: i === 1 ? "#F8C8D8" : "#FFF8F0",
                  textShadow: i === 1 ? "0 0 40px rgba(248,200,216,0.4)" : "none",
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Names */}
        <motion.div
          className="mt-8 md:mt-10"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.04, delayChildren: 1.2 } },
          }}
        >
          <div className="flex flex-wrap justify-center">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={`${letter}-${i}`}
                className="text-2xl md:text-4xl font-body font-light tracking-widest"
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.5 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 150, damping: 15 },
                  },
                }}
                style={{
                  color: letter === "&" ? "#D4A574" : "#E8D5F5",
                  margin: letter === " " ? "0 0.3em" : letter === "&" ? "0 0.4em" : "0",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Date line */}
        <motion.p
          className="mt-4 text-sm md:text-base font-sans text-ivory-100/50 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.8 }}
        >
          Since April 5, 2025
        </motion.p>

        {/* Day counter */}
        <DayCounter startDate={startDate} />
      </div>

      {/* Scroll invitation */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <span className="text-xs font-sans uppercase tracking-[0.25em] text-champagne-400/50">
          Scroll to begin
        </span>
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-champagne-400/50"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M4 7L10 13L16 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
