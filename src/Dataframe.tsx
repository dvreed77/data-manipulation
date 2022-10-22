import { Series } from "./Series";

export class DataFrame {
  columns: Series[] = [];
  constructor(columns?: Series[]) {
    if (columns) {
      this.columns = columns;
    }
  }

  generate(nCols = 3, nRows = 15) {
    this.columns = Array.from({ length: nCols }, () =>
      new Series().generate(nRows)
    );
    return this;
  }

  copy() {
    return new DataFrame(this.columns.map((c) => c.copy()));
  }

  transform({ gap = 0, feWindow = 0 }) {
    if (!this.columns) return this;

    const newColumns: Series[] = [];
    this.columns.forEach((c) => {
      for (let i = 0; i < feWindow; i++) {
        const nc = c.copy().lag(i + gap, true);
        newColumns.push(nc);
      }
    });
    this.columns = newColumns;
    return this;
  }

  draw({ cellSize = 10 }) {
    if (!this.columns) return null;
    const x = 10;
    const y = 10;
    return (
      <g transform={`translate(${x}, ${y})`}>
        {this.columns.map((s, i) => (
          <g key={i}>{s.draw({ cellSize, x: i * (cellSize + 1), y: 0 })}</g>
        ))}
      </g>
    );
  }
}
