import os
import re

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
    
    # The search bar card ends here:
    #               </div>
    #               </Card>
    #           {/* 4. Clients Data Table */} (or similar)
    
    # We want to replace the FIRST </Card> that comes after `sticky top-[60px]` with `</Card></div>`
    
    parts = c.split('sticky top-[60px]')
    if len(parts) > 1:
        # parts[1] contains the rest of the file
        subparts = parts[1].split('</Card>', 1)
        if len(subparts) > 1:
            # subparts[0] is everything up to the first </Card>
            # subparts[1] is everything after
            parts[1] = subparts[0] + '</Card>\n        </div>\n' + subparts[1]
            
        c = 'sticky top-[60px]'.join(parts)
    
    # Now we must remove the trailing `</div> {/* Close Green Sticky Wrapper */}`
    # Wait, my previous script already did `c.replace('</Card>\n        </div> {/* Close Green Sticky Wrapper */}', '</Card>')`
    # Let's check if the comment still exists
    c = re.sub(r'<\/div>\s*\{\/\*\s*Close Green Sticky Wrapper\s*\*\/\}', '', c)
    c = re.sub(r'<\/div>\s*\{\/\*\s*Close Sticky Wrapper\s*\*\/\}', '', c)
    
    # If the comment is already gone but the extra </div> is still there?
    # Actually, let's just make sure we don't have too many </div>s.
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)

print("Done")
