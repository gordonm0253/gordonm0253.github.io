import styles from './CardBack.module.css';

interface Props {
  name: string;
  desc: string;
  tech: string[];
  featured: boolean;
}

export default function CardBack({ name, desc, tech, featured }: Props) {
  return (
    <div className={`${styles.back} ${featured ? styles.featured : ''}`}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.desc}>{desc}</p>

      <div className={styles.tech}>
        {tech.map((t) => (
          <span key={t} className={styles.chip}>{t}</span>
        ))}
      </div>
    </div>
  );
}
