import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import ClientSidebar from "components/sidebar/ClientSidebar";
import Footer from "components/footer/Footer";
import clientRoutes from "routes-client.js";


const WatermarkOverlay = () => {
    const userStr = localStorage.getItem("dayal_user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return null;
    const wmText = `${user.name} - ${user.email}`;

    const items = Array(200).fill(wmText);

    return (
        <div style={{
            position: 'fixed', top: '-50%', left: '-50%', width: '200vw', height: '200vh',
            pointerEvents: 'none', zIndex: 9999, overflow: 'hidden',
            display: 'flex', flexWrap: 'wrap', opacity: 0.03, userSelect: 'none', 
            transform: 'rotate(-25deg)', transformOrigin: 'center'
        }}>
            {items.map((t, i) => (
               <div key={i} style={{ padding: '30px 50px', whiteSpace: 'nowrap', fontSize: '20px', fontWeight: 'bold', color: 'black' }}>
                   {t}
               </div>
            ))}
        </div>
    );
};

export default function ClientLayout(props) {

  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/client") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <WatermarkOverlay />
      <ClientSidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}>
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Dayal Portal"}
              brandText={"My Dashboard"}
              secondary={false}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(clientRoutes)}
                <Route
                  path="/"
                  element={<Navigate to="/client/default" replace />}
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

