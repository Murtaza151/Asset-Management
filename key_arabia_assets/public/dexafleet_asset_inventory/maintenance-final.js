(function(){
  const source=window.DexaFleetMaintenanceData||{catalog:[],bikeAssignments:[],companyId:'dexafleet'};
  const catalogKey=`dexafleet.maintenance.catalog.${source.companyId}.v1`;
  let companyCatalog=JSON.parse(localStorage.getItem(catalogKey)||'null')||source.catalog.map(x=>({...x}));
  let selectedItems=new Set();
  const assignments=source.bikeAssignments||[];
  const catalogSave=()=>localStorage.setItem(catalogKey,JSON.stringify(companyCatalog));
  const h=value=>String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const assignmentLabel=a=>a.riderId?`${a.riderId} ${a.riderName}`:'No Active Rider';

  function buildJobPage(){
    const modal=document.getElementById('modal');
    modal.innerHTML=`<div class="panel"><header class="job-page-header top"><div><h2>New Maintenance Job / Bill</h2><div class="hint">Select approved bill items from the company maintenance checklist.</div></div><div class="job-header-actions"><button class="btn" type="button" onclick="closeJob()">Back</button><button class="btn" type="button" onclick="submitFinalJob('Draft')">Save Draft</button><button id="submitFinalButton" class="btn primary" type="button" onclick="submitFinalJob('Pending Approval')">Submit for Approval</button></div></header>
      <div id="jobMessage" class="form-message" role="alert"></div>
      <section id="billingControls" class="job-compact-card"><div class="job-nine-grid">
        <div class="field"><label for="jDate">Job Date</label><input id="jDate" type="date"></div>
        <div class="field"><label for="jTime">Job Time</label><input id="jTime" type="time"></div>
        <div class="field"><label for="jWorkshop">Workshop</label><select id="jWorkshop"><option>Al Quoz</option><option>Muraqqabat</option></select></div>
        <div class="field"><label for="jBike">Bike Number <span class="required">*</span></label><select id="jBike" onchange="maintenanceBikeChanged()"></select></div>
        <div class="field rider-field"><label for="jRider">Current Rider</label><select id="jRider" onchange="maintenanceRiderChanged()"></select></div>
        <div class="field"><label for="jKm">Current Meter (KM)</label><input id="jKm" type="number" min="0" placeholder="Enter reading" oninput="calculateFinalBill()"></div>
        <div class="field"><label for="jLabour">Labour Total (AED)</label><input id="jLabour" type="number" min="0" step="0.01" value="0" oninput="calculateFinalBill()"></div>
        <div class="field"><label for="jRiderCharge">Charge to Rider (AED)</label><input id="jRiderCharge" type="number" min="0" step="0.01" value="0" oninput="calculateFinalBill()"></div>
        <div class="field grand-field"><label for="jGrand">Grand Total (AED)</label><input id="jGrand" class="readonly" readonly value="AED 0.00"></div>
      </div><div class="job-bottom-grid">
        <div class="field"><label for="jInvoice">Invoice Number <span class="required">*</span></label><input id="jInvoice" placeholder="Required to submit every bill"></div>
        <div class="field invoice-picture-field"><label for="jInvoiceFile">Invoice Picture <span id="invoicePictureRequired" class="required conditional-marker">*</span></label><input id="jInvoiceFile" type="file" accept="image/*,application/pdf"></div>
        <section id="bikeServiceKpis" class="bike-service-kpis" aria-label="Selected bike maintenance history"></section>
      </div></section>
      <section class="checklist-shell"><div class="checklist-toolbar"><strong>Main Work Type / Bill Items <span class="required">*</span></strong><input id="checkSearch" type="search" placeholder="Search maintenance checklist..." aria-label="Search maintenance checklist" oninput="renderMaintenanceChecklist()"><div id="checkCount" class="checklist-count"></div></div><div id="maintenanceChecklist" class="maintenance-checklist"></div></section></div>`;
  }

  function fillAssignmentLists(preferredBike){
    const bike=document.getElementById('jBike'),rider=document.getElementById('jRider');
    bike.innerHTML=assignments.length?assignments.map(a=>`<option value="${h(a.bike)}">${h(a.bike)}</option>`).join(''):'<option value="">No bikes available</option>';
    const riders=[...new Map(assignments.filter(a=>a.riderId).map(a=>[a.riderId,a])).values()];
    rider.innerHTML='<option value="">No Active Rider</option>'+riders.map(a=>`<option value="${h(a.riderId)}">${h(assignmentLabel(a))}</option>`).join('');
    bike.value=preferredBike&&assignments.some(a=>a.bike===preferredBike)?preferredBike:(assignments[0]?.bike||'');
    window.maintenanceBikeChanged();
  }

  window.maintenanceBikeChanged=function(){
    const a=assignments.find(x=>x.bike===document.getElementById('jBike').value);
    if(!a)return;
    document.getElementById('jRider').value=a.riderId||'';
    document.getElementById('jKm').value='';
    document.getElementById('jWorkshop').value=a.workshop||'Al Quoz';
    window.renderBikeServiceKpis();
  };

  window.maintenanceRiderChanged=function(){
    const riderId=document.getElementById('jRider').value;
    const bikes=assignments.filter(a=>a.riderId===riderId);
    const bike=document.getElementById('jBike');
    bike.innerHTML=bikes.map(a=>`<option value="${h(a.bike)}">${h(a.bike)}</option>`).join('');
    if(bikes[0]){bike.value=bikes[0].bike;window.maintenanceBikeChanged()}
  };

  window.renderMaintenanceChecklist=function(){
    const target=document.getElementById('maintenanceChecklist');if(!target)return;
    const q=(document.getElementById('checkSearch')?.value||'').trim().toLowerCase();
    const rows=companyCatalog.filter(x=>x.active!==false&&(!q||x.name.toLowerCase().includes(q)));
    target.innerHTML=rows.map(item=>`<label class="check-item ${selectedItems.has(item.id)?'selected':''}"><input type="checkbox" value="${h(item.id)}" ${selectedItems.has(item.id)?'checked':''} onchange="toggleMaintenanceItem('${h(item.id)}',this.checked)"><strong>${h(item.name)}</strong><span class="price-pill">AED ${Number(item.price).toFixed(2)}</span></label>`).join('')||'<div class="empty">No approved maintenance item matches this search.</div>';
    document.getElementById('checkCount').textContent=`${rows.length} approved · ${selectedItems.size} selected`;
  };

  window.toggleMaintenanceItem=function(id,checked){checked?selectedItems.add(id):selectedItems.delete(id);window.renderMaintenanceChecklist();window.calculateFinalBill()};

  function distanceLabel(due,current){const diff=Number(due||0)-Number(current||0);return diff>=0?`${Math.round(diff).toLocaleString()} KM remaining`:`${Math.abs(Math.round(diff)).toLocaleString()} KM overdue`}
  window.renderBikeServiceKpis=function(){
    const target=document.getElementById('bikeServiceKpis');if(!target)return;
    const a=assignments.find(x=>x.bike===document.getElementById('jBike')?.value),entered=Number(document.getElementById('jKm')?.value||0),basis=entered||Number(a?.lastKnownMeter||0),oilDiff=entered?entered-Number(a?.nextOilKm||0):null,oilItem=companyCatalog.find(x=>x.name.trim().toUpperCase()==='OIL CHANGE'),oilSelected=!!oilItem&&selectedItems.has(oilItem.id);
    const oilStatus=!oilSelected?'Select OIL CHANGE':(oilDiff===null?'Enter current meter':(oilDiff>0?`${oilDiff.toLocaleString()} KM extra`:`On time · ${Math.abs(oilDiff).toLocaleString()} KM remaining`)),tone=!oilSelected?'neutral':oilDiff>0?'bad':entered?'ok':'info';
    const cards=[['Last Maintenance',a?.lastMaintenanceDate||'-',''],['Last Oil Change',a?`${Number(a.lastOilKm).toLocaleString()} KM`:'-',''],['Next Oil Target',a?`${Number(a.nextOilKm).toLocaleString()} KM`:'-',''],['Oil Status',oilStatus,tone],['Full Service',a?distanceLabel(a.fullServiceDueKm,basis):'-',''],['Front Tyre',a?distanceLabel(a.frontTyreDueKm,basis):'-',''],['Rear Tyre',a?distanceLabel(a.rearTyreDueKm,basis):'-','']];
    target.innerHTML=cards.map(([label,value,cls])=>`<div class="service-kpi ${cls}"><span>${label}</span><strong>${value}</strong></div>`).join('');
  };

  function totals(){
    const items=[...selectedItems].map(id=>companyCatalog.find(x=>x.id===id)).filter(Boolean);
    const itemTotal=items.reduce((s,x)=>s+Number(x.price||0),0),labour=Math.max(0,Number(document.getElementById('jLabour')?.value||0)),rider=Math.max(0,Number(document.getElementById('jRiderCharge')?.value||0)),grand=itemTotal+labour+rider;
    return{items,itemTotal,labour,grand,rider,company:itemTotal+labour};
  }

  window.calculateFinalBill=function(){
    const t=totals(),invoiceRequired=t.rider>0;
    document.getElementById('jGrand').value=money(t.grand);
    document.getElementById('billingControls').classList.toggle('rider-invoice',invoiceRequired);
    document.getElementById('jInvoice').required=true;
    document.getElementById('jInvoiceFile').required=invoiceRequired;
    window.renderBikeServiceKpis();
    return t;
  };

  function message(text,type='error'){const el=document.getElementById('jobMessage');el.textContent=text;el.className=`form-message show ${type}`;el.scrollIntoView({behavior:'smooth',block:'center'})}

  window.openJob=function(){
    selectedItems.clear();
    document.body.classList.add('job-page-open');document.getElementById('modal').classList.add('open');
    document.getElementById('jDate').value=iso();document.getElementById('jTime').value=time();
    document.getElementById('jLabour').value=0;document.getElementById('jRiderCharge').value=0;document.getElementById('jInvoice').value='';
    fillAssignmentLists();window.renderMaintenanceChecklist();window.calculateFinalBill();window.scrollTo({top:0,behavior:'auto'});
  };
  window.closeJob=function(){document.body.classList.remove('job-page-open');document.getElementById('modal').classList.remove('open');render();window.scrollTo({top:0,behavior:'auto'})};

  window.submitFinalJob=function(status){
    const t=window.calculateFinalBill(),button=document.getElementById('submitFinalButton');
    const assignment=assignments.find(a=>a.bike===document.getElementById('jBike').value);
    if(!assignment)return message('No bike is available. Import the company asset and assignment data first.');
    if(!t.items.length&&t.labour<=0&&t.rider<=0)return message('Select a maintenance item or enter Labour / Charge to Rider.');
    const invoice=document.getElementById('jInvoice').value.trim();
    if(status!=='Draft'&&Number(document.getElementById('jKm').value||0)<=0)return message('Current Meter (KM) is required before submitting the bill.');
    if(status!=='Draft'&&!invoice)return message('Invoice Number is required before submitting every maintenance bill.');
    if(status!=='Draft'&&jobs.some(j=>String(j.invoice||j.id).toLowerCase()===invoice.toLowerCase()))return message('This Invoice Number already exists. Enter a unique invoice number.');
    if(status!=='Draft'&&t.rider>0&&!document.getElementById('jInvoiceFile').files.length)return message('Invoice Picture is required when Charge to Rider is greater than zero.');
    button.disabled=true;
    const currentMeter=Number(document.getElementById('jKm').value||0),oilExtraKm=Math.max(0,currentMeter-Number(assignment?.nextOilKm||0)),oilRemainingKm=Math.max(0,Number(assignment?.nextOilKm||0)-currentMeter),oilSelected=t.items.some(x=>x.name.trim().toUpperCase()==='OIL CHANGE');
    jobs.unshift({id:invoice||`DRAFT-${String(jobs.length+1).padStart(3,'0')}`,bike:assignment?.bike||'',rider:assignmentLabel(assignment||{}),type:t.items[0]?.name||(t.rider>0?'Other Rider Charge':'Labour Only'),items:t.items.map(x=>({id:x.id,item:x.name,price:x.price})),mainPrice:t.itemTotal,extraTotal:0,parts:t.itemTotal,labour:t.labour,cost:t.grand,allocation:{company:t.company,rider:t.rider,vendor:0,insurance:0},km:currentMeter,status,date:document.getElementById('jDate').value,time:document.getElementById('jTime').value,workshop:document.getElementById('jWorkshop').value,invoice,notes:'',oilPerformance:oilSelected?{targetKm:Number(assignment?.nextOilKm||0),currentMeter,oilExtraKm,oilRemainingKm,onTime:oilExtraKm===0}:null,serviceSnapshot:{lastMaintenanceDate:assignment?.lastMaintenanceDate,lastOilKm:assignment?.lastOilKm,nextOilKm:assignment?.nextOilKm,fullServiceRemainingKm:Number(assignment?.fullServiceDueKm||0)-currentMeter,frontTyreRemainingKm:Number(assignment?.frontTyreDueKm||0)-currentMeter,rearTyreRemainingKm:Number(assignment?.rearTyreDueKm||0)-currentMeter},catalogueSnapshot:{items:t.items}});
    persist();message(status==='Draft'?'Draft saved successfully.':'Maintenance bill submitted for approval.','success');setTimeout(()=>{button.disabled=false;window.closeJob()},350);
  };

  function renderCatalogAdmin(){
    const main=document.querySelector('.main');
    main.innerHTML=`<div class="catalog-admin"><div class="top page-head"><div><h1>Maintenance Catalog Setup</h1><div class="subtle">${h(source.companyName)} company prices, item requests and approvals</div></div><button class="btn" onclick="window.location.href='asset-inventory-prototype.html#setup'">Back to Asset Setup</button></div><div class="catalog-admin-grid"><section class="card"><h2>Request New Item</h2><div class="field"><label>Item Name</label><input id="catalogRequestName"></div><div class="field"><label>Proposed Price (AED)</label><input id="catalogRequestPrice" type="number" min="0" step="0.01"></div><div class="field"><label>Reason</label><textarea id="catalogRequestReason" rows="3"></textarea></div><button class="btn primary" onclick="submitCatalogRequest()">Submit Request</button><h2>Pending Requests</h2><div id="catalogRequests" class="request-list"></div></section><section class="card"><div class="top"><h2>Approved Maintenance Items</h2><input id="catalogAdminSearch" style="max-width:360px" placeholder="Search item" oninput="renderCatalogTable()"></div><div class="catalog-table-wrap"><table><thead><tr><th>Item</th><th>Price</th><th>Status</th><th>Action</th></tr></thead><tbody id="catalogAdminRows"></tbody></table></div></section></div></div>`;
    window.renderCatalogTable();window.renderCatalogRequests();
  }

  window.renderCatalogTable=function(){const target=document.getElementById('catalogAdminRows');if(!target)return;const q=(document.getElementById('catalogAdminSearch')?.value||'').toLowerCase();const rows=companyCatalog.filter(x=>!q||x.name.toLowerCase().includes(q));target.innerHTML=rows.map(x=>`<tr><td>${h(x.name)}</td><td>AED ${Number(x.price).toFixed(2)}</td><td><span class="badge ${x.active!==false?'ok':'neutral'}">${x.active!==false?'Active':'Inactive'}</span></td><td><div class="catalog-actions"><button class="btn" onclick="editCatalogPrice('${h(x.id)}')">Edit Price</button><button class="btn" onclick="toggleCatalogItem('${h(x.id)}')">${x.active!==false?'Deactivate':'Activate'}</button></div></td></tr>`).join('')};
  window.editCatalogPrice=function(id){const item=companyCatalog.find(x=>x.id===id),value=prompt(`Approved price for ${item.name}`,item.price);if(value===null)return;const price=Number(value);if(!Number.isFinite(price)||price<0)return alert('Enter a valid non-negative price.');item.price=price;catalogSave();window.renderCatalogTable()};
  window.toggleCatalogItem=function(id){const item=companyCatalog.find(x=>x.id===id);item.active=item.active===false;catalogSave();window.renderCatalogTable()};
  window.submitCatalogRequest=function(){const name=document.getElementById('catalogRequestName').value.trim(),price=Number(document.getElementById('catalogRequestPrice').value),reason=document.getElementById('catalogRequestReason').value.trim();if(!name||!Number.isFinite(price)||price<0||!reason)return alert('Item name, valid price and reason are required.');requests.unshift({id:crypto.randomUUID(),kind:'New Item',item:name,price,reason,status:'Pending',requestedBy:'Workshop Manager',createdAt:new Date().toISOString()});persist();document.getElementById('catalogRequestName').value='';document.getElementById('catalogRequestPrice').value='';document.getElementById('catalogRequestReason').value='';window.renderCatalogRequests()};
  window.renderCatalogRequests=function(){const target=document.getElementById('catalogRequests');if(!target)return;const pending=requests.filter(r=>r.status==='Pending');target.innerHTML=pending.map(r=>`<div class="request-row"><strong>${h(r.item)}</strong><div class="small">AED ${Number(r.price).toFixed(2)} · ${h(r.reason||'No reason')}</div><button class="btn primary" onclick="approveCatalogRequest('${h(r.id)}')">Admin Approve</button></div>`).join('')||'<div class="empty">No pending requests.</div>'};
  window.approveCatalogRequest=function(id){const r=requests.find(x=>x.id===id);if(!r)return;if(!companyCatalog.some(x=>x.name.toLowerCase()===r.item.toLowerCase()))companyCatalog.push({id:`CAT-${Date.now()}`,name:r.item,price:r.price,active:true});r.status='Approved';r.approvedBy='Company Admin';r.approvedAt=new Date().toISOString();catalogSave();persist();window.renderCatalogRequests();window.renderCatalogTable()};

  buildJobPage();
  const invoiceHeader=document.querySelector('#jobsCard thead th');if(invoiceHeader)invoiceHeader.textContent='Invoice Number';
  const approvalAudit=document.getElementById('audit')?.closest('.card');if(approvalAudit)approvalAudit.remove();
  const searchLine=document.querySelector('.search-line'),resultsNote=document.getElementById('resultsNote');if(searchLine&&resultsNote){searchLine.appendChild(resultsNote);const compactResults=()=>{const match=resultsNote.textContent.match(/Showing\s+(\d+)\s+of\s+(\d+)/i),next=match?`Showing ${match[1]} of ${match[2]} jobs`:resultsNote.textContent;if(resultsNote.textContent!==next)resultsNote.textContent=next};new MutationObserver(compactResults).observe(resultsNote,{childList:true,characterData:true,subtree:true});compactResults()}
  const review=document.createElement('div');review.id='adminReviewModal';review.className='admin-review-modal';review.innerHTML='<div class="admin-review-panel"><div class="top"><h2>Maintenance Approval Review</h2><button class="btn" onclick="closeAdminReview()">Close</button></div><div id="adminReviewBody"></div><div class="admin-review-actions"><button class="btn" onclick="closeAdminReview()">Cancel</button><button id="confirmApprovalButton" class="btn primary">Approve & Release</button></div></div>';document.body.appendChild(review);
  window.closeAdminReview=function(){review.classList.remove('open')};
  window.approve=function(id){const j=jobs.find(x=>x.id===id);if(!j)return;if(j.status!=='Pending Approval')return;const items=(j.items||[]).map(x=>`<div class="review-item"><span>${h(x.item||x.name)}</span><strong>${money(x.price||x.total||0)}</strong></div>`).join('')||'<div class="empty">No item lines are available for this bill.</div>';document.getElementById('adminReviewBody').innerHTML=`<div class="review-grid"><div><span>Invoice Number</span><strong>${h(j.invoice||j.id)}</strong></div><div><span>Date / Time</span><strong>${h(j.date)} ${h(j.time||'')}</strong></div><div><span>Workshop</span><strong>${h(j.workshop)}</strong></div><div><span>Bike</span><strong>${h(j.bike)}</strong></div><div><span>Current Rider</span><strong>${h(j.rider)}</strong></div><div><span>Current Meter</span><strong>${Number(j.km||0).toLocaleString()} KM</strong></div><div><span>Items Total</span><strong>${money(j.parts||j.mainPrice||0)}</strong></div><div><span>Labour</span><strong>${money(j.labour||0)}</strong></div><div><span>Charge to Rider</span><strong>${money(j.allocation?.rider||0)}</strong></div><div><span>Grand Total</span><strong>${money(j.cost||0)}</strong></div></div><h3>Bill Items</h3><div class="review-items">${items}</div><h3>Work Done / Remarks</h3><div class="review-note">${h(j.notes||'No remarks recorded.')}</div>`;document.getElementById('confirmApprovalButton').onclick=()=>window.confirmAdminApproval(id);review.classList.add('open')};
  window.confirmAdminApproval=function(id){const button=document.getElementById('confirmApprovalButton'),j=jobs.find(x=>x.id===id);if(!j)return;button.disabled=true;j.status='Ready for Road';j.approvedBy='Company Admin';j.approvedAt=new Date().toISOString();persist();window.closeAdminReview();render();button.disabled=false};
  const requestedView=new URLSearchParams(location.search).get('view');
  if(requestedView==='catalog')renderCatalogAdmin();else{const today=iso(),monthStart=`${today.slice(0,8)}01`;document.getElementById('from').value=monthStart;document.getElementById('to').value=today;filtersChanged()}
})();
