import React, { useState, useEffect, useRef } from "react";
import Card from "components/card";
import { MdPerson, MdEmail, MdPhone, MdLock, MdCloudUpload } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";
import { uploadFileToR2, getR2FileUrl } from "utils/r2Storage";


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userStr = localStorage.getItem("dayal_user");
    if (userStr) {
      const parsed = JSON.parse(userStr);
      setUser(parsed);
      setFormData({
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      loadAvatar(parsed.permissions?.avatar);
    }
  }, []);

  const loadAvatar = async (fileKey) => {
      if (fileKey && fileKey !== "test") {
          try {
              const url = await getR2FileUrl(fileKey);
              setAvatarUrl(url);
          } catch (e) {
              console.error("Failed to load avatar", e);
          }
      }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    
    setIsUploading(true);
    try {
        const fileKey = await uploadFileToR2(file, 'profiles');
        const updatedPermissions = { ...(user.permissions || {}), avatar: fileKey };
        
        const { error } = await supabase.from('employees').update({ permissions: updatedPermissions }).eq('id', user.id);
        
        if (error) throw error;
        
        const updatedUser = { ...user, permissions: updatedPermissions };
        localStorage.setItem("dayal_user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        loadAvatar(fileKey);
        
        alert("Profile photo updated successfully!");
    } catch (err) {
        alert("Failed to upload photo. Ensure R2 CORS is configured.");
        console.error(err);
    }
    setIsUploading(false);
    e.target.value = null;
  };

  const handleSaveProfile = async () => {
     if (!user) return;
     
     // If user wants to change password, verify current password first
     if (formData.newPassword) {
         if (!formData.currentPassword) {
             alert("Please enter your current password to set a new one.");
             return;
         }
         
         // Verify current password against DB
         const { data: dbUser, error: verifyError } = await supabase
             .from('employees')
             .select('password')
             .eq('id', user.id)
             .single();
         
         if (verifyError || !dbUser) {
             alert("Could not verify your identity. Please try again.");
             return;
         }
         
         if (dbUser.password !== formData.currentPassword) {
             alert("Incorrect current password. Please try again.");
             return;
         }
         
         if (formData.newPassword !== formData.confirmPassword) {
             alert("New passwords do not match!");
             return;
         }
     }
     
     const updatePayload = {
         name: formData.name,
         email: formData.email,
         phone: formData.phone
     };
     
     if (formData.newPassword) {
         updatePayload.password = formData.newPassword;
     }
     
     try {
         const { data, error } = await supabase.from('employees').update(updatePayload).eq('id', user.id).select();
         
         if (error) throw error;
         
         if (data && data[0]) {
             const updatedUser = data[0];
             localStorage.setItem("dayal_user", JSON.stringify(updatedUser));
             setUser(updatedUser);
             setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
             alert("Profile settings updated successfully!");
             
             // Dispatch a custom event to update navbar instantly
             window.dispatchEvent(new Event('storage'));
         }
     } catch (err) {
         alert("Failed to update profile settings.");
         console.error(err);
     }
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3 animate-fade-in">
       
       
       {/* Left Column: Avatar & Basic Info */}
       <div className="col-span-1 flex flex-col gap-5">
           <Card extra="items-center w-full h-full p-[16px] bg-cover">
               <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}>
                  <div className="absolute -bottom-12 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[4px] border-white bg-white dark:!border-navy-700">
                     {avatarUrl ? (
                         <img className="h-full w-full rounded-full object-cover" src={avatarUrl} alt="avatar" />
                     ) : (
                         <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                         </div>
                     )}
                     
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                     <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute bottom-0 right-0 p-2 bg-brand-500 rounded-full text-white shadow-md hover:bg-brand-600 transition disabled:opacity-50"
                        title="Upload Profile Photo"
                     >
                        <MdCloudUpload size={16} />
                     </button>
                  </div>
               </div>
               
               <div className="mt-16 flex flex-col items-center">
                  <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                     {user.name}
                  </h4>
                  <p className="text-base font-normal text-gray-600">{user.role}</p>
               </div>
           </Card>
       </div>
       
       {/* Right Column: Settings Form */}
       <div className="col-span-1 md:col-span-2">
          <Card extra="w-full h-full p-6">
              <h4 className="text-xl font-bold text-navy-700 mb-6 border-b pb-4">
                 Account Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Name */}
                 <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-2 font-medium flex items-center gap-2"><MdPerson /> Full Name</label>
                    <input 
                       type="text" 
                       className="border rounded-lg p-2.5 outline-none focus:border-brand-500" 
                       value={formData.name} 
                       onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                 </div>
                 
                 {/* Email */}
                 <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-2 font-medium flex items-center gap-2"><MdEmail /> Email Address</label>
                    <input 
                       type="email" 
                       className="border rounded-lg p-2.5 outline-none focus:border-brand-500 bg-gray-50" 
                       value={formData.email} 
                       disabled 
                       title="Email cannot be changed"
                    />
                 </div>
                 
                 {/* Phone */}
                 <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-2 font-medium flex items-center gap-2"><MdPhone /> Phone Number</label>
                    <input 
                       type="text" 
                       className="border rounded-lg p-2.5 outline-none focus:border-brand-500" 
                       value={formData.phone} 
                       onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                       placeholder="Not provided"
                    />
                 </div>
                 
                 {/* Role */}
                 <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-2 font-medium flex items-center gap-2"><MdPerson /> Account Role</label>
                    <input 
                       type="text" 
                       className="border rounded-lg p-2.5 outline-none focus:border-brand-500 bg-gray-50" 
                       value={user.role} 
                       disabled 
                    />
                 </div>
              </div>
              
              <h4 className="text-lg font-bold text-navy-700 mt-8 mb-4 border-b pb-4 flex items-center gap-2">
                 <MdLock /> Security
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-2 font-medium">Current Password</label>
                    <input 
                       type="password" 
                       className="border rounded-lg p-2.5 outline-none focus:border-brand-500" 
                       value={formData.currentPassword} 
                       onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} 
                       placeholder="Enter current password"
                    />
                 </div>
                 <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-2 font-medium">New Password</label>
                    <input 
                       type="password" 
                       className="border rounded-lg p-2.5 outline-none focus:border-brand-500" 
                       value={formData.newPassword} 
                       onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
                       placeholder="Enter new password"
                    />
                 </div>
                 <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-2 font-medium">Confirm New Password</label>
                    <input 
                       type="password" 
                       className="border rounded-lg p-2.5 outline-none focus:border-brand-500" 
                       value={formData.confirmPassword} 
                       onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                       placeholder="Confirm new password"
                    />
                 </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                 <button onClick={handleSaveProfile} className="bg-brand-500 text-white font-bold px-6 py-2.5 rounded-lg shadow-md hover:bg-brand-600 transition">
                    Save Changes
                 </button>
              </div>
          </Card>
       </div>
    </div>
  );
};

export default ProfileSettings;
