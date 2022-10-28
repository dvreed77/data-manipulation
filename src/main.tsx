import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { TensorflowDemo } from "./TensorflowDemo";
import {
  createBrowserRouter,
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { Flow } from "./simulation/Flow";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/tf",
      element: <TensorflowDemo />,
    },
    {
      path: "/flow",
      element: <Flow />,
    },
  ],
  { basename: "/ts-featurizer-explainer" }
);

const MyRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="flow/*" element={<Flow />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename="/ts-featurizer-explainer">
      <MyRouter />
    </BrowserRouter>
  </React.StrictMode>
);
