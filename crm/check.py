import urllib.request
import json

url = 'https://gdzligxryodasaxnhdco.supabase.co/rest/v1/clients?select=name'
headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg'
}

req = urllib.request.Request(url, headers=headers)
response = urllib.request.urlopen(req)
data = json.loads(response.read().decode('utf-8'))

db_names = [d['name'].lower() for d in data if 'name' in d and d['name']]

targets = {
    'Mamani Basmali': ['mamani', 'basmali'],
    'Mastaba Juri Alam (or Mojtaba / Mujtaba / Mastafajur)': ['mastaba', 'mojtaba', 'mujtaba', 'mastafajur', 'juri', 'alam'],
    'Dr. Chanchal Barman': ['chanchal', 'barman'],
    'Rupa Hazari': ['rupa', 'hazari'],
    'Suraj Thapa': ['suraj', 'thapa'],
    'Nikam Tamang': ['nikam', 'tamang']
}

for original, keywords in targets.items():
    found = False
    matched = ""
    for dbn in db_names:
        # Require at least one significant keyword to match
        if any(kw in dbn for kw in keywords if len(kw) > 3 or kw in ['rupa']):
            found = True
            matched = [d['name'] for d in data if d['name'] and d['name'].lower() == dbn][0]
            break
    print(f"{original}: {'FOUND (' + matched + ')' if found else 'MISSING'}")
