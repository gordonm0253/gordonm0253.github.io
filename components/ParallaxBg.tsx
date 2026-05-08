'use client';

import { useEffect, useRef } from 'react';
import styles from './ParallaxBg.module.css';
import { getScrollLength } from '@/lib/scroll';
import { easeInOutQuad, lerpRgb } from '@/lib/animation';

interface Props {
  scrollY: number;
}

export default function ParallaxBg({ scrollY }: Props) {
  const mtnRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const TOTAL = getScrollLength();
    const r = Math.min(scrollY / TOTAL, 1);

    let top: string;
    let bot: string;

    if (r < 0.22) {
      const t = easeInOutQuad(r / 0.22);
      top = lerpRgb([228, 150, 172], [14, 9, 42], t);
      bot = lerpRgb([98, 45, 115], [7, 5, 24], t);
    } else if (r < 0.50) {
      const t = easeInOutQuad((r - 0.22) / 0.28);
      top = lerpRgb([14, 9, 42], [5, 9, 22], t);
      bot = lerpRgb([7, 5, 24], [3, 4, 13], t);
    } else {
      const t = easeInOutQuad((r - 0.50) / 0.50);
      top = lerpRgb([5, 9, 22], [4, 7, 20], t);
      bot = lerpRgb([3, 4, 13], [2, 3, 11], t);
    }

    if (bgRef.current) {
      bgRef.current.style.background = `linear-gradient(to bottom, ${top}, ${bot})`;
    }

    if (mtnRef.current) {
      mtnRef.current.style.transform = `translateY(${scrollY * 0.04}px)`;
    }
  }, [scrollY]);

  return (
    <div className={styles.wrap}>
      <div ref={bgRef} className={styles.bg} />

      <div ref={mtnRef} className={`${styles.layer} ${styles.mtn}`}>
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M0 300V246L150 118L290 246L510 42L725 244L875 126L1045 248L1215 56L1440 170V300Z"
            fill="#241b38"
          />
          <path
            d="M0 300V268L130 172L260 264L520 112L748 268L962 154L1130 264L1346 92L1440 266V300Z"
            fill="#34234f"
            opacity="0.88"
          />
          <path
            d="M0 300V282L170 202L330 280L560 162L785 282L1010 198L1165 280L1325 168L1440 278V300Z"
            fill="#432b63"
            opacity="0.78"
          />
        </svg>
      </div>
    </div>
  );
}
