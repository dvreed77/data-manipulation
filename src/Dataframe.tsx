import { useContext } from "react";
import { ThemeContext } from "./App";
import { Series, SeriesRenderer } from "./Series";

const daysOfWeek = ["M", "T", "W", "Th", "F", "Sa", "Su"];
export class DataFrame {
  columns: Series[];
  target: Series;
  timeIndex: Series;

  public name = "df";
  public nCols = 2;
  public nRows = 20;
  public start = 0;

  constructor(data: Partial<DataFrame>) {
    Object.assign(this, data);

    const { nCols, nRows, start } = this;

    this.timeIndex = new Series({
      nRows,
      prefix: "d_",
      start,
      name: "D",
      fillColor: "#EAEFF9",
      borderColor: "#C8D2E6",
    });
    this.target = new Series({
      nRows,
      prefix: "t_",
      start,
      name: "T",
      fillColor: "#DCE3F0",
      borderColor: "#C8D2E6",
    });
    this.columns = Array.from(
      { length: nCols },
      (_, i) =>
        new Series({
          nRows,
          start,
          name: `f_${i}`,
          fillColor: "#F5F8FC",
        })
    );
    return this;
  }

  copy(data: Partial<DataFrame> = {}): DataFrame {
    const { nRows, start, nCols, name } = { ...this, ...data };
    return new DataFrame({ nRows, start, nCols, name });
  }

  private transformData({ gap = 0, feWindow = 1, forecastHorizon = 0 }) {
    const tFeature = this.timeIndex.copy({
      formatter: (d) => daysOfWeek[d.value % 7],
      name: "dow",
    });
    tFeature.values = tFeature.values.map((d) => ({
      value: d.value,
      prefix: d.prefix,
      color: d.color,
      textColor: d.textColor,
    }));

    const newColumns: Series[] = [tFeature];
    this.columns.forEach((c) => {
      for (let i = 0; i < feWindow; i++) {
        const newColumnName = `${c.name} Lag(${i + gap})`;

        const nc = c.copy().lag(i + gap, false);
        nc.name = newColumnName;
        newColumns.push(nc);
      }
    });
    this.columns = newColumns;
    this.nCols = newColumns.length;
  }

  private lagTarget({ gap = 0, feWindow = 1, forecastHorizon = 0 }) {
    // TODO: HACK to get target values right
    const targetValues = this.target.values.map((d) => d.value);

    this.target.values = this.timeIndex.values.map((v) => ({
      prefix: "t_",
      value: v.value + forecastHorizon,
      color: targetValues.includes(v.value + forecastHorizon)
        ? "#DCE3F0"
        : "#8698BA",
      textColor: targetValues.includes(v.value + forecastHorizon)
        ? "#606F8C"
        : "#DCE3F0",
    }));
  }

  transform({ gap = 0, feWindow = 0, forecastHorizon = 1 }) {
    if (!this.columns) return this;

    const lastTime = this.timeIndex.values[this.timeIndex.values.length - 1];

    if (!lastTime) return this;
    for (let i = 0; i < gap; i++) {
      this.timeIndex.values.push({
        prefix: lastTime.prefix,
        value: lastTime.value + i + 1,
        color: lastTime.color,
        textColor: lastTime.textColor,
      });
    }

    this.timeIndex.nRows = this.timeIndex.values.length;

    this.transformData({ gap, feWindow, forecastHorizon });
    this.lagTarget({ gap, feWindow, forecastHorizon });

    return this;
  }

  get nRows2() {
    return this.target.values.length;
  }

  get nRows3() {
    const targetLength = this.target.values.length;
    const timeIndexLength = this.timeIndex.values.length;
    const columnsLength = Math.max(...this.columns.map((d) => d.values.length));

    return Math.max(targetLength, timeIndexLength, columnsLength);
  }

  draw() {
    return null;
  }
}

export function DataFrameRenderer({
  dataframe: df,
  drawTarget = true,
}: {
  dataframe: DataFrame;
  drawTarget?: boolean;
}) {
  const {
    cellGap,
    cellSize,
    gap1,
    gap2,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
  } = useContext(ThemeContext);

  const dataWidth = cellSize * df.nCols + cellGap * (df.nCols - 1);
  const dfWidth = cellSize + gap1 + dataWidth + gap2 + cellSize;
  return (
    <>
      <g transform={`translate(${marginLeft}, 30)`}>
        <text fontSize={12}>{df.name}</text>
      </g>

      <g transform={`translate(${marginLeft}, ${marginTop})`}>
        {/* Draw Index */}
        <g>
          <SeriesRenderer series={df.timeIndex} />
        </g>
        {/* Draw Data */}
        <g transform={`translate(${cellSize + gap1}, 0)`}>
          {df.columns.map((s, i) => (
            <g
              transform={`translate(${i * (cellSize + cellGap)}, ${0})`}
              key={i}
            >
              <SeriesRenderer series={s} />
            </g>
          ))}
        </g>
        {/* Draw Target */}

        <g transform={`translate(${cellSize + gap1 + dataWidth + gap2}, 0)`}>
          <SeriesRenderer series={df.target} />
        </g>
      </g>
      <g transform={`translate(${marginLeft}, ${marginTop - 5})`}>
        <text
          x={cellSize / 2}
          y={0}
          fontSize={cellSize * 0.4}
          textAnchor="middle"
        >
          {df.timeIndex.name}
        </text>
        <g transform={`translate(${cellSize + gap1}, 0)`}>
          {df.columns.map((s, i) => (
            <g
              transform={`translate(${i * (cellSize + cellGap)}, ${0})`}
              key={i}
            >
              <text
                x={cellSize / 2}
                y={0}
                fontSize={cellSize * 0.4}
                transform={`translate(4, 10) rotate(-45)`}
              >
                {s.name}
              </text>
            </g>
          ))}
        </g>

        <g transform={`translate(${cellSize + gap1 + dataWidth + gap2}, 0)`}>
          <text
            x={cellSize / 2}
            y={0}
            fontSize={cellSize * 0.4}
            textAnchor="middle"
          >
            {df.target.name}
          </text>
        </g>
      </g>
    </>
  );
}
