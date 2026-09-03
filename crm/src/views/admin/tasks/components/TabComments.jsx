import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabComments = ({ task }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [task]);

  const fetchComments = async () => {
    if (!task) return;
    const { data } = await supabase.from('task_comments').select('*').eq('task_id', task.id).order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const handlePost = async () => {
    if (!newComment.trim() || !task) return;
    const userStr = localStorage.getItem("dayal_user");
    const user = userStr ? JSON.parse(userStr) : { name: "Admin" };

    const { data, error } = await supabase.from('task_comments').insert([{
       task_id: task.id,
       author_name: user.name || "Admin",
       comment_text: newComment
    }]).select();

    if (error) {
       alert("Failed to post comment: " + error.message);
       return;
    }

    if (data) {
       // Log this action in the Activity Log
       await supabase.from('task_activity_logs').insert([{
          task_id: task.id,
          employee_name: user.name || "Admin",
          activity_type: "Comment",
          description: `Added a comment: "${newComment}"`
       }]);

       setComments([...comments, data[0]]);
       setNewComment("");
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl flex flex-col h-[500px]">
       <div className="flex-1 overflow-y-auto p-4 border border-[#E2E8F0] rounded-t-xl bg-gray-50 flex flex-col">
          {comments.length === 0 ? (
             <div className="flex-1 flex items-center justify-center text-center">
                <div>
                   <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">No comments yet</h3>
                   <p className="text-[14px] text-[#64748B]">Start the conversation below.</p>
                </div>
             </div>
          ) : (
             <div className="space-y-4">
                {comments.map(c => (
                   <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm self-start max-w-[80%]">
                      <div className="flex items-baseline gap-2 mb-1">
                         <span className="text-[13px] font-bold text-[#0F172A]">{c.author_name}</span>
                         <span className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-[13px] text-gray-700 whitespace-pre-wrap">{c.comment_text}</p>
                   </div>
                ))}
             </div>
          )}
       </div>
       <div className="p-4 border-b border-l border-r border-[#E2E8F0] rounded-b-xl bg-white flex gap-3">
          <input 
             type="text" 
             value={newComment}
             onChange={e => setNewComment(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handlePost()}
             placeholder="Type a message..." 
             className="flex-1 h-12 px-4 rounded-xl border border-[#E2E8F0] outline-none focus:border-[#2563EB] text-[14px]" 
          />
          <button onClick={handlePost} className="h-12 px-6 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition">Post</button>
       </div>
    </div>
  );
};

export default TabComments;
