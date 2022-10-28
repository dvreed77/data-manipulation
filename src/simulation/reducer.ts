import { createContext } from "react";

export const initialState = {
  problemConfig: {
    featureEngineeringStart: -3,
    featureEngineeringEnd: -2,
    forecastHorizon: 4,
  },
  today: new Date(),
  selectedRow: null,
};

export enum ActionType {
  UPDATE_FE_START,
  UPDATE_FE_END,
  UPDATE_FD,
  UPDATE_PROBLEM_CONFIG,
  UPDATE_TODAY,
  SET_SELECTED_ROW,
}

type Action = {
  type: ActionType;
  payload: any;
};

export const reducer = (state: any, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_PROBLEM_CONFIG:
      return {
        ...state,
        problemConfig: action.payload,
      };
    case ActionType.UPDATE_FE_START:
      return {
        ...state,
        problemConfig: {
          ...state.problemConfig,
          featureEngineeringStart: action.payload,
        },
      };
    case ActionType.UPDATE_FE_END:
      return {
        ...state,
        problemConfig: {
          ...state.problemConfig,
          featureEngineeringEnd: action.payload,
        },
      };
    case ActionType.UPDATE_FD:
      return {
        ...state,
        problemConfig: {
          ...state.problemConfig,
          forecastHorizon: action.payload,
        },
      };
    case ActionType.UPDATE_TODAY:
      return {
        ...state,
        today: action.payload,
      };
    case ActionType.SET_SELECTED_ROW:
      return {
        ...state,
        selectedRow: action.payload,
      };
    default:
      return state;
  }
};

interface IContext {
  state: any;
  dispatch: React.Dispatch<Action>;
}
export const AppContext = createContext<IContext>({
  state: initialState,
  dispatch: () => {},
});
