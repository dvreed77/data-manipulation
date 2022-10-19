import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import * as d3 from "d3";

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
}

class DataFrame {
  series: Series[] = [];
  constructor(series: Series[]) {
    this.series = series;
  }
}

class Series {
  values: number[];
  constructor(values: number[]) {
    this.values = values;
  }

  lag(n: number, trim = false) {
    for (let i = 0; i < n; i++) {
      this.values.unshift(NaN);
    }

    if (trim) {
      this.values = this.values.slice(0, -n);
    }
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
  const cellSize = 15;

  const nRows = 20;

  const columns = [
    { name: "Date", palette: "BuGn" },
    { name: "F1", palette: "BuPu" },
    { name: "Target", palette: "GnBu" },
  ];

  return (
    <div className="App">
      <svg width={1000} height={1000}>
        {columns.map(({ palette }, i) => (
          <Column
            nRows={nRows}
            cellSize={cellSize}
            x={i * (cellSize + 1)}
            palette={palette}
          />
        ))}
      </svg>
    </div>
  );
}

export default App;
