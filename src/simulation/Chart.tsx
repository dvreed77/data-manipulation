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

const barData = {
  table: [
    { a: "A", b: 28, f: "F1" },
    { a: "B", b: 55, f: "F1" },
    { a: "C", b: 43, f: "F1" },
    { a: "D", b: 91, f: "F1" },
    { a: "E", b: 81, f: "F1" },
    { a: "F", b: 53, f: "F1" },
    { a: "G", b: 19, f: "F1" },
    { a: "H", b: 87, f: "F1" },
    { a: "I", b: 52, f: "F1" },
    { a: "A", b: 28, f: "F2" },
    { a: "B", b: 200, f: "F2" },
    { a: "C", b: 43, f: "F2" },
    { a: "D", b: 91, f: "F2" },
    { a: "E", b: 81, f: "F2" },
    { a: "F", b: 53, f: "F2" },
    { a: "G", b: 19, f: "F2" },
    { a: "H", b: 87, f: "F2" },
    { a: "I", b: 52, f: "F2" },
  ],
};

interface IProps {
  data: any;
}
export const Chart = ({ data }: IProps) => {
  console.log(data);
  return <VegaLite spec={spec2} data={{ table: data }} />;
};
