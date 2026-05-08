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

export default function Petals({ opacity }: { opacity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const frameRef  = useRef(0);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    petalsRef.current = Array.from({ length: 28 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 4 + Math.random() * 8,
      speed: 0.35 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
      ws: 0.3 + Math.random() * 0.5,
      col: Math.random() > 0.5 ? 'rgba(220,130,155,' : 'rgba(170,100,200,',
    }));

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameRef.current += 0.017;
      const f = frameRef.current;

      petalsRef.current.forEach(p => {
        const wx = Math.sin(f * p.ws + p.wobble) * 20;
        const wy = Math.cos(f * p.ws * 0.7 + p.wobble) * 10;
        const py = ((p.y - f * p.speed * 0.6 * 60 + canvas.height * 4) % canvas.height);

        ctx.save();
        ctx.translate(p.x + wx, py + wy);
        ctx.rotate(f * p.ws * 0.3 + p.wobble);
        ctx.fillStyle = p.col + opacity + ')';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
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
