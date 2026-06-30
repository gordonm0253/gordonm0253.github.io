'use client';

import Link from 'next/link';
import styles from './page.module.css';
import GameSection from '@/components/greed/GameSection';
import StrategySection from '@/components/greed/StrategySection';

export default function GreedPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.backLink}>← Gordon Mei</Link>
        <div className={styles.navTitle}>GREED</div>
      </nav>

      <main className={styles.main}>
        <section className={styles.section}>
          <GameSection />
        </section>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>STRATEGY LAB</span>
          <span className={styles.dividerLine} />
        </div>

        <section className={styles.section}>
          <StrategySection />
        </section>
      </main>
    </div>
  );
}
