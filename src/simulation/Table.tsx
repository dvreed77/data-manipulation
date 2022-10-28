import { Row } from "./types";

const TableRows = ({ data }: { data: Row[] }) => {
  return (
    <>
      {data.map((row) => (
        <tr key={row.key}>
          <td className="whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
            {row.key}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
            {row.date.toLocaleDateString()}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
            {row.f_1}
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
            {row.sales}
          </td>
        </tr>
      ))}
    </>
  );
};

export const Table = ({ data }: { data: Row[] }) => {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
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
      <tbody className="divide-y divide-gray-200 bg-white">
        <TableRows data={data.slice(0, 5)} />
        <tr>
          <td className="whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
            ...
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
            ...
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
            ...
          </td>
        </tr>
        <tr>
          <td className="whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
            ...
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
            ...
          </td>
          <td className="whitespace-nowrap px-3 py-1 text-sm text-gray-500">
            ...
          </td>
        </tr>
        <TableRows data={data.slice(-5)} />
      </tbody>
    </table>
  );
};
