import { PMTemplateData } from "./PMTemplateDocument";

// Master PM Template - Standard for all PMs
export const masterPMTemplate: PMTemplateData = {
  id: "master-template",
  pmTitle: "MASTER PM TEMPLATE",
  equipmentType: "[Equipment Type]",
  pmFrequency: "[Frequency]",
  discipline: "Mechanical",
  estimatedDuration: "[Duration]",
  skillLevel: "[Skill Level]",
  locationArea: "[Location / Area]",
  revision: "A",
  preparedBy: "[Prepared By]",
  approvedBy: "[Approved By]",
  lastReviewDate: "[DD/MM/YYYY]",
  status: "Draft",

  isolations: {
    electrical: false,
    mechanical: false,
    hydraulic: false,
    pneumatic: false,
  },
  lotoRequired: false,
  storedEnergyHazards: "",
  confinedSpaceRisk: false,
  workingAtHeightsRisk: false,
  hotWorkRequired: false,
  environmentalHazards: "",
  emergencyStopsLocation: "",

  ppe: {
    hardHat: true,
    safetyGlasses: true,
    gloves: true,
    steelCapBoots: true,
    hearingProtection: true,
    respiratoryProtection: false,
    otherPPE: "",
  },

  tools: {
    standardToolKit: true,
    torqueWrench: false,
    greaseGun: false,
    multimeter: false,
    liftingEquipment: false,
    otherTools: "",
  },

  preStartChecks: [
    "Correct permits obtained",
    "Area barricaded and safe",
    "Isolation complete and verified",
    "Equipment clean and safe to access",
    "Job Safety Analysis completed",
  ],

  inspectionTasks: [
    "Inspect for abnormal noise",
    "Inspect for abnormal vibration",
    "Check for oil leaks",
    "Check for grease leaks",
    "Check for loose fasteners",
    "Check guards are fitted and secure",
    "Check alignment condition",
    "Check condition of belts / chains / couplings",
  ],

  mechanicalTasks: [
    "Check bearing condition",
    "Lubricate bearings as required",
    "Check gearbox oil level",
    "Inspect shafts for wear",
    "Inspect mounting bolts",
  ],

  electricalTasks: [
    "Inspect motor condition",
    "Check cable integrity",
    "Inspect junction boxes",
    "Verify sensors are secure",
    "Test local isolators",
  ],

  acceptableCriteria: [
    "No abnormal noise or vibration",
    "No visible leaks",
    "Guards secure",
    "Temperature within normal range",
    "No damage to cables or components",
  ],

  signsOfFailure: [
    "Excessive vibration",
    "Oil contamination",
    "Overheating",
    "Structural damage",
    "Unsafe condition",
  ],

  lubrication: {
    lubricantType: "",
    lubricationPoint: "",
    quantity: "",
    interval: "",
  },

  postWorkChecks: [
    "Tools removed from area",
    "Guards refitted",
    "Equipment returned to service",
    "Area cleaned",
  ],
};

