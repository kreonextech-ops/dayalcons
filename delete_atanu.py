import urllib.request
import json

url = 'https://gdzligxryodasaxnhdco.supabase.co/rest/v1/employees?email=eq.iamatanu.swot%40gmail.com'
headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg',
    'Prefer': 'return=representation'
}

try:
    req = urllib.request.Request(url, headers=headers, method='DELETE')
    response = urllib.request.urlopen(req)
    data = json.loads(response.read().decode('utf-8'))
    print("Deleted successfully. Rows removed:")
    for d in data:
        print(d.get('name'), d.get('email'))
except Exception as e:
    print('Error:', e)
