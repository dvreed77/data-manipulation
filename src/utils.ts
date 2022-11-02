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

export function ensure<T>(value: T | undefined | null): T {
  if (value === undefined || value === null) {
    throw new Error("Value is undefined");
  }
  return value;
}

interface IProps {
  nDays?: number;
  effectiveGap?: number;
  endDate?: Date;
  startDate?: Date;
  gap?: number;
}

type Row = {
  key: number;
  target: number;
  date: Date;
};

export function generateData({
  nDays = 100,
  effectiveGap,
  endDate = new Date(),
  startDate,
  gap = 0,
}: IProps = {}): Row[] {
  const day = 60 * 60 * 24 * 1000;

  if (endDate && !startDate) {
    startDate = new Date(endDate.getTime() - day * (nDays + gap - 1));
  }

  const anchor = Math.round(new Date().getTime() / day);
  startDate = startDate || new Date();

  const signals: [number, (i: number) => number][] = [
    [0.5, (i) => Math.cos(i)],
    [2, (i) => Math.cos(i / 7)],
    [2, (i) => Math.cos(i / 30)],
    [0.5, (i) => Math.cos(i / 90)],
    [0.1, (i) => Math.cos(i / 365)],
  ];

  const max = signals.reduce((acc, [weight, signal]) => acc + weight, 0);

  const data = [];
  for (let i = 0; i < nDays; i++) {
    data.push({
      key: i,
      date: new Date(startDate.getTime() + i * day),
      target: signals.reduce(
        (acc, [weight, signal]) => acc + weight * signal(anchor + i),
        0
      ),
    });
  }

  if (effectiveGap) {
    for (let i = 0; i < effectiveGap; i++) {
      data.push({
        key: i,
        date: new Date(startDate.getTime() + (nDays + i) * day),
        target: NaN,
      });
    }
  }

  const normalize = data.map((d) => ({
    ...d,
    target: Math.round(((d.target - max) / (2 * max)) * 50 + 60),
  }));
  return normalize;
}
