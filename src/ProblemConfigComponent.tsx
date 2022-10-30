import * as d3 from "d3";
import { DraggableRect } from "./DraggableRect";
import { ProblemConfig } from "./types";

interface IProps {
  featureEngineeringMax: number;
  problemConfig: ProblemConfig;
  forecastHorizonMax: number;
  showIntervals?: boolean;
  onChange: (_: ProblemConfig) => void;
}

export const ProblemConfigComponent = ({
  featureEngineeringMax,
  forecastHorizonMax,
  problemConfig,
  onChange,
  showIntervals = true,
}: IProps) => {
  const svgWidth = 500;
  const svgHeight = 80;
  const padding = 10;

  const canvasWidth = svgWidth - 2 * padding;
  const canvasHeight = svgHeight - 2 * padding;
  const xScale = d3
    .scaleLinear()
    .domain([-featureEngineeringMax, forecastHorizonMax])
    .range([0, canvasWidth]);

  const { featureEngineeringStart, featureEngineeringEnd, forecastHorizon } =
    problemConfig;

  const step = canvasWidth / (forecastHorizonMax + featureEngineeringMax);
  const start = xScale(featureEngineeringStart - 1);
  const stop = xScale(featureEngineeringEnd);
  const horizon = xScale(forecastHorizon);
  const forecastPoint = xScale(0);

  const handleHorizonChange = (v: number) => {
    const prev = problemConfig.forecastHorizon;
    const next = Math.round(xScale.invert(v));

    if (next !== prev) {
      onChange({
        ...problemConfig,
        forecastHorizon: Math.round(xScale.invert(v)),
      });
    }
  };

  const handleDragChange = (a: number, b: number) => {
    const prevA = problemConfig.featureEngineeringStart;
    const nextA = Math.round(xScale.invert(a)) + 1;

    const prevB = problemConfig.featureEngineeringEnd;
    const nextB = Math.round(xScale.invert(b));

    if (nextA !== prevA || nextB !== prevB) {
      onChange({
        ...problemConfig,
        featureEngineeringStart: nextA,
        featureEngineeringEnd: nextB,
      });
    }
  };

  return (
    <div>
      <svg width={svgWidth} height={svgHeight}>
        <g transform={`translate(${padding}, ${padding})`}>
          <g transform={`translate(${forecastPoint}, -10)`}>
            <path
              d={`M 0 0 L ${step} 0 L ${step / 2} 10 Z`}
              fill="orange"
              opacity={0.5}
            />
          </g>
          {Array.from({
            length: featureEngineeringMax + forecastHorizonMax,
          }).map((_, i) => {
            return (
              <g key={i}>
                <line
                  key={i}
                  x1={i * step}
                  y1={0}
                  x2={i * step}
                  y2={canvasHeight}
                  stroke="#ddd"
                  strokeWidth={1}
                />
                {showIntervals && (
                  <text
                    x={i * step + step / 2}
                    y={canvasHeight / 2}
                    textAnchor="middle"
                    alignmentBaseline="mathematical"
                    fill="#aaa"
                  >
                    {i - 10}
                  </text>
                )}
              </g>
            );
          })}
          <rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill="None"
            stroke="#aaa"
          />
          <rect
            x={forecastPoint}
            y={0}
            width={step}
            height={canvasHeight}
            fill={"orange"}
            opacity={0.5}
          />
          <DraggableRect
            x1={start}
            x2={stop}
            onChange={handleDragChange}
            min={-step}
            max={forecastPoint}
            step={step}
            height={canvasHeight}
            resizable={true}
            color="green"
            offset={step}
          />
          <DraggableRect
            x1={horizon}
            x2={horizon + step}
            onChange={handleHorizonChange}
            min={forecastPoint}
            max={canvasWidth}
            step={step}
            height={canvasHeight}
            color="red"
          />
        </g>
      </svg>
    </div>
  );
};
