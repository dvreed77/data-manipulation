import { useContext } from "react";
import { ProblemConfigComponent } from "../ProblemConfigComponent";
import { ActionType, AppContext } from "./reducer";
import { VegaLite, VisualizationSpec } from "react-vega";
import { generateData } from "./Upload";

export const Configure = () => {
  const { state, dispatch } = useContext(AppContext);
  const data = generateData();

  const spec2: VisualizationSpec = {
    // $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    // description: "Google's stock price over time.",
    //   data: { url: "data/stocks.csv" },
    data: { name: "table" },
    //   transform: [{ filter: "datum.symbol==='GOOG'" }],
    mark: "line",
    width: 1000,
    height: 200,
    encoding: {
      x: { field: "date", type: "temporal" },
      // x: { field: "key", type: "quantitative" },
      y: { field: "sales", type: "quantitative" },
    },
  };

  const feWindowWidth =
    state.problemConfig.featureEngineeringEnd -
    state.problemConfig.featureEngineeringStart;

  const effectiveGap =
    state.problemConfig.forecastHorizon -
    state.problemConfig.featureEngineeringEnd;
  const barData = {
    feStart: data[30].date,
    feEnd: data[30 + 20 * feWindowWidth].date,
    fd: data[30 + 20 * (feWindowWidth + effectiveGap)].date,
  };

  const spec = {
    width: 1000,
    height: 200,
    // axisX: false,
    // axisY: false,
    layer: [
      {
        data: { name: "lineData" },
        source: "lineData",
        mark: "line",
        encoding: {
          x: { field: "date", type: "temporal" },
          // x: { field: "key", type: "quantitative" },
          y: { field: "sales", type: "quantitative" },
        },
        axisX: false,
        axisY: false,
      },
      {
        data: { name: "barData" },
        mark: "rule",
        encoding: {
          x: { field: "fd", type: "temporal" },
          color: { value: "red" },
          opacity: { value: 0.5 },
          size: { value: 4 },
        },
      },
      //   {
      //     mark: "rule",
      //     encoding: {
      //       y: { aggregate: "max", field: "sales" },
      //     },
      //   },
      {
        mark: "rect",
        data: { name: "barData" },
        encoding: {
          x: { field: "feStart", type: "temporal" },
          x2: { field: "feEnd", type: "temporal" },
          opacity: { value: 0.5 },
          color: { value: "green" },
        },
      },
    ],
  };
  return (
    <div>
      <div>
        <VegaLite spec={spec} data={{ lineData: data, barData }} />
      </div>
      <div className="flex">
        <div className="mb-3 justify-center">
          <ProblemConfigComponent
            featureEngineeringMax={20}
            forecastHorizonMax={20}
            problemConfig={state.problemConfig}
            onChange={(d) => {
              dispatch({ type: ActionType.UPDATE_PROBLEM_CONFIG, payload: d });
            }}
            showIntervals={false}
          />
        </div>
      </div>
    </div>
  );
};
