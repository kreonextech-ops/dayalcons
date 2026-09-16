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

file_path = r"C:\Users\Mr\Downloads\details.xlsx"

def insert_supabase(table, data):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=HEADERS, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Error inserting into {table}: {e}")
        return None

def run_migration():
    xl = pd.ExcelFile(file_path)
    print("Migrating SITE VISIT...")
    if 'SITE VISIT' in xl.sheet_names:
        df = xl.parse('SITE VISIT')
        df = df.dropna(subset=['Unnamed: 2']) 
        for _, row in df.iterrows():
            if str(row.get('Unnamed: 2')).strip() == 'MOBILE NO.' or str(row.get('Unnamed: 2')) == 'nan':
                continue
            
            payload = {
                'client_name': str(row.get('SITE VISIT REGISTER', '')),
                'mobile_no': str(row.get('Unnamed: 2', '')),
                'location': str(row.get('Unnamed: 3', '')),
                'visiting_date': str(row.get('Unnamed: 4', '')),
                'requirement': str(row.get('Unnamed: 5', '')),
                'amount': str(row.get('Unnamed: 6', '')),
                'status': str(row.get('Unnamed: 7', 'Ongoing'))
            }
            insert_supabase('site_visits', payload)
            print(f"Inserted site visit for {payload['client_name']}")

    print("Migrating QUOT...")
    if 'QUOT' in xl.sheet_names:
        df = xl.parse('QUOT')
        df = df.dropna(subset=['Unnamed: 1'])
        for _, row in df.iterrows():
            if str(row.get('Unnamed: 1')).strip() == 'CLIENT DETAILS' or str(row.get('Unnamed: 1')) == 'nan':
                continue
            payload = {
                'quotation_no': str(row.get('QUOTATION REGISTER', '')),
                'description': str(row.get('Unnamed: 1', '')),
                'date_arrived': str(row.get('Unnamed: 2', '')),
                'submission_deadline': str(row.get('Unnamed: 3', '')),
                'status': str(row.get('Unnamed: 4', 'Pending'))
            }
            insert_supabase('quotations', payload)
            print(f"Inserted quotation for {payload['description']}")

    print("Migration Complete!")

if __name__ == '__main__':
    run_migration()
