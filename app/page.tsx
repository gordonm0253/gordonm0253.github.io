'use client';

import { useEffect, useRef, useState } from 'react';
import ParallaxBg from '@/components/ParallaxBg';
import Petals from '@/components/Petals';
import Navbar from '@/components/Navbar';
import ProgressDots from '@/components/ProgressDots';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import styles from './page.module.css';
import { getScrollLength, SECTION_STARTS } from '@/lib/scroll';
import { clamp, easeInOutQuad } from '@/lib/animation';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [section, setSection] = useState(0);
  const [petalOpacity, setPetalOpacity] = useState(0.2);
  const [hero, setHero] = useState<[number, number]>([1, 0]);
  const [proj, setProj] = useState<[number, number]>([0, 20]);
  const [projectOverflow, setProjectOverflow] = useState(0);
  const [projectScroll, setProjectScroll] = useState(0);

  useEffect(() => {
    // Shared with nav so tab clicks land on the same animated section states.
    const TOTAL = getScrollLength(projectOverflow);

    function onScroll() {
      const s = window.scrollY;
      setScrollY(s);

      const r = clamp(s / TOTAL, 0, 1);

      const sec = r < SECTION_STARTS[1] ? 0 : 1;
      setSection(sec);

      setPetalOpacity(clamp(r * 5, 0, 0.8));

      // Hero + About fades out as the projects section enters.
      const h1 = easeInOutQuad(clamp(1 - r / 0.42, 0, 1));
      setHero([h1, (1 - h1) * 18]);

      // Projects fades in, then taller project grids move with the global page scroll.
      const h3 = easeInOutQuad(clamp((r - 0.38) / 0.16, 0, 1));
      setProj([h3, (1 - h3) * 18]);
      setProjectScroll(projectOverflow * clamp((r - 0.62) / 0.38, 0, 1));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [projectOverflow]);

  return (
    <>
      <ParallaxBg scrollY={scrollY} />
      <Petals opacity={petalOpacity} />
      <Navbar section={section} />
      <ProgressDots section={section} total={2} />

      <HeroSection opacity={hero[0]} translateY={hero[1]} />
      <ProjectsSection
        opacity={proj[0]}
        translateY={proj[1]}
        scrollY={projectScroll}
        onOverflowChange={setProjectOverflow}
      />

      <div
        className={styles.spacer}
        style={{ height: `calc(400vh + ${projectOverflow}px)` }}
      />
    </>
  );
}
