import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SectionTransition from "../effects/SectionTransition";

const futureGoals = [
  { emoji: "✈️", title: "Travel the World Together", description: "From Paris sunsets to Tokyo cherry blossoms" },
  { emoji: "🏡", title: "Build Our Dream Home", description: "A place filled with love, laughter, and memories" },
  { emoji: "🐾", title: "Get a Fur Baby", description: "A little companion to share our adventures with" },
  { emoji: "🌅", title: "Watch a Thousand Sunsets", description: "Side by side, hand in hand, forever amazed" },
  { emoji: "💍", title: "Write Our Forever", description: "Every chapter better than the last" },
];

function AnimatedCounter({ end, label, delay }: { end: number; label: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, end, delay]);

  return (
    <div className="text-center">
      <motion.span ref={ref} className="block text-4xl md:text-6xl font-display font-bold text-champagne-400"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ type: "spring", stiffness: 80, damping: 18, delay }}>
        {count.toLocaleString()}+
      </motion.span>
      <span className="text-xs md:text-sm font-sans uppercase tracking-[0.2em] text-blush-300/50 mt-2 block">{label}</span>
    </div>
  );
}

export default function FutureSection() {
  const startDate = new Date("2025-04-05");
  const now = new Date();
  const days = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <section id="future" className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-[150px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #E8D5F5 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionTransition className="text-center mb-16 md:mb-20">
          <p className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-champagne-400/70 mb-4">Chapter Five</p>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-ivory-100">Our Future Together</h2>
          <p className="mt-4 text-lg font-body text-blush-300/60 max-w-xl mx-auto">The best is yet to come, and I can't wait to live it with you</p>
        </SectionTransition>

        {/* Counters */}
        <div className="flex flex-wrap justify-center gap-10 md:gap-16 mb-20">
          <AnimatedCounter end={days} label="Days of Love" delay={0} />
          <div className="hidden md:block w-px h-20 bg-gradient-to-b from-transparent via-champagne-400/30 to-transparent self-center" />
          <AnimatedCounter end={days * 24} label="Hours Together" delay={0.2} />
          <div className="hidden md:block w-px h-20 bg-gradient-to-b from-transparent via-champagne-400/30 to-transparent self-center" />
          <AnimatedCounter end={999} label="Smiles Shared" delay={0.4} />
        </div>

        {/* Future goals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {futureGoals.map((goal, i) => (
            <motion.div key={goal.title}
              className="group relative p-6 md:p-8 rounded-2xl border border-white/[0.06] backdrop-blur-md hover:border-lavender-300/20 transition-all duration-500"
              style={{ background: "linear-gradient(135deg, rgba(45,27,61,0.4) 0%, rgba(13,10,11,0.6) 100%)" }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 80, damping: 18, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(232,213,245,0.06) 0%, transparent 70%)" }} />
              <motion.span className="text-4xl block mb-4"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}>
                {goal.emoji}
              </motion.span>
              <h3 className="text-lg md:text-xl font-display font-semibold text-ivory-100 mb-2">{goal.title}</h3>
              <p className="text-sm font-body text-blush-300/50">{goal.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Inspirational quote */}
        <SectionTransition className="text-center mt-20" delay={0.3}>
          <blockquote className="text-2xl md:text-3xl font-display italic text-ivory-100/60 max-w-2xl mx-auto leading-relaxed">
            "I loved you yesterday, I love you still. I always have, I always will."
          </blockquote>
          <div className="w-12 h-px bg-champagne-400/40 mx-auto mt-6" />
        </SectionTransition>
      </div>
    </section>
  );
}
