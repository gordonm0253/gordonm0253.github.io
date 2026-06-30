export function rollDice(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 6) + 1);
}

export interface ScoreResult {
  points: number;
  kept: number[];
  leftover: number[];
}

// Scoring rules (exact):
// - Six-straight (1-2-3-4-5-6): 1500 pts, uses all 6 dice
// - Five-straight (1-2-3-4-5 or 2-3-4-5-6): 1000 pts, uses 5 dice
// - Three pairs (6 dice forming exactly 3 pairs): 500 pts, uses all 6 dice
// - Three-of-a-kind of N: N×100 pts (N=1 → 1000); each extra same-face die doubles
// - Single 1: 100 pts each
// - Single 5: 50 pts each
// Straights and three-pairs are only scored when the full set of dice qualifies;
// they cannot be split with leftover dice.
export function scoreDice(dice: number[]): ScoreResult {
  const sorted = [...dice].sort((a, b) => a - b);
  const n = sorted.length;
  const counts: Record<number, number> = {};
  for (const d of sorted) counts[d] = (counts[d] ?? 0) + 1;

  const has = (face: number, qty: number) => (counts[face] ?? 0) >= qty;

  // Six-straight: exactly [1,2,3,4,5,6]
  if (
    n === 6 &&
    has(1,1) && has(2,1) && has(3,1) && has(4,1) && has(5,1) && has(6,1) &&
    Object.values(counts).every(c => c === 1)
  ) {
    return { points: 1500, kept: sorted, leftover: [] };
  }

  // Five-straight: all 5 of [1,2,3,4,5] or [2,3,4,5,6] present, each exactly once among those 5
  if (n >= 5) {
    for (const straight of [[1,2,3,4,5],[2,3,4,5,6]]) {
      if (straight.every(v => (counts[v] ?? 0) === 1)) {
        const leftover = sorted.filter(d => !straight.includes(d));
        return { points: 1000, kept: [...straight], leftover };
      }
    }
  }

  // Three pairs: exactly 6 dice, exactly 3 distinct faces each appearing exactly twice
  if (n === 6) {
    const faceEntries = Object.entries(counts);
    if (faceEntries.length === 3 && faceEntries.every(([, c]) => c === 2)) {
      return { points: 500, kept: sorted, leftover: [] };
    }
  }

  // Three-of-a-kind (and four/five/six of a kind), then single 1s and 5s
  let points = 0;
  const kept: number[] = [];
  const leftover: number[] = [];

  for (const face of [1, 2, 3, 4, 5, 6] as const) {
    const c = counts[face] ?? 0;
    if (c >= 3) {
      const base = face === 1 ? 1000 : face * 100;
      // Each die beyond the third doubles the score
      const score = base * Math.pow(2, c - 3);
      points += score;
      kept.push(...Array(c).fill(face));
    } else if (face === 1) {
      points += c * 100;
      if (c > 0) kept.push(...Array(c).fill(1));
    } else if (face === 5) {
      points += c * 50;
      if (c > 0) kept.push(...Array(c).fill(5));
    } else {
      if (c > 0) leftover.push(...Array(c).fill(face));
    }
  }

  return { points, kept, leftover };
}

export function isBust(dice: number[]): boolean {
  return scoreDice(dice).points === 0;
}

// All valid subsets of dice the player could legally keep (must score > 0)
// Used by the strategy simulator.
export function allKeepOptions(dice: number[]): { kept: number[]; points: number; leftover: number[] }[] {
  const results: { kept: number[]; points: number; leftover: number[] }[] = [];
  const n = dice.length;

  for (let mask = 1; mask < (1 << n); mask++) {
    const kept: number[] = [];
    const leftover: number[] = [];
    for (let i = 0; i < n; i++) {
      (mask & (1 << i) ? kept : leftover).push(dice[i]);
    }
    const { points } = scoreDice(kept);
    // The kept subset must itself be a valid scoring combination (no extra non-scoring dice)
    const { kept: scoringKept } = scoreDice(kept);
    if (points > 0 && scoringKept.length === kept.length) {
      results.push({ kept: [...kept].sort((a,b)=>a-b), points, leftover });
    }
  }

  // Deduplicate by kept-fingerprint
  const seen = new Set<string>();
  return results.filter(r => {
    const key = r.kept.join(',');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export interface Strategy {
  name: string;
  decide(turnTotal: number, diceLeft: number): 'bank' | 'roll';
}

export const PRESET_STRATEGIES: Strategy[] = [
  {
    name: 'Greedy',
    decide: (_total, diceLeft) => diceLeft > 0 ? 'roll' : 'bank',
  },
  {
    name: 'Conservative (≥300)',
    decide: (total) => total >= 300 ? 'bank' : 'roll',
  },
  {
    name: 'Adaptive',
    decide: (total, diceLeft) => (diceLeft <= 2 || total >= 500) ? 'bank' : 'roll',
  },
];

export function makeThresholdStrategy(bankAt: number, bankIfDice: number, alwaysRollBelow: number): Strategy {
  return {
    name: `Custom (≥${bankAt}pts or ≤${bankIfDice}🎲, force-roll<${alwaysRollBelow})`,
    decide: (total, diceLeft) => {
      if (total < alwaysRollBelow) return 'roll';
      if (total >= bankAt || diceLeft <= bankIfDice) return 'bank';
      return 'roll';
    },
  };
}

export interface SimResult {
  avgPoints: number;
  bustRate: number;
  histogram: number[]; // buckets: 0, 1-100, 101-300, 301-500, 501-1000, 1001+
}

const HIST_LABELS = ['0', '1–100', '101–300', '301–500', '501–1000', '1001+'];
export { HIST_LABELS };

function histBucket(pts: number): number {
  if (pts === 0) return 0;
  if (pts <= 100) return 1;
  if (pts <= 300) return 2;
  if (pts <= 500) return 3;
  if (pts <= 1000) return 4;
  return 5;
}

export function simulateStrategy(strategy: Strategy, turns: number): SimResult {
  let totalPoints = 0;
  let busts = 0;
  const histogram = [0, 0, 0, 0, 0, 0];

  for (let t = 0; t < turns; t++) {
    let turnTotal = 0;
    let diceLeft = 6;
    let busted = false;

    while (true) {
      const roll = rollDice(diceLeft);
      const { points, leftover } = scoreDice(roll);

      if (points === 0) {
        busted = true;
        break;
      }

      turnTotal += points;
      diceLeft = leftover.length;

      const decision = strategy.decide(turnTotal, diceLeft);
      if (decision === 'bank') break;

      // If all dice scored, set aside all and re-roll all 6
      if (diceLeft === 0) diceLeft = 6;
      // else set aside scoring dice and roll remaining
    }

    const earned = busted ? 0 : turnTotal;
    totalPoints += earned;
    if (busted) busts++;
    histogram[histBucket(earned)]++;
  }

  return {
    avgPoints: totalPoints / turns,
    bustRate: busts / turns,
    histogram: histogram.map(c => c / turns),
  };
}
