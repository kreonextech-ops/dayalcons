def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    text = text.replace("'\n\n'", "'\\\\n\\\\n'")
    text = text.replace("'\n  \n  '", "'\\\\n\\\\n'")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

fix_file('crm/src/views/admin/clients/ClientDetail.jsx')
fix_file('crm/src/views/admin/crm/LeadDetail.jsx')
