(() => {
  const supported = new Set(["head","category","asset-name","template","location","document","vendors","workshops","rental-providers","finance-companies","telecom-providers","clients"]);
  const listKey = {vendors:"vendors",workshops:"workshops","rental-providers":"rentalProviders","finance-companies":"financeCompanies","telecom-providers":"telecomProviders",clients:"clients"};
  const titles = {head:"Asset Head",category:"Asset Category","asset-name":"Asset Name",template:"Field Template",location:"Location Master",document:"Document Rule",vendors:"Supplier / Dealer",workshops:"Workshop / Vendor","rental-providers":"Rental / Lease Provider","finance-companies":"Finance Company","telecom-providers":"Telecom Provider",clients:"Client / Aggregator"};
  const stateKey = "dexafleet.assetSetup.manager.v1";
  let currentKind = "", editing = null;
  const esc = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const norm = value => String(value || "").trim().toLowerCase();
  const loadMeta = () => { try { return JSON.parse(localStorage.getItem(stateKey) || "{}"); } catch { return {}; } };
  const saveMeta = meta => localStorage.setItem(stateKey, JSON.stringify(meta));
  const makeId = (kind,r) => [kind,r.company,r.parent,r.name].map(norm).join("|");

  function sourceRows(kind) {
    let rows = [];
    if (kind === "head") rows = Object.keys(assetHierarchy).map(name => ({name,company:"Global",parent:"—"}));
    else if (kind === "category") rows = Object.entries(assetHierarchy).flatMap(([parent,names]) => names.map(name => ({name,company:"Global",parent})));
    else if (kind === "asset-name") rows = Object.entries(companyAssetNameOptions).flatMap(([company,map]) => Object.entries(map).flatMap(([parent,names]) => names.map(name => ({name,company,parent}))));
    else if (kind === "location") rows = Object.entries(companyLocationOptions).flatMap(([company,map]) => Object.entries(map).flatMap(([parent,names]) => names.map(name => ({name,company,parent}))));
    else if (kind === "template") rows = fieldTemplates.map(t => ({name:t.name,company:"Global",parent:t.scope || "General",detail:t.fields || ""}));
    else if (kind === "document") rows = documentRules.map(r => ({name:r.category,company:"Global",parent:r.template,detail:r.documents}));
    else if (listKey[kind]) rows = Object.entries(companyMasterLists).flatMap(([company,map]) => (map[listKey[kind]] || []).map(name => ({name,company,parent:"—"})));
    const meta = loadMeta();
    const active = rows.map(r => ({...r,status:"Active",id:makeId(kind,r)}));
    return active.concat(Object.values(meta).filter(r => r.kind === kind && r.status === "Inactive" && !active.some(a => a.id === r.id)));
  }

  function parentOptions(kind) {
    if (kind === "category") return Object.keys(assetHierarchy);
    if (kind === "asset-name") return [...new Set(Object.values(assetHierarchy).flat())].sort();
    if (kind === "location") return locationTypes;
    if (kind === "document") return fieldTemplates.map(t => t.name);
    return ["—"];
  }

  function editor(record = {}) {
    const global = ["head","category","template","document"].includes(currentKind);
    const parents = parentOptions(currentKind);
    return `<div class="setup-manager-editor"><div class="field"><label>Name *</label><input id="setupEditName" value="${esc(record.name || "")}" placeholder="Enter approved name"></div><div class="field"><label>Company</label><select id="setupEditCompany" ${global ? "disabled":""}>${(global ? ["Global"] : companyMasters.map(c=>c.name)).map(x => `<option ${x === record.company ? "selected":""}>${esc(x)}</option>`).join("")}</select></div><div class="field"><label>Parent / Type</label><select id="setupEditParent" ${parents[0] === "—" ? "disabled":""}>${parents.map(x => `<option ${x === record.parent ? "selected":""}>${esc(x)}</option>`).join("")}</select></div><div class="field"><label>Status</label><select id="setupEditStatus"><option>Active</option><option ${record.status === "Inactive" ? "selected":""}>Inactive</option></select></div><button class="btn primary" onclick="saveSetupMasterRow()">${editing ? "Update":"Add New"}</button></div>`;
  }

  function render() {
    const q = norm(document.getElementById("setupMasterSearch")?.value);
    const status = document.getElementById("setupMasterStatus")?.value || "All";
    const rows = sourceRows(currentKind).filter(r => (!q || [r.name,r.company,r.parent].some(v => norm(v).includes(q))) && (status === "All" || r.status === status));
    const body = document.getElementById("setupMasterRows");
    if (!body) return;
    document.getElementById("setupMasterCount").textContent = `${rows.length} record${rows.length === 1 ? "" : "s"}`;
    body.innerHTML = rows.length ? rows.map((r,i) => `<tr><td><strong>${esc(r.name)}</strong>${r.detail ? `<div class="small">${esc(r.detail)}</div>`:""}</td><td>${esc(r.company)}</td><td>${esc(r.parent)}</td><td><span class="badge ${r.status === "Active" ? "ok":"muted"}">${r.status}</span></td><td><div class="setup-manager-actions"><button class="btn" onclick="editSetupMasterRow(${i})">Edit</button><button class="btn" onclick="deleteSetupMasterRow(${i})">${r.status === "Active" ? "Delete":"Restore"}</button></div></td></tr>`).join("") : `<tr><td colspan="5" class="setup-manager-empty">No setup record matches this search and filter.</td></tr>`;
    window.__visibleSetupRows = rows;
  }

  function open(kind) {
    if (!supported.has(kind)) return false;
    currentKind = kind; editing = null;
    openModal(`${titles[kind]} Setup`, `<div class="notice">This master supplies approved values to Add Asset. Delete makes a value inactive and removes it from new selections; existing asset history remains unchanged.</div><div id="setupMasterEditor">${editor()}</div><div class="setup-manager-toolbar"><div class="field"><label>Search</label><input id="setupMasterSearch" placeholder="Search name, company or type" oninput="renderSetupMasterRows()"></div><div class="field"><label>Filter</label><select id="setupMasterStatus" onchange="renderSetupMasterRows()"><option>All</option><option>Active</option><option>Inactive</option></select></div><div id="setupMasterCount" class="small"></div></div><div class="setup-manager-table-wrap"><table class="setup-manager-table"><thead><tr><th>Name</th><th>Company</th><th>Parent / Type</th><th>Status</th><th>Actions</th></tr></thead><tbody id="setupMasterRows"></tbody></table></div>`, `<button class="btn primary" onclick="closeModal()">Close</button>`);
    render(); return true;
  }

  const removeNamed = (arr,name) => { const i=(arr||[]).findIndex(x=>norm(typeof x === "string" ? x : x.name)===norm(name)); if(i>=0) arr.splice(i,1); };
  const addNamed = (arr,name) => { if(!arr.some(x=>norm(typeof x === "string" ? x : x.name)===norm(name))) arr.push(name); };
  function removeSource(r) {
    if(currentKind === "head") delete assetHierarchy[r.name];
    else if(currentKind === "category") removeNamed(assetHierarchy[r.parent],r.name);
    else if(currentKind === "asset-name") removeNamed(companyAssetNameOptions[r.company]?.[r.parent],r.name);
    else if(currentKind === "location") removeNamed(companyLocationOptions[r.company]?.[r.parent],r.name);
    else if(currentKind === "template") removeNamed(fieldTemplates,r.name);
    else if(currentKind === "document") { const i=documentRules.findIndex(x=>norm(x.category)===norm(r.name)&&norm(x.template)===norm(r.parent)); if(i>=0) documentRules.splice(i,1); }
    else if(listKey[currentKind]) removeNamed(companyMasterLists[r.company]?.[listKey[currentKind]],r.name);
  }
  function addSource(r) {
    if(currentKind === "head") assetHierarchy[r.name] ||= [];
    else if(currentKind === "category") { assetHierarchy[r.parent] ||= []; addNamed(assetHierarchy[r.parent],r.name); }
    else if(currentKind === "asset-name") { companyAssetNameOptions[r.company] ||= {}; companyAssetNameOptions[r.company][r.parent] ||= []; addNamed(companyAssetNameOptions[r.company][r.parent],r.name); }
    else if(currentKind === "location") { companyLocationOptions[r.company] ||= {}; companyLocationOptions[r.company][r.parent] ||= []; addNamed(companyLocationOptions[r.company][r.parent],r.name); }
    else if(currentKind === "template") { if(!fieldTemplates.some(x=>norm(x.name)===norm(r.name))) fieldTemplates.push({name:r.name,scope:r.parent,fields:"Company-defined fields",owner:"Company",editable:"Company Admin"}); }
    else if(currentKind === "document") { if(!documentRules.some(x=>norm(x.category)===norm(r.name)&&norm(x.template)===norm(r.parent))) documentRules.push({category:r.name,template:r.parent,documents:"Configure required documents",approval:"Company Admin approval"}); }
    else if(listKey[currentKind]) { companyMasterLists[r.company] ||= {}; companyMasterLists[r.company][listKey[currentKind]] ||= []; addNamed(companyMasterLists[r.company][listKey[currentKind]],r.name); }
  }

  window.openUnifiedSetupMaster = open;
  window.renderSetupMasterRows = render;
  window.editSetupMasterRow = index => { editing=window.__visibleSetupRows[index]; document.getElementById("setupMasterEditor").innerHTML=editor(editing); document.getElementById("setupEditName").focus(); };
  window.deleteSetupMasterRow = index => { const r=window.__visibleSetupRows[index],meta=loadMeta(); if(r.status === "Active"){ if(!confirm(`Delete ${r.name} from new selections? Existing history will remain.`)) return; removeSource(r); meta[r.id]={...r,kind:currentKind,status:"Inactive"}; } else { addSource(r); delete meta[r.id]; } saveMeta(meta); savePrototypeDataState(); renderSetup(); render(); };
  window.saveSetupMasterRow = () => {
    const r={name:document.getElementById("setupEditName").value.trim(),company:document.getElementById("setupEditCompany").value,parent:document.getElementById("setupEditParent").value,status:document.getElementById("setupEditStatus").value};
    if(!r.name) return alert("Name is required.");
    const duplicate=sourceRows(currentKind).some(x=>x.id!==editing?.id&&x.status==="Active"&&norm(x.name)===norm(r.name)&&norm(x.company)===norm(r.company)&&norm(x.parent)===norm(r.parent));
    if(duplicate) return alert("This setup value already exists for the selected company and type.");
    const meta=loadMeta(); if(editing){ removeSource(editing); delete meta[editing.id]; }
    r.id=makeId(currentKind,r); r.kind=currentKind;
    if(r.status === "Active") addSource(r); else meta[r.id]=r;
    saveMeta(meta); savePrototypeDataState(); audit.unshift({time:typeof isoDateTime === "function" ? isoDateTime() : new Date().toISOString(),actor:loggedInUser?.name || "Company Admin",action:`${titles[currentKind]} ${editing ? "updated":"added"}: ${r.name}.`});
    editing=null; document.getElementById("setupMasterEditor").innerHTML=editor(); renderSetup(); render();
  };
})();
