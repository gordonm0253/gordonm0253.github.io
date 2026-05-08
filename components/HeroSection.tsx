'use client';

import { useEffect, useRef } from 'react';
import styles from './HeroSection.module.css';
import { social } from '@/lib/data';

interface Props {
  opacity: number;
  translateY: number;
}

export default function HeroSection({ opacity, translateY }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = String(opacity);
      ref.current.style.transform = `translateY(${translateY}px)`;
    }
  }, [opacity, translateY]);

  return (
    <section id="hero" className={styles.section}>
      <div ref={ref} className={styles.content}>
        <div className={styles.center}>
          <div className={styles.nameBlock}>
            <h1 className={styles.firstName}>GORDON</h1>
            <h1 className={styles.lastName}>MEI</h1>
          </div>

          <div className={styles.iconRow}>
            <a href={social.github} target="_blank" rel="noopener noreferrer" className={styles.icon} aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </a>
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.icon} aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href={`mailto:${social.email}`} className={styles.icon} aria-label="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
          </div>

          <div className={styles.scrollHint}>
            <span>SCROLL</span>
            <span className={styles.arrow}>↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}