'use client';

import styles from './ProgressDots.module.css';

interface Props {
  section: number;
  total: number;
}

export default function ProgressDots({ section, total }: Props) {
  return (
    <div className={styles.wrap}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`${styles.dot} ${i === section ? styles.active : ''}`} />
      ))}
    </div>
  );
}
