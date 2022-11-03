import { useState, MouseEventHandler } from "react";
import { MovableHandle } from "./MovableBar";
import { roundNearest } from "./utils";

interface IProps {
  x1: number;
  x2: number;
  onChange: (a: number, b: number) => void;
  min: number;
  max: number;
  step: number;
  height: number;
  resizable?: boolean;
  color?: string;
  offset?: number;
}

export const DraggableRect = ({
  x1,
  x2,
  onChange,
  min,
  max,
  step,
  height,
  resizable = false,
  color = "black",
  offset = 0,
}: IProps) => {
  const width = x2 - x1;
  const handleMouseDown: MouseEventHandler<SVGRectElement> = (e) => {
    let lastX = NaN;
    const initialStart = x1;
    e.preventDefault();
    const handleMouseMove = (e2: MouseEvent) => {
      const dx = e2.pageX - e.pageX;

      if (dx === 0) return;
      const newX = initialStart + dx;

      if (newX === lastX) return;

      if (newX >= min && newX + width <= max) {
        onChange(roundNearest(newX, step), roundNearest(newX, step) + width);
        lastX = newX;
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", handleMouseMove);
      },
      { once: true }
    );
  };

  function handleStartChange(v: number) {
    onChange(v - step, x2);
  }

  function handleStopChange(v: number) {
    onChange(x1, v - step);
  }
  return (
    <g>
      <rect
        x={x1 + offset}
        width={width}
        height={height}
        fill={color}
        opacity={0.5}
        onMouseDown={handleMouseDown}
        style={{ cursor: "move" }}
      />
      {resizable && (
        <>
          <MovableHandle
            x={x1 + offset} //TODO(dreed): figure out why its +1
            onChange={handleStartChange}
            min={0}
            max={x2}
            step={step}
            height={height}
          />
          <MovableHandle
            x={x2 + offset}
            onChange={handleStopChange}
            min={x1}
            max={max + offset}
            step={step}
            height={height}
          />
        </>
      )}
    </g>
  );
};
