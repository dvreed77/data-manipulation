import { Bracket } from "./Bracket";
import { DataFrame } from "./Dataframe";
import { ProblemConfig } from "./types";

interface IProps {
  problemConfig: ProblemConfig;
  drawWindows?: boolean;
}
export const Data2 = ({ problemConfig, drawWindows = false }: IProps) => {
  // let df1 = new DataFrame({ nCols: 3, nRows: 10, start: 40 });

  // let df2 = df1.copy().transform({
  //   gap: -problemConfig.featureEngineeringEnd,
  //   feWindow:
  //     problemConfig.featureEngineeringEnd -
  //     problemConfig.featureEngineeringStart +
  //     1,
  //   forecastHorizon: problemConfig.forecastHorizon,
  // });

  // df2.name = "Transformed";

  // const forecastPt = 10;

  // const FeatureEngineeringWindow = () => (
  //   <rect
  //     x={df1.marginLeft + df1.cellSize + df1.gap1}
  //     y={
  //       df1.marginTop +
  //       (df1.cellSize + df1.cellGap) *
  //         (forecastPt + problemConfig.featureEngineeringStart)
  //     }
  //     width={df1.dataWidth}
  //     height={
  //       (df1.cellSize + 1) *
  //       (problemConfig.featureEngineeringEnd -
  //         problemConfig.featureEngineeringStart +
  //         1)
  //     }
  //     stroke="#E09E96"
  //     strokeWidth={2}
  //     fill="none"
  //   />
  // );

  // const TargetWindow = () => (
  //   <rect
  //     x={df1.marginLeft + df1.cellSize + df1.gap1 + df1.dataWidth + df1.gap2}
  //     y={
  //       df1.marginTop +
  //       (df1.cellSize + 1) * (forecastPt + problemConfig.forecastHorizon)
  //     }
  //     width={df1.cellSize}
  //     height={df1.cellSize}
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

  // const fmBounds = {
  //   lower: -problemConfig.featureEngineeringStart,
  //   upper: 10 - problemConfig.forecastHorizon,
  // };

  // const fmBounds2 = {
  //   lower: Math.max(
  //     -problemConfig.featureEngineeringStart,
  //     10 - problemConfig.forecastHorizon
  //   ),
  //   upper:
  //     10 -
  //     problemConfig.forecastHorizon +
  //     (problemConfig.forecastHorizon - problemConfig.featureEngineeringEnd),
  // };

  // const fmBounds3 = {
  //   lower: 10 - problemConfig.forecastHorizon,
  //   upper: Math.max(
  //     -problemConfig.featureEngineeringStart,
  //     10 - problemConfig.forecastHorizon
  //   ),
  // };

  // console.log(fmBounds);

  return null;
  // <svg width={1000} height={1000}>
  //   {df1.draw()}
  //   {drawWindows && (
  //     <>
  //       <FeatureEngineeringWindow />
  //       <TargetWindow />
  //     </>
  //   )}

  //   <g transform={`translate(${df1.width + 50}, 0)`}>
  //     {df2.draw()}
  //     <g
  //       transform={`translate(${df2.width + 20}, ${
  //         df2.marginTop + fmBounds.lower * (df2.cellSize + df2.cellGap)
  //       })`}
  //     >
  //       {fmBounds.upper - fmBounds.lower > 0 && (
  //         <Bracket
  //           width={10}
  //           height={
  //             (fmBounds.upper - fmBounds.lower) * (df2.cellSize + df2.cellGap)
  //           }
  //           label="We already know this target"
  //         />
  //       )}
  //     </g>
  //     <g
  //       transform={`translate(${df2.width + 20}, ${
  //         df2.marginTop + fmBounds2.lower * (df2.cellSize + df2.cellGap)
  //       })`}
  //     >
  //       {fmBounds2.upper - fmBounds2.lower > 0 && (
  //         <Bracket
  //           width={10}
  //           height={
  //             (fmBounds2.upper - fmBounds2.lower) *
  //             (df2.cellSize + df2.cellGap)
  //           }
  //           label="This is what we can use to predict"
  //         />
  //       )}
  //     </g>
  //     <g
  //       transform={`translate(${df2.width + 20}, ${
  //         df2.marginTop + fmBounds3.lower * (df2.cellSize + df2.cellGap)
  //       })`}
  //     >
  //       {fmBounds3.upper - fmBounds3.lower > 0 && (
  //         <Bracket
  //           width={10}
  //           height={
  //             (fmBounds3.upper - fmBounds3.lower) *
  //             (df2.cellSize + df2.cellGap)
  //           }
  //           label="Not Enough Data to predict"
  //         />
  //       )}
  //     </g>
  //     {drawWindows && (
  //       <>
  //         <FeatureEngineeringWindow2 />
  //         <TargetWindow2 />
  //       </>
  //     )}
  //   </g>
  // </svg>
};
