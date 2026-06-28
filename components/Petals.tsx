'use client';

import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speed: number;
  wobble: number;
  ws: number;
  col: string;
}

interface BurstPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  col: string;
  life: number;
}

const PALETTE = [
  'rgba(182,190,199,',
  'rgba(132,143,156,',
  'rgba(216,181,82,',
];

export default function Petals({ opacity, cursorMode }: { opacity: number; cursorMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const burstRef = useRef<BurstPetal[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const cursorModeRef = useRef(cursorMode);
  const opacityRef = useRef(opacity);

  useEffect(() => { cursorModeRef.current = cursorMode; }, [cursorMode]);
  useEffect(() => { opacityRef.current = opacity; }, [opacity]);

  useEffect(() => {
    petalsRef.current = Array.from({ length: 28 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 4 + Math.random() * 8,
      speed: 0.35 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
      ws: 0.3 + Math.random() * 0.5,
      col: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    }));

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function onMouseMove(e: MouseEvent) {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', onMouseMove);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameRef.current += 0.017;
      const f = frameRef.current;
      const op = opacityRef.current;
      const isCursor = cursorModeRef.current;

      // Normal falling petals
      petalsRef.current.forEach((p) => {
        const wx = Math.sin(f * p.ws + p.wobble) * 20;
        const wy = Math.cos(f * p.ws * 0.7 + p.wobble) * 10;
        const py = ((p.y - f * p.speed * 0.6 * 60 + canvas.height * 4) % canvas.height);

        ctx.save();
        ctx.translate(p.x + wx, py + wy);
        ctx.rotate(f * p.ws * 0.3 + p.wobble);
        ctx.fillStyle = p.col + op + ')';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Cursor burst: spawn petals from mouse position
      if (isCursor && cursorRef.current) {
        for (let i = 0; i < 2; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 1.5 + Math.random() * 3;
          burstRef.current.push({
            x: cursorRef.current.x + (Math.random() - 0.5) * 8,
            y: cursorRef.current.y + (Math.random() - 0.5) * 8,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd - 1.5,
            size: 3 + Math.random() * 6,
            col: PALETTE[Math.floor(Math.random() * PALETTE.length)],
            life: 1,
          });
        }
      }

      // Update and draw burst petals
      burstRef.current = burstRef.current.filter(b => b.life > 0);
      burstRef.current.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.08;
        b.vx *= 0.97;
        b.life -= 0.022;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.life * 8);
        ctx.fillStyle = b.col + Math.max(0, b.life) + ')';
        ctx.beginPath();
        ctx.ellipse(0, 0, b.size, b.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
}
