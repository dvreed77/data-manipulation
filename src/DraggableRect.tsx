import { useState, MouseEventHandler } from "react";
import { roundNearest } from "./utils";

interface IProps {
  x1: number;
  x2: number;
  onChange: (a: number, b: number) => void;
  min: number;
  max: number;
  step: number;
  height: number;
}
export const DraggableRect = ({
  x1,
  x2,
  onChange,
  min,
  max,
  step,
  height,
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
  return (
    <rect
      x={x1}
      width={width}
      height={height}
      stroke="black"
      fill="rgba(211, 211, 211, 0)"
      onMouseDown={handleMouseDown}
      style={{ cursor: "move" }}
    />
  );
};
