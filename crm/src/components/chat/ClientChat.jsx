import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { MdSend, MdAttachFile, MdInsertDriveFile, MdImage } from "react-icons/md";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClientChat({ clientId, userType }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!clientId) return;
    const { data, error } = await supabase
      .from("client_messages")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: true });
      
    if (!error && data) {
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Optional: Realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'client_messages',
          filter: `client_id=eq.${clientId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      client_id: clientId,
      sender_type: userType, // 'admin' or 'client'
      message: newMessage.trim(),
    };

    const currentMsg = newMessage;
    setNewMessage("");
    
    const { error } = await supabase.from("client_messages").insert([msg]);
    
    if (error) {
      console.error("Insert error:", error);
      alert("Failed to send message: " + error.message + " (Check RLS policies)");
      setNewMessage(currentMsg); // Restore message
    } else {
      fetchMessages(); // Fallback if realtime fails
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${clientId}/${fileName}`;

    // Upload to 'client_files' bucket
    let { error: uploadError } = await supabase.storage
      .from('client_files')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("Failed to upload file. Make sure the 'client_files' storage bucket exists and is public.");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('client_files')
      .getPublicUrl(filePath);

    const msg = {
      client_id: clientId,
      sender_type: userType,
      message: file.name, // Use file name as message text
      file_url: publicUrl,
      file_name: file.name
    };

    await supabase.from("client_messages").insert([msg]);
    setUploading(false);
    fetchMessages();
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-[20px] shadow-sm border border-[#E2E8F0]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_type === userType;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl p-3 ${isMe ? 'bg-brand-500 text-white rounded-br-none' : 'bg-gray-100 text-navy-700 rounded-bl-none'}`}>
                  {msg.file_url ? (
                    <div className="flex flex-col gap-2">
                      {msg.file_url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                        <a href={msg.file_url} target="_blank" rel="noreferrer">
                          <img src={msg.file_url} alt="attachment" className="max-w-full rounded-lg max-h-48 object-cover" />
                        </a>
                      ) : (
                        <a href={msg.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline text-sm break-all">
                          <MdInsertDriveFile size={20} />
                          {msg.file_name || "Download File"}
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  )}
                  <span className={`text-[10px] mt-1 block ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-[20px]">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          
          <label className={`cursor-pointer p-3 rounded-full hover:bg-gray-200 transition ${uploading ? 'opacity-50 pointer-events-none' : 'text-brand-500'}`}>
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            <MdAttachFile size={24} />
          </label>

          <textarea
            className="flex-1 max-h-32 min-h-[44px] bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none resize-none focus:border-brand-500"
            placeholder={uploading ? "Uploading file..." : "Type a message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={uploading}
            rows={1}
          />

          <button
            type="submit"
            disabled={uploading || !newMessage.trim()}
            className="p-3 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
