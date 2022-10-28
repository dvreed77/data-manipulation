import { useContext } from "react";
import { ActionType, AppContext } from "./reducer";

export const SimulationControls = () => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <div className="p-4 grid gap-4 grid-rows-1 grid-flow-col w-1/2 mx-auto">
      <button
        onClick={() =>
          dispatch({
            type: ActionType.UPDATE_TODAY,
            payload: new Date(),
          })
        }
        type="button"
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ayx-primary focus:ring-offset-2"
      >
        Reset
      </button>
      <div>Today {state.today.toLocaleDateString()}</div>
      <button
        onClick={() =>
          dispatch({
            type: ActionType.UPDATE_TODAY,
            payload: new Date(state.today.getTime() + 60 * 60 * 24 * 1000),
          })
        }
        type="button"
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ayx-primary focus:ring-offset-2"
      >
        + 1 day
      </button>
      <button
        onClick={() =>
          dispatch({
            type: ActionType.UPDATE_TODAY,
            payload: new Date(state.today.getTime() + 7 * 60 * 60 * 24 * 1000),
          })
        }
        type="button"
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ayx-primary focus:ring-offset-2"
      >
        + 1 week
      </button>
    </div>
  );
};
