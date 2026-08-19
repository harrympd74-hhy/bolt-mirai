import AdminDashboard from "./pages/AdminDashboard";
import GuruDashboard from "./pages/GuruDashboard";
import SiswaDashboard from "./pages/SiswaDashboard";
import OrangtuaDashboard from "./pages/OrangtuaDashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

export const routers = [
  {
    path: "/",
    name: "home",
    element: <Index />,
  },
  {
    path: "/admin",
    name: "admin",
    element: <AdminDashboard />,
  },
  {
    path: "/guru",
    name: "guru",
    element: <GuruDashboard />,
  },
  {
    path: "/siswa",
    name: "siswa",
    element: <SiswaDashboard />,
  },
  {
    path: "/orangtua",
    name: "orangtua",
    element: <OrangtuaDashboard />,
  },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
