import { useContext } from "react";
import { Data2 } from "../Data2";
import { ProblemConfigComponent } from "../ProblemConfigComponent";
import { ActionType, AppContext } from "./reducer";
import { Table } from "./Table";
import { Table2 } from "./Table2";
import { Table3 } from "./Table3";
import { Row } from "./types";
import { generateData } from "./Upload";

export type Row2 = {
  key: number;
  date: Date;
  sales: number;
  lag1: number;
  lag2: number;
};

function transformData(data: Row[], lag: number, lag2: number): Row2[] {
  const newData: Row2[] = [];
  for (let i = 0; i < data.length; i++) {
    newData.push({
      ...data[i],
      lag1: data[i - lag]?.sales ?? NaN,
      lag2: data[i - lag2]?.sales ?? NaN,
    });
  }

  newData.push({
    key: 5000,
    date: new Date(),
    sales: 22,
    lag1: 22,
    lag2: 22,
  });
  return newData;
}
export const Train = () => {
  const { state, dispatch } = useContext(AppContext);
  const data = generateData();

  const lag1 =
    state.problemConfig.forecastHorizon -
    state.problemConfig.featureEngineeringEnd;

  const lag2 =
    state.problemConfig.forecastHorizon -
    state.problemConfig.featureEngineeringStart;

  const transformedData = transformData(data, lag1, lag2);
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
          <h2>User Data</h2>
          <Table2 data={data} />
        </div>
        <div className="w-1/2 m-3 max-h-96">
          <h2>Transformed Data</h2>
          <Table3 data={transformedData} />
        </div>
      </div>
    </div>
  );
};
