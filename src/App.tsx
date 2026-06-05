import { useEffect, useRef } from "react";
import type { MutableRefObject, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Images, Milestone, PenLine, Sparkle, Stars } from "lucide-react";

import GSAPBackground from "./components/effects/GSAPBackground";
import RomanticUniverse from "./components/effects/RomanticUniverse";
import yujiPhoto from "./assets/photos/yuji.png";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─────────────────── Cursor Glow ──────────────────────────────────── */
function CursorGlow({ pointer }: { pointer: MutableRefObject<{ x: number; y: number }> }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 90, damping: 24 });
  const smoothY = useSpring(y, { stiffness: 90, damping: 24 });

  useEffect(() => {
    const update = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      pointer.current = { x: nx * 2, y: -ny * 2 };
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("pointermove", update, { passive: true });
    return () => window.removeEventListener("pointermove", update);
  }, [pointer, x, y]);

  return (
    <motion.div className="cursor-glow" style={{ x: smoothX, y: smoothY }} aria-hidden="true">
      <span />
      <span />
    </motion.div>
  );
}

/* ─────────────────── Story Panel ──────────────────────────────────── */
function StoryPanel({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`story-panel ${className}`}
      initial={{ opacity: 0, y: 26, filter: "blur(14px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────── Main App ─────────────────────────────────────── */
export default function App() {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const photos = [
    { src: yujiPhoto },
    { src: yujiPhoto },
    { src: yujiPhoto },
    { src: yujiPhoto },
    { src: yujiPhoto },
    { src: yujiPhoto },
  ];

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(progress, {
        current: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".cinematic-journey",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="cinematic-journey" aria-label="Premium cinematic monthsary journey">
      {/* Scroll-linked gradient background */}
      <GSAPBackground />

      {/* Scroll-driven Three.js universe */}
      <RomanticUniverse progress={progress} pointer={pointer} photos={photos} />

      {/* Cursor glow effect */}
      <CursorGlow pointer={pointer} />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="journey-chapter chapter-hero" id="hero">
        <StoryPanel className="story-panel-hero">
          <div className="eyebrow">
            <Sparkle size={15} aria-hidden="true" />
            A cinematic monthsary world
          </div>
          <h1>Happy Monthsary, My Love</h1>
          <p>Scroll slowly. I made this little universe as a soft place for our memories to breathe.</p>
        </StoryPanel>
      </section>

      {/* ── Memory Gallery ────────────────────────────────────────── */}
      <section className="journey-chapter chapter-memory">
        <StoryPanel className="story-panel-right">
          <div className="eyebrow">
            <Images size={15} aria-hidden="true" />
            Memory gallery
          </div>
          <h2>Every frame carries a feeling.</h2>
          <p>The camera drifts between glowing glass panels, like walking through moments we kept safe.</p>
        </StoryPanel>
      </section>

      {/* ── Love Letter ───────────────────────────────────────────── */}
      <section className="journey-chapter chapter-letter" id="letter">
        <StoryPanel className="story-panel-letter">
          <div className="eyebrow">
            <PenLine size={15} aria-hidden="true" />
            Love letter
          </div>
          <h2>My favorite part of time is sharing it with you.</h2>
          <p>
            Every month with you feels like discovering a new language for tenderness. You make ordinary days softer,
            brighter, and beautifully worth remembering.
          </p>
        </StoryPanel>
      </section>

      {/* Timeline */}
      <section className="journey-chapter chapter-timeline">
        <StoryPanel className="story-panel-right">
          <div className="eyebrow">
            <Milestone size={15} aria-hidden="true" />
            Love timeline
          </div>
          <h2>Little milestones, glowing in order.</h2>
          <p>Each point wakes as the camera passes, like the story remembering itself one heartbeat at a time.</p>
        </StoryPanel>
      </section>

      {/* ── Constellation ─────────────────────────────────────────── */}
      <section className="journey-chapter chapter-stars">
        <StoryPanel>
          <div className="eyebrow">
            <Stars size={15} aria-hidden="true" />
            Constellation
          </div>
          <h2>Our memories keep finding each other.</h2>
          <p>Stars gather into a heart, connected by quiet light, the way small moments become something whole.</p>
        </StoryPanel>
      </section>

      {/* ── Finale ────────────────────────────────────────────────── */}
      <section className="journey-chapter chapter-gallery">
        <StoryPanel>
          <div className="eyebrow">
            <Images size={15} aria-hidden="true" />
            3D gallery
          </div>
          <h2>One photograph, many ways to feel it.</h2>
          <p>Soft parallax, glass depth, and slow cinematic zooms make the gallery feel suspended in its own quiet room.</p>
        </StoryPanel>
      </section>

      <section className="journey-chapter chapter-finale">
        <StoryPanel className="story-panel-final" delay={0.08}>
          <div className="eyebrow">
            <Heart size={15} fill="currentColor" aria-hidden="true" />
            Final heart
          </div>
          <h2>Happy Monthsary</h2>
          <p>Thank you for every moment with you.</p>
        </StoryPanel>
      </section>
    </main>
  );
}
