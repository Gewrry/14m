import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SectionTransition from "../effects/SectionTransition";

const letterLines = [
  "My Dearest Lovely,",
  "",
  "If I could bottle up every moment we've shared,",
  "I'd have a collection more precious than any treasure",
  "the world could ever offer.",
  "",
  "You came into my life like a gentle breeze on a summer day —",
  "unexpected, refreshing, and absolutely perfect.",
  "Every day since then has been painted in colors",
  "I never knew existed.",
  "",
  "You are my morning sun and my evening star.",
  "You are the reason my heart beats with purpose,",
  "and the reason every tomorrow feels like a gift.",
  "",
  "Thank you for choosing me, for loving me,",
  "for being the most beautiful part of my story.",
  "I promise to spend every day making you feel",
  "as special as you've made me feel.",
  "",
  "Forever yours,",
  "Deo 💕",
];

function TypewriterLine({ text, delay, isVisible }: { text: string; delay: number; isVisible: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [isVisible, delay]);

  useEffect(() => {
    if (!started || !text) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [started, text]);

  if (!text) return <div className="h-4" />;

  return (
    <span className="block min-h-[1.8em]">
      {displayed}
      {started && displayed.length < text.length && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-champagne-400">|</motion.span>
      )}
    </span>
  );
}

export default function LoveLetterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section id="letter" ref={sectionRef} className="relative py-24 md:py-36 overflow-hidden">
      {/* Warm ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-[150px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #D4A574 0%, transparent 70%)" }} />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionTransition className="text-center mb-16">
          <p className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-champagne-400/70 mb-4">Chapter Four</p>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-ivory-100">A Letter For You</h2>
        </SectionTransition>

        {/* Letter card */}
        <motion.div
          className="relative max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: "spring", stiffness: 60, damping: 18, duration: 1 }}
        >
          {/* Paper shadow */}
          <div className="absolute inset-0 rounded-2xl translate-y-4 blur-xl opacity-20"
            style={{ background: "rgba(212,165,116,0.3)" }} />

          <div className="relative rounded-2xl border border-champagne-400/20 p-8 md:p-12 overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(253,245,230,0.06) 0%, rgba(45,27,61,0.3) 50%, rgba(13,10,11,0.5) 100%)" }}>
            {/* Decorative corner */}
            <div className="absolute top-4 right-4 text-champagne-400/20 text-4xl">✦</div>
            <div className="absolute bottom-4 left-4 text-champagne-400/20 text-4xl rotate-180">✦</div>

            {/* Letter content */}
            <div className="font-body text-base md:text-lg text-ivory-100/70 leading-[1.9] italic">
              {letterLines.map((line, i) => (
                <TypewriterLine key={i} text={line} delay={i * 400} isVisible={isInView} />
              ))}
            </div>

            {/* Wax seal */}
            <motion.div
              className="absolute -bottom-3 right-8 md:right-12 w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "radial-gradient(circle, #8B2252 0%, #6B1A42 70%)", boxShadow: "0 4px 20px rgba(139,34,82,0.4)" }}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 1.5 }}
            >
              <span className="text-2xl">💌</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
