import os

directories = [
    'crm/src/views/admin/crm',
    'crm/src/views/admin/clients',
    'crm/src/views/admin/services',
    'crm/src/views/admin/projects',
    'crm/src/views/admin/tasks',
    'crm/src/views/admin/followups'
]

for d in directories:
    fp = os.path.join(d, 'index.jsx')
    if not os.path.exists(fp): continue
    
    with open(fp, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # 1. First, we need to remove the {/* Close Green Sticky Wrapper */} comment and the </div> just before it
    # Since it's at the end of the table card
    
    # In my previous patch, the structure is:
    # </Card>
    # </div> {/* Close Green Sticky Wrapper */}
    # 
    # </div>
    # {/* New Client Modal */}
    
    c = c.replace('</Card>\n        </div> {/* Close Green Sticky Wrapper */}', '</Card>')
    
    # 2. Now we need to CLOSE the sticky div right after the Search Bar Card.
    # The Search Bar card ends with </Card>. And immediately after is the Table Card.
    # Search Bar Card is: <Card extra="shrink-0 p-3... mb-3 ..."> ... </Card>
    # So we replace </Card> \n <Card extra="flex flex-col
    # with </Card> \n </div> \n <Card extra="flex flex-col
    
    c = c.replace('</Card>\n        <Card extra="flex flex-col', '</Card>\n        </div>\n        <Card extra="flex flex-col')
    c = c.replace('</Card>\n          <Card extra="flex flex-col', '</Card>\n          </div>\n          <Card extra="flex flex-col')
    
    # Note: the exact spacing might vary. Let's use a safer regex.
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)

print("Done")
