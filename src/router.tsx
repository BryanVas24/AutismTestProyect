import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);
