with open("crm/src/views/auth/SignIn.jsx", "r", encoding="utf-8") as f:
    content = f.read()

old_func = """  const enterDashboard = async (data) => {
    await logLogin(data.name, data.id);
    sessionStorage.setItem("dayal_user", JSON.stringify(data));
    if (data.role === "Client") navigate("/client/default");
    else navigate("/admin/default");
  };"""

new_func = """  const enterDashboard = async (data) => {
    // Fire-and-forget logLogin so it doesn't block the user from entering the dashboard
    logLogin(data.name, data.id).catch(console.error);
    
    sessionStorage.setItem("dayal_user", JSON.stringify(data));
    if (data.role === "Client") navigate("/client/default");
    else navigate("/admin/default");
  };"""

content = content.replace(old_func, new_func)

with open("crm/src/views/auth/SignIn.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Speed patch applied!")
