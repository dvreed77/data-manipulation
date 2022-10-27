import { Routes, Route, Link, Outlet, useLocation } from "react-router-dom";

export const Upload = () => {
  return <div>Upload</div>;
};
export const Configure = () => {
  return <div>Configure</div>;
};
export const Train = () => {
  return <div>Train</div>;
};
export const Results = () => {
  return <div>Results</div>;
};
export const Upload2 = () => {
  return <div>Upload New</div>;
};
export const Forecast = () => {
  return <div>Forecast</div>;
};

const steps = [
  { name: "Upload", path: "upload", component: <Upload /> },
  { name: "Configure", path: "configure", component: <Configure /> },
  { name: "Train", path: "train", component: <Train /> },
  { name: "Results", path: "results", component: <Results /> },
  { name: "Upload New", path: "upload2", component: <Upload2 /> },
  { name: "Forecast", path: "forecast", component: <Forecast /> },
];

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to={""}>Home</Link>
          </li>
          {steps.map((step) => (
            <li>
              <Link to={step.path}>{step.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

export const Flow = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {steps.map((step) => (
          <Route key={step.path} path={step.path} element={step.component} />
        ))}
      </Route>
    </Routes>
  );
};
