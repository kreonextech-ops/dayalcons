const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/components/ViewList.jsx', 'utf8');

const rowRegex = /<td className="py-3 px-6">([\s\S]*?)<\/td>\s*<\/tr>/g;
code = code.replace(rowRegex, (match, statusHtml) => {
    return `<td className="py-3 px-4">${statusHtml}</td>
                           <td className="py-3 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => onDelete && onDelete(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition inline-flex items-center" title="Delete Task">
                                 <MdDelete size={18} />
                              </button>
                           </td>
                        </tr>`;
});

fs.writeFileSync('src/views/admin/tasks/components/ViewList.jsx', code);
