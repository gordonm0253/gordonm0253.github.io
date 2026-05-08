import styles from './CardFront.module.css';

interface Props {
  label: string;
  crystalColor: string[];
  featured: boolean;
}

export default function CardFront({ label, crystalColor, featured }: Props) {
  const [c1, c2, c3, c4] = crystalColor;

  return (
    <div className={`${styles.front} ${featured ? styles.featured : ''}`}>
      {/* Corner ornaments */}
      <div className={`${styles.corner} ${styles.tl}`} />
      <div className={`${styles.corner} ${styles.tr}`} />
      <div className={`${styles.corner} ${styles.bl}`} />
      <div className={`${styles.corner} ${styles.br}`} />

      {/* Crystal shards */}
      <div className={styles.shards}>
        <div className={styles.shardLeft}  style={{ background: `linear-gradient(to bottom, ${c1}, ${c2})` }} />
        <div className={styles.shardCenter} style={{ background: `linear-gradient(to bottom, ${c3}, ${c4})` }} />
        <div className={styles.shardRight} style={{ background: `linear-gradient(to bottom, ${c1}, ${c2})` }} />
        {/* Center glow line */}
        <div className={styles.shardLine} />
      </div>

      {/* Top crystal glow */}
      <div className={styles.glowTop} style={{ background: `radial-gradient(ellipse at center, ${c3}99, transparent 70%)` }} />

      {/* Play icon on featured */}
      {featured && (
        <div className={styles.playWrap}>
          <div className={styles.playIcon} />
        </div>
      )}

      {/* Label */}
      <div className={styles.label}>{label}</div>
    </div>
  );
}
