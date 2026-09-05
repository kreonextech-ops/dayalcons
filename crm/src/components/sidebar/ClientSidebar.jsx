import React from "react";
import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import clientRoutes from "routes-client.js";

const ClientSidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[20px] mt-[50px] flex items-center justify-center`}>
        <div className="mt-1 font-poppins text-[18px] font-bold text-center uppercase text-navy-700 dark:text-white leading-tight">
          Dayal Constructions <br/> & Co. <span className="font-medium">Portal</span>
        </div>
      </div>
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />

      <ul className="mb-auto pt-1">
        {/* We can write custom links here for client to bypass the complex Links component */}
        {clientRoutes.map((route, idx) => (
           <div key={idx} className="relative mb-3 flex hover:cursor-pointer">
              <li className="my-[3px] flex cursor-pointer items-center px-8">
                <span className="font-bold text-brand-500 dark:text-white">
                  {route.icon}
                </span>
                <p className="leading-1 ml-4 flex font-bold text-navy-700 dark:text-white">
                  {route.name}
                </p>
              </li>
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
           </div>
        ))}
      </ul>
      
      <div className="flex justify-center mt-auto pb-4">
         <button onClick={() => { localStorage.removeItem("dayal_user"); window.location.href="/"; }} className="px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-bold hover:bg-red-100 transition">
            Sign Out
         </button>
      </div>
    </div>
  );
};

export default ClientSidebar;
