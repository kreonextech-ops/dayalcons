import React, { useState, useEffect } from "react";
import Widget from "components/widget/Widget";
import { MdBusinessCenter, MdAssignment, MdPeople, MdAttachMoney, MdArrowForward, MdAccessTime } from "react-icons/md";
import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

// Initialize Supabase Client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, leads: 0, revenue: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For Employee Dashboard
  const [myTasks, setMyTasks] = useState([]);
  const [myClients, setMyClients] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [myFollowUps, setMyFollowUps] = useState([]);

  const userStr = localStorage.getItem("dayal_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isEmployee = user && user.role !== "Admin" && user.role !== "MD";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      if (isEmployee) {
         // Fetch Employee Data
         const { data: tasksData } = await supabase.from('tasks').select('*').eq('assignee_id', user.id).order('created_at', { ascending: false });
         if (tasksData) {
            setMyTasks(tasksData);
            setMyFollowUps(tasksData.filter(t => t.custom_category === "Follow Up" && t.status !== "Completed"));
         }

         const { data: clientsData } = await supabase.from('clients').select('*').like('assigned_to', `%${user.id}%`);
         if (clientsData) setMyClients(clientsData);

         const { data: servicesData } = await supabase.from('services').select('*').like('assigned_to', `%${user.id}%`);
         if (servicesData) setMyServices(servicesData);

         const { data: projectsData } = await supabase.from('projects').select('*').like('assigned_to', `%${user.id}%`);
         if (projectsData) setMyProjects(projectsData);

      } else {
         // Fetch MD/Admin Data
         const [projectsRes, tasksRes, leadsRes, quotesRes] = await Promise.all([
           supabase.from('projects').select('*', { count: 'exact', head: true }),
           supabase.from('tasks').select('*', { count: 'exact', head: true }).neq('status', 'Completed'),
           supabase.from('leads').select('*', { count: 'exact', head: true }),
           supabase.from('quotations').select('amount').eq('status', 'Approved')
         ]);

         let totalRevenue = 0;
         if (quotesRes.data) {
           totalRevenue = quotesRes.data.reduce((acc, curr) => acc + Number(curr.amount), 0);
         }

         setStats({
           projects: projectsRes.count || 0,
           tasks: tasksRes.count || 0,
           leads: leadsRes.count || 0,
           revenue: totalRevenue
         });

         const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5);
         if (leadsData) setRecentLeads(leadsData);

         const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(5);
         if (projectsData) setRecentProjects(projectsData);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [isEmployee, user?.id]);

  if (isEmployee) {
     return (
        <div>
          <div className="mt-3 mb-4 flex justify-between items-end">
            <div>
               <h2 className="text-2xl font-bold text-navy-700 dark:text-white">Welcome, {user.name}</h2>
               <p className="text-gray-500">Here is a quick overview of your assigned tasks and responsibilities.</p>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
             <Link to="/admin/clients">
               <Widget icon={<MdPeople className="h-7 w-7" />} title="My Assigned Clients" subtitle={myClients.length.toString()} />
             </Link>
             <Link to="/admin/services">
               <Widget icon={<MdBusinessCenter className="h-7 w-7 text-blue-500" />} title="My Assigned Services" subtitle={myServices.length.toString()} />
             </Link>
             <Link to="/admin/projects">
               <Widget icon={<MdBusinessCenter className="h-7 w-7 text-amber-500" />} title="My Assigned Projects" subtitle={myProjects.length.toString()} />
             </Link>
             <Link to="/admin/followups">
               <Widget icon={<MdAccessTime className="h-7 w-7 text-red-500" />} title="Pending Follow Ups" subtitle={myFollowUps.length.toString()} />
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
             <Card extra={"w-full h-full p-4 sm:p-6"}>
                <header className="relative flex items-center justify-between pt-4 pb-2">
                  <div className="text-xl font-bold text-navy-700 dark:text-white">My Pending Tasks</div>
                  <Link to="/admin/tasks" className="text-sm font-medium text-brand-500 hover:underline flex items-center gap-1">View All <MdArrowForward /></Link>
                </header>
                <div className="mt-4 overflow-x-auto">
                   <table className="w-full">
                     <thead>
                       <tr className="border-b border-gray-200">
                         <th className="py-3 text-left text-sm font-bold text-gray-600">TASK NAME</th>
                         <th className="py-3 text-left text-sm font-bold text-gray-600">STATUS</th>
                       </tr>
                     </thead>
                     <tbody>
                       {loading ? (
                         <tr><td colSpan="2" className="py-4 text-center">Loading...</td></tr>
                       ) : myTasks.filter(t => t.status !== 'Completed' && t.custom_category !== 'Follow Up').length === 0 ? (
                         <tr><td colSpan="2" className="py-4 text-center text-gray-500">No pending tasks.</td></tr>
                       ) : (
                         myTasks.filter(t => t.status !== 'Completed' && t.custom_category !== 'Follow Up').slice(0, 5).map(task => (
                           <tr key={task.id} className="border-b border-gray-50">
                              <td className="py-3 text-sm font-bold text-navy-700 line-clamp-1">{task.title || task.name}</td>
                              <td className="py-3 text-sm font-medium">
                                 <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-[12px] font-bold">{task.status}</span>
                              </td>
                           </tr>
                         ))
                       )}
                     </tbody>
                   </table>
                </div>
             </Card>

             <Card extra={"w-full h-full p-4 sm:p-6"}>
                <header className="relative flex items-center justify-between pt-4 pb-2">
                  <div className="text-xl font-bold text-navy-700 dark:text-white">Upcoming Follow Ups</div>
                  <Link to="/admin/followups" className="text-sm font-medium text-brand-500 hover:underline flex items-center gap-1">View All <MdArrowForward /></Link>
                </header>
                <div className="mt-4 overflow-x-auto">
                   <table className="w-full">
                     <thead>
                       <tr className="border-b border-gray-200">
                         <th className="py-3 text-left text-sm font-bold text-gray-600">TITLE</th>
                         <th className="py-3 text-left text-sm font-bold text-gray-600">DUE DATE</th>
                       </tr>
                     </thead>
                     <tbody>
                       {loading ? (
                         <tr><td colSpan="2" className="py-4 text-center">Loading...</td></tr>
                       ) : myFollowUps.length === 0 ? (
                         <tr><td colSpan="2" className="py-4 text-center text-gray-500">No upcoming follow ups.</td></tr>
                       ) : (
                         myFollowUps.slice(0, 5).map(task => (
                           <tr key={task.id} className="border-b border-gray-50">
                              <td className="py-3 text-sm font-bold text-navy-700 line-clamp-1">{task.title || task.name}</td>
                              <td className="py-3 text-sm font-medium text-gray-500">
                                 {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                              </td>
                           </tr>
                         ))
                       )}
                     </tbody>
                   </table>
                </div>
             </Card>
          </div>
        </div>
     );
  }

  return (
    <div>
      {/* Title */}
      <div className="mt-3 mb-4">
        <h2 className="text-2xl font-bold text-navy-700 dark:text-white">Managing Director (MD) Overview</h2>
        <p className="text-gray-500">High-level insights into construction projects, sales, and financials.</p>
      </div>

      {/* Real-time Stat Widgets */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<MdBusinessCenter className="h-7 w-7" />}
          title={"Active Projects"}
          subtitle={stats.projects.toString()}
        />
        <Widget
          icon={<MdAttachMoney className="h-7 w-7" />}
          title={"Approved Revenue"}
          subtitle={`₹${stats.revenue.toLocaleString()}`}
        />
        <Widget
          icon={<MdPeople className="h-7 w-7" />}
          title={"Total Leads"}
          subtitle={stats.leads.toString()}
        />
        <Widget
          icon={<MdAssignment className="h-6 w-6" />}
          title={"Pending Tasks"}
          subtitle={stats.tasks.toString()}
        />
      </div>

      {/* Data Tables */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Recent Leads */}
        <Card extra={"w-full h-full p-4 sm:p-6"}>
          <header className="relative flex items-center justify-between pt-4 pb-2">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Recent Leads Pipeline
            </div>
            <a href="/admin/crm" className="text-sm text-brand-500 font-medium hover:underline">View All</a>
          </header>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="py-3 text-left text-sm font-bold text-gray-600 dark:text-white">NAME</th>
                  <th className="py-3 text-left text-sm font-bold text-gray-600 dark:text-white">STATUS</th>
                  
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="2" className="py-4 text-center">Loading...</td></tr>
                  ) : recentLeads.length === 0 ? (
                    <tr><td colSpan="2" className="py-4 text-center text-gray-500">No recent leads.</td></tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50 dark:border-white/5">
                      <td className="py-3 text-sm font-bold text-navy-700 dark:text-white">{lead.name}</td>
                      <td className="py-3 text-sm font-medium text-navy-700 dark:text-white">
                        <span className="bg-brand-50 text-brand-500 px-2 py-1 rounded-md">{lead.status}</span>
                      </td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Projects */}
        <Card extra={"w-full h-full p-4 sm:p-6"}>
          <header className="relative flex items-center justify-between pt-4 pb-2">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Ongoing Projects
            </div>
            <a href="/admin/projects" className="text-sm text-brand-500 font-medium hover:underline">View All</a>
          </header>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="py-3 text-left text-sm font-bold text-gray-600 dark:text-white">PROJECT NAME</th>
                  <th className="py-3 text-left text-sm font-bold text-gray-600 dark:text-white">STATUS</th>
                  <th className="py-3 text-left text-sm font-bold text-gray-600 dark:text-white">DATE ADDED</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="py-4 text-center">Loading...</td></tr>
                ) : recentProjects.length === 0 ? (
                  <tr><td colSpan="3" className="py-4 text-center text-gray-500">No active projects.</td></tr>
                ) : (
                  recentProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-50 dark:border-white/5">
                      <td className="py-3 text-sm font-bold text-navy-700 dark:text-white">{project.name}</td>
                      <td className="py-3 text-sm font-medium text-navy-700 dark:text-white">
                        <span className="bg-orange-50 text-orange-500 px-2 py-1 rounded-md capitalize">{project.status}</span>
                      </td>
                      <td className="py-3 text-sm font-bold text-navy-700 dark:text-white">{project.created_at ? new Date(project.created_at).toLocaleDateString('en-GB') : ''}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
