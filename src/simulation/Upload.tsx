import { Chart } from "./Chart";
import { Table } from "./Table";
import { Row } from "./types";

export function generateData(): Row[] {
  const nDays = 2000;
  const today = new Date();
  const day = 60 * 60 * 24 * 1000;
  const gap = 30;
  const startDate = new Date(today.getTime() - day * (nDays + gap));
  const data = [];
  for (let i = 0; i < 2000; i++) {
    const weekly = Math.cos(i / 7);
    const monthly = Math.cos(i / 30);
    const yearly = Math.cos(i / 365);
    const seasonal = Math.cos(i / 90);
    data.push({
      key: i,
      date: new Date(startDate.getTime() + i * day),
      f_1: i,
      sales: 0.2 * weekly + 0.4 * monthly + yearly + seasonal,
    });
  }

  const minValue = Math.min(...data.map((d) => d.sales));
  const maxValue = Math.max(...data.map((d) => d.sales));

  const normalize = data.map((d) => ({
    ...d,
    sales: Math.round(
      ((d.sales - minValue) / (maxValue - minValue)) * 1000 + 100
    ),
  }));
  return normalize;
}

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
