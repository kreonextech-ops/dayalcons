import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_eff = """  useEffect(() => {
    if (!selectedLead && scrollPosRef.current > 0) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosRef.current, behavior: "auto" });
      }, 100);
    }
  }, [selectedLead]);"""
new_eff = """  useEffect(() => {
    if (!selectedLead && !loading && scrollPosRef.current > 0) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosRef.current, behavior: "auto" });
      }, 50);
    }
  }, [selectedLead, loading]);"""

content = content.replace(old_eff, new_eff)
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_eff_c = """  useEffect(() => {
    if (!selectedClient && scrollPosRef.current > 0) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosRef.current, behavior: "auto" });
      }, 100);
    }
  }, [selectedClient]);"""
new_eff_c = """  useEffect(() => {
    if (!selectedClient && !loading && scrollPosRef.current > 0) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosRef.current, behavior: "auto" });
      }, 50);
    }
  }, [selectedClient, loading]);"""

content = content.replace(old_eff_c, new_eff_c)
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

print("Dependencies fixed")
