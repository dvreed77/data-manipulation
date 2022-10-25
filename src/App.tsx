import { useState } from "react";
import { DataFrame } from "./Dataframe";
import { ProblemConfig } from "./types";
import { ProblemConfigComponent } from "./ProblemConfigComponent";
import { ProblemDataDisplay } from "./ProblemDataDisplay";
import { Data2 } from "./Data2";

function App() {
  const cellSize = 20;

  const [problemConfig, setProblemConfig] = useState<ProblemConfig>({
    featureEngineeringStart: -4,
    featureEngineeringEnd: -3,
    forecastHorizon: 3,
  });

  let df1 = new DataFrame().generate(3, 20);

  let df2 = df1.copy().transform({
    gap: -problemConfig.featureEngineeringEnd,
    feWindow:
      problemConfig.featureEngineeringEnd -
      problemConfig.featureEngineeringStart +
      1,
    forecastHorizon: problemConfig.forecastHorizon,
  });

  df2.name = "Transformed";

  const handleProblemChange = (newProblemConfig: ProblemConfig) => {
    setProblemConfig(newProblemConfig);
  };

  const forecastPt = 10;
  return (
    <div className="mx-auto w-1/2">
      <div className="sticky top-0 bg-white border-b py-2">
        <div className="mb-3">
          <ProblemDataDisplay problemConfig={problemConfig} />
        </div>
        <ProblemConfigComponent
          problemConfig={problemConfig}
          featureEngineeringMax={10}
          forecastHorizonMax={10}
          onChange={handleProblemChange}
        />
      </div>
      <h2 className="mt-5">Model Training</h2>
      <hr />
      <svg width={1000} height={1000}>
        <rect
          x={df1.marginLeft - 10}
          y={df1.marginTop + (df1.cellSize + df1.cellGap) * forecastPt - 2}
          width={df1.width + 50 + df2.width + 30}
          height={cellSize + 4}
          // strokeWidth={2}
          fill="#FFBF00"
          opacity={0.5}
        />

        {df1.draw()}

        <rect
          x={df1.marginLeft + df1.cellSize + df1.gap1}
          y={
            df1.marginTop +
            (df1.cellSize + df1.cellGap) *
              (forecastPt + problemConfig.featureEngineeringStart)
          }
          width={df1.dataWidth}
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
          stroke="#94547F"
          strokeWidth={2}
          fill="none"
        />

        <g transform={`translate(${df1.width + 50}, 0)`}>
          {df2.draw()}
          <rect
            x={df2.marginLeft + df2.cellSize + df2.gap1}
            y={df2.marginTop + (df2.cellSize + df2.cellGap) * forecastPt}
            width={df2.dataWidth}
            height={cellSize}
            stroke="#E09E96"
            strokeWidth={2}
            fill="none"
          />
          <rect
            x={
              df2.marginLeft +
              df2.cellSize +
              df2.gap1 +
              df2.dataWidth +
              df2.gap2
            }
            y={df2.marginTop + (df2.cellSize + df2.cellGap) * forecastPt}
            width={cellSize}
            height={cellSize}
            stroke="#94547F"
            strokeWidth={2}
            fill="none"
          />
        </g>
      </svg>
      <h2 className="mt-5">Prediction</h2>
      <hr />
      <Data2 problemConfig={problemConfig} />
    </div>
  );
}

export default App;
