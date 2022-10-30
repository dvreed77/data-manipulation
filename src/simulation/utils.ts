import { Row } from "./types";

export function generateData(effectiveGap?: number): Row[] {
  const nDays = 100;
  const today = new Date();
  const day = 60 * 60 * 24 * 1000;
  const gap = 30;
  const startDate = new Date(today.getTime() - day * (nDays + gap));
  const data = [];
  for (let i = 0; i < nDays; i++) {
    const daily = Math.cos(i);
    const weekly = Math.cos(i / 7);
    const monthly = Math.cos(i / 30);
    const yearly = Math.cos(i / 365);
    const seasonal = Math.cos(i / 90);
    data.push({
      key: i,
      date: new Date(startDate.getTime() + i * day),
      f_1: i,
      sales: 0.2 * weekly + 0.4 * monthly + yearly + seasonal + 0.1 * daily,
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
  const minValue = Math.min(
    ...data.map((d) => d.sales).filter((d) => !isNaN(d))
  );
  const maxValue = Math.max(
    ...data.map((d) => d.sales).filter((d) => !isNaN(d))
  );

  const normalize = data.map((d) => ({
    ...d,
    sales: Math.round(
      ((d.sales - minValue) / (maxValue - minValue)) * 1000 + 100
    ),
  }));
  return normalize;
}
