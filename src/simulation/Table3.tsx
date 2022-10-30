import { useContext, useEffect } from "react";
import { ActionType, AppContext } from "./reducer";
import { Row2 } from "./Train";
import { Row } from "./types";

const TableRows = ({ data }: { data: Row2[] }) => {
  const { state, dispatch } = useContext(AppContext);

  function handleClick(row: any) {
    dispatch({ type: ActionType.SET_SELECTED_ROW, payload: row.key });
  }

  useEffect(() => {
    const element = document.getElementById(`row2-${state.selectedRow}`);

    element?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [state.selectedRow]);
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
          <td
            id={`row2-${row.key}`}
            className="whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-inherit sm:pl-6"
          >
            {row.key}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-inherit">
            {row.date.toLocaleDateString()}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-inherit">
            {isNaN(row.lag1) ? "--" : row.lag1}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-inherit">
            ...
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-inherit">
            {isNaN(row.lag2) ? "--" : row.lag2}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-inherit">
            {row.sales}
          </td>
        </tr>
      ))}
    </>
  );
};

export const Table3 = ({ data }: { data: Row2[] }) => {
  const { state, dispatch } = useContext(AppContext);

  const effectiveGap =
    state.problemConfig.forecastHorizon -
    state.problemConfig.featureEngineeringEnd;

  const lag1 =
    state.problemConfig.forecastHorizon -
    state.problemConfig.featureEngineeringEnd;

  const lag2 =
    state.problemConfig.forecastHorizon -
    state.problemConfig.featureEngineeringStart;

  return (
    <div className="overflow-x-auto max-h-96">
      <table className="min-w-full divide-y divide-gray-300 max-h-96">
        <thead className="bg-gray-50 table-header-group sticky top-0 border-b border-gray-400">
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
              Sales Lag {lag1}
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              ...
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Sales Lag {lag2}
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Sales
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white max-h-96 overflow-auto table-row-group">
          <TableRows data={data} />
        </tbody>
      </table>
    </div>
  );
};
