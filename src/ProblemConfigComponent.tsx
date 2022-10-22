import * as d3 from "d3";
import { DraggableRect } from "./DraggableRect";
import { MovableBar } from "./MovableBar";
import { ProblemConfig } from "./types";

interface IProps {
  featureEngineeringMax: number;
  problemConfig: ProblemConfig;
  forecastHorizonMax: number;
  onChange: (_: ProblemConfig) => void;
}

export const ProblemConfigComponent = ({
  featureEngineeringMax,
  forecastHorizonMax,
  problemConfig,
  onChange,
}: IProps) => {
  const svgWidth = 500;
  const svgHeight = 100;
  const padding = 10;

  const canvasWidth = svgWidth - 2 * padding;
  const canvasHeight = svgHeight - 2 * padding;
  const xScale = d3
    .scaleLinear()
    .domain([-featureEngineeringMax, forecastHorizonMax])
    .range([0, canvasWidth]);

  const { featureEngineeringStart, featureEngineeringEnd, forecastHorizon } =
    problemConfig;

  const start = xScale(featureEngineeringStart);
  const stop = xScale(featureEngineeringEnd);
  const horizon = xScale(forecastHorizon);
  const forecastPoint = xScale(0);

  const width = stop - start;

  const step = canvasWidth / (forecastHorizonMax + featureEngineeringMax);

  const handleStartChange = (v: number) => {
    onChange({
      ...problemConfig,
      featureEngineeringStart: Math.round(xScale.invert(v)),
    });
  };

  const handleStopChange = (v: number) => {
    onChange({
      ...problemConfig,
      featureEngineeringEnd: Math.round(xScale.invert(v)),
    });
  };

  const handleHorizonChange = (v: number) => {
    onChange({
      ...problemConfig,
      forecastHorizon: Math.round(xScale.invert(v)),
    });
  };

  const handleDragChange = (a: number, b: number) => {
    onChange({
      ...problemConfig,
      featureEngineeringStart: Math.round(xScale.invert(a)),
      featureEngineeringEnd: Math.round(xScale.invert(b)),
    });
  };

  return (
    <div>
      <svg width={svgWidth} height={svgHeight}>
        <g transform={`translate(${padding}, ${padding})`}>
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
          />
          <DraggableRect
            x1={start}
            x2={stop}
            onChange={handleDragChange}
            min={0}
            max={forecastPoint}
            step={step}
            height={canvasHeight}
          />
          {/* <MovableBar
            x={start}
            onChange={handleStartChange}
            min={0}
            max={stop - step}
            step={step}
            height={canvasHeight}
          />
          <MovableBar
            x={stop}
            onChange={handleStopChange}
            min={start + step}
            max={canvasWidth}
            step={step}
            height={canvasHeight}
          /> */}
          <MovableBar
            x={horizon}
            width={step}
            onChange={handleHorizonChange}
            min={forecastPoint + step}
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
