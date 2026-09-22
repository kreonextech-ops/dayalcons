import os

files_to_update = [
    'crm/src/routes.js',
    'crm/src/components/sidebar/components/Links.jsx',
    'crm/src/views/admin/assignments/index.jsx'
]

for filepath in files_to_update:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace Hub with Workflow in text
        content = content.replace('Assignment Hub', 'Assignment Workflow')
        content = content.replace('AssignmentHub', 'AssignmentWorkflow')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Renamed in {filepath}")
    else:
        print(f"File not found: {filepath}")
