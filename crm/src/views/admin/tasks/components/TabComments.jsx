import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { MdAttachFile, MdDelete } from "react-icons/md";
import { uploadFileToR2, deleteR2File } from "utils/r2Storage";
import CommentRenderer from "components/chat/CommentRenderer";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const TabComments = ({ task }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchComments();
  }, [task]);

  const fetchComments = async () => {
    if (!task) return;
    const { data } = await supabase.from('task_comments').select('*').eq('task_id', task.id).order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const postCommentText = async (textToPost) => {
    if (!task) return;
    const userStr = localStorage.getItem("dayal_user");
    const user = userStr ? JSON.parse(userStr) : { name: "Admin" };

    const { data, error } = await supabase.from('task_comments').insert([{
       task_id: task.id,
       author_name: user.name || "Admin",
       comment_text: textToPost
    }]).select();

    if (error) {
       alert("Failed to post comment: " + error.message);
       return null;
    }

    if (data) {
       await supabase.from('task_activity_logs').insert([{
          task_id: task.id,
          employee_name: user.name || "Admin",
          activity_type: "Comment",
          description: "Added a comment: "
       }]);
       return data[0];
    }
    return null;
  };

  const handlePost = async () => {
    if (!newComment.trim()) return;
    const inserted = await postCommentText(newComment);
    if (inserted) {
       setComments([...comments, inserted]);
       setNewComment("");
    }
  };

  const handleDeleteComment = async (commentId, commentText) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    const fileMatch = commentText?.match(/\[R2_FILE::(.*?)::(.*?)\]/);
    if (fileMatch) {
       try { await deleteR2File(fileMatch[1]); } catch (err) { console.error("Failed to delete R2 file", err); }
    }
    const { error } = await supabase.from('task_comments').delete().eq('id', commentId);
    if (!error) setComments(comments.filter(c => c.id !== commentId));
    else alert("Failed to delete comment");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !task) return;
    setIsUploading(true);
    try {
       const fileKey = await uploadFileToR2(file, 'tasks/comments');
       const textToPost = (newComment.trim() ? newComment.trim() + '\n\n' : '') + `[R2_FILE::${fileKey}::${file.name}]`;
       const inserted = await postCommentText(textToPost);
       if (inserted) {
         setComments([...comments, inserted]);
         setNewComment("");
       }
    } catch (err) {
       alert("Failed to upload file");
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
                      <div className="flex items-center justify-between mb-1 gap-4">
                         <div className="flex items-baseline gap-2">
                            <span className="text-[13px] font-bold text-[#0F172A]">{c.author_name}</span>
                            <span className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleString()}</span>
                         </div>
                         <button onClick={() => handleDeleteComment(c.id, c.comment_text)} className="text-gray-400 hover:text-red-500 transition">
                            <MdDelete size={14} />
                         </button>
                      </div>
                      <CommentRenderer text={c.comment_text} />
                   </div>
                ))}
             </div>
          )}
       </div>
       <div className="p-4 border-b border-l border-r border-[#E2E8F0] rounded-b-xl bg-white flex gap-3 items-center">
          <button 
             onClick={() => fileInputRef.current?.click()} 
             disabled={isUploading}
             className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
             title="Attach File"
          >
             <MdAttachFile size={20} />
          </button>
          <input 
             type="file" 
             className="hidden" 
             ref={fileInputRef} 
             onChange={handleFileChange} 
          />
          <input 
             type="text" 
             value={newComment}
             onChange={e => setNewComment(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handlePost()}
             placeholder={isUploading ? "Uploading file..." : "Type a message..."} 
             disabled={isUploading}
             className="flex-1 h-12 px-4 rounded-xl border border-[#E2E8F0] outline-none focus:border-[#2563EB] text-[14px]" 
          />
          <button onClick={handlePost} disabled={isUploading || !newComment.trim()} className="h-12 px-6 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition disabled:opacity-50">
             Post
          </button>
       </div>
    </div>
  );
};

export default TabComments;

