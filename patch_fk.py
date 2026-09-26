with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

s1 = """await supabase.from("clients").delete().eq("id", clientData.id);
    onBack({ id: clientData.id, deleted: true });"""
r1 = """const { error: delErr } = await supabase.from("clients").delete().eq("id", clientData.id);
    if (delErr) { alert("Cannot delete: Client has active projects, tasks, or services attached to them. Delete those first."); return; }
    onBack({ id: clientData.id, deleted: true });"""
c = c.replace(s1, r1)

s2 = """await supabase.from('clients').delete().eq('id', clientData.id);
    onBack({ id: clientData.id, deleted: true });"""
r2 = """const { error: delErr2 } = await supabase.from('clients').delete().eq('id', clientData.id);
    if (delErr2) { alert("Cannot convert: Client has active projects or services attached to them. Delete those first."); return; }
    onBack({ id: clientData.id, deleted: true });"""
c = c.replace(s2, r2)

with open('crm/src/views/admin/clients/ClientDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
