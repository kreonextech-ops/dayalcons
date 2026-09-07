import re

# 1. Fix TabComments.jsx
with open('crm/src/views/admin/tasks/components/TabComments.jsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace("[R2_FILE::::]", "`[R2_FILE::::]`")
with open('crm/src/views/admin/tasks/components/TabComments.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

# 2. Fix ClientDetail.jsx
with open('crm/src/views/admin/clients/ClientDetail.jsx', 'r', encoding='utf-8') as f:
    text = f.read()
if "textToPost =" not in text:
    print("ClientDetail not fully patched")
else:
    print("ClientDetail already has textToPost")

# 3. Fix LeadDetail.jsx
with open('crm/src/views/admin/crm/LeadDetail.jsx', 'r', encoding='utf-8') as f:
    text = f.read()
if "textToPost =" not in text:
    print("LeadDetail not fully patched")
else:
    print("LeadDetail already has textToPost")

