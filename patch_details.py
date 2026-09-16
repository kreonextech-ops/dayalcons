import sys

def patch_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Rename Tab
    content = content.replace('"Site Visit"', '"Visit"')
    content = content.replace("tab === 'Site Visit'", "tab === 'Visit'")
    content = content.replace("activeTab === 'Site Visit'", "activeTab === 'Visit'")

    # Status dropdown options
    # In LeadDetail
    content = content.replace('<option>New</option>', '<option>Ongoing</option>')
    content = content.replace('<option>Contacted</option>', '')
    content = content.replace('<option>Site Visit</option>', '<option>Success</option>')
    content = content.replace('<option>Proposal Sent</option>', '')
    content = content.replace('<option>Won</option>', '')
    content = content.replace('<option>Lost</option>', '<option>Closed</option>')

    # In ClientDetail (if any)
    content = content.replace('<option value="active">Active</option>', '<option value="Ongoing">Ongoing</option>\n<option value="Success">Success</option>')
    content = content.replace('<option value="inactive">Inactive</option>', '<option value="Closed">Closed</option>')
    
    with open(filepath, 'w') as f:
        f.write(content)

patch_file('crm/src/views/admin/crm/LeadDetail.jsx')
patch_file('crm/src/views/admin/clients/ClientDetail.jsx')
print("Patched Details")
