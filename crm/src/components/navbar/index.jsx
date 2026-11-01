import React, { useState, useEffect } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowBarUp } from "react-icons/bs";
import { MdCheck, MdDoneAll } from "react-icons/md";
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
  const [seenIds, setSeenIds] = useState(() => {
    try {
      const stored = localStorage.getItem('dayal_seen_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
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
      try {
        const { data } = await supabase
          .from("audit_logs")
          .select("id, employee_name, action_type, module, description, created_at")
          .neq("action_type", "LOGIN")
          .neq("action_type", "LOGOUT")
          .order("created_at", { ascending: false })
          .limit(20);

        if (data) {
          setNotifications(data);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const markAllAsSeen = () => {
    const allIds = notifications.map(n => n.id);
    const updated = Array.from(new Set([...seenIds, ...allIds]));
    setSeenIds(updated);
    try {
      localStorage.setItem('dayal_seen_notifications', JSON.stringify(updated));
    } catch (e) {}
  };

  const markSingleAsSeen = (id, module) => {
    if (!seenIds.includes(id)) {
      const updated = [...seenIds, id];
      setSeenIds(updated);
      try {
        localStorage.setItem('dayal_seen_notifications', JSON.stringify(updated));
      } catch (e) {}
    }
    // Navigate to appropriate module if applicable
    const m = (module || '').toLowerCase();
    if (m.includes('lead')) navigate('/admin/crm');
    else if (m.includes('client')) navigate('/admin/clients');
    else if (m.includes('service')) navigate('/admin/services');
    else if (m.includes('task')) navigate('/admin/tasks');
  };

  const unreadCount = notifications.filter(n => !seenIds.includes(n.id)).length;

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <nav className="sticky top-0 z-50 flex flex-row items-center justify-between bg-white/80 p-3 border-b border-gray-100 backdrop-blur-xl dark:bg-[#0b1437cc] dark:border-navy-700 w-full -mx-4 px-6 md:-mx-2 md:px-4 xl:-mx-2 xl:px-4 shadow-sm">
      <div className="ml-[6px] flex items-center gap-4">
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-6 w-6" />
        </span>
        
        <div>
          <div className="h-6 w-auto pt-1 flex items-center gap-2">
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
              className="text-lg font-bold capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
              to="#"
            >
              {brandText}
            </Link>
          </div>
          
        </div>
      </div>

      <div className="relative flex h-[40px] w-auto flex-grow items-center justify-end gap-3 px-2 py-1 md:w-auto md:flex-grow-0 md:gap-4 xl:w-auto xl:gap-4">
        {/* start Notification */}
        <Dropdown
          button={
            <div className="cursor-pointer relative p-1 rounded-full hover:bg-gray-100 dark:hover:bg-navy-800 transition">
              <IoMdNotificationsOutline className="h-5 w-5 text-gray-600 dark:text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-1 ring-white animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[340px] sm:w-[420px] flex-col rounded-[20px] bg-white shadow-2xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none border border-gray-100 dark:border-navy-700 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-navy-700 bg-gray-50/50 dark:bg-navy-900/50">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); markAllAsSeen(); }}
                    className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1 transition"
                  >
                    <MdDoneAll className="text-sm" /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification List: Height sized for 5 items, scrollable beyond that */}
              <div className="max-h-[350px] overflow-y-auto divide-y divide-gray-100 dark:divide-navy-700 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No recent activity or notifications.
                  </div>
                ) : (
                  notifications.map((item) => {
                    const isSeen = seenIds.includes(item.id);
                    const mod = (item.module || '').toLowerCase();
                    const act = (item.action_type || '').toUpperCase();
                    
                    let badgeBg = 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
                    if (act === 'CREATE') badgeBg = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
                    else if (act === 'DELETE') badgeBg = 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400';
                    else if (act === 'UPDATE') badgeBg = 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';

                    return (
                      <div
                        key={item.id}
                        onClick={() => markSingleAsSeen(item.id, item.module)}
                        className={`flex items-start gap-3 p-3 text-left transition-colors cursor-pointer relative ${
                          isSeen 
                            ? 'bg-white opacity-70 hover:opacity-100 hover:bg-gray-50/80 dark:bg-navy-800' 
                            : 'bg-blue-50/30 font-medium hover:bg-blue-50/60 dark:bg-navy-700/50'
                        }`}
                      >
                        {/* Unseen indicator dot */}
                        {!isSeen && (
                          <span className="absolute left-1.5 top-4 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-navy-800" />
                        )}

                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${badgeBg}`}>
                          {item.module ? item.module.substring(0, 2).toUpperCase() : 'SYS'}
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className={`text-xs truncate ${isSeen ? 'text-gray-700 dark:text-gray-300' : 'text-navy-700 dark:text-white font-bold'}`}>
                              <span className="font-semibold text-brand-500">{item.employee_name || 'System'}</span>: {item.module}
                            </p>
                            <span className="text-[10px] text-gray-400 shrink-0 font-normal">
                              {formatTimeAgo(item.created_at)}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed break-words">
                            {item.description || 'Recent change updated'}
                          </p>

                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${badgeBg}`}>
                              {item.action_type || 'UPDATE'}
                            </span>
                            {isSeen ? (
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                <MdCheck className="text-xs text-green-500" /> Seen
                              </span>
                            ) : (
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 border-t border-gray-100 dark:border-navy-700 text-center bg-gray-50/50 dark:bg-navy-900/50">
                <button
                  type="button"
                  onClick={() => navigate('/admin/crm')}
                  className="text-xs font-semibold text-gray-500 hover:text-brand-500 dark:text-gray-400 transition"
                >
                  View Activity & Leads
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-4 -left-[230px] md:-left-[380px] w-max"}
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
                      const userStr = sessionStorage.getItem("dayal_user");
                      const user = userStr ? JSON.parse(userStr) : { name: "User" };
                      return user.name.split(" ")[0];
                    })()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                    {(() => {
                      const userStr = sessionStorage.getItem("dayal_user");
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
                    sessionStorage.removeItem("dayal_user");
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
