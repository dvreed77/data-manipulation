import { ProblemConfig } from "./types";

interface IProps {
  problemConfig: ProblemConfig;
}

export function ProblemDataDisplay2({ problemConfig }: IProps) {
  const { featureEngineeringStart, featureEngineeringEnd, forecastHorizon } =
    problemConfig;
  const stats = [
    {
      name: "FE Interval",
      stat: featureEngineeringEnd - featureEngineeringStart + 1,
    },
    { name: "Data Access Gap", stat: -featureEngineeringEnd },
    { name: "Forecast Distance", stat: forecastHorizon },
    { name: "Effective Gap", stat: forecastHorizon - featureEngineeringEnd },
  ];
  return (
    <div>
      <dl className="flex flex-col">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden bg-white px-2 py-1 mx-1"
          >
            <dt className="truncate text-xs font-medium text-gray-400">
              {item.name}
            </dt>
            <dd className="mt-1 text-lg font-semibold tracking-tight text-gray-900">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
