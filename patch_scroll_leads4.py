import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_eff = """  useEffect(() => {
    if (!selectedLead && !loading && scrollPosRef.current > 0) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosRef.current, behavior: "auto" });
      }, 50);
    }
  }, [selectedLead, loading]);"""
new_eff = """  useEffect(() => {
    if (!selectedLead && !loading && scrollPosRef.current > 0) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosRef.current, behavior: "auto" });
        scrollPosRef.current = 0;
      }, 50);
    }
  }, [selectedLead, loading]);"""
content = content.replace(old_eff, new_eff)
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

filepath = 'crm/src/views/admin/clients/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()
old_eff_c = """  useEffect(() => {
    if (!selectedClient && !loading && scrollPosRef.current > 0) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosRef.current, behavior: "auto" });
      }, 50);
    }
  }, [selectedClient, loading]);"""
new_eff_c = """  useEffect(() => {
    if (!selectedClient && !loading && scrollPosRef.current > 0) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosRef.current, behavior: "auto" });
        scrollPosRef.current = 0;
      }, 50);
    }
  }, [selectedClient, loading]);"""
content = content.replace(old_eff_c, new_eff_c)
with open(filepath, 'w', encoding='utf-8') as f: f.write(content)

print("Reset scrollPos to 0 added")
