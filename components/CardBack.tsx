import styles from './CardBack.module.css';

interface Props {
  name: string;
  desc: string;
  tech: string[];
  link: string | null;
  linkLabel: string;
  featured: boolean;
}

export default function CardBack({ name, desc, tech, link, linkLabel, featured }: Props) {
  return (
    <div className={`${styles.back} ${featured ? styles.featured : ''}`}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.desc}>{desc}</p>

      <div className={styles.tech}>
        {tech.map((t) => (
          <span key={t} className={styles.chip}>{t}</span>
        ))}
      </div>

      <div className={styles.linkRow}>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onClick={(e) => e.stopPropagation()}
          >
            {linkLabel}
          </a>
        ) : (
          <span className={styles.noLink}>{linkLabel}</span>
        )}
      </div>
    </div>
  );
}
