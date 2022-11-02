import { VegaLite, VisualizationSpec } from "react-vega";
import { generateData } from "./utils";

export const Simulation = () => {
  const uploadedData = generateData();

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
    ],
  };

  return (
    <div>
      <div>
        Imagine that a user has uploaded {uploadedData.length} data points, from{" "}
        {uploadedData[0].date.toLocaleDateString()} to{" "}
        {uploadedData[uploadedData.length - 1].date.toLocaleDateString()}.
      </div>
      <VegaLite spec={spec} data={{ uploadedData }} />
      <div>
        Based upon the problem configuration, we can forecast the next 30 days.
      </div>
    </div>
  );
};
