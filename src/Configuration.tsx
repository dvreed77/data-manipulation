import { useContext } from "react";
import { ProblemConfigComponent } from "./ProblemConfigComponent";
import { ProblemDataDisplay } from "./ProblemDataDisplay";
import { ActionType, AppContext } from "./reducer";
import { ProblemConfig } from "./types";

export const Configuration = () => {
  const { state, dispatch } = useContext(AppContext);

  function handleChange(newProblemConfig: ProblemConfig) {
    dispatch({
      type: ActionType.UPDATE_PROBLEM_CONFIG,
      payload: newProblemConfig,
    });
  }

  return (
    <>
      <div className="flex flex-row justify-center">
        <ProblemConfigComponent
          problemConfig={state.problemConfig}
          featureEngineeringMax={10}
          forecastHorizonMax={10}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3 justify-center">
        <ProblemDataDisplay problemConfig={state.problemConfig} />
      </div>
    </>
  );
};
