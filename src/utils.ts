import * as d3 from "d3";

export function roundNearest(num: number, step: number) {
  return Math.round(num / step) * step;
}

const palettes: { [key: string]: (t: number) => string } = {
  BuGn: d3.interpolateBuGn,
  BuPu: d3.interpolateBuPu,
  GnBu: d3.interpolateGnBu,
  Greens: d3.interpolateGreens,
};

export function colorGenerator({ palette = "BuGn", nColors = 10 }) {
  const interpolate = palettes[palette];

  const scale = d3
    .scaleLinear()
    .domain([0, nColors - 1])
    .range([0.05, 0.6]);
  return (idx: number) => d3.rgb(interpolate(scale(idx))).formatHex();
}

function ensure<T>(value: T | undefined | null): T {
  if (value === undefined || value === null) {
    throw new Error("Value is undefined");
  }
  return value;
}
