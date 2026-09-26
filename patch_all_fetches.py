import os
import glob

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Old logic we want to replace
    old_merge_1 = "return { ...client, ...localData };"
    old_merge_2 = "return { ...client, ...localData, lastContact, activeProjectsCount: clientProjects.length, work_types: finalWorkTypes };"
    old_merge_3 = "return { ...client, ...localData,"

    changed = False

    if "return { ...client, ...localData }" in content:
        content = content.replace("return { ...client, ...localData }", """const mergedClient = { ...client };
           if (localData.phone && !mergedClient.phone) mergedClient.phone = localData.phone;
           if (localData.email && !mergedClient.email) mergedClient.email = localData.email;
           if (localData.address && !mergedClient.address) mergedClient.address = localData.address;
           if (localData.company && !mergedClient.company) mergedClient.company = localData.company;
           return mergedClient""")
        changed = True

    elif "return { ...client, ...localData };" in content:
        content = content.replace("return { ...client, ...localData };", """const mergedClient = { ...client };
           if (localData.phone && !mergedClient.phone) mergedClient.phone = localData.phone;
           if (localData.email && !mergedClient.email) mergedClient.email = localData.email;
           if (localData.address && !mergedClient.address) mergedClient.address = localData.address;
           if (localData.company && !mergedClient.company) mergedClient.company = localData.company;
           return mergedClient;""")
        changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filepath}")

for root, _, files in os.walk("crm/src"):
    for file in files:
        if file.endswith(".jsx"):
            patch_file(os.path.join(root, file))
