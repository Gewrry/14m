import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionTransition from "../effects/SectionTransition";

const reasons = [
  "Your smile lights up even my darkest days",
  "The way you laugh makes everything feel right",
  "You believe in me when I forget to believe in myself",
  "Every moment with you feels like a beautiful dream",
  "Your kindness inspires me to be a better person",
  "You make the ordinary feel extraordinary",
  "The way you hold my hand says everything words can't",
  "You are my calm in every storm",
  "Your eyes tell stories that make my heart race",
  "Because with you, I found my forever home",
];

function ReasonCard({ reason, index }: { reason: string; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 22 });
  const rY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 22 });

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 80, damping: 18, delay: index * 0.06 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - r.left) / r.width - 0.5);
        mouseY.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      style={{ rotateX: rX, rotateY: rY, transformPerspective: 800 }}
    >
      <div className="relative p-6 md:p-8 rounded-2xl border border-white/[0.06] backdrop-blur-md group-hover:border-blush-300/20 transition-all duration-500 h-full"
        style={{ background: "linear-gradient(135deg, rgba(45,27,61,0.4) 0%, rgba(13,10,11,0.6) 100%)" }}>
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(248,200,216,0.08) 0%, transparent 70%)" }} />
        {/* Number */}
        <motion.span className="text-5xl md:text-6xl font-display font-bold text-champagne-400/15 absolute top-3 right-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.06 + 0.3 }}>
          {String(index + 1).padStart(2, "0")}
        </motion.span>
        {/* Heart icon */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, rgba(248,200,216,0.2) 0%, rgba(232,213,245,0.1) 100%)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#F8C8D8">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <p className="text-base md:text-lg font-body text-ivory-100/80 leading-relaxed relative z-10">
          {reason}
        </p>
      </div>
    </motion.div>
  );
}

export default function ReasonsSection() {
  return (
    <section id="reasons" className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[150px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #F8C8D8 0%, transparent 70%)" }} />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionTransition className="text-center mb-16 md:mb-20">
          <p className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-champagne-400/70 mb-4">Chapter Three</p>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-ivory-100">Reasons I Love You</h2>
          <p className="mt-4 text-lg font-body text-blush-300/60 max-w-xl mx-auto">An infinite list, but here are just a few</p>
        </SectionTransition>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {reasons.map((r, i) => <ReasonCard key={i} reason={r} index={i} />)}
        </div>
      </div>
    </section>
  );
}
