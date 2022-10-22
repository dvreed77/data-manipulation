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
  cellGap = 1;
  cellSize = 20;
  gap1 = 10;
  gap2 = 10;
  marginTop = 10;
  marginLeft = 10;
  marginRight = 10;
  marginBottom = 10;
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

  transform({ gap = 0, feWindow = 0, forecastHorizon = 1 }) {
    if (!this.columns) return this;

    const newColumns: Series[] = [];
    this.columns.forEach((c) => {
      for (let i = 0; i < feWindow; i++) {
        const nc = c.copy().lag(i + gap, true);
        newColumns.push(nc);
      }
    });
    this.columns = newColumns;
    this.target = this.target?.copy().lag(-forecastHorizon, true);
    return this;
  }

  get width() {
    return (
      this.cellSize + this.gap1 + this.dataWidth + this.gap2 + this.cellSize
    );
  }

  get dataWidth() {
    return (
      this.columns.length * this.cellSize +
      (this.columns.length - 1) * this.cellGap
    );
  }

  draw() {
    if (!this.columns) return null;

    const cellSize = this.cellSize;
    return (
      <g transform={`translate(${this.marginLeft}, ${this.marginTop})`}>
        {/* Draw Index */}
        <g>{ensure(this.timeIndex).draw({ cellSize })}</g>

        {/* Draw Data */}
        <g transform={`translate(${this.cellSize + this.gap1}, 0)`}>
          {this.columns.map((s, i) => (
            <g
              transform={`translate(${i * (cellSize + this.cellGap)}, ${0})`}
              key={i}
            >
              {s.draw({ cellSize })}
            </g>
          ))}
        </g>

        {/* Draw Target */}
        <g
          transform={`translate(${
            this.cellSize + this.gap1 + this.dataWidth + this.gap2
          }, 0)`}
        >
          {ensure(this.target).draw({ cellSize })}
        </g>
      </g>
    );
  }
}
