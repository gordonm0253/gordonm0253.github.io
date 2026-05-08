'use client';

import { useState } from 'react';
import styles from './NightMarketCard.module.css';
import CardFront from './CardFront';
import CardBack from './CardBack';

interface Props {
  label: string;
  name: string;
  desc: string;
  tech: string[];
  link: string | null;
  linkLabel: string;
  crystalColor: string[];
  featured?: boolean;
}

export default function NightMarketCard({
  name, desc, tech, link, label, linkLabel, crystalColor, featured = false
}: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`${styles.card} ${featured ? styles.featured : styles.side} ${flipped ? styles.flipped : ''}`}
      onClick={() => setFlipped(f => !f)}
      role="button"
      aria-label={`${name} — click to reveal`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped(f => !f)}
    >
      <div className={styles.inner}>
        <CardFront label={label} crystalColor={crystalColor} featured={featured} />
        <CardBack
          name={name}
          desc={desc}
          tech={tech}
          link={link}
          linkLabel={linkLabel}
          featured={featured}
        /> 
      </div>
    </div>
  );
}
