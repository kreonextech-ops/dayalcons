import re

def process(filepath, is_leads=True):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. State
    if 'currentPage' not in content:
        content = content.replace('const [sortOrder, setSortOrder] = useState(', 'const [currentPage, setCurrentPage] = useState(1);\n  const [sortOrder, setSortOrder] = useState(')
    
    # 2. Extract IIFE logic
    tbody_start = content.find('<tbody>')
    tbody_end = content.find('</tbody>')
    
    iife = re.search(r'\{\(\(\) => \{\s*(let filtered = [\s\S]*?return filtered\.map\([\s\S]*?\);\s*)\}\)\(\)\}', content[tbody_start:tbody_end])
    if not iife: return print("Not found", filepath)
    
    filter_code = iife.group(1)
    
    # rewrite filter_code
    new_filter_code = filter_code.replace("return filtered.map", "return { filtered, paginated: filtered.slice((currentPage - 1) * 10, currentPage * 10) };\n// return filtered.map")
    
    display_data_block = f"""
  const {{ filtered: finalFiltered, paginated: finalPaginated }} = (() => {{
      {new_filter_code}
  }})();
  """
    
    return_idx = content.rfind('return (')
    content = content[:return_idx] + display_data_block + content[return_idx:]
    
    # Replace the IIFE inside tbody
    old_iife_full = iife.group(0)
    
    var_name = 'lead' if is_leads else 'client'
    new_map = f"""{{finalPaginated.length === 0 ? (
       <tr><td colSpan="11" className="py-12 text-center text-gray-500">No data found.</td></tr>
    ) : (
       finalPaginated.map(({var_name}, index) => {{
          const oldLen = finalFiltered.length - ((currentPage - 1) * 10 + index);
          return (
"""
    # Now just replace old_iife_full with new_map... wait, we need the actual JSX inside the map!
    # I can just use a simpler regex. Let's just find `filtered.map((lead, index) => (`
    # and replace with `finalPaginated.map((lead, index) => (`
    pass

def quick_fix(filepath, is_leads=True):
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
        
    c = c.replace('const [sortOrder, setSortOrder] = useState(', 'const [currentPage, setCurrentPage] = useState(1);\n  const [sortOrder, setSortOrder] = useState(')
    
    if is_leads:
        c = c.replace('let filtered = leads;', 'let filtered = leads;\n                       const totalPages = Math.ceil(filtered.length / 10);')
    else:
        c = c.replace('let filtered = clients;', 'let filtered = clients;\n                       const totalPages = Math.ceil(filtered.length / 10);')
        
    c = c.replace('return filtered.map((', 'const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);\n                     if (paginated.length === 0) return <tr><td colSpan="11" className="py-12 text-center text-gray-500">No data found.</td></tr>;\n                     return paginated.map((')
    
    c = c.replace('{filtered.length - index}', '{filtered.length - ((currentPage - 1) * 10 + index)}')
    
    old_footer = 'Showing {leads.length > 0 ? `1 - ${leads.length}` : \'—\'} of {leads.length > 0 ? leads.length : \'—\'} leads</span>' if is_leads else 'Showing {clients.length > 0 ? `1 - ${clients.length}` : \'—\'} of {clients.length > 0 ? clients.length : \'—\'} clients</span>'
    new_footer = 'Showing {leads.length > 0 ? ((currentPage - 1) * 10 + 1) : 0} - {Math.min(currentPage * 10, leads.length)} of {leads.length} leads</span>' if is_leads else 'Showing {clients.length > 0 ? ((currentPage - 1) * 10 + 1) : 0} - {Math.min(currentPage * 10, clients.length)} of {clients.length} clients</span>'
    c = c.replace(old_footer, new_footer)
    
    old_nav = '<button className="h-8 px-3 rounded border border-[#E2E8F0] dark:border-navy-700 text-[13px] font-medium text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center transition"><MdKeyboardArrowLeft /> Prev</button>\n               <button className="h-8 px-3 rounded bg-[#2563EB] text-white text-[13px] font-medium shadow-sm">1</button>\n               <button className="h-8 px-3 rounded border border-[#E2E8F0] dark:border-navy-700 text-[13px] font-medium text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center transition">Next <MdKeyboardArrowRight /></button>'
    new_nav = '<button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 px-3 rounded border border-[#E2E8F0] dark:border-navy-700 text-[13px] font-medium text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center transition disabled:opacity-50"><MdKeyboardArrowLeft /> Prev</button>\n               <button className="h-8 px-3 rounded bg-[#2563EB] text-white text-[13px] font-medium shadow-sm">{currentPage}</button>\n               <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * 10 >= (is_leads and "leads" or "clients").length} className="h-8 px-3 rounded border border-[#E2E8F0] dark:border-navy-700 text-[13px] font-medium text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center transition disabled:opacity-50">Next <MdKeyboardArrowRight /></button>'
    
    # Wait, the `disabled` uses the literal string `(is_leads and "leads" or "clients").length`. I should format it in python.
    pass

