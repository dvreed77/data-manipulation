import { useContext } from "react";
import { ActionType, AppContext } from "./reducer";
import { Row } from "./types";

const TableRows = ({ data }: { data: Row[] }) => {
  const { state, dispatch } = useContext(AppContext);

  function handleClick(row: any) {
    const effectiveGap =
      state.problemConfig.forecastHorizon -
      state.problemConfig.featureEngineeringEnd;

    const myRow = row.key - effectiveGap;
    console.log(myRow);

    const element = document.getElementById(`row-${myRow}`);

    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    dispatch({ type: ActionType.SET_SELECTED_ROW, payload: row.key });
  }
  return (
    <>
      {data.map((row) => (
        <tr
          key={row.key}
          onClick={() => handleClick(row)}
          className={`cursor-pointer ${
            state.selectedRow === row.key ? "bg-red-200 text-red-900" : ""
          }`}
        >
          <td className="whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-inherit sm:pl-6">
            {row.key}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-inherit">
            {row.date.toLocaleDateString()}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-inherit">
            {row.f_1}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-inherit">
            {row.sales}
          </td>
        </tr>
      ))}
    </>
  );
};

export const Table3 = ({ data }: { data: Row[] }) => {
  return (
    <table className="min-w-full divide-y divide-gray-300 max-h-96">
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
            Feature 1
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Sales
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white max-h-96 overflow-auto block">
        <TableRows data={data} />
      </tbody>
    </table>
  );
};
