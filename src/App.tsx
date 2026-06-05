import { Component, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkle } from "lucide-react";

import RomanticUniverse from "./components/effects/RomanticUniverse";
import GSAPBackground from "./components/effects/GSAPBackground";

const photoModules = import.meta.glob("./assets/photos/*.{png,jpg,jpeg,webp,avif,gif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const uploadedPhotoUrls = Object.entries(photoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

const photoAt = (index: number) => uploadedPhotoUrls[index % uploadedPhotoUrls.length] ?? "/yuji.png";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─────────────────── Error Boundary ────────────────────────────────── */
class UniverseBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("3D universe failed to render:", error);
  }

  render() {
    if (this.state.hasError) {
      return <div className="cinematic-fallback" aria-hidden="true" />;
    }
    return this.props.children;
  }
}

/* ─────────────────── Cursor Glow ──────────────────────────────────── */
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
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────── Main App ─────────────────────────────────────── */
function PhotoPanel({
  src,
  alt,
  className = "",
  delay = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.figure
      className={`chapter-photo ${className}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </motion.figure>
  );
}

export default function App() {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const photos = Array.from({ length: Math.max(uploadedPhotoUrls.length, 6) }, (_, index) => ({ src: photoAt(index) }));

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

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      pointer.current = { x: nx * 2, y: -ny * 2 };
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, []);

  return (
    <main className="cinematic-journey" aria-label="Premium cinematic monthsary journey">
      {/* Scroll-driven background gradients */}
      <GSAPBackground />

      {/* Scroll-driven Three.js universe */}
      <UniverseBoundary>
        <RomanticUniverse progress={progress} pointer={pointer} photos={photos} />
      </UniverseBoundary>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="journey-chapter chapter-hero" id="hero">
        <StoryPanel className="story-panel-hero">
          <div className="eyebrow">
            <Sparkle size={15} aria-hidden="true" />
          </div>
          <h1>Happy Monthsary, Baby!</h1>
        </StoryPanel>
      </section>

      {/* ── Memory Gallery ────────────────────────────────────────── */}
      <section className="journey-chapter chapter-memory">
        <PhotoPanel className="chapter-photo-right" src={photoAt(0)} alt="A favorite shared memory" />
      </section>

      {/* ── Love Letter ───────────────────────────────────────────── */}
      <section className="journey-chapter chapter-letter" id="letter">
        <PhotoPanel className="chapter-photo-wide" src={photoAt(1)} alt="A picture for the love letter chapter" />
      </section>

      {/* Timeline */}
      <section className="journey-chapter chapter-timeline">
        <PhotoPanel className="chapter-photo-right" src={photoAt(2)} alt="A milestone memory" />
      </section>

      {/* ── Constellation ─────────────────────────────────────────── */}
      <section className="journey-chapter chapter-stars">
        <PhotoPanel src={photoAt(3)} alt="A memory beneath the constellation scene" />
      </section>

      {/* ── Finale ────────────────────────────────────────────────── */}
      <section className="journey-chapter chapter-gallery">
        <PhotoPanel className="chapter-photo-wide" src={photoAt(4)} alt="A gallery memory" />
      </section>

      <section className="journey-chapter chapter-finale">
        <StoryPanel className="story-panel-final" delay={0.08}>

          <h2>Happy Monthsary</h2>
          <p>Thank you for every moment with you. I love you gwapa!</p>
        </StoryPanel>
      </section>
    </main>
  );
}
