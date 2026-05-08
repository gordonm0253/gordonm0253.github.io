'use client';

import { useEffect, useRef } from 'react';
import styles from './ProjectsSection.module.css';
import NightMarketCard from './NightMarketCard';
import { projects } from '@/lib/data';

interface Props {
  opacity: number;
  translateY: number;
}

export default function ProjectsSection({ opacity, translateY }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = String(opacity);
      ref.current.style.transform = `translateY(${translateY}px)`;
    }
  }, [opacity, translateY]);

  // Put the featured card in the center
  const sorted = [...projects].sort((a, b) =>
    a.featured === b.featured ? 0 : a.featured ? -1 : 1
  );
  const centerIndex = sorted.findIndex(p => p.featured);
  // Rearrange: left cards, center, right cards
  const left  = sorted.slice(0, centerIndex);
  const center = sorted[centerIndex];
  const right = sorted.slice(centerIndex + 1);
  const ordered = [...left, center, ...right];

  return (
    <section id="projects" className={styles.section}>
      <div ref={ref} className={styles.content}>
        <h2 className={styles.title}>Projects</h2>
        <p className={styles.tag}>Select a card to reveal</p>

        <div className={styles.row}>
          {ordered.map((p) => (
            <NightMarketCard
              key={p.id}
              label={p.label}
              name={p.name}
              desc={p.desc}
              tech={p.tech}
              link={p.link}
              linkLabel={p.linkLabel}
              crystalColor={p.crystalColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
