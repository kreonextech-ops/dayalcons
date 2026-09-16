import pandas as pd
import urllib.request
import json

SUPABASE_URL = "https://gdzligxryodasaxnhdco.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def api_request(method, table, data=None):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8') if data else None, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        try:
            print(f"Error {method} {table}: {e.read().decode('utf-8')}")
        except:
            print(f"Error {method} {table}: {e}")
        return None

def get_clients():
    clients = api_request('GET', 'clients?select=id,name')
    return {str(c['name']).strip().upper(): c['id'] for c in clients} if clients else {}

def ensure_client(name_val, clients_map):
    if not name_val or str(name_val).strip() == '' or str(name_val).strip().lower() == 'nan':
        return None
    name = str(name_val).strip().upper()
    if name in clients_map:
        return clients_map[name]
    
    # Actually fix: no type column!
    res = api_request('POST', 'clients', {'name': name, 'status': 'Active'})
    if res and len(res) > 0:
        new_id = res[0]['id']
        clients_map[name] = new_id
        return new_id
    return None

def run_migration():
    file_path = r"C:\Users\Mr\Downloads\details.xlsx"
    xl = pd.ExcelFile(file_path)
    
    clients_map = get_clients()
            
    if 'CONST' in xl.sheet_names:
        df = xl.parse('CONST', skiprows=3)
        for idx, row in df.iterrows():
            client_col = row.get('CLIENT DETAILS')
            if str(client_col) == 'nan' or not client_col: continue
            cid = ensure_client(client_col, clients_map)
            if not cid: continue
            payload = {
                'name': f"Construction for {client_col}",
                'client_id': cid,
                'status': 'Completed' if str(row.get('REMARKS', '')).strip().upper() == 'CLOSED' else 'In Progress',
                'progress_details': str(row.get('PROGRESS DETAILS', '')),
                'signature_of_payee': str(row.get('SIGNATURE OF PAY', ''))
            }
            api_request('POST', 'projects', payload)

    print("Migration complete!")

if __name__ == '__main__':
    run_migration()
