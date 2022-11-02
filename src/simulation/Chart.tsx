import { VegaLite, VisualizationSpec } from "react-vega";

const spec: VisualizationSpec = {
  data: { name: "table" }, // note: vega-lite data attribute is a plain object instead of an array
  facet: { row: { field: "f", title: "Feature" } },
  spec: {
    width: 1000,
    height: 200,
    mark: "line",
    encoding: {
      x: { field: "a", type: "ordinal" },
      y: { field: "b", type: "quantitative" },
    },
  },
};

const spec2: VisualizationSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Google's stock price over time.",
  //   data: { url: "data/stocks.csv" },
  data: { name: "table" },
  //   transform: [{ filter: "datum.symbol==='GOOG'" }],
  mark: "line",
  width: 1000,
  height: 200,
  encoding: {
    x: { field: "date", type: "temporal" },
    // x: { field: "key", type: "quantitative" },
    y: { field: "sales", type: "quantitative" },
  },
};

interface IProps {
  data: any;
}
export const Chart = ({ data }: IProps) => {
  console.log(data);
  return <VegaLite spec={spec2} data={{ table: data }} />;
};
