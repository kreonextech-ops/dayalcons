const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/components/ViewList.jsx', 'utf8');

if (!code.includes('MdDelete')) {
   code = code.replace('import Card from "components/card";', 'import Card from "components/card";\nimport { MdDelete } from "react-icons/md";');
}

code = code.replace(/const ViewList = \(\{ onSelect, tasks = \[\] \}\) => \{/, 'const ViewList = ({ onSelect, onDelete, tasks = [] }) => {');
code = code.replace(/<th className="py-4 px-6 text-\[11px\] font-bold text-\[#64748B\] uppercase tracking-wider">Status<\/th>/, '<th className="py-4 px-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Status</th>\n                   <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Actions</th>');
code = code.replace(/<td colSpan="8"/, '<td colSpan="9"');

const rowRegex = /<td className="py-4 px-6">([\s\S]*?)<\/td>\s*<\/tr>/g;
code = code.replace(rowRegex, (match, statusHtml) => {
    return `<td className="py-4 px-4">${statusHtml}</td>
                         <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => onDelete && onDelete(task.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete Task">
                               <MdDelete size={18} />
                            </button>
                         </td>
                      </tr>`;
});

fs.writeFileSync('src/views/admin/tasks/components/ViewList.jsx', code);
