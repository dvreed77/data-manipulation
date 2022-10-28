import { Configure } from "./Configure";
import { Forecast } from "./Forecast";
import { Results } from "./Results";
import { Train } from "./Train";
import { Upload } from "./Upload";
import { Upload2 } from "./Upload2";
import { NavLink, Outlet } from "react-router-dom";
import { SimulationControls } from "./SimulationControls";

export const steps = [
  { name: "Upload", path: "upload", component: <Upload /> },
  { name: "Configure", path: "configure", component: <Configure /> },
  { name: "Train", path: "train", component: <Train /> },
  { name: "Results", path: "results", component: <Results /> },
  { name: "Upload New", path: "upload2", component: <Upload2 /> },
  { name: "Forecast", path: "forecast", component: <Forecast /> },
];

export function Layout() {
  return (
    <div>
      <div className="border-b">
        <SimulationControls />
      </div>
      <div className="flex">
        <nav className="w-2/12 my-2">
          <ul className="grid gap-1 grid-cols-1">
            {steps.map((step) => (
              <li className="rounded border" key={step.name}>
                <NavLink
                  to={step.path}
                  className={({ isActive }) =>
                    isActive ? "bg-ayx-primary text-white" : "bg-inherit"
                  }
                >
                  <div className="p-3 bg-inherit">{step.name}</div>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="w-10/12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
