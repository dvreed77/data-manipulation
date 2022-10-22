export function roundNearest(num: number, step: number) {
  return Math.round(num / step) * step;
}
