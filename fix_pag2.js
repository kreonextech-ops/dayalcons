const fs = require('fs');

function process(filePath, arrName) {
    let c = fs.readFileSync(filePath, 'utf8');

    c = c.replace('const [sortOrder, setSortOrder] = useState(', 'const [currentPage, setCurrentPage] = useState(1);\n  const [sortOrder, setSortOrder] = useState(');
    
    c = c.replace('return filtered.map((', 'const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);\n                     return paginated.map((');
    
    c = c.replace('{filtered.length - index}', '{filtered.length - ((currentPage - 1) * 10 + index)}');

    // The showing string:
    const oldShowingRegex = /Showing \{.*?\.length > 0 \? `1 - \$\{.*?\.length\}` : '—'\} of \{.*?\.length > 0 \? .*?\.length : '—'\} .*?<\/span>/;
    const newShowing = `Showing {${arrName}.length > 0 ? ((currentPage - 1) * 10 + 1) : 0} - {Math.min(currentPage * 10, ${arrName}.length)} of {${arrName}.length} ${arrName}</span>`;
    c = c.replace(oldShowingRegex, newShowing);

    // Nav buttons
    c = c.replace(
        /<button className="h-8 px-3 rounded border[^>]*><MdKeyboardArrowLeft \/> Prev<\/button>/,
        '<button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 px-3 rounded border border-[#E2E8F0] dark:border-navy-700 text-[13px] font-medium text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center transition disabled:opacity-50"><MdKeyboardArrowLeft /> Prev</button>'
    );
    
    c = c.replace(
        /<button className="h-8 px-3 rounded border[^>]*>Next <MdKeyboardArrowRight \/><\/button>/,
        `<button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * 10 >= ${arrName}.length} className="h-8 px-3 rounded border border-[#E2E8F0] dark:border-navy-700 text-[13px] font-medium text-[#64748B] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center transition disabled:opacity-50">Next <MdKeyboardArrowRight /></button>`
    );

    c = c.replace(
        /<button className="h-8 px-3 rounded bg-\[#2563EB\] text-white text-\[13px\] font-medium shadow-sm">1<\/button>/,
        '<button className="h-8 px-3 rounded bg-[#2563EB] text-white text-[13px] font-medium shadow-sm">{currentPage}</button>'
    );
    
    c = c.replace(/onChange=\{\(e\) => set([a-zA-Z0-9_]+)\(e\.target\.value\)\}/g, 'onChange={(e) => { set$1(e.target.value); setCurrentPage(1); }}');
    
    fs.writeFileSync(filePath, c);
}

process('crm/src/views/admin/crm/index.jsx', 'leads');
process('crm/src/views/admin/clients/index.jsx', 'clients');
