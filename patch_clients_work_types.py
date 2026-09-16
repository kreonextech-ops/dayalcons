import sys
import re

with open('crm/src/views/admin/clients/index.jsx', 'r') as f:
    content = f.read()

pattern = re.compile(
    r"let activitiesData = \[\];\s+let projectsData = \[\];\s+if \(clientIds\.length > 0\) \{.*?\};\s+\}\s+// Merge with localStorage to bypass Supabase schema limits\s+const merged = data\.map\(client => \{.*?return \{ \.\.\.client, \.\.\.localData, lastContact, activeProjectsCount: clientProjects\.length \};\s+\}\);",
    re.DOTALL
)

new_block = """        let activitiesData = [];
        let projectsData = [];
        let servicesData = [];
        if (clientIds.length > 0) {
            const [actRes, projRes, servRes] = await Promise.all([
               supabase.from('lead_activities').select('client_id, created_at').in('client_id', clientIds).order('created_at', { ascending: false }),
               supabase.from('projects').select('client_id, title, name').in('client_id', clientIds),
               supabase.from('services').select('client_id, title').in('client_id', clientIds)
            ]);
            if (actRes.data) activitiesData = actRes.data;
            if (projRes.data) projectsData = projRes.data;
            if (servRes.data) servicesData = servRes.data;
        }

        // Merge with localStorage to bypass Supabase schema limits
        const merged = data.map(client => {
           const localData = JSON.parse(localStorage.getItem(client_) || "{}");
           const clientActivities = activitiesData.filter(a => a.client_id === client.id);
           const lastContact = clientActivities.length > 0 ? clientActivities[0].created_at : null; 
           
           const clientProjects = projectsData.filter(p => p.client_id === client.id);
           const clientServices = servicesData.filter(s => s.client_id === client.id);
           
           // Dynamically generate work_types from actual projects and services
           const activeWorks = [
              ...clientServices.map(s => s.title),
              ...clientProjects.map(p => p.title || p.name)
           ].filter(Boolean);
           
           const finalWorkTypes = activeWorks.length > 0 ? activeWorks.join(', ') : (client.work_types || localData.work_types || "");
           
           return { ...client, ...localData, lastContact, activeProjectsCount: clientProjects.length, work_types: finalWorkTypes };
        });"""

content = pattern.sub(new_block, content)

with open('crm/src/views/admin/clients/index.jsx', 'w') as f:
    f.write(content)

print("Patched work_types logic in fetchClients via regex")
