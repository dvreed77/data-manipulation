import { useState, createContext, useContext } from "react";
import { DataFrame, DataFrameRenderer } from "./Dataframe";
import { ProblemConfig } from "./types";
import { ProblemConfigComponent } from "./ProblemConfigComponent";
import { ProblemDataDisplay } from "./ProblemDataDisplay";
import { Data2 } from "./Data2";
import { Bracket } from "./Bracket";
import { Marker } from "./visUtils";
import { ProblemDataDisplay2 } from "./ProblemDataDisplay2";
import Hello from "./dave.mdx";
import { Counter } from "./counter";

export function useDataFrameDimensions(df: DataFrame) {
  const theme = useContext(ThemeContext);

  const dataWidth = theme.cellSize * df.nCols + theme.cellGap * (df.nCols - 1);
  return {
    width:
      theme.cellSize + theme.gap1 + dataWidth + theme.gap2 + theme.cellSize,
    dataWidth,
  };
}

const theme = {
  cellGap: 0,
  cellSize: 30,
  gap1: 10,
  gap2: 10,
  marginTop: 100,
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 10,
  targetBorder: "#FF938E",
  feBorder: "#91C08C",
  fpBorder: "#FFD296",
  value: "dave",
  setValue: () => {},
};

interface ITheme {
  cellGap: number;
  cellSize: number;
  gap1: number;
  gap2: number;
  marginTop: number;
  marginLeft: number;
  marginRight: number;
  marginBottom: number;
  targetBorder: string;
  feBorder: string;
  fpBorder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const ThemeContext = createContext<ITheme>(theme);

function App() {
  const [problemConfig, setProblemConfig] = useState<ProblemConfig>({
    featureEngineeringStart: -5,
    featureEngineeringEnd: -5,
    forecastHorizon: 3,
  });

  let df1 = new DataFrame({ name: "User Uploaded Data" });

  let df2 = df1.copy({ name: "Transformed" }).transform({
    gap: -problemConfig.featureEngineeringEnd,
    feWindow:
      problemConfig.featureEngineeringEnd -
      problemConfig.featureEngineeringStart +
      1,
    forecastHorizon: problemConfig.forecastHorizon,
  });

  const handleProblemChange = (newProblemConfig: ProblemConfig) => {
    setProblemConfig(newProblemConfig);
  };

  const forecastPt = 10;

  const df1Dims = useDataFrameDimensions(df1);
  const df2Dims = useDataFrameDimensions(df2);

  const [value, setValue] = useState("dave");

  const newTheme = {
    ...theme,
    value,
    setValue,
  };

  return (
    <ThemeContext.Provider value={newTheme}>
      <div className="mx-auto w-1/2">
        <div>
          <h1>Time Series Explainer</h1>
        </div>
        <div className="sticky top-0 bg-white border-b py-2 justify-center">
          <div className="flex flex-row justify-center">
            <ProblemConfigComponent
              problemConfig={problemConfig}
              featureEngineeringMax={10}
              forecastHorizonMax={10}
              onChange={handleProblemChange}
            />
            {/* <ProblemDataDisplay2 problemConfig={problemConfig} /> */}
          </div>
          <div className="mb-3 justify-center">
            <ProblemDataDisplay problemConfig={problemConfig} />
          </div>
        </div>
        <div className="bg-white py-3">
          <h2 className="font-semibold text-2xl">Model Training</h2>
        </div>
        <div>
          <hr />
          <svg width={1000} height={1000}>
            <rect
              x={0}
              y={
                theme.marginTop +
                (theme.cellSize + theme.cellGap) * forecastPt +
                2
              }
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
              y={
                theme.marginTop + (theme.cellSize + theme.cellGap) * forecastPt
              }
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
                y={
                  theme.marginTop +
                  (theme.cellSize + theme.cellGap) * forecastPt
                }
                width={theme.cellSize}
                height={theme.cellSize}
                stroke={theme.fpBorder}
                strokeWidth={2}
                fill="none"
              />

              <rect
                x={
                  theme.marginLeft +
                  theme.cellSize +
                  theme.gap1 +
                  theme.cellSize
                }
                y={
                  theme.marginTop +
                  (theme.cellSize + theme.cellGap) * forecastPt
                }
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
                y={
                  theme.marginTop +
                  (theme.cellSize + theme.cellGap) * forecastPt
                }
                width={theme.cellSize}
                height={theme.cellSize}
                stroke={theme.targetBorder}
                strokeWidth={2}
                fill="none"
              />
            </g>
          </svg>
        </div>

        <div className="bg-white py-3">
          <h2 className="font-semibold text-2xl">Prediction</h2>
        </div>
        <hr />
        <Data2 problemConfig={problemConfig} />
      </div>

      <article className="prose lg:prose-xl mx-auto">
        <Hello />
      </article>
    </ThemeContext.Provider>
  );
}

export default App;
