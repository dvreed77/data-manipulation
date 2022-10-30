import { Chart } from "./Chart";
import { Table } from "./Table";
import { Row } from "./types";
import { generateData } from "./utils";

export const Upload = () => {
  const onClick = () => {
    console.log("Upload");
  };

  const data = generateData();
  return (
    <div className="flex flex-col">
      <div>
        <button
          onClick={onClick}
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ayx-primary focus:ring-offset-2"
        >
          Upload
        </button>
      </div>
      <div>
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <div className="text-sm text-blue-800">
                <p>
                  User uploaded 2000 rows of data that starts on{" "}
                  <b>{data[0].date.toLocaleDateString()}</b> and ends on{" "}
                  <b>{data[data.length - 1].date.toLocaleDateString()}</b>.
                </p>
                <p>
                  The data ends about a month ago, but during prediction, this
                  could be more or less.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Chart data={data} />

      <Table data={data} />
    </div>
  );
};
