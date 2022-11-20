import React from "react";
import Home from "./page/home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Data from "./page/data";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "data",
    element: <Data />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
