import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export const logAction = async (action_type, module, description) => {
    try {
        const userStr = sessionStorage.getItem("dayal_user");
        const user = userStr ? JSON.parse(userStr) : null;
        if (!user) return;

        let ip = "Unknown";
        let location = "Unknown";
        // Optionally fetch IP again, but that's slow for every action.
        // We'll skip IP fetching for non-LOGIN actions to keep it fast.
        
        await supabase.from('audit_logs').insert([{
            user_id: user.id,
            employee_name: user.name,
            action_type,
            module,
            description,
            ip_address: "Logged in session",
            device_info: navigator.userAgent
        }]);
    } catch (error) {
        console.error("Failed to log action:", error);
    }
};
