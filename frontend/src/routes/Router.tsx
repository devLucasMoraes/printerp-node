import { lazy } from "react";
import { Navigate } from "react-router";
import Loadable from "../layouts/full/shared/loadable/Loadable";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import("../layouts/full/FullLayout")));
const BlankLayout = Loadable(
  lazy(() => import("../layouts/blank/BlankLayout"))
);

/* ****Private Pages***** */
const Dashboard = Loadable(lazy(() => import("../page/dashboard/Dashboard")));
const Settings = Loadable(lazy(() => import("../page/settings/Settings")));
const Users = Loadable(lazy(() => import("../page/users/Users")));
const Categorias = Loadable(
  lazy(() => import("../page/categorias/Categorias"))
);
const Requisitantes = Loadable(
  lazy(() => import("../page/requisitantes/Requisitantes"))
);
const Setores = Loadable(lazy(() => import("../page/setores/Setores")));
const Insumos = Loadable(lazy(() => import("../page/insumos/Insumos")));
const RequisicoesEstoque = Loadable(
  lazy(() => import("../page/requisicoes-estoque/RequisicoesEstoque"))
);
const Armazens = Loadable(lazy(() => import("../page/armazens/Armazens")));
const Estoques = Loadable(lazy(() => import("../page/estoques/Estoques")));
const Emprestimos = Loadable(
  lazy(() => import("../page/emprestimos/Emprestimos"))
);
const Parceiros = Loadable(lazy(() => import("../page/parceiros/Parceiros")));

/* ****Public Pages***** */
const Register = Loadable(
  lazy(() => import("../page/authentication/Register"))
);
const Login = Loadable(lazy(() => import("../page/authentication/Login")));

const Error = Loadable(lazy(() => import("../page/authentication/Error")));

const Router = [
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <FullLayout />,
        children: [
          { path: "/", element: <Navigate to="/dashboard" /> },
          { path: "/dashboard", exact: true, element: <Dashboard /> },
          { path: "/settings", exact: true, element: <Settings /> },
          { path: "/users", exact: true, element: <Users /> },
          { path: "/categorias", exact: true, element: <Categorias /> },
          { path: "/requisitantes", exact: true, element: <Requisitantes /> },
          { path: "/setores", exact: true, element: <Setores /> },
          { path: "/insumos", exact: true, element: <Insumos /> },
          {
            path: "/requisicoes-estoque",
            exact: true,
            element: <RequisicoesEstoque />,
          },
          { path: "/armazens", exact: true, element: <Armazens /> },
          { path: "/estoques", exact: true, element: <Estoques /> },
          { path: "/emprestimos", exact: true, element: <Emprestimos /> },
          { path: "/parceiros", exact: true, element: <Parceiros /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <PublicRoute />,
    children: [
      {
        path: "/auth",
        element: <BlankLayout />,
        children: [
          { path: "register", element: <Register /> },
          { path: "login", element: <Login /> },
        ],
      },
    ],
  },
  {
    path: "/auth/404",
    element: <Error />,
  },
  {
    path: "*",
    element: <Navigate to="/auth/404" />,
  },
];

export default Router;
