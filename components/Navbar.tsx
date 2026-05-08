'use client';

import styles from './Navbar.module.css';
import { getScrollLength, SECTION_TARGETS } from '@/lib/scroll';

interface Props {
  section: number;
}

export default function Navbar({ section }: Props) {
  const scrollTo = (index: number) => {
    window.scrollTo({
      top: SECTION_TARGETS[index] * getScrollLength(),
      behavior: 'smooth',
    });
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>Gordon Mei</div>
      <div className={styles.links}>
        <button onClick={() => scrollTo(0)} className={`${styles.link} ${section === 0 ? styles.active : ''}`}>HOME</button>
        <button onClick={() => scrollTo(1)} className={`${styles.link} ${section === 1 ? styles.active : ''}`}>PROJECTS</button>
      </div>
    </nav>
  );
}
