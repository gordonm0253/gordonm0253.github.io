'use client';

import { useState } from 'react';
import styles from './NightMarketCard.module.css';
import CardFront from './CardFront';
import CardBack from './CardBack';
import type { CrystalColor } from '@/lib/projectColors';

interface Props {
  label: string;
  name: string;
  desc: string;
  tech: string[];
  crystalColor: CrystalColor;
  featured?: boolean;
  active?: boolean;
  onSelect?: () => void;
}

export default function NightMarketCard({
  name,
  desc,
  tech,
  label,
  crystalColor,
  featured = false,
  active = false,
  onSelect,
}: Props) {
  const [flipped, setFlipped] = useState(false);

  const reveal = () => {
    onSelect?.();
    setFlipped((isFlipped) => !isFlipped);
  };

  const cardClassName = [
    styles.card,
    featured ? styles.featured : styles.side,
    active ? styles.active : '',
    flipped ? styles.flipped : '',
  ].join(' ');

  return (
    <div
      className={cardClassName}
      onClick={reveal}
      role="button"
      aria-label={`${name} — click to reveal`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && reveal()}
    >
      <div className={styles.inner}>
        <CardFront label={label} crystalColor={crystalColor} featured={featured} active={active} />
        <CardBack
          name={name}
          desc={desc}
          tech={tech}
          featured={featured}
        />
      </div>
    </div>
  );
}
