"use strict";
globalThis["webpackHotUpdatehorizon_ui_tailwind_react"]("main",{

/***/ "./src/views/admin/projects/ProjectDetail.jsx":
/*!****************************************************!*\
  !*** ./src/views/admin/projects/ProjectDetail.jsx ***!
  \****************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_icons_md__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-icons/md */ "./node_modules/react-icons/md/index.esm.js");
/* harmony import */ var components_card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! components/card */ "./src/components/card/index.jsx");
/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @supabase/supabase-js */ "./node_modules/@supabase/supabase-js/dist/index.mjs");
/* harmony import */ var _components_TabWorkspace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/TabWorkspace */ "./src/views/admin/projects/components/TabWorkspace.jsx");
/* harmony import */ var _components_TabScope__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/TabScope */ "./src/views/admin/projects/components/TabScope.jsx");
/* harmony import */ var _components_TabSteps__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/TabSteps */ "./src/views/admin/projects/components/TabSteps.jsx");
/* harmony import */ var _components_TabPayments__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/TabPayments */ "./src/views/admin/projects/components/TabPayments.jsx");
/* harmony import */ var _crm_components_TabTasks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../crm/components/TabTasks */ "./src/views/admin/crm/components/TabTasks.jsx");
/* harmony import */ var _crm_components_TabCommunication__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../crm/components/TabCommunication */ "./src/views/admin/crm/components/TabCommunication.jsx");
/* harmony import */ var _crm_components_TabTimeline__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../crm/components/TabTimeline */ "./src/views/admin/crm/components/TabTimeline.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");

var _jsxFileName = "C:\\Users\\Mr\\Downloads\\crm\\horizon-tailwind-react\\src\\views\\admin\\projects\\ProjectDetail.jsx",
  _s = __webpack_require__.$Refresh$.signature();





// Project specific tabs





// CRM shared tabs




