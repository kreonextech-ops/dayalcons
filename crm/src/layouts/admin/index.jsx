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
    return routes.map((prop, key) => {
      if (prop.layout === "/admin" || prop.layout === "/auth") {
        
        let hasPermission = false;
        const userStr = localStorage.getItem("dayal_user");
        const loggedInUser = userStr ? JSON.parse(userStr) : null;
        const isAdmin = loggedInUser?.role === 'Admin';
        const isCRO = loggedInUser?.role === 'CRO';
  
        if (isAdmin) {
          hasPermission = true;
        } else if (isCRO && prop.layout === "/admin") {
          const allowedForCRO = [
            "Dashboard",
            "Clients",
            "Design & Legal Services",
            "Execution Projects",
            "Tasks",
            "Follow Ups",
            "Profile Settings"
          ];
          if (allowedForCRO.includes(prop.name)) hasPermission = true;
        } else if (prop.layout === "/admin") {
          const allowedForEmployees = [
            "Dashboard", 
            "Leads", 
            "Clients", 
            "Design & Legal Services", 
            "Execution Projects", 
            "Tasks",
            "Follow Ups",
            "Profile Settings"
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
         return <Route path={`/${prop.path}`} element={<div className="p-10 text-center font-bold text-red-500">You do not have permission to access this module.</div>} key={key} />;
      } else {
        return null;
      }
      }
      return null;
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Mobile Backdrop */}
      {open && window.innerWidth < 1200 ? (
        <div 
          className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to={
                     // Find first permitted route
                     (() => {
                       const userStr = localStorage.getItem("dayal_user");
                       const loggedInUser = userStr ? JSON.parse(userStr) : null;
                       const isAdmin = loggedInUser?.role === 'Admin';
                       const isCRO = loggedInUser?.role === 'CRO';
                       if (isAdmin) return "/admin/default";
                       if (isCRO) return "/admin/clients";
                       
                       const allowed = ["Dashboard", "Leads", "Clients", "Design & Legal Services", "Execution Projects", "Tasks", "Follow Ups", "Profile Settings"];
                       const firstMatch = routes.find(r => r.layout === "/admin" && allowed.includes(r.name));
                       return firstMatch ? `/admin/${firstMatch.path}` : "/admin/default";
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
