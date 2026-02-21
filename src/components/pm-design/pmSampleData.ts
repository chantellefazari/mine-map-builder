import { PMData } from "./PMFrequencySection";

// Sample PM based on the Ball Mill Area Inspection example
export const samplePMs: PMData[] = [
  {
    id: "pm-fp-daily-offline",
    pmName: "Filter Press Daily Offline Inspection",
    equipmentType: "Filter Press",
    frequency: "Daily",
    purpose:
      "To safely carry out mechanical inspection of filter press equipment for signs of damage or potential failures that may require maintenance attention. Equipment must be isolated and locked out before commencing offline inspection tasks.",
    discipline: "Mechanical",
    dutyType: "Both",
    estimatedDuration: "1 hr",
    skillLevel: "Fitter",
    requiredTools: [
      "Standard hand tools",
      "Temperature gun",
      "Torch",
      "Marker tags",
    ],
    requiredPPE: [
      "Steel cap boots",
      "Hard hat",
      "Safety glasses",
      "Hearing protection",
      "Gloves (when required)",
    ],
    isolationRequirements:
      "Equipment must be isolated, locked out and tagged before commencing offline inspection. Full mechanical isolation required.",
    safetyNotes: [
      "Complete a TAKE 5 every time to check that no abnormal conditions exist",
      "Follow safety procedures at all times",
      "Isolate equipment where required & ensure use of correct PPE",
      "Under no circumstances will personnel place themselves in an unsafe position while carrying out these inspection tasks",
    ],
    tasks: [
      { id: "fp-t1", step: 1, description: "Ensure equipment is isolated, locked out and tagged before commencing offline inspection" },
      { id: "fp-t2", step: 2, description: "Conduct area inspection as per tables below. Record each check with a tick in the appropriate box" },
      { id: "fp-t3", step: 3, description: "When a defect is identified and it is safe and practical to repair, do so and note in the comments section" },
      { id: "fp-t4", step: 4, description: "If not practical to repair, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request" },
    ],
    inspectionPoints: [
      {
        item: "Filter 1 – Plates and Structural",
        checkPoints: ["Plates for cracks/warping/chips", "Plate sealing edges", "Handles and lugs", "Tie bars straightness/corrosion", "Main beam and frame", "Pneumatic plate shakers"],
      },
      {
        item: "Filter 1 – Hydraulic",
        checkPoints: ["Cylinder rods for scoring/damage", "Rod wipers and seals", "Hose clamps and supports"],
      },
      {
        item: "Filter 1 – Plate Shifter",
        checkPoints: ["Carriage wheels wear/binding", "Shifter rails corrosion/misalignment", "Chain tension", "Shifter smooth operation"],
      },
      {
        item: "Filter 1 Extraction Conveyor",
        checkPoints: ["Skirts adjustment", "Roller condition", "Roller frames"],
      },
      {
        item: "Filter 2 – Plates and Structural",
        checkPoints: ["Plates for cracks/warping/chips", "Plate sealing edges", "Handles and lugs", "Tie bars straightness/corrosion", "Main beam and frame", "Pneumatic plate shakers"],
      },
      {
        item: "Filter 2 – Hydraulic",
        checkPoints: ["Cylinder rods for scoring/damage", "Rod wipers and seals", "Hose clamps and supports"],
      },
      {
        item: "Filter 2 – Plate Shifter",
        checkPoints: ["Carriage wheels wear/binding", "Shifter rails corrosion/misalignment", "Chain tension and sprockets", "Shifter smooth operation"],
      },
      {
        item: "Filter 2 Extraction Conveyor",
        checkPoints: ["Skirts adjustment", "Roller condition", "Roller frames"],
      },
      {
        item: "Collector Conveyor (If Available)",
        checkPoints: ["Skirts adjustment", "Roller condition", "Roller frames"],
      },
      {
        item: "Radial Stacker Conveyor (If Available)",
        checkPoints: ["Skirts adjustment", "Roller condition", "Roller frames"],
      },
    ],
    acceptableCriteria: [
      "No plate cracks or damaged sealing edges",
      "No cylinder rod scoring or seal failure",
      "Chain elongation <3%",
      "No seized or hot bearings",
      "Frame and tie bars aligned",
      "No visible hydraulic leaks",
    ],
    signsOfFailure: [
      "Plate cracks or damaged sealing edges",
      "Cylinder rod scoring or seal failure",
      "Chain elongation >3%",
      "Seized or hot bearings",
      "Misaligned frame or tie bars",
      "Visible hydraulic leaks",
    ],
    lubricationNotes: "N/A - This is an offline visual/mechanical inspection.",
    oemReferences: "Refer to filter press OEM documentation for component specifications.",
    status: "Draft",
  },
  {
    id: "pm-001",
    pmName: "Weekly Ball Mill Area Inspection",
    equipmentType: "Ball Mill",
    frequency: "1 Week",
    purpose:
      "To safely carry out electrical inspection for signs of damage or potential failures that may require maintenance attention. This is a visual inspection only - equipment is live.",
    discipline: "Electrical",
    dutyType: "Both",
    estimatedDuration: "45 min",
    skillLevel: "Electrician",
    requiredTools: [
      "Hand tools",
      "Cabinet key",
      "Wire brush",
      "Cleaning rag",
    ],
    requiredPPE: [
      "Safety glasses",
      "Hard hat",
      "Steel cap boots",
      "High-vis vest",
      "Gas monitor (in signed areas)",
    ],
    isolationRequirements:
      "This is a visual inspection only. Equipment is LIVE. No isolation required but exercise caution. Always assume the equipment is live until positively isolated, locked and tagged.",
    safetyNotes: [
      "Complete a SMART START before commencing to check for abnormal conditions",
      "Always wear correct PPE",
      "Gas monitor to be carried in plant areas where signed",
      "Always assume equipment is live until positively isolated, locked and tagged",
    ],
    tasks: [
      {
        id: "t1",
        step: 1,
        description:
          "Conduct area inspection as per tables below. Record each check with a tick in the appropriate box.",
      },
      {
        id: "t2",
        step: 2,
        description:
          "Motors, enclosures and electrical apparatus must be cleaned as required where excessive build up has occurred.",
      },
      {
        id: "t3",
        step: 3,
        description:
          "Areas subject to spillage or hosing shall require the use of Denso tape around terminal boxes and cable entries.",
      },
      {
        id: "t4",
        step: 4,
        description:
          "Visual inspection to ensure adequate water and dust ingress protection is provided for electrical apparatus.",
      },
      {
        id: "t5",
        step: 5,
        description:
          "If immediate action is required to rectify unsafe electrical equipment, contact your supervisor.",
      },
      {
        id: "t6",
        step: 6,
        description:
          "Unless a defect requires immediate action, note it within the comments section for a work order to be raised.",
      },
    ],
    inspectionPoints: [
      {
        item: "Ball Mill Barring Drive",
        checkPoints: ["Condition", "Switches & Proxies", "Sensors", "Motor", "Labels", "Glands", "Cables"],
      },
      {
        item: "Ball Mill Pinion Lube System",
        checkPoints: ["Condition", "Switches & Proxies", "Sensors", "Motor", "Labels", "Glands", "Cables"],
      },
      {
        item: "Ball Mill Gearbox Lube System",
        checkPoints: ["Condition", "Switches & Proxies", "Sensors", "Motor", "Labels", "Glands", "Cables"],
      },
      {
        item: "Ball Mill Trunion Lube System",
        checkPoints: ["Condition", "Switches & Proxies", "Sensors", "Motor", "Labels", "Glands", "Cables"],
      },
      {
        item: "Ball Mill Motor Lube System",
        checkPoints: ["Condition", "Switches & Proxies", "Sensors", "Motor", "Labels", "Glands", "Cables"],
      },
      {
        item: "Ball Mill LRS",
        checkPoints: ["Condition", "Switches & Proxies", "Sensors", "Motor", "Labels", "Glands", "Cables"],
      },
      {
        item: "Gravity Feed Pump System",
        checkPoints: ["Condition", "Switches & Proxies", "Sensors", "Motor", "Labels", "Glands", "Cables"],
      },
      {
        item: "Mill Discharge Pump 1 & 2",
        checkPoints: ["Condition", "Switches & Proxies", "Sensors", "Motor", "Labels", "Glands", "Cables"],
      },
    ],
    acceptableCriteria: [
      "All equipment in GOOD condition",
      "No visible damage to cables, glands, or enclosures",
      "All labels legible and intact",
      "All cabinets properly secured",
      "No signs of water or dust ingress",
    ],
    signsOfFailure: [
      "Damaged cables",
      "Loose glands",
      "Missing labels",
      "Water ingress",
      "Dust build-up",
      "Overheating",
      "Unusual noise",
    ],
    lubricationNotes: "N/A - This is a visual inspection only. No lubrication required.",
    oemReferences: "Doc: SM-XXX--PR-XXXX | Issue Date: 30/06/2020 | Version: A",
    status: "Approved",
  },
  {
    id: "pm-002",
    pmName: "Weekly Centrifugal Pump Visual Inspection",
    equipmentType: "Centrifugal Pump",
    frequency: "1 Week",
    purpose:
      "Prevent bearing failure and seal leaks through early detection of abnormal conditions.",
    discipline: "Mechanical",
    dutyType: "Both",
    estimatedDuration: "30 min",
    skillLevel: "Operator",
    requiredTools: ["Torch", "Temperature gun"],
    requiredPPE: [
      "Safety glasses",
      "Hard hat",
      "Steel cap boots",
      "Hearing protection",
    ],
    isolationRequirements:
      "No isolation required for visual inspection. For intrusive work, full electrical and mechanical isolation required.",
    safetyNotes: [
      "Complete SMART START before commencing",
      "Do not touch rotating equipment",
      "Maintain safe distance from coupling guards",
    ],
    tasks: [
      {
        id: "t1",
        step: 1,
        description: "Check bearing housing temperature (should be <70°C)",
      },
      {
        id: "t2",
        step: 2,
        description: "Listen for unusual noise (cavitation, bearing rumble)",
      },
      {
        id: "t3",
        step: 3,
        description: "Check mechanical seal area for visible leaks",
      },
      {
        id: "t4",
        step: 4,
        description: "Inspect coupling guard for damage or missing bolts",
      },
      {
        id: "t5",
        step: 5,
        description: "Check foundation bolts are tight and not corroded",
      },
    ],
    inspectionPoints: [
      {
        item: "Bearing Housing",
        checkPoints: ["Temperature", "Noise", "Vibration"],
      },
      {
        item: "Mechanical Seal",
        checkPoints: ["Leakage", "Flush system operation"],
      },
      {
        item: "Coupling Guard",
        checkPoints: ["Condition", "Bolts secure"],
      },
    ],
    acceptableCriteria: [
      "Bearing temperature <70°C",
      "No visible leaks at seal",
      "No abnormal noise",
      "Foundation bolts tight",
    ],
    signsOfFailure: [
      "High temperature",
      "Excessive vibration",
      "Seal weepage",
      "Unusual noise",
      "Cavitation sounds",
    ],
    lubricationNotes: "Check grease level if fitted with sight glass. Grease as per OEM schedule.",
    oemReferences: "Refer to pump datasheet for acceptable operating parameters.",
    status: "Reviewed",
  },
  {
    id: "pm-003",
    pmName: "Fortnightly Conveyor Belt Inspection",
    equipmentType: "Belt Conveyor",
    frequency: "2 Week",
    purpose:
      "Prevent belt damage, tracking issues, and material spillage through regular inspection.",
    discipline: "Mechanical",
    dutyType: "Duty",
    estimatedDuration: "1.5 hrs",
    skillLevel: "Fitter",
    requiredTools: ["Torch", "Tape measure", "Marker pen"],
    requiredPPE: [
      "Safety glasses",
      "Hard hat",
      "Steel cap boots",
      "Gloves",
    ],
    isolationRequirements:
      "Electrical isolation required for all under-belt work. Lock out at local isolator.",
    safetyNotes: [
      "Never reach under moving belt",
      "Confirm E-stops are functional before starting",
      "Watch for pinch points at idlers and pulleys",
    ],
    tasks: [
      {
        id: "t1",
        step: 1,
        description: "Inspect belt surface for damage, cuts, or tears >50mm",
      },
      {
        id: "t2",
        step: 2,
        description: "Check belt tracking at head, tail, and midpoints",
      },
      {
        id: "t3",
        step: 3,
        description: "Inspect all carry and return idlers for wear and spin freely",
      },
      {
        id: "t4",
        step: 4,
        description: "Check pulley lagging condition",
      },
      {
        id: "t5",
        step: 5,
        description: "Inspect belt scrapers and skirts for wear",
      },
      {
        id: "t6",
        step: 6,
        description: "Check take-up position and tension",
      },
    ],
    inspectionPoints: [
      {
        item: "Belt Surface",
        checkPoints: ["Cuts", "Tears", "Edge fraying", "Splice condition"],
      },
      {
        item: "Idlers",
        checkPoints: ["Spinning freely", "Wear", "Seized rollers"],
      },
      {
        item: "Pulleys",
        checkPoints: ["Lagging", "Tracking", "Wear"],
      },
    ],
    acceptableCriteria: [
      "No belt damage >50mm",
      "Belt tracking centered",
      "All idlers spinning freely",
      "No material spillage",
    ],
    signsOfFailure: [
      "Belt mistracking",
      "Idler seizure",
      "Material spillage",
      "Belt edge fraying",
      "Splice separation",
    ],
    lubricationNotes: "Lubricate take-up bearings if applicable. Check idler bearing grease condition.",
    oemReferences: "Refer to conveyor GA drawing for component locations.",
    status: "Draft",
  },
];