// Example: Weekly Centrifugal Pump Inspection
export const samplePMTemplates: PMTemplateData[] = [
  {
    id: "pm-template-001",
    pmTitle: "WEEKLY CENTRIFUGAL PUMP INSPECTION",
    equipmentType: "Centrifugal Pump",
    pmFrequency: "1 Week",
    discipline: "Mechanical",
    estimatedDuration: "45 minutes",
    skillLevel: "Fitter / Operator",
    locationArea: "Processing Plant",
    revision: "B",
    preparedBy: "Maintenance Planner",
    approvedBy: "Maintenance Superintendent",
    lastReviewDate: "15/01/2026",
    status: "Approved",

    isolations: {
      electrical: false,
      mechanical: false,
      hydraulic: false,
      pneumatic: false,
    },
    lotoRequired: false,
    storedEnergyHazards: "Pressurised pipework - verify pump is depressurised before intrusive work",
    confinedSpaceRisk: false,
    workingAtHeightsRisk: false,
    hotWorkRequired: false,
    environmentalHazards: "Slurry spillage risk - wear appropriate PPE",
    emergencyStopsLocation: "Local E-Stop on pump skid, MCC E-Stop in control room",

    ppe: {
      hardHat: true,
      safetyGlasses: true,
      gloves: true,
      steelCapBoots: true,
      hearingProtection: true,
      respiratoryProtection: false,
      otherPPE: "Face shield if cleaning with compressed air",
    },

    tools: {
      standardToolKit: true,
      torqueWrench: false,
      greaseGun: true,
      multimeter: false,
      liftingEquipment: false,
      otherTools: "Temperature gun, Stethoscope / listening rod",
    },

    preStartChecks: [
      "Correct permits obtained",
      "Area barricaded and safe",
      "Isolation NOT required for visual inspection",
      "Equipment clean and safe to access",
      "Job Safety Analysis completed",
    ],

    inspectionTasks: [
      "Inspect for abnormal noise (cavitation, bearing rumble)",
      "Inspect for abnormal vibration",
      "Check for oil leaks at bearing housing",
      "Check for seal leaks at gland area",
      "Check for loose foundation bolts",
      "Check coupling guard is fitted and secure",
      "Check alignment condition (visual)",
      "Check condition of coupling (if visible)",
    ],

    mechanicalTasks: [
      "Check bearing housing temperature (max 70°C)",
      "Lubricate bearings as required (if grease points fitted)",
      "Check oil level in bearing housing (if oil lubricated)",
      "Inspect mechanical seal flush system operation",
      "Inspect gland packing condition (if fitted)",
    ],

    electricalTasks: [],

    acceptableCriteria: [
      "Bearing temperature < 70°C",
      "No abnormal noise or vibration",
      "No visible leaks at seal or bearing housing",
      "Foundation bolts tight",
      "Guards secure and undamaged",
      "Coupling guard in place",
    ],

    signsOfFailure: [
      "Excessive vibration (> 4.5 mm/s)",
      "High bearing temperature (> 70°C)",
      "Seal leakage exceeding acceptable limits",
      "Cavitation noise",
      "Unusual grinding or rumbling sounds",
    ],

    lubrication: {
      lubricantType: "Shell Gadus S2 V220 2 (or equivalent)",
      lubricationPoint: "Bearing housing grease nipples (DE & NDE)",
      quantity: "2-3 pumps per grease point",
      interval: "Weekly or as required",
    },

    postWorkChecks: [
      "Tools removed from area",
      "Guards refitted",
      "Equipment returned to service",
      "Area cleaned of any spills",
    ],
  },
  {
    id: "pm-template-002",
    pmTitle: "FORTNIGHTLY CONVEYOR BELT INSPECTION",
    equipmentType: "Belt Conveyor",
    pmFrequency: "2 Week",
    discipline: "Mechanical",
    estimatedDuration: "1.5 hours",
    skillLevel: "Fitter",
    locationArea: "Processing Plant",
    revision: "A",
    preparedBy: "Maintenance Planner",
    approvedBy: "Maintenance Superintendent",
    lastReviewDate: "10/01/2026",
    status: "Reviewed",

    isolations: {
      electrical: true,
      mechanical: false,
      hydraulic: false,
      pneumatic: false,
    },
    lotoRequired: true,
    storedEnergyHazards: "Belt tension - gravity take-up may drop if released",
    confinedSpaceRisk: false,
    workingAtHeightsRisk: true,
    hotWorkRequired: false,
    environmentalHazards: "Dust inhalation risk - RPE may be required",
    emergencyStopsLocation: "Pull-wire along conveyor length, E-Stop at head and tail",

    ppe: {
      hardHat: true,
      safetyGlasses: true,
      gloves: true,
      steelCapBoots: true,
      hearingProtection: true,
      respiratoryProtection: true,
      otherPPE: "Fall arrest harness if working at heights",
    },

    tools: {
      standardToolKit: true,
      torqueWrench: false,
      greaseGun: true,
      multimeter: false,
      liftingEquipment: false,
      otherTools: "Tape measure, Marker pen, Belt thickness gauge",
    },

    preStartChecks: [
      "Correct permits obtained (incl. heights permit if required)",
      "Area barricaded and safe",
      "Electrical isolation complete and verified",
      "Equipment clean and safe to access",
      "Job Safety Analysis completed",
    ],

    inspectionTasks: [
      "Inspect belt surface for cuts, tears, gouges > 50mm",
      "Inspect belt edges for fraying or damage",
      "Check belt tracking at head, tail, and midpoints",
      "Inspect belt splices for separation or wear",
      "Check all carry idlers are spinning freely",
      "Check all return idlers are spinning freely",
      "Inspect pulley lagging condition",
      "Check belt scrapers for wear",
      "Check skirt rubber condition",
    ],

    mechanicalTasks: [
      "Check head pulley bearings (temperature, noise)",
      "Check tail pulley bearings (temperature, noise)",
      "Inspect take-up position and tension",
      "Check drive gearbox oil level",
      "Inspect coupling condition",
      "Check all structural bolts are secure",
    ],

    electricalTasks: [
      "Inspect motor condition (visual)",
      "Check cable integrity to motor",
      "Verify pull-wire E-Stop functionality",
    ],

    acceptableCriteria: [
      "No belt damage > 50mm",
      "Belt tracking centered within 25mm",
      "All idlers spinning freely",
      "No material spillage",
      "Splices in good condition",
      "Take-up within travel limits",
    ],

    signsOfFailure: [
      "Belt mistracking > 50mm",
      "Seized idlers",
      "Material spillage",
      "Belt edge fraying",
      "Splice separation",
      "Pulley lagging damage",
    ],

    lubrication: {
      lubricantType: "Shell Gadus S2 V220 2",
      lubricationPoint: "Head & Tail pulley bearings, Take-up bearings",
      quantity: "As per OEM specification",
      interval: "Fortnightly",
    },

    postWorkChecks: [
      "Tools removed from conveyor",
      "Guards and covers refitted",
      "Isolation removed and equipment returned to service",
      "Area cleaned of debris",
    ],
  },
  {
    id: "pm-template-003",
    pmTitle: "6-WEEKLY GEARBOX INSPECTION",
    equipmentType: "Gearbox",
    pmFrequency: "6 Week",
    discipline: "Mechanical",
    estimatedDuration: "1 hour",
    skillLevel: "Fitter",
    locationArea: "Processing Plant",
    revision: "A",
    preparedBy: "Maintenance Planner",
    approvedBy: "Maintenance Superintendent",
    lastReviewDate: "05/01/2026",
    status: "Draft",

    isolations: {
      electrical: false,
      mechanical: false,
      hydraulic: false,
      pneumatic: false,
    },
    lotoRequired: false,
    storedEnergyHazards: "None - visual inspection only while running",
    confinedSpaceRisk: false,
    workingAtHeightsRisk: false,
    hotWorkRequired: false,
    environmentalHazards: "Hot surfaces - gearbox may be at operating temperature",
    emergencyStopsLocation: "As per equipment E-Stop location",

    ppe: {
      hardHat: true,
      safetyGlasses: true,
      gloves: true,
      steelCapBoots: true,
      hearingProtection: true,
      respiratoryProtection: false,
      otherPPE: "",
    },

    tools: {
      standardToolKit: true,
      torqueWrench: false,
      greaseGun: false,
      multimeter: false,
      liftingEquipment: false,
      otherTools: "Temperature gun, Oil sample bottle, Sight glass cleaner",
    },

    preStartChecks: [
      "Job Safety Analysis completed",
      "Area safe to access",
      "No isolation required for visual inspection",
      "Equipment running for operational checks",
      "Temperature gun calibrated",
    ],

    inspectionTasks: [
      "Inspect for abnormal noise",
      "Inspect for abnormal vibration",
      "Check for oil leaks at seals",
      "Check for oil leaks at drain plug",
      "Check oil level via sight glass",
      "Check oil condition via sight glass (colour, clarity)",
      "Check breather condition",
      "Check mounting bolts are secure",
    ],

    mechanicalTasks: [
      "Check gearbox housing temperature (max 80°C)",
      "Check input shaft seal condition",
      "Check output shaft seal condition",
      "Take oil sample if scheduled",
      "Clean sight glass if dirty",
    ],

    electricalTasks: [],

    acceptableCriteria: [
      "Gearbox temperature < 80°C",
      "No abnormal noise or vibration",
      "Oil level at correct mark on sight glass",
      "Oil clear and not milky or dark",
      "No visible leaks",
      "Breather clear and undamaged",
    ],

    signsOfFailure: [
      "High temperature (> 80°C)",
      "Milky oil (water contamination)",
      "Dark oil (oxidation or wear)",
      "Metal particles visible in oil",
      "Unusual noise (gear whine, grinding)",
      "Excessive vibration",
    ],

    lubrication: {
      lubricantType: "Shell Omala S4 GX 320 (or as per OEM)",
      lubricationPoint: "Gearbox sump - filled to sight glass level",
      quantity: "Top up as required to sight glass mark",
      interval: "Check 6-weekly, change annually or as per oil analysis",
    },

    postWorkChecks: [
      "Tools removed from area",
      "Sample bottles labelled and submitted",
      "Area cleaned",
      "Findings recorded",
    ],
  },
];
