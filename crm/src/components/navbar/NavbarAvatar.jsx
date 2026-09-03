import React, { useState, useEffect } from "react";
import { getR2FileUrl } from "utils/r2Storage";

const NavbarAvatar = () => {
    const userStr = localStorage.getItem("dayal_user");
    const user = userStr ? JSON.parse(userStr) : { name: "U", permissions: {} };
    
    const [avatar, setAvatar] = useState(null);
    
    useEffect(() => {
       const loadUserAvatar = async () => {
           const uStr = localStorage.getItem("dayal_user");
           if (uStr) {
               const u = JSON.parse(uStr);
               if (u.permissions?.avatar && u.permissions.avatar !== "test") {
                   try {
                       const url = await getR2FileUrl(u.permissions.avatar);
                       setAvatar(url);
                   } catch(e) {}
               }
           }
       };
       loadUserAvatar();
       
       const handleStorage = () => loadUserAvatar();
       window.addEventListener('storage', handleStorage);
       return () => window.removeEventListener('storage', handleStorage);
    }, []);
    
    if (avatar) {
       return <img src={avatar} className="w-full h-full object-cover" alt="Profile" />;
    }
    
    const names = user.name.split(" ");
    if (names.length > 1) {
      return <>{(names[0][0] + names[1][0]).toUpperCase()}</>;
    }
    return <>{user.name.substring(0, 2).toUpperCase()}</>;
};

export default NavbarAvatar;
