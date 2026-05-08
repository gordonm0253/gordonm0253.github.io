'use client';

import styles from './Navbar.module.css';

interface Props {
  section: number;
}

const SECTION_OFFSETS = [0, 1, 2]; // multipliers of window.innerHeight * 1.05

export default function Navbar({ section }: Props) {
  const scrollTo = (index: number) => {
    const vh = window.innerHeight;
    const TOTAL = vh * 3;
    // Match the thresholds in page.tsx: sections start at r = 0, 0.28, 0.65
    const starts = [0, 0.28, 0.65];
    window.scrollTo({ top: starts[index] * TOTAL, behavior: 'smooth' });
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>Gordon Mei</div>
      <div className={styles.links}>
        <button onClick={() => scrollTo(0)} className={`${styles.link} ${section === 0 ? styles.active : ''}`}>HOME</button>
        <button onClick={() => scrollTo(1)} className={`${styles.link} ${section === 1 ? styles.active : ''}`}>EXPERIENCE</button>
        <button onClick={() => scrollTo(2)} className={`${styles.link} ${section === 2 ? styles.active : ''}`}>PROJECTS</button>
      </div>
    </nav>
  );
}