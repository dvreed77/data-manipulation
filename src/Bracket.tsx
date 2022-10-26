import * as d3 from "d3";

interface IProps {
  x?: number;
  y?: number;
  width: number;
  height: number;
  label: string;
  color?: string;
}

export const Bracket = ({
  x = 0,
  y = 0,
  width,
  height,
  label,
  color = "#aaa",
}: IProps) => {
  const path = d3.path();

  path.moveTo(x, y);
  path.lineTo(x + width, y + 5);
  path.lineTo(x + width, y + height - 5);
  path.lineTo(x, y + height);

  return (
    <g>
      <path d={path.toString()} stroke={color} strokeWidth={1} fill="none" />
      <line
        x1={x + width}
        x2={x + width + 5}
        y1={y + height / 2}
        y2={y + height / 2}
        stroke={color}
        strokeWidth={1}
      />
      <text
        x={x + width + 10}
        y={y + height / 2}
        fontSize={10}
        alignmentBaseline="middle"
        fill={color}
      >
        {label}
      </text>
    </g>
  );
};
