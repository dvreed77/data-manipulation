import { useContext } from "react";
import { ThemeContext, useDataFrameDimensions } from "./App";
import { Bracket } from "./Bracket";
import { DataFrame, DataFrameRenderer } from "./Dataframe";
import { ProblemConfig } from "./types";

interface IProps {
  problemConfig: ProblemConfig;
  drawWindows?: boolean;
}
export const Data2 = ({ problemConfig, drawWindows = false }: IProps) => {
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

  let df1 = new DataFrame({
    nCols: 2,
    nRows: 10,
    start: 40,
    name: "User Uploaded Data",
  });

  let df2 = df1.copy({ name: "Transformed" }).transform({
    gap: -problemConfig.featureEngineeringEnd,
    feWindow:
      problemConfig.featureEngineeringEnd -
      problemConfig.featureEngineeringStart +
      1,
    forecastHorizon: problemConfig.forecastHorizon,
  });

  // df2.name = "Transformed";

  // const forecastPt = 10;

  const FeatureEngineeringWindow = () => (
    <rect
      x={marginLeft + cellSize + gap1}
      y={
        marginTop +
        (cellSize + cellGap) * (10 + problemConfig.featureEngineeringStart)
      }
      width={df1Dims.dataWidth}
      height={
        (cellSize + 1) *
        (problemConfig.featureEngineeringEnd -
          problemConfig.featureEngineeringStart +
          1)
      }
      stroke="#E09E96"
      strokeWidth={2}
      fill="none"
    />
  );

  // const TargetWindow = () => (
  //   <rect
  //     x={marginLeft + cellSize + gap1 + dataWidth + gap2}
  //     y={
  //       marginTop +
  //       (cellSize + 1) * (forecastPt + problemConfig.forecastHorizon)
  //     }
  //     width={cellSize}
  //     height={cellSize}
  //     stroke="#94547F"
  //     strokeWidth={2}
  //     fill="none"
  //   />
  // );

  // const FeatureEngineeringWindow2 = () => (
  //   <rect
  //     x={df2.marginLeft + df2.cellSize + df2.gap1}
  //     y={df2.marginTop + (df2.cellSize + df2.cellGap) * forecastPt}
  //     width={df2.dataWidth}
  //     height={df2.cellSize}
  //     stroke="#E09E96"
  //     strokeWidth={2}
  //     fill="none"
  //   />
  // );

  // const TargetWindow2 = () => (
  //   <rect
  //     x={df2.marginLeft + df2.cellSize + df2.gap1 + df2.dataWidth + df2.gap2}
  //     y={df2.marginTop + (df2.cellSize + df2.cellGap) * forecastPt}
  //     width={df2.cellSize}
  //     height={df2.cellSize}
  //     stroke="#94547F"
  //     strokeWidth={2}
  //     fill="none"
  //   />
  // );

  const fmBounds = {
    lower: -problemConfig.featureEngineeringStart,
    upper: 10 - problemConfig.forecastHorizon,
  };

  const fmBounds2 = {
    lower: Math.max(
      -problemConfig.featureEngineeringStart,
      10 - problemConfig.forecastHorizon
    ),
    upper:
      10 -
      problemConfig.forecastHorizon +
      (problemConfig.forecastHorizon - problemConfig.featureEngineeringEnd),
  };

  const fmBounds3 = {
    lower: 10 - problemConfig.forecastHorizon,
    upper: Math.max(
      -problemConfig.featureEngineeringStart,
      10 - problemConfig.forecastHorizon
    ),
  };

  // console.log(fmBounds);

  // return null;
  const df1Dims = useDataFrameDimensions(df1);
  const df2Dims = useDataFrameDimensions(df2);

  return (
    <svg width={1000} height={1000}>
      <DataFrameRenderer dataframe={df1} />
      {/* {drawWindows && (
      <>
        <FeatureEngineeringWindow />
        <TargetWindow />
      </>
    )} */}

      <g transform={`translate(${df1Dims.width + 100}, 0)`}>
        <DataFrameRenderer dataframe={df2} />
        <g
          transform={`translate(${df2Dims.width + 20}, ${
            marginTop + fmBounds.lower * (cellSize + cellGap)
          })`}
        >
          {fmBounds.upper - fmBounds.lower > 0 && (
            <Bracket
              width={10}
              height={(fmBounds.upper - fmBounds.lower) * (cellSize + cellGap)}
              label="We already know this target"
            />
          )}
        </g>
        <g
          transform={`translate(${df2Dims.width + 20}, ${
            marginTop + fmBounds2.lower * (cellSize + cellGap)
          })`}
        >
          {fmBounds2.upper - fmBounds2.lower > 0 && (
            <Bracket
              width={10}
              height={
                (fmBounds2.upper - fmBounds2.lower) * (cellSize + cellGap)
              }
              label="This is what we can use to predict"
            />
          )}
        </g>
        <g
          transform={`translate(${df2Dims.width + 20}, ${
            marginTop + fmBounds3.lower * (cellSize + cellGap)
          })`}
        >
          {fmBounds3.upper - fmBounds3.lower > 0 && (
            <Bracket
              width={10}
              height={
                (fmBounds3.upper - fmBounds3.lower) * (cellSize + cellGap)
              }
              label="Not Enough Data to predict"
            />
          )}
        </g>
        {/* {drawWindows && (
          <>
            <FeatureEngineeringWindow2 />
            <TargetWindow2 />
          </>
        )} */}
      </g>
    </svg>
  );
};
