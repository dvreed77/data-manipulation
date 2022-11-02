import { useContext } from "react";
import { VegaLite } from "react-vega";
import { Data3 } from "./Data3";
import { AppContext } from "./reducer";
import { generateData } from "./utils";

export const Simulation = () => {
  const nDays = 200;
  const uploadedData = generateData({ nDays });
  const { state } = useContext(AppContext);

  const { problemConfig } = state;

  const effectiveGap =
    problemConfig.forecastHorizon - problemConfig.featureEngineeringEnd;

  const marks = {
    // feStart: data[30].date,
    // feEnd: data[30 + 1 * feWindowWidth].date,
    // fd: data[30 + 1 * (feWindowWidth + effectiveGap)].date,
    predStart: uploadedData[nDays - 1].date,
    predEnd: new Date(
      uploadedData[nDays - 1].date.getTime() +
        effectiveGap * 24 * 60 * 60 * 1000
    ),
  };

  const spec = {
    width: 1000,
    height: 200,
    layer: [
      {
        data: { name: "uploadedData" },
        source: "uploadedData",
        mark: "line",
        encoding: {
          x: { field: "date", type: "temporal" },
          y: { field: "target", type: "quantitative" },
        },
        axisX: false,
        axisY: false,
      },
      {
        mark: "rect",
        data: { name: "marks" },
        encoding: {
          x: { field: "predStart", type: "temporal" },
          x2: { field: "predEnd", type: "temporal" },
          opacity: { value: 0.5 },
          color: { value: "green" },
        },
      },
    ],
  };

  const featureEngineeringWindowWidth =
    problemConfig.featureEngineeringEnd -
    problemConfig.featureEngineeringStart +
    1;

  return (
    <div>
      <div>
        Imagine that a user has uploaded {uploadedData.length} days of data,
        from {uploadedData[0].date.toLocaleDateString()} to{" "}
        {uploadedData[uploadedData.length - 1].date.toLocaleDateString()}.
      </div>
      <VegaLite spec={spec} data={{ uploadedData, marks }} />
      <div>
        Based upon the problem configuration, we can use this data to forecast
        the next {effectiveGap} days, up until the{" "}
        {marks.predEnd.toLocaleDateString()}.
      </div>
      <div>
        Now we are in the future and the user wants to upload some new data to
        predict on:
        <div>
          <button
            type="button"
            className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Not Enough Data
          </button>
          <button
            type="button"
            className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Enough to Predict a Single Point
          </button>
          <button
            type="button"
            className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Enough to Predict Multiple Points
          </button>
          <button
            type="button"
            className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Too Much Data
          </button>
        </div>
        <div>
          The user needs to upload at least enough data to account for the all
          the lags, so in this case {featureEngineeringWindowWidth} days. If the
          user were to upload {featureEngineeringWindowWidth - 1} days of data,
          there would not be enough data to account for all the lags.
          <Data3 nDays={featureEngineeringWindowWidth - 1} />
        </div>
        <div>
          If the user wanted to predict a single day, then the user would only
          need {featureEngineeringWindowWidth} days of data.
          <Data3 nDays={featureEngineeringWindowWidth} />
        </div>
        <div>
          If the user wanted to predict multiple days, then the user could{" "}
          {featureEngineeringWindowWidth + effectiveGap - 1} days of data.
          upload
          <Data3 nDays={featureEngineeringWindowWidth + effectiveGap - 1} />
        </div>
        <div>
          More days than {featureEngineeringWindowWidth + effectiveGap + 1} days
          of data, would give predictions, the user already knows about
          <Data3 nDays={featureEngineeringWindowWidth + effectiveGap + 1} />
        </div>
      </div>
    </div>
  );
};
