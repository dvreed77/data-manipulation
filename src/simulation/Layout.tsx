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
              <NavLink key={step.path} to={step.path}>
                {({ isActive }) => (
                  <li
                    className={`rounded border overflow-hidden ${
                      isActive && "bg-ayx-primary text-white"
                    }`}
                    key={step.name}
                  >
                    <div className="p-3 bg-inherit">{step.name}</div>
                  </li>
                )}
              </NavLink>
            ))}
          </ul>
        </nav>
        <div className="w-10/12">
          <div className="m-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
