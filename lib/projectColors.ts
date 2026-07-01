export type CrystalColor = readonly [string, string, string, string];

const PALETTES: readonly CrystalColor[] = [
  ['#3a7ab8', '#1a4a8a', '#6ab8f0', '#3a8fd4'],
  ['#c84b4b', '#8a1a1a', '#e87070', '#c43030'],
  ['#1a7a5a', '#0a4a3a', '#2ab88a', '#1a7a5a'],
  ['#5a4ab8', '#2a2a8a', '#8a70e8', '#5a50c4'],
  ['#b8782e', '#704018', '#f0a85a', '#c47a30'],
  ['#9a4f8f', '#5a2754', '#d47ac8', '#a84898'],
  ['#6c7a2a', '#364616', '#b8c85a', '#7f9432'],
  ['#2f8a96', '#165260', '#62d0dc', '#2c9cad'],
] as const;

export function getProjectCrystalColor(index: number): CrystalColor {
  return PALETTES[index % PALETTES.length];
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Randomly assigns a palette to each item such that no two cards in the
 * same row (left neighbor) or same column (directly above) share a color.
 * Falls back to any non-repeating palette if the grid is narrower than the
 * available palette count.
 */
export function assignRandomCrystalColors(count: number, columns: number): CrystalColor[] {
  const cols = Math.max(1, columns);
  const assigned: CrystalColor[] = [];

  for (let i = 0; i < count; i += 1) {
    const left = i % cols !== 0 ? assigned[i - 1] : undefined;
    const above = i - cols >= 0 ? assigned[i - cols] : undefined;

    const candidates = shuffle(PALETTES).filter(
      (palette) => palette !== left && palette !== above
    );

    assigned.push(candidates[0] ?? shuffle(PALETTES)[0]);
  }

  return assigned;
}
