import { Series } from "./Series";

function ensure<T>(value: T | undefined | null): T {
  if (value === undefined || value === null) {
    throw new Error("Value is undefined");
  }
  return value;
}
export class DataFrame {
  columns: Series[] = [];
  target?: Series;
  timeIndex?: Series;
  constructor(columns?: Series[]) {
    if (columns) {
      this.target = new Series().generate(columns[0].values?.length);
      this.timeIndex = new Series().generate(columns[0].values?.length);
      this.columns = columns;
    }
  }

  generate(nCols = 3, nRows = 15) {
    this.timeIndex = new Series().generate(nRows);
    this.target = new Series().generate(nRows);
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
        <g transform={`translate(0,0)`}>
          {ensure(this.target).draw({ cellSize })}
        </g>
        {this.columns.map((s, i) => (
          <g
            transform={`translate(${cellSize + i * (cellSize + 1)}, ${0})`}
            key={i}
          >
            {s.draw({ cellSize })}
          </g>
        ))}
        <g
          transform={`translate(${
            cellSize + this.columns.length * (cellSize + 1)
          },0)`}
        >
          {ensure(this.target).draw({ cellSize })}
        </g>
      </g>
    );
  }
}
