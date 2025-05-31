import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Patient from "./pages/Patient";
import Representante from "./pages/Representante";
import WelcomePage from "./pages/WelcomePage";
import HomeAndLoginLayout from "./layouts/HomeAndLoginLayout";
import Users from "./pages/Users";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomeAndLoginLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
    ],
  },
  {
    path: "/sistem",
    element: <MainLayout />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: "/sistem/usuarios", element: <Users /> },
      { path: "/sistem/paciente", element: <Patient /> },
      { path: "/sistem/representante", element: <Representante /> },
    ],
  },
]);
