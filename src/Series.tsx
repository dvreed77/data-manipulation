export class Series {
  values?: number[];
  constructor(values?: number[]) {
    if (values) {
      this.values = values;
    }
  }

  copy() {
    if (!this.values) return new Series();

    return new Series([...this.values]);
  }

  generate(nRows = 10) {
    this.values = Array.from({ length: nRows }, (_, i) => i);
    return this;
  }

  lag(n: number, trim = false) {
    if (!this.values) return this;
    for (let i = 0; i < n; i++) {
      this.values.unshift(NaN);
    }

    if (trim) {
      this.values = this.values.slice(0, -n);
    }

    return this;
  }

  draw({ cellSize = 10, x = 10, y = 10 }) {
    if (!this.values) return null;
    return (
      <g transform={`translate(${x}, ${y})`}>
        {this.values.map((c, i) => (
          <g key={i}>
            <rect
              x={0}
              y={i * (cellSize + 1)}
              width={cellSize}
              height={cellSize}
              fill={"yellow"}
            />
            <text
              x={cellSize / 2}
              y={i * (cellSize + 1) + cellSize / 2}
              fontSize={cellSize * 0.5}
              textAnchor="middle"
              alignmentBaseline="mathematical"
            >
              {isNaN(c) ? "--" : c}
            </text>
          </g>
        ))}
      </g>
    );
  }
}
