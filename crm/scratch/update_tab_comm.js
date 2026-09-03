const fs = require('fs');
let code = fs.readFileSync('src/views/admin/crm/components/TabCommunication.jsx', 'utf8');

code = code.replace(
  'const TabCommunication = ({ leadData, isClient = false, action, setAction }) => {',
  'const TabCommunication = ({ leadData, isClient = false, action, setAction, entityType, entityId }) => {'
);

const fetchRegex = /const \{ data \} = await supabase\.from\('lead_activities'\)\.select\('\*'\)\.eq\(isClient \? 'client_id' : 'lead_id', leadData\.id\)\.eq\('activity_group', 'Communication'\)\.order\('created_at', \{ ascending: false \}\);/g;
const newFetch = `const { data: rawData } = await supabase.from('lead_activities').select('*').eq(isClient ? 'client_id' : 'lead_id', leadData.id).eq('activity_group', 'Communication').order('created_at', { ascending: false });
    let data = rawData;
    if (data && entityType && entityId) {
       data = data.filter(d => {
          let meta = {};
          try { meta = typeof d.metadata === 'string' ? JSON.parse(d.metadata) : (d.metadata || {}); } catch(e) {}
          if (entityType === 'service') return meta.service_id === entityId;
          if (entityType === 'project') return meta.project_id === entityId;
          return true;
       });
    }`;
code = code.replace(fetchRegex, newFetch);

const insertRegex = /metadata: \{\}/g;
const newInsert = `metadata: {
        ...(entityType === 'service' ? { service_id: entityId } : {}),
        ...(entityType === 'project' ? { project_id: entityId } : {})
      }`;
code = code.replace(insertRegex, newInsert);

fs.writeFileSync('src/views/admin/crm/components/TabCommunication.jsx', code);
