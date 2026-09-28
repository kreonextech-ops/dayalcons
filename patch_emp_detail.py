with open('crm/src/views/admin/employees/EmployeeDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add password to empData
c = c.replace('email: employee?.email || "—",', 'email: employee?.email || "—",\n    password: employee?.password || "—",')

# Add password to UI
old_email_ui = """                  <div>
                     <p className="text-[11px] font-bold text-[#64748B] uppercase">Email</p>
                     <p className="text-[13px] font-medium text-[#0F172A]">{empData.email}</p>
                  </div>"""
new_email_ui = """                  <div>
                     <p className="text-[11px] font-bold text-[#64748B] uppercase">Email</p>
                     <p className="text-[13px] font-medium text-[#0F172A]">{empData.email}</p>
                  </div>
                  <div>
                     <p className="text-[11px] font-bold text-[#64748B] uppercase">Password</p>
                     <p className="text-[13px] font-mono text-[#0F172A]">{empData.password}</p>
                  </div>"""
c = c.replace(old_email_ui, new_email_ui)

with open('crm/src/views/admin/employees/EmployeeDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
