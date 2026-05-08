export type Rgb = readonly [number, number, number];

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function easeInOutQuad(value: number) {
  return value < 0.5
    ? 2 * value * value
    : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

export function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

export function lerpRgb(from: Rgb, to: Rgb, amount: number) {
  const channels = from.map((channel, index) => (
    Math.round(lerp(channel, to[index], amount))
  ));

  return `rgb(${channels.join(',')})`;
}
