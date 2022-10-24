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
  marginTop = 60;
  marginLeft = 10;
  marginRight = 10;
  marginBottom = 10;
  name = "User Uploaded Data";
  constructor(columns?: Series[]) {
    if (columns) {
      this.target = new Series().generate(columns[0].values?.length);
      this.timeIndex = new Series().generate(columns[0].values?.length);
      this.columns = columns;
    }
  }

  generate(nCols = 3, nRows = 15, start = 0) {
    this.timeIndex = new Series().generate(nRows, "d_", start);
    this.target = new Series().generate(nRows, "t_", start);
    this.columns = Array.from({ length: nCols }, () =>
      new Series().generate(nRows, "", start)
    );
    return this;
  }

  copy(): DataFrame {
    const df = new DataFrame();
    df.columns = this.columns.map((c) => c.copy());
    df.target = ensure(this.target).copy();
    df.timeIndex = ensure(this.timeIndex).copy();

    return df;
  }

  transform({ gap = 0, feWindow = 0, forecastHorizon = 1 }) {
    if (!this.columns) return this;

    const lastTime = ensure(this.timeIndex?.values)[
      ensure(this.timeIndex?.values?.length) - 1
    ];
    for (let i = 0; i < gap; i++) {
      ensure(this.timeIndex?.values).push({
        prefix: lastTime.prefix,
        value: lastTime.value + i + 1,
        color: lastTime.color,
      });
    }

    const newColumns: Series[] = [];
    this.columns.forEach((c) => {
      for (let i = 0; i < feWindow; i++) {
        const nc = c.copy().lag(i + gap, false);
        newColumns.push(nc);
      }
    });
    this.columns = newColumns;
    this.target = this.target?.copy().lag(-forecastHorizon, true);

    const lastGoodIdx =
      ensure(this.target?.values?.length) - forecastHorizon - 1;

    const lastTarget = ensure(this.target?.values)[lastGoodIdx];

    for (let i = 1; i < forecastHorizon + gap + 1; i++) {
      ensure(this.target?.values)[lastGoodIdx + i] = {
        prefix: lastTarget.prefix,
        value: lastTarget.value + i,
        color: "red",
      };
    }
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
      <>
        <g transform={`translate(${this.marginLeft}, 30)`}>
          <text fontSize={12}>{this.name}</text>
        </g>
        <g transform={`translate(${this.marginLeft}, ${this.marginTop - 5})`}>
          <text
            x={this.cellSize / 2}
            y={0}
            fontSize={this.cellSize * 0.4}
            textAnchor="middle"
          >
            idx
          </text>
          <g transform={`translate(${this.cellSize + this.gap1}, 0)`}>
            {this.columns.map((s, i) => (
              <g
                transform={`translate(${i * (cellSize + this.cellGap)}, ${0})`}
                key={i}
              >
                <text
                  x={this.cellSize / 2}
                  y={0}
                  fontSize={this.cellSize * 0.4}
                  textAnchor="middle"
                >
                  {`f_${i}`}
                </text>
              </g>
            ))}
          </g>
          <g
            transform={`translate(${
              this.cellSize + this.gap1 + this.dataWidth + this.gap2
            }, 0)`}
          >
            <text
              x={this.cellSize / 2}
              y={0}
              fontSize={this.cellSize * 0.4}
              textAnchor="middle"
            >
              T
            </text>
          </g>
        </g>
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
      </>
    );
  }
}
