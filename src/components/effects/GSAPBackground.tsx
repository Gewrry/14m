import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP-driven scroll-linked background.
 *
 * Animates three CSS custom-property colors that feed into
 * a gradient via inline style. GSAP's built-in color
 * interpolation handles smooth transitions between hex values.
 */
export default function GSAPBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = bgRef.current;
    if (!el) return;

    // Set initial custom-property values (these feed the gradient below)
    gsap.set(el, {
      "--bg-top": "#0D0A0B",
      "--bg-mid": "#1A0A2E",
      "--bg-bot": "#2D1B3D",
    });

    // Build a timeline scrubbed by the page scroll position
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    });

    tl
      // Hero → Memory
      .to(el, { "--bg-top": "#2D1B3D", "--bg-mid": "#1A0A2E", "--bg-bot": "#0D0A0B", ease: "none" })
      // Memory → Letter
      .to(el, { "--bg-top": "#0D0A0B", "--bg-mid": "#1A0A2E", "--bg-bot": "#2D1B3D", ease: "none" })
      // Letter → Constellation
      .to(el, { "--bg-top": "#2D1B3D", "--bg-mid": "#1A0A2E", "--bg-bot": "#0D0A0B", ease: "none" })
      // Constellation → Finale
      .to(el, { "--bg-top": "#0D0A0B", "--bg-mid": "#2D1B3D", "--bg-bot": "#1A0A2E", ease: "none" })
      // Finale end
      .to(el, { "--bg-top": "#1A0A2E", "--bg-mid": "#0D0A0B", "--bg-bot": "#1A0A2E", ease: "none" });

  }, { scope: bgRef });

  return (
    <div
      ref={bgRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background:
          "linear-gradient(180deg, var(--bg-top) 0%, var(--bg-mid) 50%, var(--bg-bot) 100%)",
      }}
      aria-hidden="true"
    />
  );
}
