const fs = require('fs');
let code = fs.readFileSync('src/components/navbar/index.jsx', 'utf8');

// I will extract the Avatar logic into the Navbar component body or create a sub-component.
// Let's create a sub-component at the top of the file: NavbarAvatar.

const avatarComponent = `
const NavbarAvatar = () => {
    const userStr = localStorage.getItem("dayal_user");
    const user = userStr ? JSON.parse(userStr) : { name: "User", permissions: {} };
    
    const [avatar, setAvatar] = React.useState(null);
    
    React.useEffect(() => {
       const loadUserAvatar = async () => {
           const uStr = localStorage.getItem("dayal_user");
           if (uStr) {
               const u = JSON.parse(uStr);
               if (u.permissions?.avatar) {
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
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
};
`;

if (!code.includes('NavbarAvatar = () =>')) {
    code = code.replace(
        'const Navbar = (props) => {',
        `${avatarComponent}\n\nconst Navbar = (props) => {`
    );
}

// Now replace the buggy inline hook with <NavbarAvatar />
const buggyInline = /\{\(\(\) => \{\s*const userStr = localStorage\.getItem\("dayal_user"\)[\s\S]*?\}\)\(\)\}/;
code = code.replace(buggyInline, '<NavbarAvatar />');

fs.writeFileSync('src/components/navbar/index.jsx', code);
