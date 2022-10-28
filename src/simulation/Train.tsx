import { useContext } from "react";
import { Data2 } from "../Data2";
import { ProblemConfigComponent } from "../ProblemConfigComponent";
import { ActionType, AppContext } from "./reducer";
import { Table } from "./Table";
import { Table2 } from "./Table2";
import { Table3 } from "./Table3";
import { Row } from "./types";
import { generateData } from "./Upload";

function transformData(data: Row[], lag: number): Row[] {
  const newData: Row[] = [];
  for (let i = 0; i < data.length; i++) {
    newData.push({
      ...data[i],
      sales: data[i - lag]?.sales ?? "--",
    });
  }
  return newData;
}
export const Train = () => {
  const { state, dispatch } = useContext(AppContext);
  const data = generateData();

  const lag =
    state.problemConfig.forecastHorizon -
    state.problemConfig.featureEngineeringEnd;
  const transformedData = transformData(data, lag);
  return (
    <div>
      <ProblemConfigComponent
        featureEngineeringMax={20}
        forecastHorizonMax={20}
        problemConfig={state.problemConfig}
        onChange={(d) => {
          dispatch({ type: ActionType.UPDATE_PROBLEM_CONFIG, payload: d });
        }}
        showIntervals={false}
      />

      <div className="flex flex-row">
        <div className="w-1/2 m-3">
          <Table2 data={data} />
        </div>
        <div className="w-1/2 m-3 max-h-96">
          <Table3 data={transformedData} />
        </div>
      </div>
    </div>
  );
};
