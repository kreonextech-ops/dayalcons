import React, { useState, useEffect } from "react";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("vendors").select("*");
      if (!error && data) {
        setVendors(data);
      }
      setLoading(false);
    };
    fetchVendors();
  }, []);

  return (
    <div className="mt-5 grid h-full grid-cols-1 gap-5">
      <Card extra={"w-full h-full p-4 sm:p-6"}>
        <header className="relative flex items-center justify-between pt-4 pb-2">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Vendors & Procurement
          </div>
          <button className="linear rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white transition hover:bg-brand-800">
            + Add Vendor
          </button>
        </header>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="!border-px !border-gray-400">
                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"><p className="text-sm font-bold text-gray-600 dark:text-white">VENDOR NAME</p></th>
                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"><p className="text-sm font-bold text-gray-600 dark:text-white">TYPE</p></th>
                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"><p className="text-sm font-bold text-gray-600 dark:text-white">RATING</p></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="py-4 text-center">Loading vendors...</td></tr>
              ) : vendors.length === 0 ? (
                <tr><td colSpan="3" className="py-4 text-center text-gray-500">No vendors found.</td></tr>
              ) : (
                vendors.map((v) => (
                  <tr key={v.id} className="border-b-[1px] border-gray-200 hover:bg-gray-50 dark:hover:bg-navy-700">
                    <td className="pt-[14px] pb-[18px] sm:text-[14px]"><p className="text-sm font-bold text-navy-700 dark:text-white">{v.name}</p></td>
                    <td className="pt-[14px] pb-[18px] sm:text-[14px]"><p className="text-sm font-bold text-navy-700 dark:text-white">{v.type}</p></td>
                    <td className="pt-[14px] pb-[18px] sm:text-[14px]"><p className="text-sm font-bold text-navy-700 dark:text-white">{v.rating} / 5</p></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Vendors;
