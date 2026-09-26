import os
import re

def add_pagination(filepath, is_leads=False):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Add states
    if 'const [currentPage, setCurrentPage]' not in content:
        content = content.replace(
            'const [sortOrder, setSortOrder] = useState(',
            'const [currentPage, setCurrentPage] = useState(1);\n  const [sortOrder, setSortOrder] = useState('
        )
    
    # 2. Reset page on filter changes (just heuristically doing this on data change might be tricky, but we can just let them change page)
    # Actually, we can just slice the `filtered` array right before rendering.
    
    # 3. Find the render map
    # In crm/index.jsx: filtered.map((lead, index) =>
    # In clients/index.jsx: filtered.map((client, index) =>
    
    # Let's find the `<tbody>` block
    # We will slice `filtered` inside the JSX:
    # `const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);`
    # `return paginated.map(...)`
    
    # Replace the map block
    if 'let filtered =' in content:
        if is_leads:
            old_map = "return filtered.map((lead, index) => ("
            new_map = """
                     const totalPages = Math.ceil(filtered.length / 10);
                     const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);
                     return paginated.map((lead, index) => (
"""
            content = content.replace(old_map, new_map)
            
            # Fix index numbering in the table
            content = content.replace(
                '{filtered.length - index}',
                '{filtered.length - ((currentPage - 1) * 10 + index)}'
            )
        else:
            old_map = "return filtered.map((client, index) => ("
            new_map = """
                     const totalPages = Math.ceil(filtered.length / 10);
                     const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);
                     return paginated.map((client, index) => (
"""
            content = content.replace(old_map, new_map)
            
            content = content.replace(
                '{filtered.length - index}',
                '{filtered.length - ((currentPage - 1) * 10 + index)}'
            )

    # 4. Update the "Showing 1 - X" text
    old_showing = r'Showing \{.*?\.length > 0 \? `1 - \$\{.*?\.length\}` : .—.\} of \{.*?\.length > 0 \? .*?\.length : .—.\} .*?</span>'
    
    arr_name = 'leads' if is_leads else 'clients'
    
    new_showing = f"""Showing {{filtered.length > 0 ? ((currentPage - 1) * 10 + 1) : 0}} - {{Math.min(currentPage * 10, filtered.length)}} of {{filtered.length}} {arr_name}</span>"""
    
    content = re.sub(old_showing, new_showing, content, flags=re.DOTALL)
    
    # 5. Update the pagination buttons
    old_prev = r'<button className="h-8 px-3 rounded border[^>]*><MdKeyboardArrowLeft /> Prev</button>'
    new_prev = f"""<button onClick={{() => setCurrentPage(p => Math.max(1, p - 1))}} disabled={{currentPage === 1}} className="h-8 px-3 rounded border border-[#E2E8F0] dark:border-navy-700 text-[13px] font-medium text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center transition disabled:opacity-50"><MdKeyboardArrowLeft /> Prev</button>"""
    content = re.sub(old_prev, new_prev, content)
    
    old_next = r'<button className="h-8 px-3 rounded border[^>]*>Next <MdKeyboardArrowRight /></button>'
    new_next = f"""<button onClick={{() => setCurrentPage(p => p + 1)}} disabled={{currentPage * 10 >= filtered.length}} className="h-8 px-3 rounded border border-[#E2E8F0] dark:border-navy-700 text-[13px] font-medium text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center transition disabled:opacity-50">Next <MdKeyboardArrowRight /></button>"""
    content = re.sub(old_next, new_next, content)
    
    old_num = r'<button className="h-8 px-3 rounded bg-\[#2563EB\] text-white text-\[13px\] font-medium shadow-sm">1</button>'
    new_num = f"""<button className="h-8 px-3 rounded bg-[#2563EB] text-white text-[13px] font-medium shadow-sm">{{currentPage}}</button>"""
    content = re.sub(old_num, new_num, content)
    
    # Reset page on filter changes (hacky but works: just add it to the select onChanges)
    content = content.replace('setFilterEmployee(e.target.value)', 'setFilterEmployee(e.target.value); setCurrentPage(1)')
    content = content.replace('setFilterService(e.target.value)', 'setFilterService(e.target.value); setCurrentPage(1)')
    content = content.replace('setFilterStatus(e.target.value)', 'setFilterStatus(e.target.value); setCurrentPage(1)')
    content = content.replace('setSortOrder(e.target.value)', 'setSortOrder(e.target.value); setCurrentPage(1)')
    content = content.replace('setSearchTerm(e.target.value)', 'setSearchTerm(e.target.value); setCurrentPage(1)')

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Patched pagination in " + filepath)

add_pagination("crm/src/views/admin/crm/index.jsx", is_leads=True)
add_pagination("crm/src/views/admin/clients/index.jsx", is_leads=False)
