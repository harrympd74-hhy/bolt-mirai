import AdminDashboard from "./pages/AdminDashboard";
import GuruDashboard from "./pages/GuruDashboard";
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
