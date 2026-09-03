const fs = require('fs');
let code = fs.readFileSync('src/views/admin/tasks/index.jsx', 'utf8');

// 1. Change KPI calculations to use displayedTasks instead of allTasks
// We need to move the displayedTasks definition ABOVE the KPI calculations.

const kpiStartIdx = code.indexOf('// KPIs');
const displayedTasksRegex = /const \[taskScope, setTaskScope\] = useState\("My Tasks"\);\n\n\s*const userStr = localStorage\.getItem\("dayal_user"\);\n\s*const loggedInUser = userStr \? JSON\.parse\(userStr\) : null;\n\s*const isAdminOrMD = loggedInUser && \(loggedInUser\.role === "Admin" \|\| loggedInUser\.role === "MD"\);\n\n\s*const displayedTasks = allTasks\.filter\(t => \{\n\s*if \(\!loggedInUser\) return true; \/\/ fallback\n\s*if \(taskScope === "All Tasks" && isAdminOrMD\) return true;\n\s*if \(taskScope === "My Tasks"\) return t\.assignee_id === loggedInUser\.id;\n\s*if \(taskScope === "Given Tasks"\) return t\.creator_id === loggedInUser\.id;\n\s*return false;\n\s*\}\);\n/;

// Extract the displayedTasks block
const displayedTasksMatch = code.match(displayedTasksRegex);
if (displayedTasksMatch) {
    const displayedTasksBlock = displayedTasksMatch[0];
    code = code.replace(displayedTasksRegex, '');
    code = code.replace('// KPIs', displayedTasksBlock + '\n    // KPIs');
} else {
    console.log("Could not find displayedTasks block to move.");
}

// Now replace allTasks with displayedTasks inside the KPI block
const kpiLines = [
    'const activeTasks = allTasks.filter(t => t.status !== "Completed");',
    'const inProgress = allTasks.filter(t => t.status === "In Progress");',
    'const waitingReview = allTasks.filter(t => t.status === "Needs Approval" || t.status === "Waiting Review");',
    'const completed = allTasks.filter(t => t.status === "Completed");',
    'const uniqueEmployees = new Set(allTasks.filter(t => t.assigneeName).map(t => t.assigneeName)).size;'
];

for (let line of kpiLines) {
    code = code.replace(line, line.replace(/allTasks/g, 'displayedTasks'));
}

// 2. Hide "Assigned Employees" KPI if not Admin/MD, and remove Calendar from views
// Also remove Calendar view export button.

const viewsArrayOld = `const views = [
      { name: "Kanban", icon: <MdViewKanban /> },
      { name: "List", icon: <MdViewList /> },
      { name: "Calendar", icon: <MdCalendarToday /> }
    ];`;
const viewsArrayNew = `const views = [
      { name: "Kanban", icon: <MdViewKanban /> },
      { name: "List", icon: <MdViewList /> }
    ];`;
code = code.replace(viewsArrayOld, viewsArrayNew);

const kpisArrayOld = `const kpis = [
      { title: "Total Active Tasks", value: activeTasks.length || "0" },
      { title: "Due Today", value: dueToday.length || "0" },
      { title: "Overdue", value: overdue.length || "0" },
      { title: "In Progress", value: inProgress.length || "0" },
      { title: "Waiting Review", value: waitingReview.length || "0" },
      { title: "Completed", value: completed.length || "0" },
      { title: "High Priority", value: highPriority.length || "0" },
      { title: "Assigned Employees", value: uniqueEmployees || "0" }
    ];`;
const kpisArrayNew = `const kpis = [
      { title: "Total Active Tasks", value: activeTasks.length || "0" },
      { title: "Due Today", value: dueToday.length || "0" },
      { title: "Overdue", value: overdue.length || "0" },
      { title: "In Progress", value: inProgress.length || "0" },
      { title: "Waiting Review", value: waitingReview.length || "0" },
      { title: "Completed", value: completed.length || "0" },
      { title: "High Priority", value: highPriority.length || "0" }
    ];
    if (isAdminOrMD) {
        kpis.push({ title: "Assigned Employees", value: uniqueEmployees || "0" });
    }`;
code = code.replace(kpisArrayOld, kpisArrayNew);

// Remove the calendar view button at the top header
const calendarBtnRegex = /<button onClick=\{\(\) => setActiveView\("Calendar"\)\} className="flex items-center gap-2 bg-white border border-\[\#E2E8F0\] text-\[\#0F172A\] px-4 py-2 rounded-xl text-\[14px\] font-bold hover:bg-gray-50 transition shadow-sm">\s*<MdCalendarToday \/> Calendar View\s*<\/button>/;
code = code.replace(calendarBtnRegex, '');

// Also make sure to check if "activeView === 'Calendar'" is removed or at least not accessible
code = code.replace(/\{activeView === "Calendar" && \(\s*<ViewCalendar tasks=\{displayedTasks\} \/>\s*\)\}/g, '');

fs.writeFileSync('src/views/admin/tasks/index.jsx', code);
