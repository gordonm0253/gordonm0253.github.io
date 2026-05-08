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

function hashText(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getProjectCrystalColor(seed: string): CrystalColor {
  return PALETTES[hashText(seed) % PALETTES.length];
}
