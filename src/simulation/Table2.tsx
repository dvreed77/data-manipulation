import { useContext } from "react";
import { AppContext } from "./reducer";
import { Row } from "./types";

const TableRows = ({ data }: { data: Row[] }) => {
  const { state, dispatch } = useContext(AppContext);

  const effectiveGap =
    state.problemConfig.forecastHorizon -
    state.problemConfig.featureEngineeringEnd;

  const myRow = state.selectedRow - effectiveGap;
  console.log(state.selectedRow, effectiveGap);

  return (
    <>
      {data.map((row) => (
        <tr
          key={row.key}
          className={`cursor-pointer ${myRow === row.key ? "bg-gray-200" : ""}`}
        >
          <td
            id={`row-${row.key}`}
            className="whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
          >
            {row.key}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
            {row.date.toLocaleDateString()}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
            {row.sales}
          </td>
        </tr>
      ))}
    </>
  );
};

export const Table2 = ({ data }: { data: Row[] }) => {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50 block">
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
          >
            #
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Date
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Sales
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white  max-h-96 overflow-auto block">
        <TableRows data={data} />
      </tbody>
    </table>
  );
};
