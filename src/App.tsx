import { useState, createContext, useContext, useReducer } from "react";
import { DataFrame, DataFrameRenderer } from "./Dataframe";
import { ProblemConfig } from "./types";
import { ProblemConfigComponent } from "./ProblemConfigComponent";
import { ProblemDataDisplay } from "./ProblemDataDisplay";
import { Data2 } from "./Data2";
import { Bracket } from "./Bracket";
import { Marker } from "./visUtils";
import { ProblemDataDisplay2 } from "./ProblemDataDisplay2";
import { Simulation } from "./Simulation";
import { reducer, initialState, AppContext } from "./reducer";
import { Configuration } from "./Configuration";
import { ModelTraining } from "./ModelTraining";

export function useDataFrameDimensions(df: DataFrame) {
  const theme = useContext(ThemeContext);

  const dataWidth = theme.cellSize * df.nCols + theme.cellGap * (df.nCols - 1);
  return {
    width:
      theme.cellSize + theme.gap1 + dataWidth + theme.gap2 + theme.cellSize,
    dataWidth,
  };
}

const theme = {
  cellGap: 0,
  cellSize: 30,
  gap1: 10,
  gap2: 10,
  marginTop: 100,
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 10,
  targetBorder: "#FF938E",
  feBorder: "#91C08C",
  fpBorder: "#FFD296",
};

export const ThemeContext = createContext(theme);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ThemeContext.Provider value={theme}>
      <AppContext.Provider value={{ state, dispatch }}>
        <div>
          <div className="sticky top-0 bg-white border-b py-2 justify-center z-10">
            <Configuration />
          </div>
          <div className="bg-white py-3 mx-auto w-1/2 text-center">
            <h2 className="font-semibold text-2xl">Model Training</h2>
          </div>
          <hr />
          <div className="mx-auto w-1/2 text-center flex justify-center">
            <ModelTraining />
          </div>

          <div className="bg-white py-3 mx-auto w-1/2 text-center">
            <h2 className="font-semibold text-2xl">Prediction</h2>
          </div>
          <hr />
          <div className="mx-auto w-1/2 text-center flex justify-center">
            <Data2 />
          </div>

          <div className="bg-white py-3 mx-auto w-1/2 text-center">
            <h2 className="font-semibold text-2xl">Simulation</h2>
          </div>
          <hr />
          <div className="mx-auto w-1/2 text-center flex justify-center">
            <Simulation />
          </div>
        </div>
      </AppContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
