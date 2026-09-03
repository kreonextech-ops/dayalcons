const fs = require('fs');
let lines = fs.readFileSync('src/views/admin/tasks/TaskDetail.jsx', 'utf8').split('\n');

const tabContentIndex = lines.findIndex(l => l.includes('{/* Tab Content */}'));

const correctEnd = `        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeView(activeTab)}
        </div>
      </div>
    </div>
  );

  function activeView(tab) {
     switch(tab) {
        case "Overview": return <TabOverview task={task} />;
        case "Checklist": return <TabChecklist task={task} />;
        case "Comments": return <TabComments task={task} />;
        case "Files": return <TabFiles task={task} />;
        case "Activity & Time Log": return <TabTimeLog task={task} />;
        default: return null;
     }
  }
};

export default TaskDetail;
`;

if (tabContentIndex !== -1) {
    const newContent = lines.slice(0, tabContentIndex).join('\n') + '\n' + correctEnd;
    fs.writeFileSync('src/views/admin/tasks/TaskDetail.jsx', newContent);
}
