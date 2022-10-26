import { useState, useContext } from "react";
import { ThemeContext } from "./App";

export { Counter };

function Counter() {
  //   const [count, setCount] = useState(0);

  const { cellSize, cellGap, value, setValue } = useContext(ThemeContext);

  console.log("asdas", cellSize, cellGap, value);

  return (
    <button onClick={() => setValue((count) => count + 1)}>
      John: {value} {cellSize} {cellGap}
    </button>
  );
}
