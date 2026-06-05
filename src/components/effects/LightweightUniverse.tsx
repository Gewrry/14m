import { useCallback, useEffect, useRef } from "react";
import type { MutableRefObject } from "react";

/* ─────────────────────────────── Types ─────────────────────────────── */
interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  hue: number; // 0 = warm-ivory, 1 = pink, 2 = gold, 3 = lavender
}

interface FloatingHeart {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  drift: number;
  phase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

interface LightweightUniverseProps {
  progress: MutableRefObject<number>;
  pointer: MutableRefObject<{ x: number; y: number }>;
}

/* ────────────────────── Color palette ──────────────────────────────── */
const COLORS = {
  ivory: [255, 247, 237],
  pink: [255, 179, 205],
  gold: [216, 170, 104],
  lavender: [217, 196, 255],
  rosePink: [255, 143, 186],
};

const HEART_PATH = new Path2D(
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
);

/* ─────────────────────── Component ─────────────────────────────────── */
export default function LightweightUniverse({ progress, pointer }: LightweightUniverseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const heartsRef = useRef<FloatingHeart[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const sparklesRef = useRef<Sparkle[]>([]);
  const animRef = useRef(0);
  const lastShootTime = useRef(0);
  const lastSparkleTime = useRef(0);

  /* ── Initialise stars + hearts on resize ──────────────────────────── */
  const init = useCallback((w: number, h: number) => {
    // Stars — responsive count, capped for performance
    const starCount = Math.min(Math.floor((w * h) / 2800), 450);
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2.0 + 0.3,
        baseAlpha: Math.random() * 0.55 + 0.2,
        twinkleSpeed: Math.random() * 0.006 + 0.002,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: Math.floor(Math.random() * 4),
      });
    }
    starsRef.current = stars;

    // Floating hearts
    const heartCount = Math.min(Math.floor(w / 90), 18);
    const hearts: FloatingHeart[] = [];
    for (let i = 0; i < heartCount; i++) {
      hearts.push({
        x: Math.random() * w,
        y: h + Math.random() * h * 0.3,
        size: Math.random() * 14 + 7,
        alpha: Math.random() * 0.22 + 0.06,
        speed: Math.random() * 0.35 + 0.15,
        drift: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }
    heartsRef.current = hearts;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    /* ── Sizing ──────────────────────────────────────────────────────── */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── Render loop ─────────────────────────────────────────────────── */
    const draw = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const p = progress.current;
      const px = pointer.current.x;
      const py = pointer.current.y;

      ctx.clearRect(0, 0, w, h);

      /* — Stars ————————————————————————————————————————————————————— */
      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.35 + 0.65;
        const alpha = star.baseAlpha * twinkle;

        // Subtle parallax based on pointer
        const sx = star.x + px * star.size * 4;
        const sy = star.y - py * star.size * 3;

        let r: number, g: number, b: number;
        switch (star.hue) {
          case 1:
            [r, g, b] = COLORS.pink;
            break;
          case 2:
            [r, g, b] = COLORS.gold;
            break;
          case 3:
            [r, g, b] = COLORS.lavender;
            break;
          default:
            [r, g, b] = COLORS.ivory;
        }

        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // Soft glow on larger stars
        if (star.size > 1.4) {
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.size * 3.5);
          grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.35})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(sx, sy, star.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      /* — Floating hearts ——————————————————————————————————————————— */
      for (const heart of heartsRef.current) {
        heart.y -= heart.speed;
        heart.x += Math.sin(time * 0.001 + heart.phase) * heart.drift;

        // Reset when off-screen
        if (heart.y < -heart.size * 2) {
          heart.y = h + heart.size;
          heart.x = Math.random() * w;
        }

        const fadeIn = Math.min(1, (h - heart.y) / (h * 0.1));
        const fadeOut = Math.min(1, heart.y / (h * 0.1));
        const a = heart.alpha * fadeIn * fadeOut;

        ctx.save();
        ctx.translate(heart.x, heart.y);
        const sc = heart.size / 24;
        ctx.scale(sc, sc);
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgba(${COLORS.pink.join(",")},0.7)`;
        ctx.fill(HEART_PATH);
        ctx.restore();
      }

      /* — Shooting stars ——————————————————————————————————————————— */
      if (time - lastShootTime.current > 3500 + Math.random() * 5500) {
        lastShootTime.current = time;
        shootingRef.current.push({
          x: Math.random() * w * 0.8 + w * 0.1,
          y: Math.random() * h * 0.25,
          length: Math.random() * 90 + 35,
          speed: Math.random() * 5 + 3.5,
          angle: (Math.random() * 28 + 12) * (Math.PI / 180),
          opacity: 1,
          life: 0,
          maxLife: 65 + Math.random() * 35,
        });
      }

      shootingRef.current = shootingRef.current.filter((s) => {
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity = 1 - s.life / s.maxLife;
        if (s.opacity <= 0) return false;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
        const grad = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length,
        );
        grad.addColorStop(0, `rgba(255,248,240,${s.opacity})`);
        grad.addColorStop(1, "rgba(255,248,240,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        return true;
      });

      /* — Sparkles (scroll-linked density) ————————————————————————— */
      const sparkleInterval = Math.max(80, 300 - p * 260);
      if (time - lastSparkleTime.current > sparkleInterval) {
        lastSparkleTime.current = time;
        const colors = [
          `rgba(${COLORS.pink.join(",")},0.7)`,
          `rgba(${COLORS.gold.join(",")},0.65)`,
          `rgba(${COLORS.lavender.join(",")},0.55)`,
          `rgba(${COLORS.ivory.join(",")},0.6)`,
        ];
        sparklesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 3 + 1.5,
          alpha: 1,
          life: 0,
          maxLife: 50 + Math.random() * 40,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      sparklesRef.current = sparklesRef.current.filter((sp) => {
        sp.life++;
        const t2 = sp.life / sp.maxLife;
        // Fade in then out
        sp.alpha = t2 < 0.3 ? t2 / 0.3 : 1 - (t2 - 0.3) / 0.7;
        if (sp.alpha <= 0) return false;

        // Draw four-pointed star sparkle
        ctx.save();
        ctx.translate(sp.x, sp.y);
        ctx.globalAlpha = sp.alpha;
        ctx.fillStyle = sp.color;

        // Vertical line
        ctx.fillRect(-0.5, -sp.size, 1, sp.size * 2);
        // Horizontal line
        ctx.fillRect(-sp.size, -0.5, sp.size * 2, 1);

        // Soft glow
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, sp.size * 2.5);
        grad.addColorStop(0, sp.color);
        grad.addColorStop(1, "rgba(255,248,240,0)");
        ctx.beginPath();
        ctx.arc(0, 0, sp.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = sp.alpha * 0.3;
        ctx.fill();
        ctx.restore();
        return true;
      });

      /* — Ambient glow orbs (scroll-linked position) ——————————————— */
      // Top-left pink glow
      drawGlow(ctx, w * 0.15 + px * 20, h * 0.12 - py * 15, w * 0.22, COLORS.rosePink, 0.06 + p * 0.04);
      // Right gold glow
      drawGlow(ctx, w * 0.82 - px * 18, h * 0.2 + py * 12, w * 0.2, COLORS.gold, 0.05 + p * 0.03);
      // Bottom lavender glow
      drawGlow(ctx, w * 0.65, h * 0.78, w * 0.25, COLORS.lavender, 0.04 + p * 0.035);

      /* — Heart constellation (visible during chapter-stars) ———————— */
      const consFade =
        smoothstep(p, 0.55, 0.65) * (1 - smoothstep(p, 0.82, 0.92));
      if (consFade > 0.01) {
        drawHeartConstellation(ctx, w / 2 + px * 15, h * 0.45 - py * 10, Math.min(w, h) * 0.28, consFade, time);
      }

      /* — Finale heart gather (visible during chapter-finale) ——————— */
      const finaleFade = smoothstep(p, 0.82, 0.96);
      if (finaleFade > 0.01) {
        drawFinaleHeart(ctx, w / 2, h * 0.42, Math.min(w, h) * 0.18, finaleFade, time);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [init, progress, pointer]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}

/* ─────────────────── Helper draw functions ─────────────────────────── */

function smoothstep(x: number, edge0: number, edge1: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function drawGlow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rgb: number[], alpha: number) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, `rgba(${rgb.join(",")},${alpha})`);
  grad.addColorStop(0.5, `rgba(${rgb.join(",")},${alpha * 0.4})`);
  grad.addColorStop(1, `rgba(${rgb.join(",")},0)`);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
}

function heartPoint(t: number, scale: number): [number, number] {
  const x = 16 * Math.sin(t) ** 3 * scale;
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
  return [x, y];
}

function drawHeartConstellation(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  fade: number,
  time: number,
) {
  const scale = size / 16;
  const count = 22;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalAlpha = fade;

  // Draw connecting lines
  ctx.beginPath();
  for (let i = 0; i <= count; i++) {
    const t = (i / count) * Math.PI * 2;
    const [x, y] = heartPoint(t, scale);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = `rgba(${COLORS.pink.join(",")},0.5)`;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Draw star nodes
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const [x, y] = heartPoint(t, scale);
    const pulse = Math.sin(time * 0.003 + i * 0.5) * 0.3 + 0.7;
    const nodeColor = i % 3 === 0 ? COLORS.gold : i % 3 === 1 ? COLORS.pink : COLORS.lavender;

    ctx.beginPath();
    ctx.arc(x, y, 2.5 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${nodeColor.join(",")},${0.9 * pulse})`;
    ctx.fill();

    // Node glow
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 8);
    grad.addColorStop(0, `rgba(${nodeColor.join(",")},${0.35 * pulse})`);
    grad.addColorStop(1, `rgba(${nodeColor.join(",")},0)`);
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  ctx.restore();
}

function drawFinaleHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  fade: number,
  time: number,
) {
  const scale = size / 16;
  const count = 120;
  ctx.save();
  ctx.translate(cx, cy);

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const [tx, ty] = heartPoint(t, scale);

    // Scatter-to-heart interpolation
    const scatterX = (Math.sin(i * 174.3) * 0.5) * size * 3.5;
    const scatterY = (Math.cos(i * 231.7) * 0.5) * size * 2.5;
    const x = scatterX + (tx - scatterX) * fade;
    const y = scatterY + (ty - scatterY) * fade;

    const pulse = Math.sin(time * 0.002 + i * 0.2) * 0.2 + 0.8;
    const colors = [COLORS.ivory, COLORS.pink, COLORS.gold, COLORS.lavender];
    const c = colors[i % 4];
    const a = (0.5 + fade * 0.4) * pulse;

    ctx.beginPath();
    ctx.arc(x, y, 1.6 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${c.join(",")},${a})`;
    ctx.fill();
  }

  ctx.restore();
}
