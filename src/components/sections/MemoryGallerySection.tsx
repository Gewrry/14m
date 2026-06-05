import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionTransition from "../effects/SectionTransition";

interface Memory {
  caption: string;
  description: string;
  color: string;
  emoji: string;
}

const memories: Memory[] = [
  { caption: "Our First Selfie", description: "The one where we couldn't stop smiling", color: "from-blush-300/20 to-lavender-300/10", emoji: "📸" },
  { caption: "Sunset Together", description: "Golden hour has nothing on you", color: "from-champagne-300/20 to-blush-300/10", emoji: "🌅" },
  { caption: "Food Adventures", description: "Trying every restaurant, one date at a time", color: "from-lavender-300/20 to-champagne-300/10", emoji: "🍽️" },
  { caption: "Rainy Day Cuddles", description: "The best weather for being close to you", color: "from-blush-300/15 to-lavender-300/15", emoji: "🌧️" },
  { caption: "Road Trip Vibes", description: "Windows down, music up, your hand in mine", color: "from-champagne-300/15 to-blush-300/15", emoji: "🚗" },
  { caption: "Late Night Talks", description: "3 AM conversations that made us fall deeper", color: "from-lavender-300/15 to-champagne-300/15", emoji: "🌙" },
];

function MemoryCard({ memory, index }: { memory: Memory; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 22 });

  return (
    <motion.div
      className="group relative cursor-pointer"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 80, damping: 18, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/[0.06] backdrop-blur-md group-hover:border-champagne-400/20 transition-all duration-500
          ${index % 3 === 0 ? "aspect-[4/5]" : index % 3 === 1 ? "aspect-square" : "aspect-[5/4]"}`}
        style={{ background: "linear-gradient(135deg, rgba(45,27,61,0.5) 0%, rgba(13,10,11,0.7) 100%)" }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${memory.color} opacity-60`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span className="text-6xl md:text-7xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
          >{memory.emoji}</motion.span>
        </div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(248,200,216,0.1) 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="rounded-xl p-4 backdrop-blur-lg border border-white/[0.08] translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
            style={{ background: "linear-gradient(135deg, rgba(13,10,11,0.7) 0%, rgba(45,27,61,0.5) 100%)" }}
          >
            <h3 className="text-base font-display font-semibold text-ivory-100">{memory.caption}</h3>
            <p className="text-xs font-body text-blush-300/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{memory.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MemoryGallerySection() {
  return (
    <section id="memories" className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[150px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #E8D5F5 0%, transparent 70%)" }} />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionTransition className="text-center mb-16 md:mb-20">
          <p className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-champagne-400/70 mb-4">Chapter Two</p>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-ivory-100">Our Memories</h2>
          <p className="mt-4 text-lg font-body text-blush-300/60 max-w-xl mx-auto">Every moment with you is a treasure I hold close to my heart</p>
        </SectionTransition>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {memories.map((m, i) => <MemoryCard key={m.caption} memory={m} index={i} />)}
        </div>
      </div>
    </section>
  );
}
