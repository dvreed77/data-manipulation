import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { ThemeContext, useDataFrameDimensions } from "./App";
import { Bracket } from "./Bracket";
import { DataFrame, DataFrameRenderer } from "./Dataframe";
import { AppContext } from "./reducer";
import { roundNearest } from "./utils";
import * as d3 from "d3";

export const ModelTraining = () => {
  const {
    cellGap,
    cellSize,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    fpBorder,
    gap1,
    targetBorder,
    feBorder,
    gap2,
  } = useContext(ThemeContext);
  const { state } = useContext(AppContext);

  const { problemConfig } = state;

  let df1 = new DataFrame({ name: "User Uploaded Data" });

  let df2 = df1.copy({ name: "Transformed" }).transform({
    gap: -problemConfig.featureEngineeringEnd,
    feWindow:
      problemConfig.featureEngineeringEnd -
      problemConfig.featureEngineeringStart +
      1,
    forecastHorizon: problemConfig.forecastHorizon,
  });

  const [forecastPt, setForecastPt] = useState(10);
  // const forecastPt = 10;

  const df1Dims = useDataFrameDimensions(df1);
  const df2Dims = useDataFrameDimensions(df2);

  const maxRows = df2.nRows3;
  const height =
    marginTop + (cellSize + cellGap) * maxRows + cellGap + marginBottom;

  const xScale = d3
    .scaleLinear()
    .domain([0, df1.nRows3])
    .range([marginTop, marginTop + (cellSize + cellGap) * df1.nRows3]);

  const min = xScale(-problemConfig.featureEngineeringStart);
  const max = xScale(df1.nRows3 - problemConfig.featureEngineeringEnd - 1);

  const isPredicting = forecastPt >= df1.nRows3 - problemConfig.forecastHorizon;

  useEffect(() => {
    setForecastPt(10);
  }, [problemConfig]);
  const handleMouseDown: MouseEventHandler<SVGRectElement> = (e) => {
    let lastY = NaN;
    const initialStart = xScale(forecastPt);
    e.preventDefault();
    const handleMouseMove = (e2: MouseEvent) => {
      const dy = e2.pageY - e.pageY;
      if (dy === 0) return;
      const newY = initialStart + dy;

      if (newY === lastY) return;
      if (newY >= min && newY <= max) {
        setForecastPt(Math.round(xScale.invert(newY)));
        lastY = newY;
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", handleMouseMove);
      },
      { once: true }
    );
  };

  return (
    <svg width={700} height={height} className="select-none">
      <g
        transform={`translate(0, ${
          marginTop + (cellSize + cellGap) * forecastPt + 2
        })`}
      >
        <rect
          x={0}
          y={0}
          width={
            marginLeft +
            df1Dims.width +
            marginRight +
            +80 +
            marginLeft +
            df2Dims.width +
            marginRight
          }
          height={cellSize - 4}
          fill="orange"
          opacity={0.5}
          className="cursor-pointer"
          onMouseDown={handleMouseDown}
        />
        <g
          transform={`translate(${marginLeft + df1Dims.width + 50}, 2)`}
          className="pointer-events-none"
        >
          <line x1={-10} x2={15} y1={6} y2={6} stroke="#ffa52e" />
          <line x1={-10} x2={15} y1={12} y2={12} stroke="#ffa52e" />
          <line
            x1={-10}
            x2={15}
            y1={cellSize - 12}
            y2={cellSize - 12}
            stroke="#ffa52e"
          />
        </g>
      </g>

      {!isPredicting && (
        <rect
          x={marginLeft - 10}
          y={
            marginTop +
            (cellSize + cellGap) *
              (forecastPt + problemConfig.forecastHorizon) +
            2
          }
          width={df1Dims.width + 20}
          height={cellSize - 4}
          fill="red"
          opacity={0.5}
        />
      )}

      <rect
        x={marginLeft - 10}
        y={
          marginTop +
          (cellSize + cellGap) *
            (forecastPt + problemConfig.featureEngineeringStart) +
          2
        }
        width={df1Dims.width + 20}
        height={
          cellSize *
            (problemConfig.featureEngineeringEnd -
              problemConfig.featureEngineeringStart +
              1) -
          4
        }
        fill="green"
        opacity={0.5}
      />

      <DataFrameRenderer dataframe={df1} />

      {forecastPt < df1.nRows3 && (
        <rect
          x={marginLeft}
          y={marginTop + (cellSize + cellGap) * forecastPt}
          width={cellSize}
          height={cellSize}
          stroke={fpBorder}
          strokeWidth={2}
          fill="none"
        />
      )}

      <rect
        x={marginLeft + cellSize + gap1}
        y={
          marginTop +
          (cellSize + cellGap) *
            (forecastPt + problemConfig.featureEngineeringStart)
        }
        width={df1Dims.dataWidth}
        height={
          (cellSize + cellGap) *
          (problemConfig.featureEngineeringEnd -
            problemConfig.featureEngineeringStart +
            1)
        }
        stroke={feBorder}
        strokeWidth={2}
        fill="none"
      />

      {!isPredicting && (
        <rect
          x={marginLeft + cellSize + gap1 + df1Dims.dataWidth + gap2}
          y={
            marginTop +
            (cellSize + cellGap) * (forecastPt + problemConfig.forecastHorizon)
          }
          width={cellSize}
          height={cellSize}
          stroke={targetBorder}
          strokeWidth={2}
          fill="none"
        />
      )}

      <g transform={`translate(${df1Dims.width + 100}, 0)`}>
        <DataFrameRenderer dataframe={df2} />
        {/* <Marker /> */}
        <g
          transform={`translate(${
            df2Dims.width + marginLeft + marginRight
          }, ${marginTop})`}
        >
          {/* <Marker /> */}

          <Bracket
            y={-problemConfig.featureEngineeringStart * cellSize}
            width={10}
            height={
              (df1.nRows -
                -problemConfig.featureEngineeringStart -
                problemConfig.forecastHorizon) *
              cellSize
            }
            label="Can be used for Training"
          />
          <Bracket
            y={
              (df2.nRows2 -
                (problemConfig.forecastHorizon -
                  problemConfig.featureEngineeringEnd)) *
              cellSize
            }
            width={10}
            height={
              (problemConfig.forecastHorizon -
                problemConfig.featureEngineeringEnd) *
              cellSize
            }
            label="Can be used for Predict"
          />
        </g>

        <rect
          x={marginLeft}
          y={marginTop + (cellSize + cellGap) * forecastPt}
          width={cellSize}
          height={cellSize}
          stroke={fpBorder}
          strokeWidth={2}
          fill="none"
        />

        <rect
          x={marginLeft + cellSize + gap1 + cellSize}
          y={marginTop + (cellSize + cellGap) * forecastPt}
          width={df2Dims.dataWidth - cellSize}
          height={cellSize}
          stroke={feBorder}
          strokeWidth={2}
          fill="none"
        />
        <rect
          x={marginLeft + cellSize + gap1 + df2Dims.dataWidth + gap2}
          y={marginTop + (cellSize + cellGap) * forecastPt}
          width={cellSize}
          height={cellSize}
          stroke={targetBorder}
          strokeWidth={2}
          fill="none"
        />
      </g>
    </svg>
  );
};
