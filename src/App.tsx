import { MouseEventHandler, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import * as d3 from "d3";
import { Slider } from "@mui/material";
import { DataFrame } from "./Dataframe";
import { ProblemConfig } from "./types";
import { ProblemConfigComponent } from "./ProblemConfigComponent";

const palettes: { [key: string]: (t: number) => string } = {
  BuGn: d3.interpolateBuGn,
  BuPu: d3.interpolateBuPu,
  GnBu: d3.interpolateGnBu,
};

type T_Cell = [number, number];
class Window {
  cells: T_Cell[];
  constructor(cells: T_Cell[]) {
    this.cells = cells;
  }

  draw({ cellSize = 10 }) {
    const nCells = this.cells.length;
    const x1 = this.cells[0][0] * cellSize;
    const y1 = this.cells[0][1] * cellSize;
    const x2 = (this.cells[nCells - 1][0] + 1) * cellSize;
    const y2 = (this.cells[nCells - 1][1] + 1) * cellSize;
    const width = x2 - x1;
    const height = y2 - y1;

    return (
      <rect
        x={x1}
        y={y1}
        width={width}
        height={height}
        fill="None"
        stroke="black"
      />
    );
  }
}

function getColors({ palette = "BuGn", nColors = 10 }) {
  const interpolate = palettes[palette];
  const colors = [];
  for (let i = 0; i < nColors; ++i) {
    colors.push(d3.rgb(interpolate(i / (nColors - 1))).formatHex());
  }
  return colors;
}

const Column = ({
  nRows = 10,
  cellSize = 10,
  palette = "BuGn",
  x = 0,
  y = 0,
}) => {
  const colors = getColors({ palette, nColors: nRows });
  return (
    <g transform={`translate(${x}, ${y})`}>
      {colors.map((c, i) => (
        <rect
          x={0}
          y={i * (cellSize + 1)}
          width={cellSize}
          height={cellSize}
          fill={c}
        />
      ))}
    </g>
  );
};

function App() {
  const cellSize = 20;

  const w = new Window([
    // [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ]);

  const [problemConfig, setProblemConfig] = useState<ProblemConfig>({
    featureEngineeringStart: -5,
    featureEngineeringEnd: -3,
    forecastHorizon: 3,
  });

  let df1 = new DataFrame().generate(3, 20);

  let df2 = df1.copy().transform({
    gap: -problemConfig.featureEngineeringEnd,
    feWindow:
      problemConfig.featureEngineeringEnd -
      problemConfig.featureEngineeringStart,
    forecastHorizon: problemConfig.forecastHorizon,
  });

  const handleProblemChange = (newProblemConfig: ProblemConfig) => {
    setProblemConfig(newProblemConfig);
  };

  const forecastPt = 10;
  return (
    <div className="App">
      <div>
        <h2>
          Feature Engineering Window Width:{" "}
          {problemConfig.featureEngineeringEnd -
            problemConfig.featureEngineeringStart}
        </h2>
        <h2>
          Feature Engineering Window:{" "}
          {`${-problemConfig.featureEngineeringStart} ${-problemConfig.featureEngineeringEnd}`}
        </h2>
        <h2>Data Gap: {-problemConfig.featureEngineeringEnd}</h2>
        <h2>Forecast Horizon: {problemConfig.forecastHorizon}</h2>
      </div>
      <ProblemConfigComponent
        problemConfig={problemConfig}
        featureEngineeringMax={10}
        forecastHorizonMax={10}
        onChange={handleProblemChange}
      />
      <svg width={1000} height={1000}>
        {df1.draw()}

        <rect
          x={df1.marginLeft + df1.cellSize + df1.gap1} //TODO(dreed): hardcoding gap here
          y={
            df1.marginTop +
            (df1.cellSize + df1.cellGap) *
              (forecastPt + problemConfig.featureEngineeringStart) +
            df1.cellSize
          }
          //TODO(dreed): hardcoding padding of 1 here
          width={df1.dataWidth}
          height={
            (cellSize + 1) *
            (problemConfig.featureEngineeringEnd -
              problemConfig.featureEngineeringStart)
          }
          stroke="black"
          fill="none"
        />
        <rect
          x={
            df1.marginLeft + df1.cellSize + df1.gap1 + df1.dataWidth + df1.gap2
          }
          y={
            df1.marginTop +
            (cellSize + 1) * (forecastPt + problemConfig.forecastHorizon)
          }
          width={cellSize}
          height={cellSize}
          stroke="black"
          fill="none"
        />

        <g transform={`translate(${df1.width + 50}, 0)`}>
          {df2.draw()}
          <rect
            x={df2.marginLeft + df2.cellSize + df2.gap1}
            y={df2.marginTop + (df2.cellSize + df2.cellGap) * forecastPt}
            width={df2.dataWidth}
            height={cellSize}
            stroke="black"
            fill="none"
          />
          <rect
            x={
              df2.marginLeft +
              df2.cellSize +
              df2.gap1 +
              df2.dataWidth +
              df2.gap2
            } //TODO(dreed): hardcoding gap here
            y={df2.marginTop + (df2.cellSize + df2.cellGap) * forecastPt}
            //TODO(dreed): hardcoding padding of 1 here
            width={cellSize}
            height={cellSize}
            stroke="black"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

export default App;
