import os

filepath = 'crm/src/views/admin/crm/index.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

dup_str = """  const [convertedCount, setConvertedCount] = useState(0);
  const [followupTodayCount, setFollowupTodayCount] = useState(0);
  const [convertedCount, setConvertedCount] = useState(0);
  const [followupTodayCount, setFollowupTodayCount] = useState(0);"""

fixed_str = """  const [convertedCount, setConvertedCount] = useState(0);
  const [followupTodayCount, setFollowupTodayCount] = useState(0);"""

content = content.replace(dup_str, fixed_str)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Duplicate variables removed")
