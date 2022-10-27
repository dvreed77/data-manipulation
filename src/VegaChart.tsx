import { VegaLite } from "react-vega";

const spec = {
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

export const VegaChart = () => {
  return <VegaLite spec={spec} data={barData} />;
};
