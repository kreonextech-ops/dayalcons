export const initGlobalAudit = () => {
    if (window._auditInitialized) return;
    window._auditInitialized = true;

    const originalFetch = window.fetch;
    const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
    const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";

    window.fetch = async (...args) => {
        const [resource, config] = args;
        const response = await originalFetch(...args);
        
        try {
            const url = typeof resource === 'string' ? resource : (resource?.url || '');
            
            // Check if it's a Supabase REST call
            if (url && url.includes(SUPABASE_URL) && url.includes('/rest/v1/')) {
                const method = (config?.method || 'GET').toUpperCase();
                
                if (['POST', 'PATCH', 'DELETE'].includes(method)) {
                    const urlObj = new URL(url);
                    const pathParts = urlObj.pathname.split('?')[0].split('/');
                    const table = pathParts[pathParts.length - 1];
                    
                    // Tables to ignore
                    const ignoredTables = ['audit_logs', 'task_activity_logs', 'notifications', 'lead_activities'];
                    
                    if (table && !ignoredTables.includes(table)) {
                        let actionType = 'UPDATE';
                        if (method === 'POST') actionType = 'CREATE';
                        if (method === 'DELETE') actionType = 'DELETE';
                        
                        let details = "";
                        try {
                            if (config && config.body && typeof config.body === 'string') {
                                const bodyObj = JSON.parse(config.body);
                                const item = Array.isArray(bodyObj) ? bodyObj[0] : bodyObj;
                                if (item) {
                                    if (item.name) details = ` "${item.name}"`;
                                    else if (item.title) details = ` "${item.title}"`;
                                    else if (item.comment) details = ` (Comment added)`;
                                    else if (item.amount) details = ` (Amount: ${item.amount})`;
                                }
                            }
                        } catch(e) {}

                        const moduleName = table.charAt(0).toUpperCase() + table.slice(1);
                        const description = `System recorded ${actionType} action in ${moduleName} module${details}`;
                        
                        const userStr = localStorage.getItem("dayal_user");
                        const user = userStr ? JSON.parse(userStr) : null;
                        
                        if (user && response.ok) {
                            // Fire and forget to audit_logs
                            originalFetch(`${SUPABASE_URL}/rest/v1/audit_logs`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'apikey': SUPABASE_KEY,
                                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                                    'Prefer': 'return=minimal'
                                },
                                body: JSON.stringify({
                                    user_id: user.id,
                                    employee_name: user.name,
                                    action_type: actionType,
                                    module: moduleName,
                                    description: description,
                                    ip_address: 'System Tracked',
                                    device_info: navigator.userAgent
                                })
                            }).catch(() => {});
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Global audit interceptor error:", e);
        }
        
        return response;
    };
};
