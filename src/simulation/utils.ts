import { Row } from "./types";

interface IProps {
  nDays?: number;
  effectiveGap?: number;
  endDate?: Date;
  startDate?: Date;
  gap?: number;
}

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
      f_1: i,
      sales: signals.reduce(
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
        f_1: i,
        sales: NaN,
      });
    }
  }

  const normalize = data.map((d) => ({
    ...d,
    sales: Math.round(((d.sales - max) / (2 * max)) * 50 + 60),
  }));
  return normalize;
}
