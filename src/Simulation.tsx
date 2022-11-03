import { useContext } from "react";
import { VegaLite } from "react-vega";
import { Data3 } from "./Data3";
import { AppContext } from "./reducer";
import { generateData } from "./utils";
import ReactMarkdown from "react-markdown";

export const Simulation = () => {
  const nDays = 200;
  const uploadedData = generateData({ nDays });
  const { state } = useContext(AppContext);

  const { problemConfig } = state;

  const effectiveGap =
    problemConfig.forecastHorizon - problemConfig.featureEngineeringEnd;

  const marks = {
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
    <div className="my-10">
      <div>
        <ReactMarkdown className="prose text-left mx-auto mb-5">
          {`
Imagine that a user has uploaded **${
            uploadedData.length
          } days** of data, from **${uploadedData[0].date.toLocaleDateString()}** to **${uploadedData[
            uploadedData.length - 1
          ].date.toLocaleDateString()}**.`}
        </ReactMarkdown>
      </div>
      <VegaLite spec={spec} data={{ uploadedData, marks }} />
      <div>
        <ReactMarkdown className="prose text-left mx-auto my-5">
          {`
Based upon the problem configuration, we can use this data to forecast the next **${effectiveGap} days**, from ${marks.predStart.toLocaleDateString()} to the ${marks.predEnd.toLocaleDateString()}.
       
# Prediction

Now we are in the future and the user wants to upload some new data to predict on. There are 4 possible scenarios:

## Not Enough Data

The user needs to upload at least enough data to account for the all the lags, so in this case **${featureEngineeringWindowWidth} days**. If the user were to upload less than that (**${
            featureEngineeringWindowWidth - 1
          } days**) of data, there would not be enough data to account for all the lags.
`}
        </ReactMarkdown>

        <div className="mx-auto text-center flex justify-center">
          <Data3 nDays={featureEngineeringWindowWidth - 1} />
        </div>

        <ReactMarkdown className="prose text-left mx-auto my-5">
          {`
## Predicting a Single Day

If the user wanted to predict a single day, then the user needs to upload **${featureEngineeringWindowWidth} days** of data.
`}
        </ReactMarkdown>

        <div className="mx-auto text-center flex justify-center">
          <Data3 nDays={featureEngineeringWindowWidth} />
        </div>

        <ReactMarkdown className="prose text-left mx-auto my-5">
          {`
## Predicting Multiple Days

If the user wanted to predict multiple days, then they could upload between **${featureEngineeringWindowWidth} to ${
            featureEngineeringWindowWidth + effectiveGap - 1
          } days** of data.  The most days that can be predicted is **${effectiveGap} days**.`}
        </ReactMarkdown>

        <div className="mx-auto text-center flex justify-center">
          <Data3 nDays={featureEngineeringWindowWidth + effectiveGap - 1} />
        </div>

        <div>
          <ReactMarkdown className="prose text-left mx-auto my-5">
            {`
## Uploading Too Much Data

Uploading more than **${
              featureEngineeringWindowWidth + effectiveGap - 1
            } days** of data, would give predictions the user already knows about. 
            
For example, if the user uploads **${
              featureEngineeringWindowWidth + effectiveGap + 1
            } days** of data, we would be trying to predict values for 2 days that were already uploaded.`}
          </ReactMarkdown>

          <div className="mx-auto text-center flex justify-center">
            <Data3 nDays={featureEngineeringWindowWidth + effectiveGap + 1} />
          </div>
        </div>
      </div>
    </div>
  );
};
