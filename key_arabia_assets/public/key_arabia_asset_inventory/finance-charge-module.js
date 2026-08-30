(() => {
  const STORAGE_KEY = 'key_arabia.finance-charge.workspace.v2';
  const money = value => `AED ${Number(value || 0).toFixed(2)}`;
  const compactAmount = value => Number(value || 0).toFixed(2);
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
  const normalizePlate = value => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const today = () => new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Dubai'}).format(new Date());
  const currentPeriod = () => { const to=today(); return {from:`${to.slice(0,8)}01`,to}; };

  const seedSalik = [];
  const seedFines = [];
  const SALIK_IMPORT_HEADERS = {
    transactionId:['Transaction ID'],
    tripDate:['Trip Date'],
    tripTime:['Trip Time'],
    postDate:['Transaction Post Date'],
    tollGate:['Toll Gate'],
    direction:['Direction'],
    tagNumber:['Tag Number'],
    plate:['Plate'],
    amount:['Amount(AED)','Amount (AED)','Amount']
  };
  const FINE_IMPORT_HEADERS = {
    serial:['SL No'],
    plate:['Plate No.','Plate No','Plate'],
    amount:['Amount','Amount(AED)','Amount (AED)'],
    details:['Details','Description'],
    fineNumber:['Fine Number'],
    issueDateTime:['Date and Time of Issuing The Fine:','Date and Time of Issuing The Fine','Issue Date/Time'],
    location:['Location']
  };

  function loadState() {
    localStorage.removeItem('key_arabia.finance-charge.workspace.v1');
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) return saved;
    } catch (error) { console.warn('Finance charge state could not be loaded', error); }
    return {salik:seedSalik,fines:seedFines,batches:[],runs:[],activeRunId:'',audit:[]};
  }
  let state = loadState();
  let activeTab = 'salik';
  let activeKpi = '';
  let sortKey = '';
  let sortDirection = 1;
  let visibleExport = {headers:[],rows:[]};
  const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  function parseDateOnly(value) {
    const text = String(value || '').trim();
    if (!text) return null;
    let match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) return `${match[3]}-${match[2].padStart(2,'0')}-${match[1].padStart(2,'0')}`;
    match = text.match(/^(\d{1,2})\/([A-Za-z]{3})\/(\d{4})$/);
    if (match) {
      const month = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(match[2].toLowerCase()) + 1;
      return month ? `${match[3]}-${String(month).padStart(2,'0')}-${match[1].padStart(2,'0')}` : null;
    }
    match = text.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2}|\d{4})$/);
    if (match) {
      const month = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(match[2].toLowerCase()) + 1;
      const year = match[3].length === 2 ? `20${match[3]}` : match[3];
      return month ? `${year}-${String(month).padStart(2,'0')}-${match[1].padStart(2,'0')}` : null;
    }
    match = text.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
    if (match) {
      const month = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(match[2].toLowerCase()) + 1;
      return month ? `${match[3]}-${String(month).padStart(2,'0')}-${match[1].padStart(2,'0')}` : null;
    }
    return /^\d{4}-\d{2}-\d{2}$/.test(text.slice(0,10)) ? text.slice(0,10) : null;
  }
  function time24(value) {
    const text = String(value || '').trim();
    if (!text) return '00:00:00';
    const match = text.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
    if (!match) return '00:00:00';
    let hour = Number(match[1]);
    const suffix = String(match[4] || '').toUpperCase();
    if (suffix === 'PM' && hour < 12) hour += 12;
    if (suffix === 'AM' && hour === 12) hour = 0;
    return `${String(hour).padStart(2,'0')}:${match[2]}:${match[3] || '00'}`;
  }
  function dateTime(dateValue,timeValue='') {
    const embedded = String(dateValue || '').split(',');
    const date = parseDateOnly(embedded[0]);
    if (!date) return null;
    const time = timeValue || embedded.slice(1).join(',').trim();
    const parsed = new Date(`${date}T${time24(time)}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const iso = date => date ? date.toISOString().slice(0,19) : '';

  function parseTsv(text) {
    const lines = String(text || '').trim().split(/\r?\n/);
    const seen = {};
    const headers = (lines.shift() || '').split('\t').map(header => {
      const count = seen[header] || 0;
      seen[header] = count + 1;
      return count ? `${header}_${count}` : header;
    });
    return lines.map(line => Object.fromEntries(line.split('\t').map((value,index) => [headers[index],value])));
  }
  function assignments() {
    const rows = typeof uploadedBikeSheet === 'string' ? parseTsv(uploadedBikeSheet) : [];
    const fromSheet = rows.filter(row => row['Bike No.Plate'] && row['Rider Id']).map((row,index) => ({
      id:`SHEET-ASG-${index+1}`,
      plate:String(row['Bike No.Plate']).trim(),
      normalizedPlate:normalizePlate(row['Bike No.Plate']),
      riderId:String(row['Rider Id']).trim(),
      riderName:String(row['Rider name'] || '').trim(),
      start:dateTime(row['Handover to Rider Date'], row['Time']),
      end:dateTime(row['Return to office Date'], row['Time_1'] || ''),
      source:'Handover / Takeover Sheet'
    })).filter(row => row.start);
    const movementDate = movement => dateTime(movement.date,movement.time);
    const fromMovements = movements.filter(movement => movement.assetId && /handover|assign|transfer holder|replacement bike issue/i.test(movement.type || '')).map(movement => {
      const asset = assets.find(item => item.id === movement.assetId) || {};
      const riderText = String(movement.to || '');
      const riderId = riderText.trim().split(/\s+/)[0] || '';
      const rider = riders.find(item => String(item.id) === riderId);
      const start = movementDate(movement);
      const returnMovement = movements
        .filter(candidate => candidate.id !== movement.id && candidate.assetId === movement.assetId && movementDate(candidate) && start && movementDate(candidate) >= start && (/return|takeover/i.test(candidate.type || '') || /assign|handover|transfer holder|replacement bike issue/i.test(candidate.type || '')))
        .sort((a,b) => movementDate(a) - movementDate(b))[0];
      const end = returnMovement ? new Date(movementDate(returnMovement).getTime() - 1) : null;
      return {id:movement.id,plate:asset.plate || asset.code,normalizedPlate:normalizePlate(asset.plate || asset.code),riderId:rider?.id || (/^R-?\d+$/i.test(riderId) || /^\d+$/.test(riderId) ? riderId : ''),riderName:rider?.name || riderText.slice(riderId.length).trim(),start,end,source:'Asset Movement'};
    }).filter(row => row.start && row.riderId);
    return [...fromSheet,...fromMovements];
  }
  function matchAssignment(plate,eventTime) {
    if (!normalizePlate(plate)) return {status:'INVALID_PLATE',reason:'Plate is missing or invalid',candidates:[]};
    if (!eventTime) return {status:'INVALID_DATE',reason:'Transaction date or time could not be parsed',candidates:[]};
    const plateRows = assignments().filter(row => row.normalizedPlate === normalizePlate(plate));
    if (!plateRows.length) return {status:'UNMATCHED_PLATE',reason:'No asset assignment exists for this plate',candidates:[]};
    const candidates = plateRows.filter(row => eventTime >= row.start && (!row.end || eventTime <= row.end));
    if (candidates.length === 1) return {status:'MATCHED',assignment:candidates[0],reason:'Plate and custody timestamp matched',candidates};
    if (candidates.length > 1) return {status:'AMBIGUOUS_OVERLAP',reason:'Multiple custody assignments match this timestamp',candidates};
    const earliest = plateRows.reduce((a,b) => a.start < b.start ? a : b);
    const latestReturned = plateRows.filter(row => row.end).sort((a,b) => b.end-a.end)[0];
    const status = eventTime < earliest.start ? 'BEFORE_HANDOVER' : latestReturned && eventTime > latestReturned.end ? 'AFTER_RETURN' : 'OUTSIDE_POSSESSION';
    return {status,reason:'Plate exists, but the event is outside every rider custody window',candidates:plateRows};
  }

  function maintenanceCharges() {
    let jobs = [];
    try { jobs = JSON.parse(localStorage.getItem('key_arabia.maintenance.jobs.v3') || '[]'); } catch {}
    return jobs.filter(job => ['Approved','Ready for Road'].includes(job.status) && Number(job.allocation?.rider || 0) > 0).map(job => ({
      id:`MAINT-${job.id}`,invoice:job.invoice || job.id,date:job.date,time:job.time || '12:00',plate:job.bike,type:job.type,grand:Number(job.cost || 0),companyShare:Number(job.allocation?.company || 0),riderCharge:Number(job.allocation?.rider || 0),status:job.status,evidence:job.invoice ? 'Invoice recorded' : 'Invoice reference missing'
    }));
  }
  const range = () => ({from:document.getElementById('financeFrom')?.value || currentPeriod().from,to:document.getElementById('financeTo')?.value || currentPeriod().to});
  const inRange = date => { const value = parseDateOnly(date); const period=range(); return value && value >= period.from && value <= period.to; };

  function runCalculator() {
    const button=document.getElementById('runFinanceCalculator');
    const period=range();
    if (!period.from || !period.to || period.from > period.to) return message('Enter a valid start and end date.','error');
    button.disabled=true; button.textContent='CALCULATING...';
    const runId=uid('RUN');
    state.salik.forEach(record => {
      if (!inRange(record.tripDate)) return;
      const result=matchAssignment(record.plate,dateTime(record.tripDate,record.tripTime));
      Object.assign(record,{status:result.status,exceptionReason:result.reason,matchedAssignmentId:result.assignment?.id || '',matchedRiderId:result.assignment?.riderId || '',matchedRiderName:result.assignment?.riderName || '',processedRunId:runId,candidates:(result.candidates || []).map(row => row.id)});
    });
    state.fines.forEach(record => {
      if (!inRange(record.issueDateTime)) return;
      const result=matchAssignment(record.plate,dateTime(record.issueDateTime));
      Object.assign(record,{status:result.status,exceptionReason:result.reason,matchedAssignmentId:result.assignment?.id || '',matchedRiderId:result.assignment?.riderId || '',matchedRiderName:result.assignment?.riderName || '',processedRunId:runId,candidates:(result.candidates || []).map(row => row.id)});
    });
    const run={id:runId,version:1,from:period.from,to:period.to,status:'CALCULATED',createdAt:new Date().toISOString(),createdBy:'Finance Reviewer'};
    state.runs.unshift(run);state.activeRunId=runId;state.audit.unshift({id:uid('AUD'),action:'Charge calculation completed',runId,at:new Date().toISOString(),actor:'Finance Reviewer'});
    persist();button.disabled=false;button.textContent='RUN CALCULATOR';message(`Charge run ${runId} calculated successfully.`,'success');render();
  }

  function currentTransactions(type) {
    const source=type==='salik'?state.salik:state.fines;
    return source.filter(record => type==='salik'?inRange(record.tripDate):inRange(record.issueDateTime));
  }
  function currentMaintenance() { return maintenanceCharges().filter(record => inRange(record.date)); }
  function bikeLines() {
    const map=new Map();
    const add=(record,type,amount) => {
      if(record.status!=='MATCHED'||!record.matchedRiderId)return;
      const key=`${record.matchedAssignmentId}|${record.plate}`;
      const row=map.get(key)||{assignmentId:record.matchedAssignmentId,plate:record.plate,riderId:record.matchedRiderId,riderName:record.matchedRiderName,salik:0,fine:0,maintenance:0,count:0,sources:[]};
      row[type]+=Number(amount||0);row.count+=1;row.sources.push({type,id:record.transactionId||record.fineNumber||record.invoice,amount:Number(amount||0)});map.set(key,row);
    };
    currentTransactions('salik').forEach(record=>add(record,'salik',record.amount));
    currentTransactions('fine').forEach(record=>add(record,'fine',record.amount));
    currentMaintenance().forEach(record=>{const result=matchAssignment(record.plate,dateTime(record.date,record.time));Object.assign(record,{status:result.status,matchedAssignmentId:result.assignment?.id||'',matchedRiderId:result.assignment?.riderId||'',matchedRiderName:result.assignment?.riderName||''});add(record,'maintenance',record.riderCharge)});
    return [...map.values()].map(row=>({...row,total:row.salik+row.fine+row.maintenance}));
  }
  function riderLines() {
    const map=new Map();
    bikeLines().forEach(line=>{const row=map.get(line.riderId)||{riderId:line.riderId,riderName:line.riderName,bikes:new Set(),salik:0,fine:0,maintenance:0,count:0,sources:[]};row.bikes.add(line.plate);row.salik+=line.salik;row.fine+=line.fine;row.maintenance+=line.maintenance;row.count+=line.count;row.sources.push(...line.sources);map.set(line.riderId,row)});
    return [...map.values()].map(row=>({...row,bikeCount:row.bikes.size,total:row.salik+row.fine+row.maintenance,status:state.runs[0]?.status||'DRAFT'}));
  }

  function kpis() {
    const salik=currentTransactions('salik'),fine=currentTransactions('fine'),maintenance=currentMaintenance(),bikes=bikeLines(),riders=riderLines();
    const matchedSalik=salik.filter(r=>r.status==='MATCHED'),matchedFine=fine.filter(r=>r.status==='MATCHED');
    const unknownSalik=salik.filter(r=>r.status!=='MATCHED'),unknownFine=fine.filter(r=>r.status!=='MATCHED');
    const sum=rows=>rows.reduce((total,row)=>total+Number(row.amount||0),0);
    const cards=[
      ['Salik Transactions',salik.length,'salik'],['Salik Amount',compactAmount(sum(salik)),'salik'],['Matched Salik',matchedSalik.length,'salik'],['Unknown Salik',unknownSalik.length,'unknown-salik'],['Fine Transactions',fine.length,'fine'],['Fine Amount',compactAmount(sum(fine)),'fine'],['Matched Fine',matchedFine.length,'fine'],['Unknown Fine',unknownFine.length,'unknown-fine'],['Maintenance Rider Charge',compactAmount(maintenance.reduce((s,r)=>s+r.riderCharge,0)),'maintenance'],
      ['Bikes Charged',bikes.length,'bike'],['Riders Charged',riders.length,'rider'],['Salik Rider Charge',compactAmount(bikes.reduce((s,r)=>s+r.salik,0)),'bike'],['Fine Rider Charge',compactAmount(bikes.reduce((s,r)=>s+r.fine,0)),'bike'],['Maintenance Charge',compactAmount(bikes.reduce((s,r)=>s+r.maintenance,0)),'bike'],['Grand Rider Charge',compactAmount(bikes.reduce((s,r)=>s+r.total,0)),'rider'],['Pending Exceptions',unknownSalik.length+unknownFine.length,'unknown-salik'],['Charge Run',state.runs[0]?.status||'Not Run','rider'],['Approved Payroll',compactAmount(state.runs[0]?.status==='LOCKED'?riders.reduce((s,r)=>s+r.total,0):0),'rider']
    ];
    return cards;
  }

  function buildWorkspace() {
    const target=document.getElementById('financeChargeWorkspace');if(!target)return;
    const period=currentPeriod();target.innerHTML=`<section class="panel finance-shell"><div class="finance-control"><div class="finance-title-row"><div><h2>Fine & Salik Management</h2><div class="small">Timestamp-based rider responsibility, maintenance rider charges, exceptions and payroll calculation</div></div></div><div class="finance-filter-row"><input id="financeFrom" type="date" value="${period.from}" aria-label="Date from" onchange="renderFinanceChargeWorkspace()"><input id="financeTo" type="date" value="${period.to}" aria-label="Date to" onchange="renderFinanceChargeWorkspace()"><select id="financeStatus" aria-label="Status filter" onchange="renderFinanceChargeWorkspace()"><option>All Statuses</option><option>MATCHED</option><option>UNPROCESSED</option><option>UNMATCHED_PLATE</option><option>BEFORE_HANDOVER</option><option>AFTER_RETURN</option><option>OUTSIDE_POSSESSION</option><option>AMBIGUOUS_OVERLAP</option></select><select id="financePlate" aria-label="Plate filter" onchange="renderFinanceChargeWorkspace()"><option value="">All Plates</option></select><select id="financeRider" aria-label="Rider filter" onchange="renderFinanceChargeWorkspace()"><option value="">All Riders</option></select><button class="btn" onclick="resetFinanceFilters()">Reset</button><button id="runFinanceCalculator" class="btn primary" onclick="runFinanceChargeCalculator()">RUN CALCULATOR</button><button class="btn" onclick="document.getElementById('financeCsvInput').click()">Upload CSV</button><input id="financeCsvInput" type="file" accept=".csv,.tsv,text/csv,text/tab-separated-values" hidden onchange="financeCsvSelected(event)"></div><div id="financeMessage" class="finance-message" role="alert"></div><div id="financeKpis" class="finance-kpis"></div></div><nav id="financeTabs" class="finance-tabs" aria-label="Fine and Salik reports"></nav><div class="finance-content"><div class="finance-table-head"><div class="finance-report-heading"><h3 id="financeTableTitle"></h3><div id="financeResults" class="small"></div></div><input id="financeSearch" class="finance-report-search" type="search" placeholder="Search plate, rider, transaction, fine or invoice" aria-label="Search visible finance report" oninput="renderFinanceChargeWorkspace()"><div class="finance-report-actions"><button class="btn" onclick="exportFinanceVisibleData()">Export Visible</button><div class="finance-report-total"><span>Filtered Total</span><strong id="financeVisibleTotal">AED 0.00</strong></div></div></div><div id="financeTableWrap" class="finance-table-wrap"></div></div></section>`;
    populateFilters();render();
  }
  function populateFilters(){
    const plates=[...new Set([...state.salik.map(r=>r.plate),...state.fines.map(r=>r.plate),...maintenanceCharges().map(r=>r.plate)])].sort();
    const riders=assignments().filter(r=>r.riderId).map(r=>[r.riderId,`${r.riderId} ${r.riderName}`]);
    document.getElementById('financePlate').innerHTML='<option value="">All Plates</option>'+plates.map(value=>`<option>${escapeHtml(value)}</option>`).join('');
    document.getElementById('financeRider').innerHTML='<option value="">All Riders</option>'+[...new Map(riders).entries()].map(([id,label])=>`<option value="${escapeHtml(id)}">${escapeHtml(label)}</option>`).join('');
  }
  function message(text,type){const element=document.getElementById('financeMessage');if(!element)return;element.textContent=text;element.className=`finance-message show ${type}`;}
  function statusClass(status){return status==='MATCHED'||status==='LOCKED'||status==='APPROVED'?'ok':status==='UNPROCESSED'||status==='CALCULATED'?'info':status?.includes('AMBIGUOUS')||status?.includes('INVALID')?'bad':'warn'}
  function actionButton(label,record,type){return `<button class="btn" onclick="openFinanceRecord('${escapeHtml(type)}','${escapeHtml(record.id||record.assignmentId||record.riderId)}')">${label}</button>`}
  function applyCommonFilters(rows){
    const query=(document.getElementById('financeSearch')?.value||'').toLowerCase(),status=document.getElementById('financeStatus')?.value||'All Statuses',plate=document.getElementById('financePlate')?.value||'',rider=document.getElementById('financeRider')?.value||'';
    let filtered=rows.filter(row=>(!query||JSON.stringify(row).toLowerCase().includes(query))&&(status==='All Statuses'||row.status===status)&&(!plate||row.plate===plate)&&(!rider||row.matchedRiderId===rider||row.riderId===rider));
    if(activeKpi==='Matched Salik'||activeKpi==='Matched Fine')filtered=filtered.filter(row=>row.status==='MATCHED');
    if(sortKey)filtered.sort((a,b)=>String(a[sortKey]??'').localeCompare(String(b[sortKey]??''),undefined,{numeric:true})*sortDirection);
    return filtered;
  }
  function table(headers,rows,keys,type){
    visibleExport={headers,rows:rows.map(row=>keys.map(key=>typeof key==='function'?key(row):row[key]??''))};
    const head=headers.map((header,index)=>`<th><button class="finance-tab" onclick="sortFinanceTable('${typeof keys[index]==='string'?keys[index]:''}')">${escapeHtml(header)}</button></th>`).join('');
    const body=rows.length?rows.map(row=>`<tr>${keys.map(key=>`<td>${typeof key==='function'?key(row):escapeHtml(row[key]??'')}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${headers.length}" class="finance-empty">No records match the selected period and filters.</td></tr>`;
    document.getElementById('financeTableWrap').innerHTML=`<table class="finance-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
    document.getElementById('financeResults').textContent=`Showing ${rows.length} ${type.toLowerCase()} record${rows.length===1?'':'s'}`;
    const total=rows.reduce((sum,row)=>sum+Number(activeTab==='maintenance'?row.riderCharge:(activeTab==='bike'||activeTab==='rider'?row.total:row.amount)||0),0);
    document.getElementById('financeVisibleTotal').textContent=money(total);
  }
  function renderTable(){
    let rows,title;
    if(activeTab==='salik'){
      title='Salik Report';rows=applyCommonFilters(currentTransactions('salik'));
      table(['Transaction ID','Trip Date / Time','Post Date','Plate / Tag','Toll Gate / Direction','Amount','Rider','Status','Action'],rows,['transactionId',r=>`${escapeHtml(r.tripDate)}<br><span class="small">${escapeHtml(r.tripTime)}</span>`,'postDate',r=>`${escapeHtml(r.plate)}<br><span class="small">${escapeHtml(r.tagNumber)}</span>`,r=>`${escapeHtml(r.tollGate)}<br><span class="small">${escapeHtml(r.direction)}</span>`,r=>`<span class="amount">${money(r.amount)}</span>`,r=>r.matchedRiderId?`${escapeHtml(r.matchedRiderId)}<br><span class="small">${escapeHtml(r.matchedRiderName)}</span>`:'-',r=>`<span class="finance-status ${statusClass(r.status)}">${escapeHtml(r.status)}</span>`,r=>actionButton('Open',r,'salik')],'Salik');
    } else if(activeTab==='unknown-salik'){
      title='Unknown Salik';rows=applyCommonFilters(currentTransactions('salik').filter(r=>r.status!=='MATCHED'));
      table(['Transaction ID','Trip Date / Time','Plate','Amount','Reason','Candidates','Status','Action'],rows,['transactionId',r=>`${escapeHtml(r.tripDate)} ${escapeHtml(r.tripTime)}`,'plate',r=>`<span class="amount">${money(r.amount)}</span>`,'exceptionReason',r=>(r.candidates||[]).length,r=>`<span class="finance-status ${statusClass(r.status)}">${escapeHtml(r.status)}</span>`,r=>actionButton('Resolve',r,'salik')],'Unknown Salik');
    } else if(activeTab==='fine'){
      title='Fine Management';rows=applyCommonFilters(currentTransactions('fine'));
      table(['Fine Number','Issue Date / Time','Plate','Details','Location','Amount','Rider','Status','Action'],rows,['fineNumber','issueDateTime','plate','details','location',r=>`<span class="amount">${money(r.amount)}</span>`,r=>r.matchedRiderId?`${escapeHtml(r.matchedRiderId)}<br><span class="small">${escapeHtml(r.matchedRiderName)}</span>`:'-',r=>`<span class="finance-status ${statusClass(r.status)}">${escapeHtml(r.status)}</span>`,r=>actionButton('Open',r,'fine')],'Fine');
    } else if(activeTab==='unknown-fine'){
      title='Unknown Fine';rows=applyCommonFilters(currentTransactions('fine').filter(r=>r.status!=='MATCHED'));
      table(['Fine Number','Issue Date / Time','Plate','Details','Amount','Reason','Status','Action'],rows,['fineNumber','issueDateTime','plate','details',r=>`<span class="amount">${money(r.amount)}</span>`,'exceptionReason',r=>`<span class="finance-status ${statusClass(r.status)}">${escapeHtml(r.status)}</span>`,r=>actionButton('Resolve',r,'fine')],'Unknown Fine');
    } else if(activeTab==='maintenance'){
      title='Maintenance Cost';rows=applyCommonFilters(currentMaintenance());
      table(['Invoice','Job Date','Bike','Main Work','Grand Total','Company Share','Charge to Rider','Approval','Evidence','Action'],rows,['invoice','date','plate','type',r=>`<span class="amount">${money(r.grand)}</span>`,r=>`<span class="amount">${money(r.companyShare)}</span>`,r=>`<span class="amount">${money(r.riderCharge)}</span>`,r=>`<span class="finance-status ok">${escapeHtml(r.status)}</span>`,'evidence',r=>actionButton('Open',r,'maintenance')],'Maintenance');
    } else if(activeTab==='bike'){
      title='Charge TO Rider (Bike)';rows=applyCommonFilters(bikeLines());
      table(['Bike / Plate','Assignment','Rider ID','Rider Name','Salik','Fine','Maintenance','Total','Transactions','Drill Down'],rows,['plate','assignmentId','riderId','riderName',r=>`<span class="amount">${money(r.salik)}</span>`,r=>`<span class="amount">${money(r.fine)}</span>`,r=>`<span class="amount">${money(r.maintenance)}</span>`,r=>`<span class="amount">${money(r.total)}</span>`,'count',r=>actionButton('Details',r,'bike')],'Bike Charge');
    } else {
      title='Charge TO Rider ID';rows=applyCommonFilters(riderLines());
      table(['Rider ID','Rider Name','Bikes','Transactions','Salik','Fine','Maintenance','Payroll Total','Run Status','Drill Down'],rows,['riderId','riderName','bikeCount','count',r=>`<span class="amount">${money(r.salik)}</span>`,r=>`<span class="amount">${money(r.fine)}</span>`,r=>`<span class="amount">${money(r.maintenance)}</span>`,r=>`<span class="amount">${money(r.total)}</span>`,r=>`<span class="finance-status ${statusClass(r.status)}">${escapeHtml(r.status)}</span>`,r=>actionButton('Details',r,'rider')],'Rider Charge');
    }
    document.getElementById('financeTableTitle').textContent=title;
  }
  function render(){
    const tabs=[['salik','Salik Report'],['unknown-salik','Unknown Salik'],['fine','Fine Management'],['unknown-fine','Unknown Fine'],['maintenance','Maintenance Cost'],['bike','Charge TO Rider (Bike)'],['rider','Charge TO Rider ID']];
    document.getElementById('financeTabs').innerHTML=tabs.map(([id,label])=>`<button class="finance-tab ${activeTab===id?'active':''}" onclick="selectFinanceTab('${id}')">${label}</button>`).join('');
    document.getElementById('financeKpis').innerHTML=kpis().map(([label,value,tab])=>`<button class="finance-kpi ${activeKpi===label?'active':''}" onclick="applyFinanceKpi('${escapeHtml(label)}','${tab}')"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></button>`).join('');
    renderTable();
  }

  function parseDelimited(text){
    const lines=String(text||'').replace(/^\uFEFF/,'').split(/\r?\n/).filter(line=>line.trim());if(!lines.length)return[];
    const delimiter=lines[0].includes('\t')?'\t':',';
    const split=line=>{const result=[];let value='',quoted=false;for(let i=0;i<line.length;i++){const char=line[i];if(char==='"'&&line[i+1]==='"'){value+='"';i++;}else if(char==='"')quoted=!quoted;else if(char===delimiter&&!quoted){result.push(value.trim());value='';}else value+=char;}result.push(value.trim());return result;};
    const headers=split(lines.shift());return lines.map((line,index)=>({row:index+2,values:Object.fromEntries(split(line).map((value,column)=>[headers[column]||`Column ${column+1}`,value]))}));
  }
  function field(row,names){const entries=Object.entries(row.values);for(const name of names){const match=entries.find(([key])=>key.trim().toLowerCase()===name.toLowerCase());if(match)return match[1];}return '';}
  function previewImport(file,text){
    const rows=parseDelimited(text),keys=rows[0]?Object.keys(rows[0].values):[],lower=keys.join(' ').toLowerCase();
    const type=lower.includes('transaction id')&&lower.includes('toll gate')?'salik':lower.includes('fine number')||lower.includes('issuing the fine')?'fine':'';
    if(!type||!rows.length)return message('The file is empty or its headers do not match the supported Salik or Fine formats.','error');
    const converted=rows.map(entry=>type==='salik'?{id:uid('SAL'),transactionId:field(entry,SALIK_IMPORT_HEADERS.transactionId),tripDate:field(entry,SALIK_IMPORT_HEADERS.tripDate),tripTime:field(entry,SALIK_IMPORT_HEADERS.tripTime),postDate:field(entry,SALIK_IMPORT_HEADERS.postDate),tollGate:field(entry,SALIK_IMPORT_HEADERS.tollGate),direction:field(entry,SALIK_IMPORT_HEADERS.direction),tagNumber:field(entry,SALIK_IMPORT_HEADERS.tagNumber),plate:field(entry,SALIK_IMPORT_HEADERS.plate),amount:Number(String(field(entry,SALIK_IMPORT_HEADERS.amount)).replace(/,/g,'')),status:'UNPROCESSED',sourceRow:entry.row}:{id:uid('FINE'),serial:field(entry,FINE_IMPORT_HEADERS.serial),plate:field(entry,FINE_IMPORT_HEADERS.plate),amount:Number(String(field(entry,FINE_IMPORT_HEADERS.amount)).replace(/,/g,'')),details:field(entry,FINE_IMPORT_HEADERS.details),fineNumber:field(entry,FINE_IMPORT_HEADERS.fineNumber),issueDateTime:field(entry,FINE_IMPORT_HEADERS.issueDateTime),location:field(entry,FINE_IMPORT_HEADERS.location),status:'UNPROCESSED',sourceRow:entry.row});
    const invalid=converted.filter(row=>!row.plate||!Number.isFinite(row.amount)||(type==='salik'?(!row.transactionId||!dateTime(row.tripDate,row.tripTime)):(!row.fineNumber||!dateTime(row.issueDateTime))));
    const existingKeys=new Set((type==='salik'?state.salik:state.fines).map(row=>type==='salik'?row.transactionId:row.fineNumber));
    const duplicates=converted.filter(row=>existingKeys.has(type==='salik'?row.transactionId:row.fineNumber));
    const accepted=converted.filter(row=>!invalid.includes(row)&&!duplicates.includes(row));
    const total=accepted.reduce((sum,row)=>sum+row.amount,0);
    const importHeaders=type==='salik'?SALIK_IMPORT_HEADERS:FINE_IMPORT_HEADERS;
    openModal(`${type==='salik'?'Salik':'Fine'} Import Preview`,`<div class="notice">Review validation results before saving this batch.</div><div class="finance-import-summary"><div><span>Total Rows</span><strong>${converted.length}</strong></div><div><span>Accepted</span><strong>${accepted.length}</strong></div><div><span>Rejected</span><strong>${invalid.length}</strong></div><div><span>Duplicates</span><strong>${duplicates.length}</strong></div><div><span>Accepted Amount</span><strong>${money(total)}</strong></div></div><div class="small">File: ${escapeHtml(file.name)} · Detected type: ${type.toUpperCase()}</div><div class="small">Headers: ${escapeHtml(Object.values(importHeaders).map(names=>names[0]).join(' · '))}</div>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="confirmFinanceImport()" ${accepted.length?'':'disabled'}>Confirm Import</button>`);
    window.__financeImport={type,accepted,fileName:file.name,totalRows:converted.length,rejected:invalid.length,duplicates:duplicates.length,total};
  }

  window.runFinanceChargeCalculator=runCalculator;
  window.renderFinanceChargeWorkspace=render;
  window.selectFinanceTab=id=>{activeTab=id;activeKpi='';render()};
  window.applyFinanceKpi=(label,tab)=>{activeKpi=label;activeTab=tab;render()};
  window.sortFinanceTable=key=>{if(!key)return;if(sortKey===key)sortDirection*=-1;else{sortKey=key;sortDirection=1}renderTable()};
  window.resetFinanceFilters=()=>{const period=currentPeriod();document.getElementById('financeSearch').value='';document.getElementById('financeFrom').value=period.from;document.getElementById('financeTo').value=period.to;document.getElementById('financeStatus').value='All Statuses';document.getElementById('financePlate').value='';document.getElementById('financeRider').value='';activeKpi='';render()};
  window.financeCsvSelected=event=>{const file=event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>previewImport(file,reader.result);reader.onerror=()=>message('The selected file could not be read.','error');reader.readAsText(file);event.target.value=''};
  window.confirmFinanceImport=()=>{const batch=window.__financeImport;if(!batch)return;const id=uid('BATCH');batch.accepted.forEach(row=>{row.batchId=id;(batch.type==='salik'?state.salik:state.fines).push(row)});state.batches.unshift({id,fileName:batch.fileName,type:batch.type.toUpperCase(),rowCount:batch.totalRows,accepted:batch.accepted.length,rejected:batch.rejected,duplicates:batch.duplicates,total:batch.total,uploadedAt:new Date().toISOString(),uploadedBy:'Finance Reviewer'});state.audit.unshift({id:uid('AUD'),action:`${batch.type.toUpperCase()} CSV imported`,batchId:id,at:new Date().toISOString(),actor:'Finance Reviewer'});persist();closeModal();populateFilters();activeTab=batch.type;message(`${batch.accepted.length} ${batch.type} records imported successfully.`,'success');render()};
  window.exportFinanceVisibleData=()=>{const quote=value=>`"${String(value??'').replace(/"/g,'""').replace(/<[^>]*>/g,' ')}"`;const csv=[visibleExport.headers.map(quote).join(','),...visibleExport.rows.map(row=>row.map(quote).join(','))].join('\n');const blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${activeTab}-${range().from}-to-${range().to}.csv`;link.click();URL.revokeObjectURL(url)};
  window.openFinanceRecord=(type,id)=>{let record=type==='salik'?state.salik.find(r=>r.id===id):type==='fine'?state.fines.find(r=>r.id===id):type==='maintenance'?currentMaintenance().find(r=>r.id===id):type==='bike'?bikeLines().find(r=>r.assignmentId===id):riderLines().find(r=>r.riderId===id);if(!record)return;const entries=Object.entries(record).filter(([,value])=>!Array.isArray(value)&&value!==null&&typeof value!=='object').map(([key,value])=>`<div class="item"><span>${escapeHtml(key.replace(/([A-Z])/g,' $1'))}</span><strong>${escapeHtml(value)}</strong></div>`).join('');const sources=(record.sources||[]).map(source=>`<div class="row-card"><span>${escapeHtml(source.type)} · ${escapeHtml(source.id)}</span><strong>${money(source.amount)}</strong></div>`).join('');openModal('Finance Charge Detail',`<div class="kv">${entries}</div>${sources?`<h3>Source Transactions</h3><div class="list">${sources}</div>`:''}`,`<button class="btn primary" onclick="closeModal()">Close</button>`)};

  buildWorkspace();
})();
