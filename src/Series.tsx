import { colorGenerator } from "./utils";

type Cell = {
  value: string;
  color: string;
};

export class Series {
  values?: Cell[];
  palette = "Greens";
  constructor(values?: number[]) {
    if (values) {
      const gen = colorGenerator({
        palette: this.palette,
        nColors: values.length,
      });
      this.values = values.map((v, i) => ({
        value: v.toString(),
        color: gen(i),
      }));
    }
  }

  copy() {
    if (!this.values) return new Series();

    const s = new Series();
    s.values = this.values.map((v) => ({ ...v }));
    return s;
  }

  generate(nRows = 10, prefix = "") {
    const gen = colorGenerator({
      palette: this.palette,
      nColors: nRows,
    });
    this.values = Array.from({ length: nRows }, (_, i) => ({
      value: `${prefix}${i}`,
      color: gen(i),
    }));
    return this;
  }

  lag(n: number, trim = false) {
    if (!this.values) return this;

    if (n === 0) return this;

    if (n > 0) {
      for (let i = 0; i < n; i++) {
        this.values.unshift({ value: "--", color: "white" });
      }

      if (trim) {
        this.values = this.values.slice(0, -n);
      }
    }

    if (n < 0) {
      for (let i = 0; i < -n; i++) {
        this.values.push({ value: "--", color: "white" });
      }

      if (trim) {
        this.values = this.values.slice(-n);
      }
    }

    return this;
  }

  draw({ cellSize = 10, x = 10, y = 10 }) {
    if (!this.values) return null;
    return (
      <g>
        {this.values.map(({ value, color }, i) => (
          <g key={i}>
            <rect
              x={0}
              y={i * (cellSize + 1)}
              width={cellSize}
              height={cellSize}
              fill={color}
            />
            <text
              x={cellSize / 2}
              y={i * (cellSize + 1) + cellSize / 2}
              fontSize={cellSize * 0.4}
              textAnchor="middle"
              alignmentBaseline="mathematical"
            >
              {value}
            </text>
          </g>
        ))}
      </g>
    );
  }
}
