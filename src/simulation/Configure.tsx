import { useContext } from "react";
import { ProblemConfigComponent } from "../ProblemConfigComponent";
import { ActionType, AppContext } from "./reducer";

export const Configure = () => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <div>
      <ProblemConfigComponent
        featureEngineeringMax={10}
        forecastHorizonMax={10}
        problemConfig={state.problemConfig}
        onChange={(d) => {
          dispatch({ type: ActionType.UPDATE_PROBLEM_CONFIG, payload: d });
        }}
      />
    </div>
  );
};
