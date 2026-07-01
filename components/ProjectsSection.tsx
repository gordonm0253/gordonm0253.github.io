'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './ProjectsSection.module.css';
import NightMarketCard from './NightMarketCard';
import { projects } from '@/lib/data';
import type { Project } from '@/lib/data';
import { assignRandomCrystalColors, getProjectCrystalColor } from '@/lib/projectColors';
import type { CrystalColor } from '@/lib/projectColors';

interface Props {
  opacity: number;
  translateY: number;
  scrollY: number;
  onOverflowChange: (overflow: number) => void;
}

function compareFeaturedProjects(a: Project, b: Project) {
  if (a.featured === b.featured) {
    return 0;
  }

  return a.featured ? -1 : 1;
}

function ActionLink({
  href,
  label,
  disabled = false,
}: {
  href?: string;
  label: string;
  disabled?: boolean;
}) {
  if (disabled || !href) {
    return <span className={`${styles.actionButton} ${styles.actionButtonDisabled}`}>{label}</span>;
  }

  return (
    <a className={styles.actionButton} href={href} target="_blank" rel="noopener noreferrer">
      {label} ↗
    </a>
  );
}

export default function ProjectsSection({ opacity, translateY, scrollY, onOverflowChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRailRef = useRef<HTMLDivElement>(null);
  const ordered = useMemo(() => [...projects].sort(compareFeaturedProjects), []);
  const [selectedName, setSelectedName] = useState(ordered[0]?.name);
  const selected = ordered.find((p) => p.name === selectedName) ?? ordered[0];
  const selectedActions = [
    selected.demoLink ? { href: selected.demoLink, label: selected.demoLabel ?? 'Demo' } : null,
    selected.githubLink ? { href: selected.githubLink, label: 'Github' } : null,
  ].filter((action): action is { href: string; label: string } => action !== null);

  const [columns, setColumns] = useState<number | null>(null);

  useEffect(() => {
    const railEl = cardRailRef.current;
    if (!railEl) return;

    function measureColumns() {
      if (!railEl) return;
      const columnCount = getComputedStyle(railEl).gridTemplateColumns.split(' ').length;
      setColumns(columnCount);
    }

    measureColumns();
    const observer = new ResizeObserver(measureColumns);
    observer.observe(railEl);
    return () => observer.disconnect();
  }, []);

  const cardColors = useMemo(() => {
    const byName = new Map<string, CrystalColor>();
    if (columns === null) {
      ordered.forEach((p, i) => byName.set(p.name, p.crystalColor ?? getProjectCrystalColor(i)));
      return byName;
    }
    const palettes = assignRandomCrystalColors(ordered.length, columns);
    ordered.forEach((p, i) => byName.set(p.name, p.crystalColor ?? palettes[i]));
    return byName;
  }, [ordered, columns]);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = String(opacity);
      ref.current.style.transform = `translateY(${translateY - scrollY}px)`;
      ref.current.style.pointerEvents = opacity > 0.2 ? 'auto' : 'none';
    }
  }, [opacity, translateY, scrollY]);

  useEffect(() => {
    function measureOverflow() {
      if (!contentRef.current) return;
      const available = Math.max(0, window.innerHeight - 160);
      const overflow = Math.max(0, contentRef.current.scrollHeight - available);
      onOverflowChange(overflow);
    }

    measureOverflow();
    window.addEventListener('resize', measureOverflow);
    return () => window.removeEventListener('resize', measureOverflow);
  }, [ordered.length, selectedName, onOverflowChange]);

  return (
    <section id="projects" className={styles.section}>
      <div ref={ref} className={styles.content}>
        <div ref={contentRef} className={styles.innerContent}>
          <div className={styles.heading}>
            <h2 className={styles.title}>Projects</h2>
          </div>

          <div className={styles.showcase}>
            <article className={styles.featurePanel}>
              <h3 className={styles.featureTitle}>{selected.name}</h3>
              <p className={styles.featureDesc}>{selected.longDesc}</p>

              <div className={styles.featureTech}>
                {selected.tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <div className={styles.featureActions}>
                {selectedActions.length > 0 ? (
                  selectedActions.map((action) => (
                    <ActionLink key={action.href} href={action.href} label={action.label} />
                  ))
                ) : (
                  <ActionLink label="Coming soon" disabled />
                )}
              </div>
            </article>

            <p className={styles.instructions}>Select a card to focus it. Click again to reveal details.</p>

            <div ref={cardRailRef} className={styles.cardRail}>
              {ordered.map((p) => (
                <NightMarketCard
                  key={p.name}
                  label={p.name}
                  name={p.name}
                  desc={p.desc}
                  tech={p.tech}
                  crystalColor={cardColors.get(p.name)!}
                  featured={p.name === selected.name}
                  active={p.name === selected.name}
                  onSelect={() => setSelectedName(p.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
