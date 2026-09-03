import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import CRMLeads from "views/admin/crm";
import Clients from "views/admin/clients";
import Services from "views/admin/services";
import Projects from "views/admin/projects";
import Employees from "views/admin/employees";
import Tasks from "views/admin/tasks";
import Finance from "views/admin/finance";
import Documents from "views/admin/documents";
import Vendors from "views/admin/vendors";

import ProfileSettings from "views/admin/profile";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdPeople,
  MdBusinessCenter,
  MdAssignment,
  MdAttachMoney,
  MdFolder,
  MdLocalShipping,
  MdLock,
  MdPerson,
  MdDesignServices,
  MdLocationCity,
  MdAdminPanelSettings,
} from "react-icons/md";

const routes = [
  {
    name: "Profile Settings",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProfileSettings />,
    secondary: true,
  },
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Leads",
    layout: "/admin",
    icon: <MdPeople className="h-6 w-6" />,
    path: "crm",
    component: <CRMLeads />,
  },
  {
    name: "Clients",
    layout: "/admin",
    icon: <MdPerson className="h-6 w-6" />,
    path: "clients",
    component: <Clients />,
  },
  {
    name: "Design & Legal Services",
    layout: "/admin",
    icon: <MdDesignServices className="h-6 w-6" />,
    path: "services",
    component: <Services />,
  },
  {
    name: "Execution Projects",
    layout: "/admin",
    icon: <MdLocationCity className="h-6 w-6" />,
    path: "projects",
    component: <Projects />,
  },
  {
    name: "Employees",
    layout: "/admin",
    icon: <MdAdminPanelSettings className="h-6 w-6" />,
    path: "employees",
    component: <Employees />,
  },
  {
    name: "Tasks",
    layout: "/admin",
    icon: <MdAssignment className="h-6 w-6" />,
    path: "tasks",
    component: <Tasks />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];
export default routes;
