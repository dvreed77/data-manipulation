import { useContext } from "react";
import { Data2 } from "../Data2";
import { ProblemConfigComponent } from "../ProblemConfigComponent";
import { ActionType, AppContext } from "./reducer";

export const Train = () => {
  const { state, dispatch } = useContext(AppContext);

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
      <Data2 problemConfig={state.problemConfig} />
    </div>
  );
};
