import { useReducer } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout, steps } from "./Layout";

import { AppContext, initialState, reducer } from "./reducer";

export const Flow = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {steps.map((step) => (
            <Route key={step.path} path={step.path} element={step.component} />
          ))}
        </Route>
      </Routes>
    </AppContext.Provider>
  );
};
