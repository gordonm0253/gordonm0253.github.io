'use client';

import styles from './DiceRow.module.css';

const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

function DieFace({
  value,
  state,
  onClick,
}: {
  value: number;
  state: 'idle' | 'scoring' | 'kept' | 'bust' | 'rolling';
  onClick?: () => void;
}) {
  const pips = PIPS[value] ?? [];
  const clickable = state === 'scoring';

  return (
    <div
      className={`${styles.die} ${styles[state]} ${clickable ? styles.clickable : ''}`}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      aria-label={clickable ? `Keep die showing ${value}` : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable && onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <svg viewBox="0 0 100 100" className={styles.svg}>
        {pips.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={10} className={styles.pip} />
        ))}
      </svg>
    </div>
  );
}

export type DieState = 'idle' | 'scoring' | 'kept' | 'bust' | 'rolling';

interface Props {
  dice: number[];
  states: DieState[];
  onToggleKeep?: (index: number) => void;
}

export default function DiceRow({ dice, states, onToggleKeep }: Props) {
  return (
    <div className={styles.row}>
      {dice.map((val, i) => (
        <DieFace
          key={i}
          value={val}
          state={states[i]}
          onClick={onToggleKeep ? () => onToggleKeep(i) : undefined}
        />
      ))}
    </div>
  );
}
