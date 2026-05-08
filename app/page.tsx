'use client';

import { useEffect, useRef, useState } from 'react';
import ParallaxBg from '@/components/ParallaxBg';
import Petals from '@/components/Petals';
import Navbar from '@/components/Navbar';
import ProgressDots from '@/components/ProgressDots';
import HeroSection from '@/components/HeroSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import styles from './page.module.css';

function eio(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function cl(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

export default function Home() {
  const [scrollY, setScrollY]      = useState(0);
  const [section, setSection]      = useState(0);
  const [petalOpacity, setPetalOp] = useState(0.2);

  const [hero, setHero] = useState<[number, number]>([1, 0]);
  const [exp, setExp]   = useState<[number, number]>([0, 20]);
  const [proj, setProj] = useState<[number, number]>([0, 20]);

  useEffect(() => {
    // 5 viewport heights gives generous scroll room for all three sections
    const TOTAL = window.innerHeight * 5;

    function onScroll() {
      const s = window.scrollY;
      setScrollY(s);

      const r = cl(s / TOTAL, 0, 1);

      // Section thresholds (used for nav highlight + parallax bg)
      // Hero: 0–0.22, Experience: 0.22–0.50, Projects: 0.50–1.0
      const sec = r < 0.22 ? 0 : r < 0.50 ? 1 : 2;
      setSection(sec);

      setPetalOp(cl(r * 5, 0, 0.8));

      // Hero fades out over first 20%
      const h1 = eio(cl(1 - r / 0.20, 0, 1));
      setHero([h1, (1 - h1) * 18]);

      // Experience fades in 18–36%, fades out 44–54%
      const h2 =
        eio(cl((r - 0.18) / 0.18, 0, 1)) *
        eio(cl(1 - (r - 0.44) / 0.10, 0, 1));
      setExp([h2, (1 - h2) * 18]);

      // Projects fades in 48–60%, stays fully visible through the rest
      const h3 = eio(cl((r - 0.48) / 0.12, 0, 1));
      setProj([h3, (1 - h3) * 18]);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <ParallaxBg scrollY={scrollY} />
      <Petals opacity={petalOpacity} />
      <Navbar section={section} />
      <ProgressDots section={section} total={3} />

      <HeroSection       opacity={hero[0]} translateY={hero[1]} />
      <ExperienceSection opacity={exp[0]}  translateY={exp[1]} />
      <ProjectsSection   opacity={proj[0]} translateY={proj[1]} />

      {/* Spacer must match TOTAL — 5 * 100vh */}
      <div className={styles.spacer} />
    </>
  );
}