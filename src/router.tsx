import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PruebaAutismo from "./pages/PruebaAutismo";
import Representante from "./pages/Representante";
import WelcomePage from "./pages/WelcomePage";
import HomeAndLoginLayout from "./layouts/HomeAndLoginLayout";
import Pacientes from "./pages/Pacientes";
import Users from "./pages/Users";
import Auditoria from "./pages/Auditoria";
import Agenda from "./pages/Agenda";
import Dashboard from "./pages/Dashboard";
import Tests from "./pages/Test";
import TestDetail from "./pages/TestDetail";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomeAndLoginLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/prueba-autismo", element: <PruebaAutismo /> },
    ],
  },
  {
    path: "/sistem",
    element: <MainLayout />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: "/sistem/usuarios", element: <Users /> },
      { path: "/sistem/paciente", element: <Pacientes /> },
      { path: "/sistem/representante", element: <Representante /> },
      { path: "/sistem/auditoria", element: <Auditoria /> },
      { path: "/sistem/agenda", element: <Agenda /> },
      { path: "/sistem/dashboard", element: <Dashboard /> },
      { path: "/sistem/tests", element:<Tests />},
      { path: "/sistem/tests/:id", element:<TestDetail />},
    ],
  },
]);
