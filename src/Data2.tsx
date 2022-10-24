import { DataFrame } from "./Dataframe";
import { ProblemConfig } from "./types";

interface IProps {
  problemConfig: ProblemConfig;
  drawWindows?: boolean;
}
export const Data2 = ({ problemConfig, drawWindows = false }: IProps) => {
  let df1 = new DataFrame().generate(3, 10, 40);

  let df2 = df1.copy().transform({
    gap: -problemConfig.featureEngineeringEnd,
    feWindow:
      problemConfig.featureEngineeringEnd -
      problemConfig.featureEngineeringStart +
      1,
    forecastHorizon: problemConfig.forecastHorizon,
  });

  df2.name = "Transformed";

  const forecastPt = 10;

  const FeatureEngineeringWindow = () => (
    <rect
      x={df1.marginLeft + df1.cellSize + df1.gap1}
      y={
        df1.marginTop +
        (df1.cellSize + df1.cellGap) *
          (forecastPt + problemConfig.featureEngineeringStart)
      }
      width={df1.dataWidth}
      height={
        (df1.cellSize + 1) *
        (problemConfig.featureEngineeringEnd -
          problemConfig.featureEngineeringStart +
          1)
      }
      stroke="#E09E96"
      strokeWidth={2}
      fill="none"
    />
  );

  const TargetWindow = () => (
    <rect
      x={df1.marginLeft + df1.cellSize + df1.gap1 + df1.dataWidth + df1.gap2}
      y={
        df1.marginTop +
        (df1.cellSize + 1) * (forecastPt + problemConfig.forecastHorizon)
      }
      width={df1.cellSize}
      height={df1.cellSize}
      stroke="#94547F"
      strokeWidth={2}
      fill="none"
    />
  );

  const FeatureEngineeringWindow2 = () => (
    <rect
      x={df2.marginLeft + df2.cellSize + df2.gap1}
      y={df2.marginTop + (df2.cellSize + df2.cellGap) * forecastPt}
      width={df2.dataWidth}
      height={df2.cellSize}
      stroke="#E09E96"
      strokeWidth={2}
      fill="none"
    />
  );

  const TargetWindow2 = () => (
    <rect
      x={df2.marginLeft + df2.cellSize + df2.gap1 + df2.dataWidth + df2.gap2}
      y={df2.marginTop + (df2.cellSize + df2.cellGap) * forecastPt}
      width={df2.cellSize}
      height={df2.cellSize}
      stroke="#94547F"
      strokeWidth={2}
      fill="none"
    />
  );
  return (
    <svg width={1000} height={1000}>
      {df1.draw()}
      {drawWindows && (
        <>
          <FeatureEngineeringWindow />
          <TargetWindow />
        </>
      )}

      <g transform={`translate(${df1.width + 50}, 0)`}>
        {df2.draw()}
        {drawWindows && (
          <>
            <FeatureEngineeringWindow2 />
            <TargetWindow2 />
          </>
        )}
      </g>
    </svg>
  );
};
