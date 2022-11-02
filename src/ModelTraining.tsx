import { useContext } from "react";
import { ThemeContext, useDataFrameDimensions } from "./App";
import { Bracket } from "./Bracket";
import { DataFrame, DataFrameRenderer } from "./Dataframe";
import { AppContext } from "./reducer";

export const ModelTraining = () => {
  const theme = useContext(ThemeContext);
  const { state, dispatch } = useContext(AppContext);

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

  const forecastPt = 10;

  const df1Dims = useDataFrameDimensions(df1);
  const df2Dims = useDataFrameDimensions(df2);

  return (
    <svg width={1000} height={1000}>
      <rect
        x={0}
        y={theme.marginTop + (theme.cellSize + theme.cellGap) * forecastPt + 2}
        width={
          theme.marginLeft +
          df1Dims.width +
          theme.marginRight +
          +80 +
          theme.marginLeft +
          df2Dims.width +
          theme.marginRight
        }
        height={theme.cellSize - 4}
        fill="orange"
        opacity={0.5}
      />

      <rect
        x={theme.marginLeft - 10}
        y={
          theme.marginTop +
          (theme.cellSize + theme.cellGap) *
            (forecastPt + problemConfig.forecastHorizon) +
          2
        }
        width={df1Dims.width + 20}
        height={theme.cellSize - 4}
        fill="red"
        opacity={0.5}
      />

      <rect
        x={theme.marginLeft - 10}
        y={
          theme.marginTop +
          (theme.cellSize + theme.cellGap) *
            (forecastPt + problemConfig.featureEngineeringStart) +
          2
        }
        width={df1Dims.width + 20}
        height={
          theme.cellSize *
            (problemConfig.featureEngineeringEnd -
              problemConfig.featureEngineeringStart +
              1) -
          4
        }
        fill="green"
        opacity={0.5}
      />

      <DataFrameRenderer dataframe={df1} />

      <rect
        x={theme.marginLeft}
        y={theme.marginTop + (theme.cellSize + theme.cellGap) * forecastPt}
        width={theme.cellSize}
        height={theme.cellSize}
        stroke={theme.fpBorder}
        strokeWidth={2}
        fill="none"
      />

      <rect
        x={theme.marginLeft + theme.cellSize + theme.gap1}
        y={
          theme.marginTop +
          (theme.cellSize + theme.cellGap) *
            (forecastPt + problemConfig.featureEngineeringStart)
        }
        width={df1Dims.dataWidth}
        height={
          (theme.cellSize + theme.cellGap) *
          (problemConfig.featureEngineeringEnd -
            problemConfig.featureEngineeringStart +
            1)
        }
        stroke={theme.feBorder}
        strokeWidth={2}
        fill="none"
      />
      <rect
        x={
          theme.marginLeft +
          theme.cellSize +
          theme.gap1 +
          df1Dims.dataWidth +
          theme.gap2
        }
        y={
          theme.marginTop +
          (theme.cellSize + theme.cellGap) *
            (forecastPt + problemConfig.forecastHorizon)
        }
        width={theme.cellSize}
        height={theme.cellSize}
        stroke={theme.targetBorder}
        strokeWidth={2}
        fill="none"
      />

      <g transform={`translate(${df1Dims.width + 100}, 0)`}>
        <DataFrameRenderer dataframe={df2} />
        {/* <Marker /> */}
        <g
          transform={`translate(${
            df2Dims.width + theme.marginLeft + theme.marginRight
          }, ${theme.marginTop})`}
        >
          {/* <Marker /> */}

          <Bracket
            y={-problemConfig.featureEngineeringStart * theme.cellSize}
            width={10}
            height={
              (df1.nRows -
                -problemConfig.featureEngineeringStart -
                problemConfig.forecastHorizon) *
              theme.cellSize
            }
            label="Can be used for Training"
          />
          <Bracket
            y={
              (df2.nRows2 -
                (problemConfig.forecastHorizon -
                  problemConfig.featureEngineeringEnd)) *
              theme.cellSize
            }
            width={10}
            height={
              (problemConfig.forecastHorizon -
                problemConfig.featureEngineeringEnd) *
              theme.cellSize
            }
            label="Can be used for Predict"
          />
        </g>

        <rect
          x={theme.marginLeft}
          y={theme.marginTop + (theme.cellSize + theme.cellGap) * forecastPt}
          width={theme.cellSize}
          height={theme.cellSize}
          stroke={theme.fpBorder}
          strokeWidth={2}
          fill="none"
        />

        <rect
          x={theme.marginLeft + theme.cellSize + theme.gap1 + theme.cellSize}
          y={theme.marginTop + (theme.cellSize + theme.cellGap) * forecastPt}
          width={df2Dims.dataWidth - theme.cellSize}
          height={theme.cellSize}
          stroke={theme.feBorder}
          strokeWidth={2}
          fill="none"
        />
        <rect
          x={
            theme.marginLeft +
            theme.cellSize +
            theme.gap1 +
            df2Dims.dataWidth +
            theme.gap2
          }
          y={theme.marginTop + (theme.cellSize + theme.cellGap) * forecastPt}
          width={theme.cellSize}
          height={theme.cellSize}
          stroke={theme.targetBorder}
          strokeWidth={2}
          fill="none"
        />
      </g>
    </svg>
  );
};
