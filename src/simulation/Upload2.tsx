import { data } from "@tensorflow/tfjs";
import { useContext } from "react";
import { AppContext } from "./reducer";

export const Upload2 = () => {
  const { state, dispatch } = useContext(AppContext);
  const effectiveGap =
    state.problemConfig.forecastHorizon -
    state.problemConfig.featureEngineeringEnd;

  return (
    <div>
      <div className="text-sm text-blue-800">
        <p>
          Based on problem configuration, you can predict {effectiveGap} days
          beyone the end of the data you upload.
        </p>
      </div>
      <button
        onClick={() => console.log("button1")}
        type="button"
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ayx-primary focus:ring-offset-2"
      >
        Upload data from a week ago
      </button>
    </div>
  );
};
