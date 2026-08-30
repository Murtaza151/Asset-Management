/* Replaceable adapter shape: companyId, companyName, bikeAssignments with service targets, and approved catalog items. */
window.Key ArabiaMaintenanceData = {
  companyId: "key_arabia",
  companyName: "Key Arabia",
  bikeAssignments: (window.Key ArabiaCompanyAssetData?.assets || []).map(asset => ({
    bike:asset.plate || asset.code,
    riderId:asset.custody === "Assigned to Rider" ? (asset.lastRiderId || "") : "",
    riderName:asset.custody === "Assigned to Rider" ? (asset.currentRider || "") : "",
    workshop:"Al Quoz",
    lastKnownMeter:Number(asset.km || 0),
    lastMaintenanceDate:"",
    lastOilKm:0,
    nextOilKm:0,
    fullServiceDueKm:0,
    frontTyreDueKm:0,
    rearTyreDueKm:0
  })),
  catalog: [
  {
    "id": "CAT-001",
    "name": "OIL CHANGE",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-002",
    "name": "FULL SERVICE",
    "price": 31.5,
    "active": true
  },
  {
    "id": "CAT-003",
    "name": "OIL SEIL KIET COMPLET",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-004",
    "name": "OIL SEAL FRONT FORK",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-005",
    "name": "OIL FRONT FORK",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-006",
    "name": "OIL PUMP ASSY COMPLET WITH GEAR",
    "price": 36.75,
    "active": true
  },
  {
    "id": "CAT-007",
    "name": "GASKET SILENCER",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-008",
    "name": "GASKET CYLINDER BLOCK",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-009",
    "name": "GASKET HEAD CYLINDER",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-010",
    "name": "GASKET MAGNET COVER",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-011",
    "name": "GASKET CLUTCH COVER",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-012",
    "name": "GASKET KIT COMPLET (ENGINE)",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-013",
    "name": "HEAD TOP COVER O RING",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-014",
    "name": "HEAD ASSY COMPLET KIT HONDA160",
    "price": 304.5,
    "active": true
  },
  {
    "id": "CAT-015",
    "name": "TIMING CHAIN WITH GUIDE KIT",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-016",
    "name": "VALVE KIT AND VALVE SEAL KIT",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-017",
    "name": "BLOCK PISTON ASSY COMPLET FOR160",
    "price": 204.75,
    "active": true
  },
  {
    "id": "CAT-018",
    "name": "CRANK SHAFT ASSY COMPLET FOR 160",
    "price": 220.5,
    "active": true
  },
  {
    "id": "CAT-019",
    "name": "CAM SHAFT ASSY COMPLET",
    "price": 78.75,
    "active": true
  },
  {
    "id": "CAT-020",
    "name": "CAM SHAFT SPROCKET",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-021",
    "name": "CAM SHAFT HOLDER",
    "price": 63,
    "active": true
  },
  {
    "id": "CAT-022",
    "name": "ROCKER ARM SET COMPLET",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-023",
    "name": "ROTOR OIL FILTER AND GASKET",
    "price": 31.5,
    "active": true
  },
  {
    "id": "CAT-024",
    "name": "CLUTCH FRICTION PLATE KIT",
    "price": 63,
    "active": true
  },
  {
    "id": "CAT-025",
    "name": "PRESSURE PLATE KIT",
    "price": 31.5,
    "active": true
  },
  {
    "id": "CAT-026",
    "name": "CLUTCH ASSY COMPLET",
    "price": 131.25,
    "active": true
  },
  {
    "id": "CAT-027",
    "name": "CLUTCH HOUSING WITH PRIMARY GEAR",
    "price": 157.5,
    "active": true
  },
  {
    "id": "CAT-028",
    "name": "CLUTCH NUT",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-029",
    "name": "CLUTCH HOUSING REAPIR KIT WITH RUBBER /SPRING",
    "price": 36.75,
    "active": true
  },
  {
    "id": "CAT-030",
    "name": "ENGINE CRANK CASE STUD",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-031",
    "name": "DOME CAP NUT FOR STUD",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-032",
    "name": "CLUTCH BEARING",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-033",
    "name": "CHAIN TENIONER FOR TIMING CHAIN",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-034",
    "name": "BALANCER IDLER GEAR KIT (SPRING /RUBBER)",
    "price": 31.5,
    "active": true
  },
  {
    "id": "CAT-035",
    "name": "SHAFT INPUT TRANSMISSION",
    "price": 94.5,
    "active": true
  },
  {
    "id": "CAT-036",
    "name": "SHAFT OUTPUT TRANSMISSION",
    "price": 94.5,
    "active": true
  },
  {
    "id": "CAT-037",
    "name": "GEAR ENGINE (1ST/2ND/3RD/4TH)",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-038",
    "name": "BEARING ENGINE",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-039",
    "name": "BEARING WHEEL (FRONT/ REAR",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-040",
    "name": "GEAR CHANGE LEVER",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-041",
    "name": "GEAR CHANGE SHAFT",
    "price": 47.25,
    "active": true
  },
  {
    "id": "CAT-042",
    "name": "CRANK CASE ENGINE LH SIDE",
    "price": 210,
    "active": true
  },
  {
    "id": "CAT-043",
    "name": "CRANK CASE ENGINE RH SIDE",
    "price": 220.5,
    "active": true
  },
  {
    "id": "CAT-044",
    "name": "COVER CLUTCH ASSY COMPLET",
    "price": 126,
    "active": true
  },
  {
    "id": "CAT-045",
    "name": "COVER MAGNET ASSY COMPLET",
    "price": 126,
    "active": true
  },
  {
    "id": "CAT-046",
    "name": "KICK ASSY COMPLET",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-047",
    "name": "CARBURATOR INSULATOR (MAINIFOLD)",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-048",
    "name": "CARBURATOR ORING",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-049",
    "name": "CARBURATOR FLOT ASSY",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-050",
    "name": "CARBURATOR NEELE PIN ASSY",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-051",
    "name": "CARBURATOR CHOCK KIT",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-052",
    "name": "CARBURATOR VACCUM PISTON",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-053",
    "name": "CARBURATOR ASSY COMPLET",
    "price": 388.5,
    "active": true
  },
  {
    "id": "CAT-054",
    "name": "AIR FILTER ELEMENT",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-055",
    "name": "AIR FILTER DUCT PIPE",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-056",
    "name": "AIR BREATHER PIPE",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-057",
    "name": "AIR BREATHER TUBE",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-058",
    "name": "SWITCH LH CONTROL INDICATOR",
    "price": 68.25,
    "active": true
  },
  {
    "id": "CAT-059",
    "name": "SWITCH RH CONTROL SELF START",
    "price": 68.25,
    "active": true
  },
  {
    "id": "CAT-060",
    "name": "SWITCH FRONT AND REAR BRAKE",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-061",
    "name": "SWITCH EXTRA FOR 4 INDICATOR",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-062",
    "name": "SWITCH IGNITION WITH KEY",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-063",
    "name": "SWITCH NEWTRAL",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-064",
    "name": "SWITCH CLUTCH",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-065",
    "name": "LOCK SET ASSY COMLET KIT",
    "price": 78.75,
    "active": true
  },
  {
    "id": "CAT-066",
    "name": "WIRRING ASSY COMPLET",
    "price": 194.25,
    "active": true
  },
  {
    "id": "CAT-067",
    "name": "LEVER FRONT BRAKE",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-068",
    "name": "LEVER BRAKE YOKE",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-069",
    "name": "LEVER CLUTCH",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-070",
    "name": "LEVER CLUTCH YOKE",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-071",
    "name": "LEVER ROD CLUTCH COVER",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-072",
    "name": "BRAKE PAD FRONT",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-073",
    "name": "BRAKE SHOE REAR",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-074",
    "name": "COUPLING RUBBER",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-075",
    "name": "BRAKE SHOE SPRING",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-076",
    "name": "BRAKE PANLE REAR",
    "price": 57.75,
    "active": true
  },
  {
    "id": "CAT-077",
    "name": "BRAKE DISC FRONT",
    "price": 99.75,
    "active": true
  },
  {
    "id": "CAT-078",
    "name": "BRAKE CALIPER FRONT",
    "price": 141.75,
    "active": true
  },
  {
    "id": "CAT-079",
    "name": "BRAKE MASTER CYLINDER ASSY WITH LEVER",
    "price": 105,
    "active": true
  },
  {
    "id": "CAT-080",
    "name": "BRAKE MASTER CYLINDER REPAIR KIT FRONT",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-081",
    "name": "BRAKE LIGHT ASSY COMPLET",
    "price": 68.25,
    "active": true
  },
  {
    "id": "CAT-082",
    "name": "BRAKE LIGHT GLASS",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-083",
    "name": "BAKE LIGHT BULB",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-084",
    "name": "BRAKE PADLE ASSY",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-085",
    "name": "BRAKE CAM LEVER REAR",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-086",
    "name": "BRAKE PADLE SPRING",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-087",
    "name": "BRAKE ROD ASSY",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-088",
    "name": "BRAKE ROD KIT COMPLET",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-089",
    "name": "CHAIN ADJUSTER PATTY",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-090",
    "name": "SIDE VIEW MIRROR LH/ RH",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-091",
    "name": "HEAD LIGHT RELAY (INTER LOCK)",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-092",
    "name": "HEAD LIGHT BULB(12V 35 W)",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-093",
    "name": "HEAD LIGHT HOLDER WITH",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-094",
    "name": "HEAD LIGHT ASSY COMPLET",
    "price": 94.5,
    "active": true
  },
  {
    "id": "CAT-095",
    "name": "HEAD LIGHT FLAP LH AND RH (UNICORN160)",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-096",
    "name": "HEAD LIGHT BACK COVER (HODA160)",
    "price": 73.5,
    "active": true
  },
  {
    "id": "CAT-097",
    "name": "WIND SHIELD",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-098",
    "name": "WIND SHIELD INNER",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-099",
    "name": "MUDGUARD FRONT FR (HONDA160)",
    "price": 63,
    "active": true
  },
  {
    "id": "CAT-100",
    "name": "MUDGUARD FRONT RR( HONDA160)",
    "price": 63,
    "active": true
  },
  {
    "id": "CAT-101",
    "name": "MUDGUARD CLAMP FRONT",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-102",
    "name": "MUDGUARD REAR",
    "price": 73.5,
    "active": true
  },
  {
    "id": "CAT-103",
    "name": "COVER SIDE LH / RH",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-104",
    "name": "COVER SIDE LOCK",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-105",
    "name": "SEAT COWEL COMPLET",
    "price": 152.25,
    "active": true
  },
  {
    "id": "CAT-106",
    "name": "TANK FLAF LH /RH WITH MONOGRAM HONDA 160",
    "price": 78.75,
    "active": true
  },
  {
    "id": "CAT-107",
    "name": "TANK FLAF LH /RH INNER",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-108",
    "name": "PETROL TANK COMPLET",
    "price": 551.25,
    "active": true
  },
  {
    "id": "CAT-109",
    "name": "PETROL TANK UNIT",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-110",
    "name": "PETROL TANK CAP",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-111",
    "name": "PETROL TANK LOCK",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-112",
    "name": "PETROL COCK ASSY",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-113",
    "name": "PETROL PIPE",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-114",
    "name": "FOOT REST BAR ASSY (160)",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-115",
    "name": "FOOT REST FRONT LH/ RH",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-116",
    "name": "FOOT REST REAR LH /RH",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-117",
    "name": "FOOT REST RUBBER",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-118",
    "name": "FRONT FORK INNER PIPE",
    "price": 84,
    "active": true
  },
  {
    "id": "CAT-119",
    "name": "FRONT FORK OUTER PIPE LH /RH",
    "price": 94.5,
    "active": true
  },
  {
    "id": "CAT-120",
    "name": "FRONT FORK SPRING",
    "price": 31.5,
    "active": true
  },
  {
    "id": "CAT-121",
    "name": "FRONT FORK PIPE PISTON KIT",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-122",
    "name": "LEG GUARD ASSY",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-123",
    "name": "SARIGUARD ASSY",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-124",
    "name": "REAR SHOCK ABSSORBER",
    "price": 168,
    "active": true
  },
  {
    "id": "CAT-125",
    "name": "SILNCER GUARD",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-126",
    "name": "SILENCER ASSY COMPLET",
    "price": 409.5,
    "active": true
  },
  {
    "id": "CAT-127",
    "name": "SWING ARM COMPLET",
    "price": 262.5,
    "active": true
  },
  {
    "id": "CAT-128",
    "name": "SWING ARM BUSH REPAIR KIT KIT",
    "price": 31.5,
    "active": true
  },
  {
    "id": "CAT-129",
    "name": "WHEEL AXLE FRONT / REAR",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-130",
    "name": "AXLE NUT FRONT / REAR",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-131",
    "name": "WHEEL RIM FRONT (ALLOY)",
    "price": 220.5,
    "active": true
  },
  {
    "id": "CAT-132",
    "name": "WHEEL RIM REAR (ALLOY)",
    "price": 341.25,
    "active": true
  },
  {
    "id": "CAT-133",
    "name": "WHEEL CHAIN SET COMPLET",
    "price": 115.5,
    "active": true
  },
  {
    "id": "CAT-134",
    "name": "WHEEL DRIVE CHAIN",
    "price": 63,
    "active": true
  },
  {
    "id": "CAT-135",
    "name": "WHEEL CHAIN LOCK",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-136",
    "name": "WHEEL DOWEL PIN",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-137",
    "name": "HALF AXLE WITH NUT (SLEEV)",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-138",
    "name": "WHEEL COUPLING HUB REAR",
    "price": 63,
    "active": true
  },
  {
    "id": "CAT-139",
    "name": "CHAIN COVER SET (UPPER AND LOWER)",
    "price": 94.5,
    "active": true
  },
  {
    "id": "CAT-140",
    "name": "CHAIN COVER UPPER",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-141",
    "name": "CHAIN COVER LOWER",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-142",
    "name": "HANDLE BAR ASSY",
    "price": 47.25,
    "active": true
  },
  {
    "id": "CAT-143",
    "name": "HANDLE RUBBER KIT",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-144",
    "name": "HANDLE UNDRER GUTKA",
    "price": 36.75,
    "active": true
  },
  {
    "id": "CAT-145",
    "name": "HANDLE UNDER ( T )ASSY HONDA 160",
    "price": 105,
    "active": true
  },
  {
    "id": "CAT-146",
    "name": "STEERING CONE SET COMPLET",
    "price": 47.25,
    "active": true
  },
  {
    "id": "CAT-147",
    "name": "HOLDER STEP LH / RH",
    "price": 94.5,
    "active": true
  },
  {
    "id": "CAT-148",
    "name": "GRIP LH AND RH SIDE",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-149",
    "name": "CABLE CLUTCH",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-150",
    "name": "SPEEDO METER GEAR",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-151",
    "name": "SPEEDO METER DIGITAL (HONDA 160)",
    "price": 283.5,
    "active": true
  },
  {
    "id": "CAT-152",
    "name": "SPEEDO SENSIOR (HONDA160)",
    "price": 126,
    "active": true
  },
  {
    "id": "CAT-153",
    "name": "SPARK PLUG",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-154",
    "name": "SPARK PLU CAP",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-155",
    "name": "C D I UNIT ASSY",
    "price": 89.25,
    "active": true
  },
  {
    "id": "CAT-156",
    "name": "H T COIL ASSY",
    "price": 36.75,
    "active": true
  },
  {
    "id": "CAT-157",
    "name": "HORN ASSY",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-158",
    "name": "BATTERY 12V7B",
    "price": 63,
    "active": true
  },
  {
    "id": "CAT-159",
    "name": "BATTERY BELT",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-160",
    "name": "INDICATOR ASSY (FRONT LH/ RH AND REAR LH /RH )",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-161",
    "name": "INDICATOR BULB",
    "price": 3.15,
    "active": true
  },
  {
    "id": "CAT-162",
    "name": "INDICATOR FLASHER",
    "price": 15.75,
    "active": true
  },
  {
    "id": "CAT-163",
    "name": "INDICATOR BRACKET",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-164",
    "name": "STATOR PALTE ASSY COMPLET (MAGNETO COIL)",
    "price": 94.5,
    "active": true
  },
  {
    "id": "CAT-165",
    "name": "SELF STARTER CLUTCH ASSY COMPLET",
    "price": 126,
    "active": true
  },
  {
    "id": "CAT-166",
    "name": "SELF STARTER GEAR ASSY",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-167",
    "name": "SELF STARTER MOTOR ASSY",
    "price": 136.5,
    "active": true
  },
  {
    "id": "CAT-168",
    "name": "SELF MOTOR CARBON KIT",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-169",
    "name": "SIDE STAND ASSY",
    "price": 26.25,
    "active": true
  },
  {
    "id": "CAT-170",
    "name": "CENTER STAND ASSY",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-171",
    "name": "CENTER STAND BRACKET",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-172",
    "name": "SPRING FOR STAND",
    "price": 5.25,
    "active": true
  },
  {
    "id": "CAT-173",
    "name": "STAND PIN CENTRE",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-174",
    "name": "SEAT ASSY COMPLET",
    "price": 157.5,
    "active": true
  },
  {
    "id": "CAT-175",
    "name": "SEAT COVER SET",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-176",
    "name": "TYRE REAR",
    "price": 136.5,
    "active": true
  },
  {
    "id": "CAT-177",
    "name": "TYER FORNT",
    "price": 94.5,
    "active": true
  },
  {
    "id": "CAT-178",
    "name": "SELF STARTER RELAY",
    "price": 68.25,
    "active": true
  },
  {
    "id": "CAT-179",
    "name": "REGULATOR ASSY",
    "price": 73.5,
    "active": true
  },
  {
    "id": "CAT-180",
    "name": "TYRE CHANGE LABOUR",
    "price": 0,
    "active": true
  },
  {
    "id": "CAT-181",
    "name": "CLUTCH PALTES REPLACING CHARGES",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-182",
    "name": "BRAKE SHOE AND BRAKE PAD FITTING CHARGES",
    "price": 0,
    "active": true
  },
  {
    "id": "CAT-183",
    "name": "ELECTRICAL AND WIRING REAPARING CHARGES",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-184",
    "name": "ENGINE OVERHAULING (REPAIRING) CHARGES",
    "price": 157.5,
    "active": true
  },
  {
    "id": "CAT-185",
    "name": "ENGINE OVERHAULING (REPAIRING) CHARGES( HALF)",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-186",
    "name": "HEAD REPAIRING",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-187",
    "name": "CLUTCH CABLE, ACCILIRATOR CABLE, EXC. FITTING CHARGES",
    "price": 0,
    "active": true
  },
  {
    "id": "CAT-188",
    "name": "WATER WASHING CHARGES",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-189",
    "name": "TUBELESS PUNCTURE",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-190",
    "name": "WHEEL CHAIN AND COMPLET SET REPLACING CHARGES",
    "price": 0,
    "active": true
  },
  {
    "id": "CAT-191",
    "name": "NEW BATTERY FITTING CHARGES",
    "price": 0,
    "active": true
  },
  {
    "id": "CAT-192",
    "name": "SELF MOTOR REPAIRING CHARGES",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-193",
    "name": "FRONT FORK OVERHAULING (REPAIRING CHARGES)",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-194",
    "name": "MAIN IGNITION LOCK CHANGE CHARGES",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-195",
    "name": "SIDE STAND BRACKET WELDING",
    "price": 31.5,
    "active": true
  },
  {
    "id": "CAT-196",
    "name": "CARBURATOR CLEANING CHARGES",
    "price": 0,
    "active": true
  },
  {
    "id": "CAT-197",
    "name": "O/S LATH WORK FOR VALVE GRIDING CHARGE",
    "price": 31.5,
    "active": true
  },
  {
    "id": "CAT-198",
    "name": "BOX OPENING AND RE FIXING CHARGE",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-199",
    "name": "NORMAL WELDING CHARGES DEPEND ON WELDING",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-200",
    "name": "OTHER LABOUR CHARGES",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-201",
    "name": "BOX REPAIRING (REVETING, CLAMP FITING)",
    "price": 10.5,
    "active": true
  },
  {
    "id": "CAT-202",
    "name": "MAGNETO OHVERHAULING CHARGES",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-203",
    "name": "CHASSISE WELDING CHARGES",
    "price": 52.5,
    "active": true
  },
  {
    "id": "CAT-204",
    "name": "LATH WORK FOR CLUTCH HOUSING REPAIR",
    "price": 36.75,
    "active": true
  },
  {
    "id": "CAT-205",
    "name": "LATH WORK FOR CRAK CASE ALUMINIUM WELDING",
    "price": 36.75,
    "active": true
  },
  {
    "id": "CAT-206",
    "name": "LATH WORK FOR OIL DRAIN BILT THRADE REPAIR",
    "price": 36.75,
    "active": true
  },
  {
    "id": "CAT-207",
    "name": "LATH WORK FOR HEAD REAPIAR",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-208",
    "name": "NORMAL WELDING SILENCER REAPIR AND WELDING",
    "price": 31.5,
    "active": true
  },
  {
    "id": "CAT-209",
    "name": "RECOVERY",
    "price": 73.5,
    "active": true
  },
  {
    "id": "CAT-210",
    "name": "ROADSIDE ASSISTANCE",
    "price": 42,
    "active": true
  },
  {
    "id": "CAT-211",
    "name": "ACCLETOR CABLE",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-212",
    "name": "METER CABLE",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-213",
    "name": "CHOKE CABLE",
    "price": 21,
    "active": true
  },
  {
    "id": "CAT-214",
    "name": "PARKING BULB",
    "price": 3.15,
    "active": true
  },
  {
    "id": "CAT-215",
    "name": "FUSE",
    "price": 3.15,
    "active": true
  },
  {
    "id": "CAT-216",
    "name": "SPOCKET BAIRING",
    "price": 21,
    "active": true
  }
]
};
