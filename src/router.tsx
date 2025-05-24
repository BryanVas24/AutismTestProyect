import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>Hola mundo</h1>,
    errorElement: <ErrorPage />,
    children: [],
  },
]);
