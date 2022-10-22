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
  });

  const handleProblemChange = (newProblemConfig: ProblemConfig) => {
    setProblemConfig(newProblemConfig);
  };
  return (
    <div className="App">
      <h2>
        {problemConfig.featureEngineeringStart},{" "}
        {problemConfig.featureEngineeringEnd}
      </h2>
      <ProblemConfigComponent
        problemConfig={problemConfig}
        featureEngineeringMax={10}
        forecastHorizonMax={10}
        onChange={handleProblemChange}
      />
      <svg width={1000} height={1000}>
        {/* {s.draw({ cellSize, x: 0, y: 0 })}
        {s.lag(1, true).draw({ cellSize, x: cellSize + 1, y: 0 })}
        {s.lag(1, true).draw({ cellSize, x: 2 * (cellSize + 1), y: 0 })}
        {s.lag(1, true).draw({ cellSize, x: 3 * (cellSize + 1), y: 0 })}
        {w.draw({ cellSize })} */}
        {df1.draw({ cellSize })}

        <g transform={`translate(${(cellSize + 1) * 3 + 50},0)`}>
          {df2.draw({ cellSize })}
        </g>
      </svg>
    </div>
  );
}

export default App;
