import React from "react";
import { MdHome, MdAssignment } from "react-icons/md";
import ClientDashboard from "views/client/dashboard";

const clientRoutes = [
  {
    name: "My Project Dashboard",
    layout: "/client",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <ClientDashboard />,
  }
];

export default clientRoutes;
