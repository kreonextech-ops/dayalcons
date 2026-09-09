import React, { useState, useEffect } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import NavbarAvatar from "./NavbarAvatar";
import { logAction } from "utils/auditLogger";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = useState(() => {
    const saved = localStorage.getItem('dayal_darkmode');
    return saved === 'true';
  });
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Apply dark mode class on mount and whenever it changes
  useEffect(() => {
    if (darkmode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkmode]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userStr = localStorage.getItem("dayal_user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("assignee_id", user.id)
        .neq("status", "Completed")
        .order("created_at", { ascending: false })
        .limit(5);
        
      if (data) {
        setNotifications(data);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px] flex items-center gap-4">
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-6 w-6" />
        </span>
        
        <div>
          <div className="h-6 w-[224px] pt-1">
            <a
              className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
              href=" "
            >
              Pages
              <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
                {" "}
                /{" "}
              </span>
            </a>
            <Link
              className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
              to="#"
            >
              {brandText}
            </Link>
          </div>
          <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white mt-2">
            <Link
              to="#"
              className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
            >
              {brandText}
            </Link>
          </p>
        </div>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-auto flex-grow items-center justify-end gap-4 rounded-full bg-white px-4 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-auto md:flex-grow-0 md:gap-4 xl:w-auto xl:gap-4">
        {/* start Notification */}
        <Dropdown
          button={
            <div className="cursor-pointer relative">
              <IoMdNotificationsOutline className="h-5 w-5 text-gray-600 dark:text-white" />
              {notifications.length > 0 && (
                 <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                    {notifications.length}
                 </span>
              )}
            </div>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  My Tasks
                </p>
                <p className="text-sm font-bold text-brand-500 cursor-pointer" onClick={() => navigate('/admin/tasks')}>
                  View all
                </p>
              </div>

              {notifications.length === 0 ? (
                 <p className="text-sm text-gray-500 text-center py-4">No pending tasks.</p>
              ) : (
                 notifications.map(task => (
                    <button key={task.id} onClick={() => navigate('/admin/tasks')} className="flex w-full items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                        <BsArrowBarUp className="h-5 w-5" />
                      </div>
                      <div className="ml-3 flex h-full w-full flex-col justify-center rounded-lg text-sm text-left">
                        <p className="mb-1 text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                          {task.title}
                        </p>
                        <p className="font-base text-xs text-gray-500 line-clamp-1">
                          Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                        </p>
                      </div>
                    </button>
                 ))
              )}
            </div>
          }
          classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
        />
        <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              const next = !darkmode;
              setDarkmode(next);
              localStorage.setItem('dayal_darkmode', next ? 'true' : 'false');
            }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
            button={
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm cursor-pointer shadow-sm relative overflow-hidden">
                <NavbarAvatar />
              </div>
            }
            children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-navy-700 dark:text-white truncate">
                    👋 Hey, {(() => {
                      const userStr = localStorage.getItem("dayal_user");
                      const user = userStr ? JSON.parse(userStr) : { name: "User" };
                      return user.name.split(" ")[0];
                    })()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                    {(() => {
                      const userStr = localStorage.getItem("dayal_user");
                      const user = userStr ? JSON.parse(userStr) : null;
                      return user ? user.role : "";
                    })()}
                  </p>
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <Link
                    to="/admin/profile"
                    className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                  >
                    Profile Settings
                  </Link>
                <button
                  onClick={async () => {
                    await logAction("LOGOUT", "System", "User logged out");
                    localStorage.removeItem("dayal_user");
                    try { await supabase.auth.signOut(); } catch(e) {}
                    Object.keys(localStorage).forEach(key => { if (key.startsWith("sb-")) localStorage.removeItem(key); });
                    window.location.href = "/crm/auth/sign-in";
                  }}
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in text-left"
                >
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
