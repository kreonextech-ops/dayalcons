const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/TaskDetail.jsx', 'utf8');

const importRegex = /import Card from "components\/card";/;
code = code.replace(importRegex, `import Card from "components/card";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);`);

const hookRegex = /const \[activeTab, setActiveTab\] = useState\("Overview"\);/;
code = code.replace(hookRegex, `const [activeTab, setActiveTab] = useState("Overview");
  const [contextData, setContextData] = useState({ client: null, lead: null, project: null, service: null });

  useEffect(() => {
    async function fetchContext() {
      const dataObj = {};
      if (task?.client_id) {
         const { data } = await supabase.from('clients').select('id, name').eq('id', task.client_id).single();
         if (data) dataObj.client = data;
      }
      if (task?.lead_id) {
         const { data } = await supabase.from('leads').select('id, name').eq('id', task.lead_id).single();
         if (data) dataObj.lead = data;
      }
      if (task?.project_id) {
         const { data } = await supabase.from('projects').select('id, name').eq('id', task.project_id).single();
         if (data) dataObj.project = data;
      }
      if (task?.service_id) {
         const { data } = await supabase.from('services').select('id, title').eq('id', task.service_id).single();
         if (data) dataObj.service = data;
      }
      setContextData(dataObj);
    }
    fetchContext();
  }, [task]);`);

const renderRegex = /<p className="text-\[\#64748B\]">Priority: <b className="text-\[\#0F172A\]">\{taskData\.priority\}<\/b><\/p>/;
code = code.replace(renderRegex, `<p className="text-[#64748B]">Priority: <b className="text-[#0F172A]">{taskData.priority}</b></p>
                  {contextData.lead && <p className="text-[#64748B]">Lead: <a href={\`/admin/crm?leadId=\${contextData.lead.id}\`} className="text-[#2563EB] font-bold hover:underline">{contextData.lead.name}</a></p>}
                  {contextData.client && <p className="text-[#64748B]">Client: <a href={\`/admin/clients?clientId=\${contextData.client.id}\`} className="text-[#2563EB] font-bold hover:underline">{contextData.client.name}</a></p>}
                  {contextData.project && <p className="text-[#64748B]">Project: <a href={\`/admin/projects?projectId=\${contextData.project.id}\`} className="text-[#2563EB] font-bold hover:underline">{contextData.project.name}</a></p>}
                  {contextData.service && <p className="text-[#64748B]">Service: <a href={\`/admin/services?serviceId=\${contextData.service.id}\`} className="text-[#2563EB] font-bold hover:underline">{contextData.service.title}</a></p>}`);

fs.writeFileSync('src/views/admin/tasks/TaskDetail.jsx', code);
