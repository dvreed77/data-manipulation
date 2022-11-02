import { useContext } from "react";
import { ProblemConfigComponent } from "../ProblemConfigComponent";
import { ActionType, AppContext } from "./reducer";
import { VegaLite, VisualizationSpec } from "react-vega";
import { ProblemDataDisplay } from "../ProblemDataDisplay";
import { generateData } from "./utils";

export const Configure = () => {
  const { state, dispatch } = useContext(AppContext);

  const feWindowWidth =
    state.problemConfig.featureEngineeringEnd -
    state.problemConfig.featureEngineeringStart +
    1;
  const effectiveGap =
    state.problemConfig.forecastHorizon -
    state.problemConfig.featureEngineeringEnd;

  const data = generateData(effectiveGap);

  const barData = {
    feStart: data[30].date,
    feEnd: data[30 + 1 * feWindowWidth].date,
    fd: data[30 + 1 * (feWindowWidth + effectiveGap)].date,
    end1: data[100 - 1].date,
    end2: data[data.length - 1].date,
  };

  const spec = {
    width: 1000,
    height: 200,
    layer: [
      {
        data: { name: "lineData" },
        source: "lineData",
        mark: "line",
        encoding: {
          x: { field: "date", type: "temporal" },
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
      {
        mark: "rect",
        data: { name: "barData" },
        encoding: {
          x: { field: "end1", type: "temporal" },
          x2: { field: "end2", type: "temporal" },
          opacity: { value: 0.5 },
          color: { value: "#ccc" },
        },
      },
    ],
  };

  return (
    <div>
      <div className="flex">
        <div className="ml-3">
          <div className="text-sm text-blue-800">
            <p>
              User uploaded {data.length - effectiveGap} rows of data that
              starts on <b>{data[0].date.toLocaleDateString()}</b> and ends on{" "}
              <b>{data[data.length - 1].date.toLocaleDateString()}</b>.
            </p>
            <p>
              Based on this Problem configuration, we can predict{" "}
              <b>{effectiveGap}</b> days off the end of the data set.
            </p>
          </div>
        </div>
      </div>
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
          <ProblemDataDisplay problemConfig={state.problemConfig} />
        </div>
      </div>
    </div>
  );
};
