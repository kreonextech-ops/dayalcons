import React from "react";
import TabServiceWorkspace from "../../crm/components/TabServiceWorkspace";

const TabWorkspace = ({ serviceCase }) => {
  let reqs = [];
  try {
    const meta = JSON.parse(serviceCase.description || "{}");
    reqs = meta.requirements || [];
  } catch(e) {}

  return <TabServiceWorkspace customRequirements={reqs} />;
};

export default TabWorkspace;
