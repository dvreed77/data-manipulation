import { useContext } from "react";
import { ThemeContext, useDataFrameDimensions } from "./App";
import { Bracket } from "./Bracket";
import { DataFrame, DataFrameRenderer } from "./Dataframe";
import { AppContext } from "./reducer";

interface IProps {
  nDays: number;
}
export const Data3 = ({ nDays }: IProps) => {
  const { cellGap, cellSize, marginTop, marginBottom } =
    useContext(ThemeContext);

  const { state } = useContext(AppContext);

  const { problemConfig } = state;
  let df1 = new DataFrame({
    nCols: 2,
    nRows: nDays ?? 10,
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

  const fmBounds = {
    lower: -problemConfig.featureEngineeringStart,
    upper: nDays - problemConfig.forecastHorizon,
  };

  const fmBounds2 = {
    lower: Math.max(
      -problemConfig.featureEngineeringStart,
      nDays - problemConfig.forecastHorizon
    ),
    upper:
      nDays -
      problemConfig.forecastHorizon +
      (problemConfig.forecastHorizon - problemConfig.featureEngineeringEnd),
  };

  const fmBounds3 = {
    lower: Math.max(nDays - problemConfig.forecastHorizon, 0),
    upper: Math.max(
      -problemConfig.featureEngineeringStart,
      nDays - problemConfig.forecastHorizon
    ),
  };

  const df1Dims = useDataFrameDimensions(df1);
  const df2Dims = useDataFrameDimensions(df2);

  const maxRows = df2.nRows3;

  const height =
    marginTop + (cellSize + cellGap) * maxRows + cellGap + marginBottom;
  return (
    <svg width={700} height={height}>
      <DataFrameRenderer dataframe={df1} />

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
      </g>
    </svg>
  );
};
