export const initGlobalAudit = () => {
    if (window._auditInitialized) return;
    window._auditInitialized = true;

    const originalFetch = window.fetch;
    const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
    const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";

    window.fetch = async (...args) => {
        const [resource, config] = args;
        
        let oldRecord = null;
        let method = (config?.method || 'GET').toUpperCase();
        let urlObj = null;
        let table = null;
        let isTracked = false;

        const url = typeof resource === 'string' ? resource : (resource?.url || '');
        
        if (url && url.includes(SUPABASE_URL) && url.includes('/rest/v1/')) {
            urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('?')[0].split('/');
            table = pathParts[pathParts.length - 1];
            
            const ignoredTables = ['audit_logs', 'notifications']; 
            
            if (['POST', 'PATCH', 'DELETE'].includes(method) && table && !ignoredTables.includes(table)) {
                isTracked = true;
                
                if (['PATCH', 'DELETE'].includes(method)) {
                    const idMatch = urlObj.search.match(/id=eq\.([^&]+)/);
                    if (idMatch) {
                        try {
                            const res = await originalFetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${idMatch[1]}&select=*`, {
                                headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
                            });
                            const data = await res.json();
                            if (data && data.length > 0) oldRecord = data[0];
                        } catch(e) {}
                    }
                }
            }
        }

        const response = await originalFetch(...args);
        
        try {
            if (isTracked && response.ok) {
                let actionType = 'UPDATE';
                if (method === 'POST') actionType = 'CREATE';
                if (method === 'DELETE') actionType = 'DELETE';
                
                let changes = [];
                let itemName = "Record";

                try {
                    if (config && config.body && typeof config.body === 'string') {
                        const bodyObj = JSON.parse(config.body);
                        const item = Array.isArray(bodyObj) ? bodyObj[0] : bodyObj;
                        if (item) {
                            if (item.name) itemName = item.name;
                            else if (item.title) itemName = item.title;
                            else if (oldRecord && oldRecord.name) itemName = oldRecord.name;
                            else if (oldRecord && oldRecord.title) itemName = oldRecord.title;

                            if (actionType === 'UPDATE' && oldRecord) {
                                for (const [k, v] of Object.entries(item)) {
                                    if (['id', 'updated_at', 'created_at'].includes(k)) continue;
                                    const oldVal = oldRecord[k];
                                    if (oldVal !== v) {
                                        let ov = String(oldVal === null || oldVal === undefined ? 'empty' : oldVal);
                                        let nv = String(v === null || v === undefined ? 'empty' : v);
                                        if (ov.length > 30) ov = ov.substring(0,30) + '...';
                                        if (nv.length > 30) nv = nv.substring(0,30) + '...';
                                        changes.push(`${k} from '${ov}' to '${nv}'`);
                                    }
                                }
                            } else if (actionType === 'CREATE') {
                                for (const [k, v] of Object.entries(item)) {
                                    if (['id', 'updated_at', 'created_at'].includes(k)) continue;
                                    let nv = String(v === null || v === undefined ? 'empty' : v);
                                    if (nv.length > 30) nv = nv.substring(0,30) + '...';
                                    changes.push(`${k}: '${nv}'`);
                                }
                            }
                        }
                    }
                } catch(e) {}

                
                let moduleName = table.charAt(0).toUpperCase() + table.slice(1);
                if (table === 'lead_activities') moduleName = 'Communications & Activity';
                if (table === 'task_activity_logs') moduleName = 'Task Activity';

                let description = `System recorded ${actionType} in ${moduleName}`;
                
                if (actionType === 'DELETE') {
                    description = `Deleted ${itemName} from ${moduleName}`;
                } else if (actionType === 'UPDATE') {
                    if (changes.length > 0) {
                        description = `Updated ${moduleName} "${itemName}". Changes: ${changes.join(', ')}`;
                    } else {
                        description = `Updated ${moduleName} "${itemName}"`;
                    }
                } else if (actionType === 'CREATE') {
                    if (changes.length > 0) {
                        description = `Created ${moduleName} "${itemName}". Details: ${changes.join(', ')}`;
                    } else {
                        description = `Created ${moduleName} "${itemName}"`;
                    }
                }
                
                const userStr = localStorage.getItem("dayal_user");
                const user = userStr ? JSON.parse(userStr) : null;
                
                if (user) {
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
                    }).catch(()=>{});
                }
            }
        } catch(e) {
            console.error("Audit log error:", e);
        }
        
        return response;
    };
};