const supabaseUrl = ({"NODE_ENV":"development","PUBLIC_URL":"","WDS_SOCKET_HOST":undefined,"WDS_SOCKET_PATH":undefined,"WDS_SOCKET_PORT":undefined,"FAST_REFRESH":true}).REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = ({"NODE_ENV":"development","PUBLIC_URL":"","WDS_SOCKET_HOST":undefined,"WDS_SOCKET_PATH":undefined,"WDS_SOCKET_PORT":undefined,"FAST_REFRESH":true}).REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_10__.createClient)(supabaseUrl, supabaseKey);
const ProjectDetail = ({
  projData,
  onBack,
  onUpdate
}) => {
  _s();
  var _projData$client4, _projData$id, _projData$client5, _projData$client6, _parsedMeta, _parsedMeta$requireme, _parsedMeta2;
  const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("Overview");
  const [employees, setEmployees] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [nextTask, setNextTask] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [showScheduleModal, setShowScheduleModal] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [communicationAction, setCommunicationAction] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchEmployees();
    if (projData !== null && projData !== void 0 && projData.id) {
      fetchNextTask();
    }
  }, [projData === null || projData === void 0 ? void 0 : projData.id]);
  const fetchEmployees = async () => {
    const {
      data
    } = await supabase.from('employees').select('id, name, role');
    if (data) setEmployees(data);
  };
  const fetchNextTask = async () => {
    if (!(projData !== null && projData !== void 0 && projData.client_id)) return;
    const {
      data
    } = await supabase.from('tasks').select('*').eq('client_id', projData.client_id).neq('status', 'Completed').order('due_date', {
      ascending: true
    }).limit(1);
    if (data && data.length > 0) setNextTask(data[0]);else setNextTask(null);
  };
  const handleCompleteTask = async () => {
    if (!nextTask) return;
    const {
      error
    } = await supabase.from('tasks').update({
      status: 'Completed'
    }).eq('id', nextTask.id);
    if (!error) fetchNextTask();
  };
  const handleToggleAssignEmployee = async employeeId => {
    let currentAssigned = (projData.assigned_to || '').split(',').filter(Boolean);
    if (currentAssigned.includes(employeeId)) {
      currentAssigned = currentAssigned.filter(id => id !== employeeId);
    } else {
      currentAssigned.push(employeeId);
    }
    const newAssignedString = currentAssigned.join(',');

    // Optimistic update
    const updatedCase = {
      ...projData,
      assigned_to: newAssignedString || null
    };
    if (onUpdate) onUpdate(updatedCase);
    if (projData.id) {
      await supabase.from('projects').update({
        assigned_to: newAssignedString || null
      }).eq('id', projData.id);
    }
  };
  const handleQuickAction = label => {
    if (label === 'Schedule') {
      setShowScheduleModal(true);
    } else {
      var _projData$client, _projData$client2, _projData$client3;
      if (label === 'Call' && (_projData$client = projData.client) !== null && _projData$client !== void 0 && _projData$client.phone) {
        window.open(`tel:${projData.client.phone}`, '_self');
      } else if (label === 'WhatsApp' && (_projData$client2 = projData.client) !== null && _projData$client2 !== void 0 && _projData$client2.phone) {
        window.open(`https://wa.me/${projData.client.phone.replace(/\D/g, '')}`, '_blank');
      } else if (label === 'Email' && (_projData$client3 = projData.client) !== null && _projData$client3 !== void 0 && _projData$client3.email) {
        window.open(`mailto:${projData.client.email}`, '_self');
      }
      setCommunicationAction(label);
      setActiveTab('Communication');
    }
  };
  let parsedMeta = {};
  try {
    parsedMeta = JSON.parse((projData === null || projData === void 0 ? void 0 : projData.description) || "{}");
  } catch (e) {}
  const financials = parsedMeta.financials || {
    total: 0,
    advance: 0
  };
  const payments = parsedMeta.payments || [];
  const totalPaid = (parseFloat(financials.advance) || 0) + payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
  const totalAmount = parseFloat(financials.total) || 0;
  const balance = totalAmount - totalPaid;

  // Format dates and names
  const clientName = (projData === null || projData === void 0 ? void 0 : (_projData$client4 = projData.client) === null || _projData$client4 === void 0 ? void 0 : _projData$client4.name) || (projData === null || projData === void 0 ? void 0 : projData.clientName) || "Unknown Client";

  // Role Check
  const userStr = localStorage.getItem('dayal_user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.role) === 'Admin';
  const tabs = ["Overview", "Scope", "Workspace", "Steps", ...(isAdmin ? ["Payments"] : []), "Tasks", "Timeline", "Communication"];
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
    className: "relative min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans pb-24",
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
      className: "mb-6 flex items-center gap-2 text-sm text-[#64748B]",
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("button", {
        onClick: onBack,
        className: "flex items-center gap-2 hover:text-brand-500 transition",
        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_icons_md__WEBPACK_IMPORTED_MODULE_11__.MdArrowBack, {
          className: "h-5 w-5"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 118,
          columnNumber: 11
        }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
          className: "font-semibold",
          children: "Back to Projects"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 119,
          columnNumber: 11
        }, undefined)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 117,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
        className: "mx-2",
        children: "/"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 121,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
        children: "Pages"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 122,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
        className: "mx-2",
        children: "/"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 123,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
        children: "Design & Legal"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 124,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 116,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
      className: "rounded-[20px] bg-gradient-to-r from-[#2563EB]/10 to-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-[#E2E8F0] mb-6 flex flex-col md:flex-row justify-between items-start md:items-center",
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "flex items-center gap-6",
        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "flex h-20 w-20 items-center justify-center rounded-full bg-[#2563EB] text-3xl font-bold text-white shadow-md",
          children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_icons_md__WEBPACK_IMPORTED_MODULE_11__.MdDesignServices, {}, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 131,
            columnNumber: 13
          }, undefined)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 130,
          columnNumber: 11
        }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
            className: "flex items-center gap-3",
            children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("h1", {
              className: "text-[28px] font-bold text-[#0F172A]",
              children: projData.name || projData.title
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 135,
              columnNumber: 16
            }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
              className: "bg-gray-100 text-[#475569] px-3 py-1 rounded-md text-[12px] font-bold",
              children: ["SRV-", (_projData$id = projData.id) === null || _projData$id === void 0 ? void 0 : _projData$id.substring(0, 5).toUpperCase()]
            }, void 0, true, {
              fileName: _jsxFileName,
              lineNumber: 136,
              columnNumber: 16
            }, undefined)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 134,
            columnNumber: 13
          }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
            className: "mt-2 flex flex-wrap items-center gap-4 text-sm text-[#475569]",
            children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
              className: "flex items-center gap-1 font-semibold text-[#0F172A]",
              children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_icons_md__WEBPACK_IMPORTED_MODULE_11__.MdPerson, {}, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 139,
                columnNumber: 86
              }, undefined), " Client: ", clientName]
            }, void 0, true, {
              fileName: _jsxFileName,
              lineNumber: 139,
              columnNumber: 15
            }, undefined)
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 138,
            columnNumber: 13
          }, undefined)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 133,
          columnNumber: 11
        }, undefined)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 129,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "mt-6 flex flex-col items-end md:mt-0 gap-3",
        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
          className: "rounded-full px-4 py-1 text-xs font-bold tracking-wide bg-[#F59E0B] text-white uppercase",
          children: ["STATUS: ", projData.status]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 144,
          columnNumber: 11
        }, undefined), isAdmin && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "flex gap-4 text-right",
          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
            children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("p", {
              className: "text-[11px] font-semibold text-[#64748B] uppercase",
              children: "Total Value"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 150,
              columnNumber: 19
            }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("p", {
              className: "text-[20px] font-bold text-[#0F172A]",
              children: ["\u20B9 ", totalAmount.toLocaleString()]
            }, void 0, true, {
              fileName: _jsxFileName,
              lineNumber: 151,
              columnNumber: 19
            }, undefined)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 149,
            columnNumber: 16
          }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
            children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("p", {
              className: "text-[11px] font-semibold text-[#64748B] uppercase",
              children: "Balance"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 154,
              columnNumber: 19
            }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("p", {
              className: "text-[20px] font-bold text-[#DC2626]",
              children: ["\u20B9 ", balance.toLocaleString()]
            }, void 0, true, {
              fileName: _jsxFileName,
              lineNumber: 155,
              columnNumber: 19
            }, undefined)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 153,
            columnNumber: 16
          }, undefined)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 148,
          columnNumber: 13
        }, undefined)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 143,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 128,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
      className: "flex flex-col lg:flex-row gap-8",
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "w-full lg:w-[72%]",
        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "sticky top-0 z-10 flex gap-2 overflow-x-auto bg-[#F8FAFC] py-4 border-b border-[#E2E8F0] mb-6 custom-scrollbar",
          children: tabs.map(tab => /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("button", {
            onClick: () => setActiveTab(tab),
            className: `rounded-[12px] px-5 py-2.5 text-sm font-semibold transition whitespace-nowrap ${activeTab === tab ? 'bg-[#2563EB] text-white shadow-md' : 'text-[#64748B] hover:bg-white border border-transparent hover:border-[#E2E8F0]'}`,
            children: tab
          }, tab, false, {
            fileName: _jsxFileName,
            lineNumber: 170,
            columnNumber: 15
          }, undefined))
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 168,
          columnNumber: 11
        }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "min-h-[500px]",
          children: [activeTab === "Overview" && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in",
            children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(components_card__WEBPACK_IMPORTED_MODULE_1__["default"], {
              extra: "p-6 border border-[#E2E8F0] shadow-sm",
              children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("h3", {
                className: "text-[16px] font-semibold text-[#0F172A] mb-4",
                children: "Client Information"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 190,
                columnNumber: 20
              }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                className: "space-y-4",
                children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex flex-col",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[12px] font-medium text-[#64748B]",
                    children: "Client / Company Name"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 192,
                    columnNumber: 53
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[14px] font-semibold text-[#0F172A]",
                    children: clientName
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 192,
                    columnNumber: 138
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 192,
                  columnNumber: 22
                }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex flex-col",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[12px] font-medium text-[#64748B]",
                    children: "Contact Email"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 193,
                    columnNumber: 53
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[14px] font-semibold text-[#0F172A]",
                    children: ((_projData$client5 = projData.client) === null || _projData$client5 === void 0 ? void 0 : _projData$client5.email) || "—"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 193,
                    columnNumber: 130
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 193,
                  columnNumber: 22
                }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex flex-col",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[12px] font-medium text-[#64748B]",
                    children: "Contact Phone"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 194,
                    columnNumber: 53
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[14px] font-semibold text-[#0F172A]",
                    children: ((_projData$client6 = projData.client) === null || _projData$client6 === void 0 ? void 0 : _projData$client6.phone) || "—"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 194,
                    columnNumber: 130
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 194,
                  columnNumber: 22
                }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex flex-col",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[12px] font-medium text-[#64748B]",
                    children: "Project Creation Date"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 195,
                    columnNumber: 53
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[14px] font-semibold text-[#0F172A]",
                    children: new Date(projData.created_at).toLocaleDateString()
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 195,
                    columnNumber: 138
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 195,
                  columnNumber: 22
                }, undefined)]
              }, void 0, true, {
                fileName: _jsxFileName,
                lineNumber: 191,
                columnNumber: 20
              }, undefined)]
            }, void 0, true, {
              fileName: _jsxFileName,
              lineNumber: 189,
              columnNumber: 18
            }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(components_card__WEBPACK_IMPORTED_MODULE_1__["default"], {
              extra: "p-6 border border-[#E2E8F0] shadow-sm",
              children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("h3", {
                className: "text-[16px] font-semibold text-[#0F172A] mb-4",
                children: "Project Details"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 201,
                columnNumber: 20
              }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                className: "space-y-4",
                children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex flex-col",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[12px] font-medium text-[#64748B]",
                    children: "Current Status"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 203,
                    columnNumber: 53
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[14px] font-bold text-[#2563EB]",
                    children: projData.status
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 203,
                    columnNumber: 131
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 203,
                  columnNumber: 22
                }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex flex-col",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[12px] font-medium text-[#64748B]",
                    children: "Primary Requirement"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 204,
                    columnNumber: 53
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[14px] font-semibold text-[#0F172A]",
                    children: projData.name || projData.title
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 204,
                    columnNumber: 136
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 204,
                  columnNumber: 22
                }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex flex-col",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[12px] font-medium text-[#64748B]",
                    children: "Selected Requirements Count"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 205,
                    columnNumber: 53
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[14px] font-semibold text-[#0F172A]",
                    children: [((_parsedMeta = parsedMeta) === null || _parsedMeta === void 0 ? void 0 : (_parsedMeta$requireme = _parsedMeta.requirements) === null || _parsedMeta$requireme === void 0 ? void 0 : _parsedMeta$requireme.length) || 0, " Modules"]
                  }, void 0, true, {
                    fileName: _jsxFileName,
                    lineNumber: 205,
                    columnNumber: 144
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 205,
                  columnNumber: 22
                }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex flex-col",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[12px] font-medium text-[#64748B]",
                    children: "Project Progress"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 206,
                    columnNumber: 53
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[14px] font-semibold text-[#0F172A]",
                    children: [(_parsedMeta2 = parsedMeta) !== null && _parsedMeta2 !== void 0 && _parsedMeta2.steps ? Math.round(parsedMeta.steps.filter(s => s.completed).length / parsedMeta.steps.length * 100) : 0, "% Completed"]
                  }, void 0, true, {
                    fileName: _jsxFileName,
                    lineNumber: 206,
                    columnNumber: 133
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 206,
                  columnNumber: 22
                }, undefined)]
              }, void 0, true, {
                fileName: _jsxFileName,
                lineNumber: 202,
                columnNumber: 20
              }, undefined)]
            }, void 0, true, {
              fileName: _jsxFileName,
              lineNumber: 200,
              columnNumber: 18
            }, undefined), isAdmin && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(components_card__WEBPACK_IMPORTED_MODULE_1__["default"], {
              extra: "p-6 border border-[#E2E8F0] shadow-sm",
              children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("h3", {
                className: "text-[16px] font-semibold text-[#0F172A] mb-4",
                children: "Commercial Summary"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 213,
                columnNumber: 22
              }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                className: "space-y-4",
                children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex justify-between items-center",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[12px] font-medium text-[#64748B]",
                    children: "Project Value"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 215,
                    columnNumber: 75
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[14px] font-bold text-[#0F172A]",
                    children: ["\u20B9 ", totalAmount.toLocaleString()]
                  }, void 0, true, {
                    fileName: _jsxFileName,
                    lineNumber: 215,
                    columnNumber: 152
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 215,
                  columnNumber: 24
                }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex justify-between items-center",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[12px] font-medium text-[#64748B]",
                    children: "Paid Amount"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 216,
                    columnNumber: 75
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[14px] font-bold text-[#16A34A]",
                    children: ["\u20B9 ", totalPaid.toLocaleString()]
                  }, void 0, true, {
                    fileName: _jsxFileName,
                    lineNumber: 216,
                    columnNumber: 150
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 216,
                  columnNumber: 24
                }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex justify-between items-center",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[12px] font-medium text-[#64748B]",
                    children: "Outstanding"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 217,
                    columnNumber: 75
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                    className: "text-[14px] font-bold text-[#DC2626]",
                    children: ["\u20B9 ", balance.toLocaleString()]
                  }, void 0, true, {
                    fileName: _jsxFileName,
                    lineNumber: 217,
                    columnNumber: 150
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 217,
                  columnNumber: 24
                }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "mt-4 pt-4 border-t border-[#E2E8F0]",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("p", {
                    className: "text-[11px] text-[#64748B] mb-2 font-bold uppercase",
                    children: "Payment Progress"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 219,
                    columnNumber: 27
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                    className: "h-2 w-full rounded-full bg-[#E2E8F0]",
                    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                      className: "h-2 rounded-full bg-[#16A34A] transition-all",
                      style: {
                        width: `${totalAmount ? Math.min(100, Math.round(totalPaid / totalAmount * 100)) : 0}%`
                      }
                    }, void 0, false, {
                      fileName: _jsxFileName,
                      lineNumber: 220,
                      columnNumber: 81
                    }, undefined)
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 220,
                    columnNumber: 27
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 218,
                  columnNumber: 24
                }, undefined)]
              }, void 0, true, {
                fileName: _jsxFileName,
                lineNumber: 214,
                columnNumber: 22
              }, undefined)]
            }, void 0, true, {
              fileName: _jsxFileName,
              lineNumber: 212,
              columnNumber: 20
            }, undefined)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 187,
            columnNumber: 16
          }, undefined), activeTab === "Scope" && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_components_TabScope__WEBPACK_IMPORTED_MODULE_3__["default"], {
            projData: projData,
            onUpdate: onUpdate
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 228,
            columnNumber: 39
          }, undefined), activeTab === "Workspace" && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_components_TabWorkspace__WEBPACK_IMPORTED_MODULE_2__["default"], {
            projData: projData
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 229,
            columnNumber: 43
          }, undefined), activeTab === "Steps" && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_components_TabSteps__WEBPACK_IMPORTED_MODULE_4__["default"], {
            projData: projData,
            onUpdate: onUpdate
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 230,
            columnNumber: 39
          }, undefined), activeTab === "Payments" && isAdmin && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_components_TabPayments__WEBPACK_IMPORTED_MODULE_5__["default"], {
            projData: projData,
            onUpdate: onUpdate
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 231,
            columnNumber: 53
          }, undefined), activeTab === "Tasks" && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_crm_components_TabTasks__WEBPACK_IMPORTED_MODULE_6__["default"], {
            leadData: {
              id: projData.client_id,
              name: clientName
            },
            isClient: true
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 234,
            columnNumber: 39
          }, undefined), activeTab === "Communication" && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_crm_components_TabCommunication__WEBPACK_IMPORTED_MODULE_7__["default"], {
            leadData: {
              id: projData.client_id,
              name: clientName
            },
            isClient: true,
            action: communicationAction,
            setAction: setCommunicationAction
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 235,
            columnNumber: 47
          }, undefined), activeTab === "Timeline" && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_crm_components_TabTimeline__WEBPACK_IMPORTED_MODULE_8__["default"], {
            leadData: {
              id: projData.client_id,
              name: clientName
            },
            isClient: true
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 236,
            columnNumber: 42
          }, undefined)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 185,
          columnNumber: 11
        }, undefined)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 166,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "w-full lg:w-[28%] relative",
        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "sticky top-6 flex flex-col gap-6",
          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(components_card__WEBPACK_IMPORTED_MODULE_1__["default"], {
            extra: "p-6",
            children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("h3", {
              className: "text-[16px] font-semibold text-[#0F172A] mb-1",
              children: "Next Follow-up"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 245,
              columnNumber: 15
            }, undefined), nextTask ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
              children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("p", {
                className: "text-[14px] font-bold text-[#DC2626] mb-1",
                children: new Date(nextTask.due_date).toLocaleString()
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 248,
                columnNumber: 19
              }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("p", {
                className: "text-[12px] text-gray-600 mb-4",
                children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("a", {
                  href: `/admin/tasks?taskId=${nextTask.id}`,
                  className: "text-brand-500 hover:underline font-bold",
                  children: nextTask.name
                }, void 0, false, {
                  fileName: _jsxFileName,
                  lineNumber: 250,
                  columnNumber: 21
                }, undefined)
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 249,
                columnNumber: 19
              }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                className: "flex flex-col gap-2",
                children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("button", {
                  onClick: () => handleQuickAction('Call'),
                  className: "w-full rounded-[10px] bg-blue-600 py-2 text-[12px] font-bold text-white hover:bg-blue-700 transition",
                  children: "Follow up"
                }, void 0, false, {
                  fileName: _jsxFileName,
                  lineNumber: 253,
                  columnNumber: 21
                }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                  className: "flex gap-2",
                  children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("button", {
                    onClick: handleCompleteTask,
                    className: "flex-1 rounded-[10px] bg-[#16A34A] py-2 text-[12px] font-bold text-white hover:bg-green-700 transition",
                    children: "Mark Complete"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 255,
                    columnNumber: 23
                  }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("button", {
                    onClick: () => setShowScheduleModal(true),
                    className: "flex-1 rounded-[10px] border border-[#E2E8F0] py-2 text-[12px] font-bold text-[#0F172A] hover:bg-gray-50 transition",
                    children: "Reschedule"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 256,
                    columnNumber: 23
                  }, undefined)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 254,
                  columnNumber: 21
                }, undefined)]
              }, void 0, true, {
                fileName: _jsxFileName,
                lineNumber: 252,
                columnNumber: 19
              }, undefined)]
            }, void 0, true) : /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
              children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("p", {
                className: "text-[28px] font-bold text-gray-400 mb-4",
                children: "No follow-up set"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 262,
                columnNumber: 19
              }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("button", {
                onClick: () => setShowScheduleModal(true),
                className: "w-full rounded-[10px] bg-blue-600 py-2 text-[12px] font-bold text-white hover:bg-blue-700 transition",
                children: "Schedule Follow-up"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 263,
                columnNumber: 19
              }, undefined)]
            }, void 0, true)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 244,
            columnNumber: 13
          }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(components_card__WEBPACK_IMPORTED_MODULE_1__["default"], {
            extra: "p-6",
            children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("h3", {
              className: "text-[16px] font-semibold text-[#0F172A] mb-4",
              children: "Quick Actions"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 269,
              columnNumber: 15
            }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
              className: "grid grid-cols-2 gap-3",
              children: [{
                label: "Call",
                icon: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_icons_md__WEBPACK_IMPORTED_MODULE_11__.MdPhone, {}, void 0, false, {
                  fileName: _jsxFileName,
                  lineNumber: 272,
                  columnNumber: 42
                }, undefined)
              }, {
                label: "WhatsApp",
                icon: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_icons_md__WEBPACK_IMPORTED_MODULE_11__.MdMessage, {}, void 0, false, {
                  fileName: _jsxFileName,
                  lineNumber: 273,
                  columnNumber: 46
                }, undefined)
              }, {
                label: "Email",
                icon: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_icons_md__WEBPACK_IMPORTED_MODULE_11__.MdEmail, {}, void 0, false, {
                  fileName: _jsxFileName,
                  lineNumber: 274,
                  columnNumber: 43
                }, undefined)
              }, {
                label: "Schedule",
                icon: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_icons_md__WEBPACK_IMPORTED_MODULE_11__.MdEvent, {}, void 0, false, {
                  fileName: _jsxFileName,
                  lineNumber: 275,
                  columnNumber: 46
                }, undefined)
              }].map((act, i) => /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("button", {
                onClick: () => handleQuickAction(act.label),
                className: "flex flex-col items-center justify-center rounded-[12px] border border-[#E2E8F0] p-3 hover:bg-[#F8FAFC] transition hover:border-[#2563EB] group",
                children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                  className: "text-[#64748B] group-hover:text-[#2563EB] text-xl mb-1 transition-colors",
                  children: act.icon
                }, void 0, false, {
                  fileName: _jsxFileName,
                  lineNumber: 278,
                  columnNumber: 21
                }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("span", {
                  className: "text-[11px] font-medium text-[#475569]",
                  children: act.label
                }, void 0, false, {
                  fileName: _jsxFileName,
                  lineNumber: 279,
                  columnNumber: 21
                }, undefined)]
              }, i, true, {
                fileName: _jsxFileName,
                lineNumber: 277,
                columnNumber: 19
              }, undefined))
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 270,
              columnNumber: 15
            }, undefined)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 268,
            columnNumber: 13
          }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(components_card__WEBPACK_IMPORTED_MODULE_1__["default"], {
            extra: "p-6",
            children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("h3", {
              className: "text-[16px] font-semibold text-[#0F172A] mb-4",
              children: "Assigned Team"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 286,
              columnNumber: 15
            }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
              className: "space-y-4",
              children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                className: "max-h-[200px] overflow-y-auto border border-gray-100 rounded-lg p-2 space-y-2 custom-scrollbar",
                children: employees.map(emp => {
                  var _emp$name;
                  const isAssigned = (projData.assigned_to || '').split(',').includes(emp.id);
                  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                    className: "flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition",
                    onClick: () => handleToggleAssignEmployee(emp.id),
                    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("input", {
                      type: "checkbox",
                      checked: isAssigned,
                      readOnly: true,
                      className: "w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    }, void 0, false, {
                      fileName: _jsxFileName,
                      lineNumber: 293,
                      columnNumber: 28
                    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                      className: "h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs",
                      children: ((_emp$name = emp.name) === null || _emp$name === void 0 ? void 0 : _emp$name.charAt(0)) || 'U'
                    }, void 0, false, {
                      fileName: _jsxFileName,
                      lineNumber: 294,
                      columnNumber: 28
                    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
                      className: "flex-1",
                      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("p", {
                        className: "text-sm font-bold text-gray-800",
                        children: emp.name
                      }, void 0, false, {
                        fileName: _jsxFileName,
                        lineNumber: 298,
                        columnNumber: 30
                      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("p", {
                        className: "text-[10px] text-gray-500",
                        children: emp.role
                      }, void 0, false, {
                        fileName: _jsxFileName,
                        lineNumber: 299,
                        columnNumber: 30
                      }, undefined)]
                    }, void 0, true, {
                      fileName: _jsxFileName,
                      lineNumber: 297,
                      columnNumber: 28
                    }, undefined)]
                  }, emp.id, true, {
                    fileName: _jsxFileName,
                    lineNumber: 292,
                    columnNumber: 25
                  }, undefined);
                })
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 288,
                columnNumber: 19
              }, undefined)
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 287,
              columnNumber: 15
            }, undefined)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 285,
            columnNumber: 13
          }, undefined)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 242,
          columnNumber: 11
        }, undefined)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 241,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 163,
      columnNumber: 7
    }, undefined), showScheduleModal && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
        className: "w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-in",
        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
          className: "flex items-center justify-between mb-6",
          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("h2", {
            className: "text-xl font-bold text-[#0F172A]",
            children: "Schedule Follow-up"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 318,
            columnNumber: 16
          }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(react_icons_md__WEBPACK_IMPORTED_MODULE_11__.MdClose, {
            className: "text-2xl text-[#64748B] cursor-pointer hover:text-red-500",
            onClick: () => setShowScheduleModal(false)
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 319,
            columnNumber: 16
          }, undefined)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 317,
          columnNumber: 13
        }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("form", {
          onSubmit: async e => {
            var _projData$assigned_to;
            e.preventDefault();
            const formData = new FormData(e.target);
            const {
              error
            } = await supabase.from('tasks').insert([{
              name: formData.get('name'),
              due_date: formData.get('due_date') || null,
              priority: 'High',
              status: 'To Do',
              assignee_id: ((_projData$assigned_to = projData.assigned_to) === null || _projData$assigned_to === void 0 ? void 0 : _projData$assigned_to.split(',')[0]) || null,
              // assign to first employee
              client_id: projData.client_id,
              creator_id: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id,
              category: 'Project Follow-up'
            }]);
            if (error) alert('Failed to schedule task: ' + error.message);else {
              setShowScheduleModal(false);
              fetchNextTask();
            }
          },
          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
            className: "mb-4",
            children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("label", {
              className: "text-sm font-medium text-gray-700",
              children: "Task Description"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 342,
              columnNumber: 17
            }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("input", {
              type: "text",
              name: "name",
              required: true,
              placeholder: "e.g., Follow up call for drafts",
              className: "w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 343,
              columnNumber: 17
            }, undefined)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 341,
            columnNumber: 15
          }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
            className: "mb-6",
            children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("label", {
              className: "text-sm font-medium text-gray-700",
              children: "Date & Time"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 346,
              columnNumber: 17
            }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("input", {
              type: "datetime-local",
              name: "due_date",
              required: true,
              className: "w-full mt-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 347,
              columnNumber: 17
            }, undefined)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 345,
            columnNumber: 15
          }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("div", {
            className: "flex justify-end gap-3",
            children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("button", {
              type: "button",
              onClick: () => setShowScheduleModal(false),
              className: "px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100",
              children: "Cancel"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 350,
              columnNumber: 17
            }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)("button", {
              type: "submit",
              className: "px-4 py-2 rounded-lg bg-blue-600 text-sm font-bold text-white hover:bg-blue-700",
              children: "Schedule Task"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 351,
              columnNumber: 17
            }, undefined)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 349,
            columnNumber: 15
          }, undefined)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 321,
          columnNumber: 13
        }, undefined)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 316,
        columnNumber: 11
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 315,
      columnNumber: 9
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 114,
    columnNumber: 5
  }, undefined);
};
_s(ProjectDetail, "8EkoJkkwwKPTctiha+3tFe7Huk4=");
_c = ProjectDetail;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProjectDetail);
var _c;
__webpack_require__.$Refresh$.register(_c, "ProjectDetail");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (true) {
		let errorOverlay;
		if (true) {
			errorOverlay = false;
		}
		let testMode;
		if (typeof __react_refresh_test__ !== 'undefined') {
			testMode = __react_refresh_test__;
		}
		return __react_refresh_utils__.executeRuntime(
			exports,
			$ReactRefreshModuleId$,
			module.hot,
			errorOverlay,
			testMode
		);
	}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("0b9c63cc2f2dd7ac6363")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=main.ab9165fdd6976006504e.hot-update.js.map