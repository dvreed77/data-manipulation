import { useContext, useEffect, useState } from "react";
import { AppContext } from "./reducer";
import { Row2 } from "./Train";
import { Row } from "./types";

interface ITransformProps {
  data: Row[];
  selectedRow?: number;
  lag1: number;
  lag2: number;
}
function transformData({ data, selectedRow, lag1, lag2 }: ITransformProps) {
  if (selectedRow === undefined || selectedRow === null) {
    console.log("selectedRow is undefined");
    return data.map((d) => ({
      ...d,
      date: d.date.toLocaleDateString(),
      selected: false,
    }));
  }
  const idx1 = selectedRow - lag2;
  const idx2 = selectedRow - lag1;

  const grp1 = data.slice(0, idx1);
  const gap1 = [
    { ...data[idx1], class: "bg-green-500 border-t border-green-700" },
    {
      key: `${idx1 + 1}-${idx2 - 1}`,
      date: undefined,
      sales: "...",
      class: "bg-green-500",
    },
    { ...data[idx2], class: "bg-green-500 border-b border-green-700" },
    { ...data[idx2 + 1], class: "" },
    {
      key: `${idx2 + 2}-${selectedRow - 2}`,
      date: undefined,
      sales: "...",
      class: "",
    },
    { ...data[selectedRow - 1], class: "" },
    { ...data[selectedRow], class: "bg-red-500 border-y border-red-800" },
  ];
  const grp2 = data.slice(selectedRow + 1);

  const transformedData = [...grp1, ...gap1, ...grp2];

  const d = transformedData.map((d) => {
    return {
      ...d,
      date: d.date ? d.date.toLocaleDateString() : "...",
      selected: d.key === selectedRow,
      class: (d as any).class ?? "",
    };
  });

  return d;
}
const TableRows = ({ data }: { data: Row[] }) => {
  const { state, dispatch } = useContext(AppContext);

  const [transformedData, setTransformedData] = useState(
    transformData({ data, lag1: 0, lag2: 0 })
  );

  useEffect(() => {
    // const effectiveGap =
    //   state.problemConfig.forecastHorizon -
    //   state.problemConfig.featureEngineeringEnd;

    const lag1 =
      state.problemConfig.forecastHorizon -
      state.problemConfig.featureEngineeringEnd;

    const lag2 =
      state.problemConfig.forecastHorizon -
      state.problemConfig.featureEngineeringStart;

    setTransformedData(
      transformData({ data, selectedRow: state.selectedRow, lag1, lag2 })
    );

    const element = document.getElementById(`row-${state.selectedRow}`);

    element?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    console.log("scrolling to row", state.selectedRow);
  }, [state.selectedRow, state.problemConfig]);

  console.log("render");
  return (
    <>
      {transformedData.map((row) => (
        <tr key={row.key} className={`table-row`}>
          <td
            id={`row-${row.key}`}
            className={`whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ${
              (row as any).class
            }`}
          >
            {row.key}
          </td>
          <td
            className={`whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ${
              (row as any).class
            }`}
          >
            {row.date}
          </td>
          <td
            className={`whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 ${
              (row as any).class
            }`}
          >
            {row.sales}
          </td>
        </tr>
      ))}
    </>
  );
};

export const Table2 = ({ data }: { data: Row[] }) => {
  return (
    <div className="overflow-x-auto max-h-96">
      <table
        className="min-w-full border-separate"
        style={{ borderSpacing: 0 }}
      >
        <thead className="table-header-group sticky top-0 z-10 bg-gray-50 bg-opacity-75 backdrop-blur backdrop-filter">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8 border-b border-gray-300"
            >
              #
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-300"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-b border-gray-300"
            >
              Sales
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white  max-h-96 overflow-auto table-row-group">
          <TableRows data={data} />
        </tbody>
      </table>
    </div>
  );
};
