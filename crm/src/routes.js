import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import CRMLeads from "views/admin/crm";
import Clients from "views/admin/clients";
import Services from "views/admin/services";
import Projects from "views/admin/projects";
import Employees from "views/admin/employees";
import Tasks from "views/admin/tasks";
import FollowUps from "views/admin/followups";
import Finance from "views/admin/finance";
import ClientLogins from "views/admin/client-logins";
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
    name: "Follow Ups",
    layout: "/admin",
    icon: <MdAssignment className="h-6 w-6" />, // Will change icon to MdNotificationsActive or similar if imported, but MdAssignment is safe
    path: "followups",
    component: <FollowUps />,
  },
  {
    name: "Financials",
    layout: "/admin",
    icon: <MdAttachMoney className="h-6 w-6" />,
    path: "finance",
    component: <Finance />,
  },
  {
    name: "Client Logins",
    layout: "/admin",
    icon: <MdLock className="h-6 w-6" />,
    path: "client-logins",
    component: <ClientLogins />,
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

