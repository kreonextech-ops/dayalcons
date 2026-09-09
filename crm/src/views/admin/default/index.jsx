import React, { useEffect, useState } from "react";
import Widget from "components/widget/Widget";
import Card from "components/card";
import { MdBusinessCenter, MdPeople, MdAssignment, MdAttachMoney, MdArrowForward, MdNotificationsActive } from "react-icons/md";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { logAction } from "utils/auditLogger";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
  const [stats, setStats] = useState({ projects: 0, revenue: 0, leads: 0, tasks: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentClients, setRecentClients] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentFollowUps, setRecentFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve user info
  const userStr = localStorage.getItem('dayal_user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = loggedInUser?.role === 'Admin';

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Stats
      const [projRes, revRes, leadsRes, tasksRes] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact" }).eq("status", "In Progress"),
        supabase.from("payments").select("amount").eq("status", "Paid"),
        supabase.from("leads").select("id", { count: "exact" }),
        supabase.from("tasks").select("id", { count: "exact" }).neq("status", "Completed")
      ]);
      const totalRev = revRes.data ? revRes.data.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) : 0;
      setStats({
        projects: projRes.count || 0,
        revenue: totalRev,
        leads: leadsRes.count || 0,
        tasks: tasksRes.count || 0,
      });

      // 2. Recent Leads (5)
      const { data: leadsData } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5);
      setRecentLeads(leadsData || []);

      // 3. Recent Clients (5)
      const { data: clientsData } = await supabase.from("clients").select("*").order("created_at", { ascending: false }).limit(5);
      setRecentClients(clientsData || []);

      // 4. Recent Projects (5)
      const { data: projData } = await supabase.from("projects").select("*, client:clients(name)").order("created_at", { ascending: false }).limit(5);
      setRecentProjects(projData || []);

      // 5. Recent Services (5)
      const { data: srvData } = await supabase.from("services").select("*, client:clients(name)").order("created_at", { ascending: false }).limit(5);
      setRecentServices(srvData || []);

      // 6. Recent Tasks (5)
      const { data: tasksData } = await supabase.from("tasks").select("*, assignee:employees!tasks_assignee_id_fkey(name)").neq("custom_category", "Follow Up").order("created_at", { ascending: false }).limit(5);
      setRecentTasks(tasksData || []);

      // 7. Recent Follow Ups (5)
      const { data: fuData } = await supabase.from("tasks").select("*, assignee:employees!tasks_assignee_id_fkey(name)").eq("custom_category", "Follow Up").order("created_at", { ascending: false }).limit(5);
      setRecentFollowUps(fuData || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePoke = async (employeeId, context) => {
    if (!employeeId) return alert("No employee assigned to poke!");
    const { error } = await supabase.from('tasks').insert([{
      title: `REMINDER: Action required regarding ${context}`,
      description: `Please check on this immediately. (System Generated Poke)`,
      assignee_id: employeeId,
      status: 'Pending',
      custom_category: 'Reminder',
      due_date: new Date().toISOString()
    }]);
    if (error) {
      alert("Failed to send poke!");
    } else {
      alert("Employee has been poked! A notification has been sent.");
    }
  };

  const getStatusBadge = (status) => {
    const s = status || 'Pending';
    const classes = 
      s === 'Completed' ? 'bg-green-100 text-green-700' :
      s === 'In Progress' ? 'bg-blue-100 text-blue-700' :
      s === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
      s === 'On Hold' ? 'bg-orange-100 text-orange-700' :
      s === 'In Review' ? 'bg-purple-100 text-purple-700' :
      s === 'Cancelled' ? 'bg-red-100 text-red-700' :
      s === 'Lost' ? 'bg-red-100 text-red-700' :
      s === 'Won' ? 'bg-green-100 text-green-700' :
      s === 'active' ? 'bg-blue-100 text-blue-700' :
      s === 'inactive' ? 'bg-gray-100 text-gray-700' :
      'bg-gray-100 text-gray-700';
    return <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${classes}`}>{s}</span>;
  };

  const calcProgress = (metadata) => {
    try {
      const meta = JSON.parse(metadata || "{}");
      if (meta.steps && meta.steps.length > 0) {
        const comp = meta.steps.filter(st => st.completed).length;
        return Math.round((comp / meta.steps.length) * 100);
      }
    } catch (e) {}
    return 0;
  };

  if (!isAdmin) {
    return (
      <div className="mt-5 text-center text-gray-500 py-10">
        <h2 className="text-xl font-bold">Welcome back, {loggedInUser?.name}</h2>
        <p className="mt-2">Use the sidebar to navigate to your assigned tasks and projects.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-3 mb-4">
        <h2 className="text-2xl font-bold text-navy-700 dark:text-white">Admin / MD Master Dashboard</h2>
        <p className="text-gray-500">Comprehensive overview of all business segments, leads, and staff activity.</p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget icon={<MdBusinessCenter className="h-7 w-7" />} title={"Active Projects"} subtitle={stats.projects.toString()} />
        <Widget icon={<MdAttachMoney className="h-7 w-7" />} title={"Approved Revenue"} subtitle={`₹${stats.revenue.toLocaleString()}`} />
        <Widget icon={<MdPeople className="h-7 w-7" />} title={"Total Leads"} subtitle={stats.leads.toString()} />
        <Widget icon={<MdAssignment className="h-6 w-6" />} title={"Pending Tasks"} subtitle={stats.tasks.toString()} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* RECENT LEADS */}
        <Card extra={"w-full p-4"}>
          <header className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Recent Leads</h3><Link to="/admin/crm" className="text-brand-500 text-sm hover:underline">View All</Link></header>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b text-gray-500 text-sm"><th className="pb-2">Name</th><th className="pb-2">Source</th><th className="pb-2">Status</th></tr></thead>
              <tbody>
                {recentLeads.map(l => (
                  <tr key={l.id} className="border-b border-gray-50">
                    <td className="py-2 font-medium">{l.name}</td>
                    <td className="py-2 text-sm">{l.source}</td>
                    <td className="py-2">{getStatusBadge(l.status)}</td>
                  </tr>
                ))}
                {recentLeads.length === 0 && <tr><td colSpan="3" className="py-4 text-center text-sm text-gray-500">No leads found.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        {/* RECENT CLIENTS */}
        <Card extra={"w-full p-4"}>
          <header className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Recent Clients</h3><Link to="/admin/clients" className="text-brand-500 text-sm hover:underline">View All</Link></header>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b text-gray-500 text-sm"><th className="pb-2">Name</th><th className="pb-2">Contact</th><th className="pb-2">Status</th></tr></thead>
              <tbody>
                {recentClients.map(c => (
                  <tr key={c.id} className="border-b border-gray-50">
                    <td className="py-2 font-medium">{c.name}</td>
                    <td className="py-2 text-sm">{c.phone || c.email || 'N/A'}</td>
                    <td className="py-2">{getStatusBadge(c.status)}</td>
                  </tr>
                ))}
                {recentClients.length === 0 && <tr><td colSpan="3" className="py-4 text-center text-sm text-gray-500">No clients found.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        {/* RECENT PROJECTS */}
        <Card extra={"w-full p-4"}>
          <header className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Recent Projects</h3><Link to="/admin/projects" className="text-brand-500 text-sm hover:underline">View All</Link></header>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b text-gray-500 text-sm"><th className="pb-2">Title</th><th className="pb-2">Progress</th><th className="pb-2">Status</th></tr></thead>
              <tbody>
                {recentProjects.map(p => {
                  const prog = calcProgress(p.description);
                  return (
                    <tr key={p.id} className="border-b border-gray-50">
                      <td className="py-2 font-medium">{p.name || p.title}</td>
                      <td className="py-2 text-sm"><div className="w-16 h-1.5 bg-gray-200 rounded-full"><div className="h-full bg-brand-500 rounded-full" style={{width: `${prog}%`}}></div></div><span className="text-[10px]">{prog}%</span></td>
                      <td className="py-2">{getStatusBadge(p.status)}</td>
                    </tr>
                  )
                })}
                {recentProjects.length === 0 && <tr><td colSpan="3" className="py-4 text-center text-sm text-gray-500">No projects found.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        {/* RECENT SERVICES */}
        <Card extra={"w-full p-4"}>
          <header className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Recent Services</h3><Link to="/admin/services" className="text-brand-500 text-sm hover:underline">View All</Link></header>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b text-gray-500 text-sm"><th className="pb-2">Title</th><th className="pb-2">Progress</th><th className="pb-2">Status</th></tr></thead>
              <tbody>
                {recentServices.map(s => {
                  const prog = calcProgress(s.description);
                  return (
                    <tr key={s.id} className="border-b border-gray-50">
                      <td className="py-2 font-medium">{s.name || s.title}</td>
                      <td className="py-2 text-sm"><div className="w-16 h-1.5 bg-gray-200 rounded-full"><div className="h-full bg-brand-500 rounded-full" style={{width: `${prog}%`}}></div></div><span className="text-[10px]">{prog}%</span></td>
                      <td className="py-2">{getStatusBadge(s.status)}</td>
                    </tr>
                  )
                })}
                {recentServices.length === 0 && <tr><td colSpan="3" className="py-4 text-center text-sm text-gray-500">No services found.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        {/* RECENT TASKS GIVEN */}
        <Card extra={"w-full p-4"}>
          <header className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Recent Tasks</h3><Link to="/admin/tasks" className="text-brand-500 text-sm hover:underline">View All</Link></header>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b text-gray-500 text-sm"><th className="pb-2">Task</th><th className="pb-2">Assignee</th><th className="pb-2">Poke</th></tr></thead>
              <tbody>
                {recentTasks.map(t => (
                  <tr key={t.id} className="border-b border-gray-50">
                    <td className="py-2 font-medium">{t.title}</td>
                    <td className="py-2 text-sm">{t.assignee?.name || 'Unassigned'}</td>
                    <td className="py-2">
                      <button onClick={() => handlePoke(t.assignee_id, `Task: ${t.title}`)} className="text-brand-500 hover:text-brand-600 flex items-center gap-1 text-xs font-bold bg-brand-50 px-2 py-1 rounded">
                        <MdNotificationsActive /> Poke
                      </button>
                    </td>
                  </tr>
                ))}
                {recentTasks.length === 0 && <tr><td colSpan="3" className="py-4 text-center text-sm text-gray-500">No tasks found.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        {/* RECENT FOLLOW UPS */}
        <Card extra={"w-full p-4"}>
          <header className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Recent Follow Ups</h3><Link to="/admin/followups" className="text-brand-500 text-sm hover:underline">View All</Link></header>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b text-gray-500 text-sm"><th className="pb-2">Follow Up</th><th className="pb-2">Assignee</th><th className="pb-2">Poke</th></tr></thead>
              <tbody>
                {recentFollowUps.map(f => (
                  <tr key={f.id} className="border-b border-gray-50">
                    <td className="py-2 font-medium">{f.title}</td>
                    <td className="py-2 text-sm">{f.assignee?.name || 'Unassigned'}</td>
                    <td className="py-2">
                      <button onClick={() => handlePoke(f.assignee_id, `Follow Up: ${f.title}`)} className="text-brand-500 hover:text-brand-600 flex items-center gap-1 text-xs font-bold bg-brand-50 px-2 py-1 rounded">
                        <MdNotificationsActive /> Poke
                      </button>
                    </td>
                  </tr>
                ))}
                {recentFollowUps.length === 0 && <tr><td colSpan="3" className="py-4 text-center text-sm text-gray-500">No follow ups found.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
