import styles from './CardFront.module.css';
import type { CrystalColor } from '@/lib/projectColors';

interface Props {
  label: string;
  crystalColor: CrystalColor;
  featured: boolean;
  active?: boolean;
}

export default function CardFront({ label, crystalColor, featured, active = false }: Props) {
  const [c1, c2, c3, c4] = crystalColor;

  return (
    <div className={`${styles.front} ${featured ? styles.featured : ''} ${active ? styles.active : ''}`}>
      <div className={`${styles.corner} ${styles.tl}`} />
      <div className={`${styles.corner} ${styles.tr}`} />
      <div className={`${styles.corner} ${styles.bl}`} />
      <div className={`${styles.corner} ${styles.br}`} />

      <div className={styles.shards}>
        <div className={styles.shardLeft} style={{ background: `linear-gradient(to bottom, ${c1}, ${c2})` }} />
        <div className={styles.shardCenter} style={{ background: `linear-gradient(to bottom, ${c3}, ${c4})` }} />
        <div className={styles.shardRight} style={{ background: `linear-gradient(to bottom, ${c1}, ${c2})` }} />
        <div className={styles.shardLine} />
      </div>

      <div className={styles.glowTop} style={{ background: `radial-gradient(ellipse at center, ${c3}99, transparent 70%)` }} />

      <div className={styles.label}>{label}</div>
    </div>
  );
}
