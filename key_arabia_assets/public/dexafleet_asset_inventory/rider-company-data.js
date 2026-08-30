/*
 * DexaFleet company rider data adapter.
 * Contains company-supplied personal data. Replace with the existing Lovable/Supabase rider query during integration.
 */
(() => {
  const sourceRows = [
  {
    "riderId": "1153563",
    "sourceName": "Abdul Sattar Riaz-KA",
    "email": "abdulsattarriaz@gmail.com",
    "phone": "971562766147",
    "emiratesIdPaperNo": "784198279808533",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1920374",
    "sourceName": "Abrar Hussain  Muhammad Younas-KA",
    "email": "i.brar.huddain304@gmail.com",
    "phone": "971503829399",
    "emiratesIdPaperNo": "784199993826421",
    "sourceStatus": "active"
  },
  {
    "riderId": "2182364",
    "sourceName": "Ammad Rana Zahoor Ahmad-KA",
    "email": "ammadrana298@gmail.com",
    "phone": "971502048690",
    "emiratesIdPaperNo": "784199583788288",
    "sourceStatus": "Active"
  },
  {
    "riderId": "4469319",
    "sourceName": "Awudu Innusah - KA",
    "email": "innusahawudu8@gmail.com",
    "phone": "971567701577",
    "emiratesIdPaperNo": "784200135184982",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1657356",
    "sourceName": "Bashir Ahmad  Muhammad Umar-KA",
    "email": "bashirahmad814@gmail.com",
    "phone": "971503534710",
    "emiratesIdPaperNo": "784199332547712",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1150325",
    "sourceName": "Bashir Ahmed Muhammad Yousaf-KA",
    "email": "bashir.1885@gmail.com",
    "phone": "971558571721",
    "emiratesIdPaperNo": "784198215462973",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1878791",
    "sourceName": "Durgarao Koona Venkatrao Koona-KA",
    "email": "durgaraobvrm89@gmail.com",
    "phone": "971506437389",
    "emiratesIdPaperNo": "784199265135790",
    "sourceStatus": "Active"
  },
  {
    "riderId": "2523754",
    "sourceName": "Eric  Mensah-KA",
    "email": "ericquabena2020@gmail.com",
    "phone": "971508441568",
    "emiratesIdPaperNo": "784199397162175",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1949836",
    "sourceName": "Fayyaz Elahi  Muhammad Faiz Elahi-KA",
    "email": "muheet91@gmail.com",
    "phone": "971564650181",
    "emiratesIdPaperNo": "784199246059390",
    "sourceStatus": "active"
  },
  {
    "riderId": "1085856",
    "sourceName": "Ghulam Shabbir Mureed Hussain-KA",
    "email": "shabirmuredhussain24@gmail.com",
    "phone": "971504809451",
    "emiratesIdPaperNo": "784199354751358",
    "sourceStatus": "active"
  },
  {
    "riderId": "1866833",
    "sourceName": "Ghulam Shabir Wazir Ahmad-KA",
    "email": "mshabbir16903@gmail.com",
    "phone": "971528626159",
    "emiratesIdPaperNo": "784199864024965",
    "sourceStatus": "on vacation"
  },
  {
    "riderId": "4356451",
    "sourceName": "Habtamu Abebe Kaltebo",
    "email": "habtamuabebe727@gmail.com",
    "phone": "971589392336",
    "emiratesIdPaperNo": "784200231852391",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1349963",
    "sourceName": "HAMID ABBAS SHAH MUSHTAQ HUSSAIN-KA",
    "email": "hmdabbass60@gmail.com",
    "phone": "971568405320",
    "emiratesIdPaperNo": "784199065002349",
    "sourceStatus": "Active"
  },
  {
    "riderId": "2158312",
    "sourceName": "Hammad Ali Tariq  Malik Muhammad Tariq-KA",
    "email": "hammadalitariq6@gmail.com",
    "phone": "971507661577",
    "emiratesIdPaperNo": "784199274088303",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1647823",
    "sourceName": "Hamza Ali  Arif Ali-KA",
    "email": "ha1560046@gmail.com",
    "phone": "971558350674",
    "emiratesIdPaperNo": "784200187003072",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1867140",
    "sourceName": "Hisamuddin Mohaiyyaddin-KA",
    "email": "mhodsharukh312@gmail.com",
    "phone": "971563751584",
    "emiratesIdPaperNo": "784200220727604",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1227276",
    "sourceName": "Imran Shah Altaf Hussain-KA",
    "email": "imranimranabc8@gmail.com",
    "phone": "971544600402",
    "emiratesIdPaperNo": "784198458175373",
    "sourceStatus": "Active"
  },
  {
    "riderId": "986918",
    "sourceName": "Imtiaz Ahmed Mehdi-KA",
    "email": "mimtiazahmed303@gmail.com",
    "phone": "971553859083",
    "emiratesIdPaperNo": "784199654132549",
    "sourceStatus": "on vacation"
  },
  {
    "riderId": "1920383",
    "sourceName": "Jehanzeb Khan Rahim Gul-KA",
    "email": "janzeebkhan215007@gmail.com",
    "phone": "971554539739",
    "emiratesIdPaperNo": "784199582693927",
    "sourceStatus": "Active"
  },
  {
    "riderId": "2528002",
    "sourceName": "Joemon John Chacko John-KA",
    "email": "jincy.joemon.143@gmail.com",
    "phone": "971568297824",
    "emiratesIdPaperNo": "784198718621448",
    "sourceStatus": "Active"
  },
  {
    "riderId": "4356417",
    "sourceName": "Jonathan  Yawson - KA",
    "email": "1realyjay@gmail.com",
    "phone": "971561197811",
    "emiratesIdPaperNo": "784200124225440",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1426858",
    "sourceName": "Khalid Mehmood Muhammad Siddique-KA",
    "email": "khalid.mehmood@gmail.com",
    "phone": "971528511707",
    "emiratesIdPaperNo": "784198824735314",
    "sourceStatus": "Active"
  },
  {
    "riderId": "2108994",
    "sourceName": "Khurram  Rehmat Ali-KA",
    "email": "khurramrehmatali@gmail.com",
    "phone": "971528627098",
    "emiratesIdPaperNo": "784199829300401",
    "sourceStatus": "Active"
  },
  {
    "riderId": "4356411",
    "sourceName": "Kingpaul  Nkrumah-KA",
    "email": "kingpaulnkrumah731@gmail.com",
    "phone": "971588602387",
    "emiratesIdPaperNo": "784198130768876",
    "sourceStatus": "Active"
  },
  {
    "riderId": "2523775",
    "sourceName": "Ladpreet Singh Raja Singh-KA",
    "email": "laddypreet91@gmail.com",
    "phone": "971552862716",
    "emiratesIdPaperNo": "784199865305884",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1773130",
    "sourceName": "Mayen Khan   Mojahar Khan-KA",
    "email": "mkmayen1097@gmail.com",
    "phone": "971524902027",
    "emiratesIdPaperNo": "784199629733835",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1647822",
    "sourceName": "Muhammad Aamir  Khalid Mehmood-KA",
    "email": "amircheema1423@gmail.com",
    "phone": "971528626907",
    "emiratesIdPaperNo": "784199788653576",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1867963",
    "sourceName": "Muhammad Ahtisham  Iftikhar Ali-KA",
    "email": "mahtisham954@gmail.com",
    "phone": "971569605148",
    "emiratesIdPaperNo": "784199824205324",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1593745",
    "sourceName": "MUHAMMAD AKMAL  MUHAMMAD INAYAT-KA",
    "email": "akmalmm123@gmail.com",
    "phone": "971588056512",
    "emiratesIdPaperNo": "784198872087022",
    "sourceStatus": "active"
  },
  {
    "riderId": "1868119",
    "sourceName": "Muhammad Azeem Muhammad Yasin-KA",
    "email": "ra523569@gmail.com",
    "phone": "971507730522",
    "emiratesIdPaperNo": "784199392818797",
    "sourceStatus": "Active"
  },
  {
    "riderId": "2034668",
    "sourceName": "Muhammad Dawood  Tahir Mehmood-KA",
    "email": "dm9193879@gmail.com",
    "phone": "971551214068",
    "emiratesIdPaperNo": "784200230340505",
    "sourceStatus": "active"
  },
  {
    "riderId": "1866832",
    "sourceName": "Muhammad Faisal Muhammad Rafiq-KA",
    "email": "faisalrafique0077@gmail.com",
    "phone": "971523361266",
    "emiratesIdPaperNo": "784199243831841",
    "sourceStatus": "Active"
  },
  {
    "riderId": "2196212",
    "sourceName": "Muhammad Kashif  Shakir Hameed-KA",
    "email": "muhammad1998kashi@gmail.com",
    "phone": "971501636928",
    "emiratesIdPaperNo": "784199878696352",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1920361",
    "sourceName": "Muhammad Naveed Ur Rehman  Muhammad Arif-KA",
    "email": "naveedurrehman298@gmail.com",
    "phone": "971543476263",
    "emiratesIdPaperNo": "784200077252086",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1572463",
    "sourceName": "Muhammad Shahzad Murad Ali-KA",
    "email": "shahzad.murad8@gmail.com",
    "phone": "971501729527",
    "emiratesIdPaperNo": "784199273525164",
    "sourceStatus": "on vacation"
  },
  {
    "riderId": "1647824",
    "sourceName": "Muhammad Shamroze  Munir Hussain-KA",
    "email": "khokharshamroze@gmail.com",
    "phone": "971528626479",
    "emiratesIdPaperNo": "784199719385504",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1413164",
    "sourceName": "Muhammad Umar Umar Hayat-KA",
    "email": "maniu9626@gmail.com",
    "phone": "971562975014",
    "emiratesIdPaperNo": "784200090272590",
    "sourceStatus": "Active"
  },
  {
    "riderId": "2523824",
    "sourceName": "Osei  Kuffour-KA",
    "email": "okuffour260@gmail.com",
    "phone": "971566277556",
    "emiratesIdPaperNo": "784200132609379",
    "sourceStatus": "Active"
  },
  {
    "riderId": "2523826",
    "sourceName": "Philip  Bataabtenge-KA",
    "email": "bataabatenge@gmail.com",
    "phone": "971566147701",
    "emiratesIdPaperNo": "784200161342645",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1375748",
    "sourceName": "Prem narayan yadav  ganga yadav-KA",
    "email": "premyadav1675@gmail.com",
    "phone": "971565756496",
    "emiratesIdPaperNo": "784199014807798",
    "sourceStatus": "Active"
  },
  {
    "riderId": "4356439",
    "sourceName": "Prosper Akewine",
    "email": "felixcatongo77@gmail.com",
    "phone": "971502458993",
    "emiratesIdPaperNo": "784200022609521",
    "sourceStatus": "Active"
  },
  {
    "riderId": "2527990",
    "sourceName": "Retheesh Raghavan Raghavan-KA",
    "email": "ratheeshkochu558@gmail.com",
    "phone": "971566376950",
    "emiratesIdPaperNo": "784198225455207",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1866582",
    "sourceName": "Saim Ghumman Muhammad Bashir-KA",
    "email": "ghummansaim9@gmail.com",
    "phone": "971553856453",
    "emiratesIdPaperNo": "784199960310953",
    "sourceStatus": "active"
  },
  {
    "riderId": "1391731",
    "sourceName": "Saimor Rahman sawan  mohammad mojibur Rahman-KA",
    "email": "sayemshaun@gmail.com",
    "phone": "971523360503",
    "emiratesIdPaperNo": "784199858245360",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1920369",
    "sourceName": "Saqib Khan  Khadim Hussain-KA",
    "email": "xkhan6632@gmail.com",
    "phone": "971504955715",
    "emiratesIdPaperNo": "784200136027107",
    "sourceStatus": "active"
  },
  {
    "riderId": "1581029",
    "sourceName": "Shahnavaj Aslam Ali-KA",
    "email": "shahnavaj.ali9@gmail.com",
    "phone": "971508356986",
    "emiratesIdPaperNo": "784199893588451",
    "sourceStatus": "active"
  },
  {
    "riderId": "1426808",
    "sourceName": "Sombhu Newar Krishna Newar Krishna Newar",
    "email": "sombhunewar0@gmail.com",
    "phone": "971581221247",
    "emiratesIdPaperNo": "784199228961761",
    "sourceStatus": "Active"
  },
  {
    "riderId": "969990",
    "sourceName": "Sunil Kumar Yadav Ganga Parsad Yadav-KA",
    "email": "sunilyadav3114@gmail.com",
    "phone": "971525842045",
    "emiratesIdPaperNo": "784198878688526",
    "sourceStatus": "active"
  },
  {
    "riderId": "1867967",
    "sourceName": "Tajamal Hussain Muhammad Younas-KA",
    "email": "falliminemfg@gmail.com",
    "phone": "971552510065",
    "emiratesIdPaperNo": "784199727104103",
    "sourceStatus": "active"
  },
  {
    "riderId": "2182359",
    "sourceName": "Umair Ali Talib Hussain Gondal-KA",
    "email": "gondalumair556@gmail.com",
    "phone": "971563421309",
    "emiratesIdPaperNo": "784199940458096",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1866584",
    "sourceName": "Waqar Ahmed Iftikhar Ahmed",
    "email": "ww197236@gmail.com",
    "phone": "971553851737",
    "emiratesIdPaperNo": "784199230209274",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1867966",
    "sourceName": "Waqas Altaf Muhammad Altaf-KA",
    "email": "waqasaltaf248@gmail.com",
    "phone": "971509719407",
    "emiratesIdPaperNo": "784199198506323",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1444561",
    "sourceName": "Zaheer Abbas  Muhammad Yaqoob-KA",
    "email": "taimoorh398@gmail.com",
    "phone": "971582136436",
    "emiratesIdPaperNo": "784199260263761",
    "sourceStatus": "Active"
  },
  {
    "riderId": "1331143",
    "sourceName": "Zawar Hussain-KA",
    "email": "zawar.hussain@gmail.com",
    "phone": "971554577475",
    "emiratesIdPaperNo": "784199761483066",
    "sourceStatus": "Active"
  },
  {
    "riderId": "2523768",
    "sourceName": "Zeeshan Khan Taukir Ahamad-KA",
    "email": "zishandubai.12d@gmail.com",
    "phone": "971556224475",
    "emiratesIdPaperNo": "784198862062324",
    "sourceStatus": "Active"
  }
];
  const clean = value => String(value || "").replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/gi, "").trim();
  const displayName = value => clean(value).replace(/\s*-\s*KA$/i, "").replace(/\s+/g, " " ).trim();
  const normalizeStatus = value => clean(value).toLowerCase() === "on vacation" ? "On Vacation" : "Active";
  const riders = sourceRows.map(row => {
    const status = normalizeStatus(row.sourceStatus);
    return {
      id:clean(row.riderId),
      riderId:clean(row.riderId),
      name:displayName(row.sourceName),
      sourceName:clean(row.sourceName),
      email:clean(row.email).toLowerCase(),
      phone:clean(row.phone),
      emiratesIdPaperNo:clean(row.emiratesIdPaperNo),
      status,
      active:status === "Active",
      company:"DexaFleet",
      source:"DexaFleet company rider register supplied 13 July 2026"
    };
  });
  window.DexaFleetCompanyRiderData = {
    companyId:"dexafleet",
    companyName:"DexaFleet",
    sourceType:"Company supplied rider register",
    importedAt:"2026-07-13",
    riders
  };
})();
