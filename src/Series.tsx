import { useContext } from "react";
import { ThemeContext } from "./App";
import { colorGenerator } from "./utils";

type Cell = {
  value: number;
  color: string;
  prefix?: string;
  textColor: string;
};

export class Series {
  values: Cell[];
  private palette = "Greens";

  public nRows = 10;
  public prefix = "";
  public start = 0;
  public name = "S";
  public textColor = "#606F8C";
  public borderColor = "#C8D2E6";
  public fillColor = "white";
  public formatter = (d: Cell) =>
    isNaN(d.value) ? "--" : `${d.prefix}${d.value}`;

  constructor(data: Partial<Series>) {
    Object.assign(this, data);
    const gen = colorGenerator({
      palette: this.palette,
      nColors: this.nRows,
    });
    this.values = Array.from({ length: this.nRows }, (_, i) => ({
      value: i + this.start,
      prefix: this.prefix,
      color: this.fillColor,
      textColor: this.textColor,
    }));
    return this;
  }

  copy(data: Partial<Series> = {}) {
    const {
      nRows,
      prefix,
      start,
      name,
      textColor,
      borderColor,
      fillColor,
      formatter,
    } = { ...this, ...data };

    return new Series({
      nRows,
      prefix,
      start,
      name,
      textColor,
      borderColor,
      fillColor,
      formatter,
    });
  }

  lag(n: number, trim = false) {
    if (!this.values) return this;

    if (n === 0) return this;

    if (n > 0) {
      for (let i = 0; i < n; i++) {
        this.values.unshift({
          value: NaN,
          color: "white",
          textColor: this.textColor,
        });
      }

      if (trim) {
        this.values = this.values.slice(0, -n);
      }
    }

    if (n < 0) {
      for (let i = 0; i < -n; i++) {
        this.values.push({
          value: NaN,
          color: "white",
          textColor: this.textColor,
        });
      }

      if (trim) {
        this.values = this.values.slice(-n);
      }
    }

    return this;
  }
}

export function SeriesRenderer({ series: s }: { series: Series }) {
  const { cellSize, cellGap } = useContext(ThemeContext);

  const { values } = s;
  return (
    <g>
      {values.map(({ value, color, prefix, textColor }, i) => (
        <g key={i}>
          <rect
            x={0}
            y={i * (cellSize + cellGap)}
            width={cellSize}
            height={cellSize}
            fill={color}
            stroke={s.borderColor}
            strokeWidth={0.5}
          />
          <text
            x={cellSize / 2}
            y={i * (cellSize + cellGap) + cellSize / 2}
            fontSize={cellSize * 0.4}
            textAnchor="middle"
            alignmentBaseline="mathematical"
            fill={textColor}
            fontWeight={400}
          >
            {s.formatter({ value, color, prefix, textColor })}
          </text>
        </g>
      ))}
    </g>
  );
}