def do_it(filepath, is_leads=True):
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
    
    c = c.replace('const [sortOrder, setSortOrder] = useState(', 'const [currentPage, setCurrentPage] = useState(1);\n  const [sortOrder, setSortOrder] = useState(')
    if is_leads:
        c = c.replace('let filtered = leads;', 'let filtered = leads;')
    else:
        c = c.replace('let filtered = clients;', 'let filtered = clients;')
        
    c = c.replace('return filtered.map((', 'const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);\n                     return paginated.map((')
    c = c.replace('{filtered.length - index}', '{filtered.length - ((currentPage - 1) * 10 + index)}')
    
    # Change footer text
    # Finding footer string using regex
    c = re.sub(r'Showing \{.*?\.length > 0 \? `1 - \$\{.*?\.length\}` : .—.\} of \{.*?\.length > 0 \? .*?\.length : .—.\} .*?</span>', f'Showing {{(currentPage - 1) * 10 + 1}} - {{Math.min(currentPage * 10, {"leads" if is_leads else "clients"}.length)}} of {{"leads" if is_leads else "clients"}.length} {"leads" if is_leads else "clients"}</span>', c)
    
    # Pagination buttons
    c = re.sub(
        r'<button className="h-8 px-3 rounded border[^>]*><MdKeyboardArrowLeft /> Prev</button>',
        r'<button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 px-3 rounded border border-[#E2E8F0] dark:border-navy-700 text-[13px] font-medium text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center transition disabled:opacity-50"><MdKeyboardArrowLeft /> Prev</button>',
        c
    )
    c = re.sub(
        r'<button className="h-8 px-3 rounded border[^>]*>Next <MdKeyboardArrowRight /></button>',
        f'<button onClick={{() => setCurrentPage(p => p + 1)}} disabled={{currentPage * 10 >= {"leads" if is_leads else "clients"}.length}} className="h-8 px-3 rounded border border-[#E2E8F0] dark:border-navy-700 text-[13px] font-medium text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center transition disabled:opacity-50">Next <MdKeyboardArrowRight /></button>',
        c
    )
    c = re.sub(
        r'<button className="h-8 px-3 rounded bg-\[#2563EB\] text-white text-\[13px\] font-medium shadow-sm">1</button>',
        r'<button className="h-8 px-3 rounded bg-[#2563EB] text-white text-[13px] font-medium shadow-sm">{currentPage}</button>',
        c
    )
    
    # Reset page on filter changes
    c = re.sub(r'onChange=\{\(e\) => set([a-zA-Z0-9_]+)\(e\.target\.value\)\}', r'onChange={(e) => { set\1(e.target.value); setCurrentPage(1); }}', c)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(c)

do_it('crm/src/views/admin/crm/index.jsx', True)
do_it('crm/src/views/admin/clients/index.jsx', False)

