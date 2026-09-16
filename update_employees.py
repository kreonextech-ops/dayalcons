import urllib.request, json
HEADERS={'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg', 'Accept': 'application/json'}

def req(method, path, data=None):
    r = urllib.request.Request(f'https://gdzligxryodasaxnhdco.supabase.co/rest/v1/{path}', headers=HEADERS, method=method)
    if data:
        r.add_header('Content-Type', 'application/json')
        r.data = json.dumps(data).encode('utf-8')
    return urllib.request.urlopen(r).read()

# Get all employees
employees_data = json.loads(req('GET', 'employees?select=id,name,role').decode('utf-8'))

for emp in employees_data:
    name = emp['name']
    id = emp['id']
    if name in ['Sebrina Subba', 'Ashok Singha']:
        print(f"Deleting {name} ({id})")
        req('DELETE', f"employees?id=eq.{id}")
    elif name == 'Priya Sarkar':
        print(f"Updating {name} ({id}) to CRO")
        req('PATCH', f"employees?id=eq.{id}", {'role': 'CRO'})

print("Done")
