'use client';

import { useEffect, useRef } from 'react';
import styles from './ParallaxBg.module.css';

interface Props {
  scrollY: number;
}

export default function ParallaxBg({ scrollY }: Props) {
  const mtnRef = useRef<HTMLDivElement>(null);
  const bgRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vh = window.innerHeight;
    const TOTAL = vh * 5; // must match page.tsx
    const r = Math.min(scrollY / TOTAL, 1);

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
    function eio(t: number) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }
    function lc(c1: number[], c2: number[], t: number) {
      return `rgb(${Math.round(lerp(c1[0],c2[0],t))},${Math.round(lerp(c1[1],c2[1],t))},${Math.round(lerp(c1[2],c2[2],t))})`;
    }

    let top: string, bot: string;
    if (r < 0.22) {
      const t = eio(r / 0.22);
      top = lc([228,150,172],[14,9,42], t);
      bot = lc([98,45,115],[7,5,24], t);
    } else if (r < 0.50) {
      const t = eio((r - 0.22) / 0.28);
      top = lc([14,9,42],[5,9,22], t);
      bot = lc([7,5,24],[3,4,13], t);
    } else {
      const t = eio((r - 0.50) / 0.50);
      top = lc([5,9,22],[4,7,20], t);
      bot = lc([3,4,13],[2,3,11], t);
    }

    if (bgRef.current)  bgRef.current.style.background = `linear-gradient(to bottom, ${top}, ${bot})`;
    if (mtnRef.current) mtnRef.current.style.transform = `translateY(${scrollY * 0.04}px)`;
  }, [scrollY]);

  return (
    <div className={styles.wrap}>
      <div ref={bgRef} className={styles.bg} />

      <div ref={mtnRef} className={`${styles.layer} ${styles.mtn}`}>
        <svg width="100%" height="280" viewBox="0 0 1440 280" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,280 210,58 440,280"        fill="#2a1e40"/>
          <polygon points="180,280 510,18 840,280"      fill="#3a2858"/>
          <polygon points="580,280 860,62 1140,280"     fill="#2a1e40"/>
          <polygon points="900,280 1200,28 1440,148 1440,280" fill="#3a2858"/>
          <polygon points="0,280 145,98 340,280"        fill="#472f68" opacity="0.85"/>
          <polygon points="300,280 520,122 740,280"     fill="#3d2660" opacity="0.9"/>
          <polygon points="1100,280 1340,72 1440,280"   fill="#472f68" opacity="0.8"/>
        </svg>
      </div>
    </div>
  );
}