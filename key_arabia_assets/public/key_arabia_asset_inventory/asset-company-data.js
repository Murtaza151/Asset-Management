/*
 * Key Arabia company asset data adapter.
 * Replace this local adapter with the existing Lovable/Supabase asset query during integration.
 */
(() => {
  const raw = `Bike Number\tRegistration Expiry\tVendor\tChassis Number
56171\t14/Nov/2025\tALDOBOWI\tLK1PCKL97S1000794
56168\t13/Nov/2025\tALDOBOWI\tLK1PCKL95S1000079
56170\t13/Nov/2025\tBike Care\tLK1PCKL9XS1000840
56174\t13/Nov/2025\tALDOBOWI\tLK1PCKL9XS1000868
56177\t13/Nov/2025\tBike Care\tLK1PCKL95S1000597
56172\t13/Nov/2025\tALDOBOWI\tLK1PCKL94S1000851
56176\t13/Nov/2025\tALDOBOWI\tLK1PCKL92S1000041
56169\t13/Nov/2025\tALDOBOWI\tLK1PCKL98S1000819
56173\t14/Nov/2025\tALDOBOWI\tLK1PCKL94S1000879
56175\t16/Nov/2025\tBike Care\tLK1PCKL91S1000077
57067\t24/Nov/2025\tALDOBOWI\tLK1PCKL98S1000805
57068\t25/Nov/2025\tALDOBOWI\tLK1PCKL92S1000878
57717\t25/Nov/2025\tALDOBOWI\tLK1PCKL93S1000808
57088\t25/Nov/2025\tALDOBOWI\tLK1PCKL97S1000830
57072\t25/Nov/2025\tALDOBOWI\tLK1PCKL91S1000872
57077\t25/Nov/2025\tBike Care\tLK1PCKL92S1000881
57721\t25/Nov/2025\tBike Care\tLK1PCKL91S1000810
57719\t25/Nov/2025\tALDOBOWI\tLK1PCKL91S1000855
57086\t25/Nov/2025\tBike Care\tLK1PCKL94S1000798
57078\t25/Nov/2025\tALDOBOWI\tLK1PCKL95S1000843
57069\t25/Nov/2025\tALDOBOWI\tLK1PCKL92S1000833
57718\t25/Nov/2025\tALDOBOWI\tLK1PCKL92S1000847
57085\t25/Nov/2025\tALDOBOWI\tLK1PCKL96S1000883
57071\t25/Nov/2025\tALDOBOWI\tLK1PCKL98S1000853
57073\t25/Nov/2025\tALDOBOWI\tLK1PCKL99S1000800
57074\t25/Nov/2025\tALDOBOWI\tLK1PCKL99S1000831
57716\t25/Nov/2025\tALDOBOWI\tLK1PCKL99S1000862
57720\t25/Nov/2025\tALDOBOWI\tLK1PCKL99S1000876
57076\t25/Nov/2025\tALDOBOWI\tLK1PCKL92S1000864
57087\t25/Nov/2025\tALDOBOWI\tLK1PCKL98S1000822
58519\t05/Dec/2025\tALDOBOWI\tLK1PCKL91S1000869
58520\t05/Dec/2025\tALDOBOWI\tLK1PCKL93S1000792
58033\t05/Dec/2025\tBike Care\tLK1PCKL9XS1000823
58521\t05/Dec/2025\tBike Care\tLK1PCKL97S1000844
58035\t05/Dec/2025\tBike Care\tLK1PCKL95S1000793
58038\t05/Dec/2025\tBike Care\tLK1PCKL90S1000863
58037\t05/Dec/2025\tBike Care\tLK1PCKL96S1000737
58036\t05/Dec/2025\tALDOBOWI\tLK1PCKL96S1000866
58034\t05/Dec/2025\tALDOBOWI\tLK1PCKL98S1000867
58537\t05/Dec/2025\tALDOBOWI\tLK1PCKL98S1000724
61325\t02/Jan/2026\tBike Care\tLK1PCKL9XS1000790
60650\t02/Jan/2026\tBike Care\tLK1PCKL90S1000801
60649\t02/Jan/2026\tBike Care\tLK1PCKL97S1000858
60647\t02/Jan/2026\tBike Care\tLK1PCKL90S1000880
61322\t02/Jan/2026\tALDOBOWI\tLK1PCKL90S1000815
60648\t02/Jan/2026\tALDOBOWI\tLK1PCKL90S1000829
61324\t02/Jan/2026\tALDOBOWI\tLK1PCKL94S1000784
61323\t02/Jan/2026\tALDOBOWI\tLK1PCKL95S1000857
60645\t02/Jan/2026\tALDOBOWI\tLK1PCKL96S1000799
61321\t02/Jan/2026\tALDOBOWI\tLK1PCKL99S1000814
61337\t06/Jan/2026\tALDOBOWI\tLK1PCKL93S1000825
61338\t06/Jan/2026\tBike Care\tLK1PCKL93S1000727
61340\t06/Jan/2026\tALDOBOWI\tLK1PCKL93S1000758
61344\t06/Jan/2026\tBike Care\tLK1PCKL90S1000846
61336\t06/Jan/2026\tBike Care\tLK1PCKL95S1000874
61332\t06/Jan/2026\tBike Care\tLK1PCKL9451000817
61339\t06/Jan/2026\tALDOBOWI\tLK1PCKL97S1000861
61342\t06/Jan/2026\tALDOBOWI\tLK1PCKL97S1000875
61343\t06/Jan/2026\tALDOBOWI\tLK1PCKL94S1000865
61341\t06/Jan/2026\tALDOBOWI\tLK1PCKL94S1000834
67087\t04/Mar/2026\tALDOBOWI\tLK1PCKL9XS1001583
67086\t04/Mar/2026\tBike Care\tLK1PCKL90S1001544
67088\t04/Mar/2026\tBike Care\tLK1PCKL94S1001546
67093\t04/Mar/2026\tBike Care\tLK1PCKL94S1001577
67090\t04/Mar/2026\tALDOBOWI\tLK1PCKL94S1001580
67092\t04/Mar/2026\tALDOBOWI\tLK1PCKL91S1001083
67085\t04/Mar/2026\tALDOBOWI\tLK1PCKL91S1001150
67094\t04/Mar/2026\tALDOBOWI\tLK1PCKL99S1001591
67091\t04/Mar/2026\tALDOBOWI\tLK1PCKL98S1001114
67089\t04/Mar/2026\tALDOBOWI\tLK1PCKL98S1001565
67687\t11/Mar/2026\tBike Care\tLK1PCKL94S1001370
67695\t11/Mar/2026\tALDOBOWI\tLK1PCKL97S1001573
67686\t11/Mar/2026\tALDOBOWI\tLK1PCKL90S1001348
67694\t11/Mar/2026\tALDOBOWI\tLK1PCKL98S1001579
67691\t11/Mar/2026\tALDOBOWI\tLK1PCKL90S1001382
67929\t12/Mar/2026\tALDOBOWI\tLK1PCKL9XS1001549
68062\t12/Mar/2026\tALDOBOWI\tLK1PCKL96S1001581
68065\t12/Mar/2026\tALDOBOWI\tLK1PCKL96S1001595
68061\t12/Mar/2026\tBike Care\tLK1PCKL91S1001052
67689\t12/Mar/2026\tBike Care\tLK1PCKL91S1001374
68067\t12/Mar/2026\tBike Care\tLK1PCKL97S1001007
68066\t12/Mar/2026\tALDOBOWI\tLK1PCKL93S1001585
68063\t12/Mar/2026\tALDOBOWI\tLK1PCKL97S1001590
67690\t12/Mar/2026\tALDOBOWI\tLK1PCKL98S1001355
67930\t12/Mar/2026\tALDOBOWI\tLK1PCKL98S1001596
67692\t12/Mar/2026\tALDOBOWI\tLK1PCKL99S1001543
67693\t12/Mar/2026\tALDOBOWI\tLK1PCKL96S1001533
68064\t12/Mar/2026\tALDOBOWI\tLK1PCKL99S1001560
67688\t12/Mar/2026\tALDOBOWI\tLK1PCKL99S1001574
68078\t14/Mar/2026\tALDOBOWI\tLK1PCKL94S1001594
68077\t14/Mar/2026\tBike Care\tLK1PCKL90S1001589
68074\t14/Mar/2026\tBike Care\tLK1PCKL96S1001564
68071\t14/Mar/2026\tALDOBOWI\tLK1PCKL9XS1001535
68076\t14/Mar/2026\tBike Care\tLK1PCKL96S1001550
68072\t14/Mar/2026\tALDOBOWI\tLK1PCKL93S1001408
68075\t14/Mar/2026\tBike Care\tLK1PCKL91S1001598
68069\t14/Mar/2026\tALDOBOWI\tLK1PCKL90S1001060
68073\t14/Mar/2026\tALDOBOWI\tLK1PCKL97S1001542
68070\t14/Mar/2026\tALDOBOWI\tLK1PCKL98S1001548
01234\t14/Mar/2026\tALDOBOWI\tLK1PCKL98S1001560`;

  const clean = value => String(value || "").replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/gi, "").trim();
  const isoDate = value => {
    const match = clean(value).match(/^(\d{1,2})\/([A-Za-z]{3})\/(\d{4})$/);
    if (!match) return "";
    const month = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].indexOf(match[2].toLowerCase()) + 1;
    return month ? `${match[3]}-${String(month).padStart(2,"0")}-${match[1].padStart(2,"0")}` : "";
  };

  const rows = raw.trim().split(/\r?\n/).slice(1).map(line => {
    const [bikeNumber, expiryDate, vendor, chassisNumber] = line.split("\t").map(clean);
    return { bikeNumber, expiryDate:isoDate(expiryDate), vendor, chassisNumber };
  });

  const positionByBike = new Map(
    (window.Key ArabiaCompanyAssignmentData?.currentPositions || []).map(position => [String(position.bikeNumber), position])
  );

  const assignmentState = position => {
    if (!position) return {
      operating:"Talabat",
      custody:"Custody Pending Verification",
      holderType:"Unassigned",
      holder:"",
      location:"Not Provided",
      locationType:"Not Provided",
      available:false,
      currentRider:"",
      km:0,
      blocker:"Complete custody, location, holder, engine number, model, current meter and insurance data.",
      notes:"Operational assignment details are pending verification."
    };
    const riderHolder = /office parking/i.test(position.riderName || "") ? "" : `${position.riderId || ""} ${position.riderName || ""}`.trim();
    const latestKm = Number(position.returnKm ?? position.handoverKm ?? 0) || 0;
    if (position.currentState === "Assigned to Rider") return {
      operating:"Talabat",
      custody:"Assigned to Rider",
      holderType:"Rider",
      holder:riderHolder,
      location:"On Road",
      locationType:"With Rider",
      available:false,
      currentRider:position.riderName || "",
      km:latestKm,
      blocker:"Engine number, model, insurance expiry and Salik tag are still required.",
      notes:`Current rider assignment reconciled from ${position.month}. Handover ${position.handoverDate || "date not provided"}.`
    };
    if (position.currentState === "Police Custody") return {
      operating:"Talabat",
      custody:"In Police Station",
      holderType:"Authority",
      holder:position.bikeStatus || "Police Station",
      location:position.bikeStatus || "Police Station",
      locationType:"Police Station",
      available:false,
      currentRider:"",
      km:latestKm,
      blocker:"Vehicle is in police custody. Engine number, model, insurance expiry and Salik tag are still required.",
      notes:`Police custody reconciled from ${position.month}. Last rider: ${riderHolder || "not provided"}.`
    };
    if (position.currentState === "Workshop") return {
      operating:"Talabat",
      custody:"With Vendor / Workshop",
      holderType:"Vendor",
      holder:position.sourceVendor || "Workshop",
      location:"In Workshop",
      locationType:"Workshop",
      available:false,
      currentRider:"",
      km:latestKm,
      blocker:"Workshop release/fitness confirmation is required. Engine number, model, insurance expiry and Salik tag are still required.",
      notes:`Workshop custody reconciled from ${position.month}. Last rider: ${riderHolder || "not provided"}.`
    };
    return {
      operating:"Talabat",
      custody:"In Company Stock",
      holderType:"Store",
      holder:"Main Store",
      location:"Head Office",
      locationType:"Store / Warehouse",
      available:true,
      currentRider:"",
      km:latestKm,
      blocker:"Engine number, model, insurance expiry and Salik tag are still required; expired registration requires approval before issue.",
      notes:`Returned/office position reconciled from ${position.month}. Last rider: ${riderHolder || "not provided"}.`
    };
  };

  const assets = rows.map(row => {
    const assignment = positionByBike.get(row.bikeNumber);
    const state = assignmentState(assignment);
    const hasLastRider = assignment?.riderId && !/office parking/i.test(assignment?.riderName || "");
    return ({
    id:`COMPANY-BIKE-${row.bikeNumber}`,
    code:`DXA-FLEE-BIKE-${row.bikeNumber}`,
    company:"Key Arabia",
    head:"Fleet / Vehicle",
    assetCategory:"Bike",
    category:"Fleet / Vehicle",
    name:`Key Arabia Bike ${row.bikeNumber}`,
    type:"Bike",
    ownership:"Owned",
    owningCompany:"Key Arabia",
    operating:state.operating,
    approvalStatus:"Approved",
    active:true,
    recordStatus:"Active",
    custody:state.custody,
    holderType:state.holderType,
    holder:state.holder,
    location:state.location,
    locationType:state.locationType,
    available:state.available,
    condition:"Used",
    plate:row.bikeNumber,
    chassis:row.chassisNumber,
    engine:"",
    model:"",
    vendor:row.vendor,
    supplierDealer:row.vendor,
    contractStart:"",
    contractEnd:"",
    lastHandoverDate:assignment?.handoverDate || "",
    lastHandoverTime:assignment?.handoverTime || "",
    lastReturnDate:assignment?.returnDate || "",
    lastReturnTime:assignment?.returnTime || "",
    lastRiderId:hasLastRider ? assignment.riderId : "",
    lastRiderName:hasLastRider ? assignment.riderName : "",
    riderStatus:assignment?.riderStatus || "",
    bikeStatusSource:assignment?.bikeStatus || "",
    assignmentSourceVendor:assignment?.sourceVendor || "",
    vehicleExpiry:row.expiryDate,
    registrationExpiry:row.expiryDate,
    insuranceExpiry:"",
    km:state.km,
    currentRider:state.currentRider,
    salikTag:"",
    documents:[],
    assetPictures:[],
    blocker:state.blocker,
    notes:`Company-owned Key Arabia bike. ${state.notes}`,
    source:"Key Arabia bike register and June/July 2026 custody reconciliation supplied 13 July 2026"
  });
  });

  window.Key ArabiaCompanyAssetData = {
    companyId:"key_arabia",
    companyName:"Key Arabia",
    sourceType:"Company supplied register",
    importedAt:"2026-07-13",
    assets,
    dataGaps:[
      "Engine number",
      "Bike make and model",
      "Insurance expiry",
      "Salik tag number",
      "Purchase date and invoice reference"
    ]
  };
})();
