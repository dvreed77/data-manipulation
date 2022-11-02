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

type TransformedRow = {
  key: number;
  keyLabel?: string;
  date: string;
  sales: string;
  class?: string;
};
function transformData({ data, selectedRow, lag1, lag2 }: ITransformProps) {
  const data2: TransformedRow[] = data.map((d) => ({
    ...d,
    date: d.date.toLocaleDateString(),
    sales: d.sales.toString(),
    selected: d.key === selectedRow,
  }));
  if (selectedRow === undefined || selectedRow === null) {
    console.log("selectedRow is undefined");
    return data2;
  }
  const feStartIdx = selectedRow - lag2;
  const feEndIdx = selectedRow - lag1;

  const newData: TransformedRow[] = [...data2.slice(0, feStartIdx)];

  newData.push({
    ...data2[feStartIdx],
    class: "bg-green-500 border-t border-green-700",
  });

  if (feEndIdx - feStartIdx > 1) {
    newData.push({
      key: feStartIdx + 1,
      keyLabel: `...`,
      date: "...",
      sales: "...",
      class: "bg-green-500",
    });
  }

  if (feEndIdx - feStartIdx > 0) {
    newData.push({
      ...data2[feEndIdx],
      class: "bg-green-500 border-b border-green-700",
    });
  }

  if (selectedRow - feEndIdx > 1) {
    newData.push({ ...data2[feEndIdx + 1] });
  }

  if (selectedRow - feEndIdx === 4) {
    newData.push({ ...data2[feEndIdx + 2] });
  }

  if (selectedRow - feEndIdx > 4) {
    newData.push({
      key: feEndIdx + 2,
      keyLabel: `...`,
      date: "...",
      sales: "...",
      class: "",
    });
  }

  if (selectedRow - feEndIdx > 2) {
    newData.push({ ...data2[selectedRow - 1] });
  }

  newData.push({
    ...data2[selectedRow],
    class: "bg-red-500 border-y border-red-800",
  });

  newData.push(...data2.slice(selectedRow + 1));

  return newData;
}
const TableRows = ({ data }: { data: Row[] }) => {
  const { state, dispatch } = useContext(AppContext);

  const [transformedData, setTransformedData] = useState(
    transformData({ data, lag1: 0, lag2: 0 })
  );

  useEffect(() => {
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
      block: "center",
    });
  }, [state.selectedRow, state.problemConfig]);

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
            {row.keyLabel || row.key}
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
