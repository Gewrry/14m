import React, { useCallback, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import FloatingParticles from "../effects/FloatingParticles";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  size: number;
  opacity: number;
  speed: number;
  arrived: boolean;
}

function heartShape(t: number, scale: number, cx: number, cy: number) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return { x: x * scale + cx, y: y * scale + cy };
}

export default function GrandFinaleSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const startedRef = useRef(false);

  const initParticles = useCallback((w: number, h: number) => {
    const count = 200;
    const scale = Math.min(w, h) * 0.012;
    const cx = w / 2;
    const cy = h / 2 - 20;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const target = heartShape(t, scale, cx, cy);
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        targetX: target.x + (Math.random() - 0.5) * 8,
        targetY: target.y + (Math.random() - 0.5) * 8,
        originX: Math.random() * w,
        originY: Math.random() * h,
        size: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.6 + 0.4,
        speed: Math.random() * 0.015 + 0.008,
        arrived: false,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      initParticles(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      const shouldForm = isInView && startedRef.current;

      for (const p of particlesRef.current) {
        if (shouldForm) {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          p.x += dx * p.speed * 3;
          p.y += dy * p.speed * 3;
          if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            p.arrived = true;
            p.x = p.targetX + Math.sin(Date.now() * 0.002 + p.targetX) * 1.5;
            p.y = p.targetY + Math.cos(Date.now() * 0.002 + p.targetY) * 1.5;
          }
        } else {
          p.x += Math.sin(Date.now() * 0.001 + p.originX) * 0.3;
          p.y += Math.cos(Date.now() * 0.001 + p.originY) * 0.3;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const alpha = p.arrived ? p.opacity * 0.9 : p.opacity * 0.5;
        ctx.fillStyle = p.arrived
          ? `rgba(248, 200, 216, ${alpha})`
          : `rgba(232, 213, 245, ${alpha * 0.7})`;
        ctx.fill();

        if (p.arrived) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          grd.addColorStop(0, `rgba(248,200,216,${alpha * 0.2})`);
          grd.addColorStop(1, "rgba(248,200,216,0)");
          ctx.fillStyle = grd;
          ctx.fill();
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initParticles, isInView]);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => { startedRef.current = true; }, 600);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  return (
    <section id="finale" ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-15 blur-[180px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #F8C8D8 0%, transparent 60%)" }} />

      <FloatingParticles count={15} colors={["rgba(248,200,216,0.1)", "rgba(212,165,116,0.08)"]} minSize={1} maxSize={3} />

      {/* Heart particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* Text content */}
      <div className="relative z-20 text-center px-6 mt-32">
        <motion.p className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-champagne-400/70 mb-6"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 3, duration: 1.5 }}>
          Forever & Always
        </motion.p>
        <motion.h2 className="text-4xl md:text-7xl font-display font-bold text-ivory-100 mb-6"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ type: "spring", stiffness: 60, damping: 18, delay: 3.5 }}>
          Happy Monthsary,{" "}
          <span className="text-blush-300" style={{ textShadow: "0 0 30px rgba(248,200,216,0.4)" }}>My Love</span>
        </motion.h2>
        <motion.p className="text-lg md:text-2xl font-body text-ivory-100/50 max-w-lg mx-auto"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 4.2, duration: 1.5 }}>
          Here's to us — to every yesterday, today, and all the tomorrows we'll share together.
        </motion.p>
        <motion.div className="mt-8 flex items-center justify-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ delay: 5, type: "spring", stiffness: 100, damping: 15 }}>
          <span className="text-2xl md:text-3xl font-display text-champagne-400">Deo</span>
          <span className="text-2xl text-blush-300">♥</span>
          <span className="text-2xl md:text-3xl font-display text-champagne-400">Lovely</span>
        </motion.div>

        {/* Footer */}
        <motion.p className="mt-20 text-xs font-sans text-ivory-100/20 tracking-widest"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 6, duration: 2 }}>
          Made with 💕 just for you
        </motion.p>
      </div>
    </section>
  );
}
