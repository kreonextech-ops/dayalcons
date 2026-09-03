import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    const userStr = localStorage.getItem("dayal_user");
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user?.role === "Admin";
  
      return routes.map((prop, key) => {
        let hasPermission = false;
        if (isAdmin) {
          hasPermission = true;
        } else if (prop.layout === "/admin") {
          const allowedForEmployees = [
            "Dashboard", 
            "Leads", 
            "Clients", 
            "Design & Legal Services", 
            "Execution Projects", 
            "Tasks"
          ];
          if (allowedForEmployees.includes(prop.name)) {
            hasPermission = true;
          }
        }
  
        if (prop.layout === "/admin" && hasPermission) {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else if (prop.layout === "/admin") {
         // Render a unauthorized redirect for routes they don't have access to
         // But only if it's not the default path they are trying to reach, to avoid redirect loops
         // A safer way is just not registering the route at all, or rendering a generic "No Access" message
         return <Route path={`/${prop.path}`} element={<div className="p-10 text-center font-bold text-red-500">You do not have permission to access this module.</div>} key={key} />;
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Dayal Construction CRM"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}

                <Route
                  path="/"
                  element={<Navigate to={
                     // Find first permitted route
                     (() => {
                       const userStr = localStorage.getItem("dayal_user");
                       const user = userStr ? JSON.parse(userStr) : null;
                       const isAdmin = user?.role === "Admin";
                       const perms = user?.permissions || {};
                       if (isAdmin) return "/admin/default";
                       
                       for (const r of routes) {
                          if (r.layout === "/admin") {
                             let mName = r.name;
                             if (mName === "Dashboard") return "/admin/" + r.path;
                             if (mName === "Design & Legal Services") mName = "Design Services";
                             if (perms[mName] && perms[mName].view) {
                                return "/admin/" + r.path;
                             }
                          }
                       }
                       return "/admin/default"; // fallback
                     })()
                  } replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
