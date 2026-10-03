import urllib.request
import json

headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg'
}

print("Checking system_logs...")
try:
    url = 'https://gdzligxryodasaxnhdco.supabase.co/rest/v1/system_logs?order=created_at.desc&limit=10'
    req = urllib.request.Request(url, headers=headers)
    logs = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    if logs:
        for log in logs:
            print(f"{log.get('created_at')} | {log.get('action')} | {log.get('details')}")
    else:
        print("No system logs found.")
except Exception as e:
    print('Error with system_logs:', e)

print("\nChecking audit_logs...")
try:
    url2 = 'https://gdzligxryodasaxnhdco.supabase.co/rest/v1/audit_logs?order=created_at.desc&limit=30'
    req = urllib.request.Request(url2, headers=headers)
    logs = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    if logs:
        for log in logs:
            print(f"{log.get('created_at')} | {log.get('action')} | {log.get('entity_type')} | {log.get('details')}")
    else:
        print("No audit logs found.")
except Exception as e:
    print('Error with audit_logs:', e)
