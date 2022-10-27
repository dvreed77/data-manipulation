import { Routes, Route, Link, Outlet, useLocation } from "react-router-dom";

export const A = () => {
  return <div>A</div>;
};
export const B = () => {
  return <div>B</div>;
};
export const C = () => {
  return <div>C</div>;
};
export const D = () => {
  return <div>D</div>;
};

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
          <li>
            <Link to={`B`}>B</Link>
          </li>
          <li>
            <Link to={`C`}>C</Link>
          </li>
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
        <Route path="B" element={<B />} />
        <Route path="C" element={<C />} />
      </Route>
    </Routes>
  );
};
