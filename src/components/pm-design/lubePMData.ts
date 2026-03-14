export interface LubePoint {
  location: string;
  type: string;
  quantity: string;
  uom: string;
}

export interface LubePMItem {
  plantId: string;
  plantItem: string;
  lubePoints: LubePoint[];
}

export interface LubePMTemplate {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  frequency: string;
  frequencyGroup: string; // sidebar key
  items: LubePMItem[];
}

export const lubePMTemplates: LubePMTemplate[] = [
  // ── MONTHLY ──
  {
    id: "lube-ball-mill-monthly",
    name: "Ball Mill Lubrication",
    title: "Ball Mill – Lubrication Schedule",
    subtitle: "Monthly Lubrication PM",
    frequency: "Monthly",
    frequencyGroup: "4-week",
    items: [
      {
        plantId: "BM01",
        plantItem: "Tank; Motor Lube Oil; Ball Mill",
        lubePoints: [
          { location: "Tank", type: "VG460", quantity: "To Tank Capacity", uom: "" },
          { location: "Motor", type: "EP3 Grease", quantity: "20", uom: "g" },
        ],
      },
      {
        plantId: "BM01",
        plantItem: "Tank; G/B-Pin; Ball Mill",
        lubePoints: [
          { location: "Gearbox", type: "VG320", quantity: "190", uom: "l" },
          { location: "Pinion", type: "VG460", quantity: "To Tank Capacity", uom: "" },
          { location: "Shaft Bearing", type: "EP1", quantity: "425", uom: "g" },
        ],
      },
      {
        plantId: "BM01",
        plantItem: "Tank; Trunnion Oil; Ball Mill",
        lubePoints: [
          { location: "Trunnion", type: "VG460", quantity: "To Tank Capacity", uom: "" },
        ],
      },
    ],
  },

  // ── 3 MONTHLY ──
  {
    id: "lube-conveyors-3monthly",
    name: "Conveyor Gearbox & Bearings",
    title: "Conveyors – Gearbox & Bearing Lubrication",
    subtitle: "3 Monthly Lubrication PM",
    frequency: "3 Monthly",
    frequencyGroup: "12-week",
    items: [
      {
        plantId: "04-FE-100",
        plantItem: "Gearbox, Pully; Conveyor",
        lubePoints: [
          { location: "Gearbox", type: "CLP 220", quantity: "1.2", uom: "l" },
          { location: "Bearing", type: "EP Grease", quantity: "To Capacity", uom: "" },
        ],
      },
      {
        plantId: "04-FE-101",
        plantItem: "Gearbox, Pully; Conveyor",
        lubePoints: [
          { location: "Gearbox", type: "CLP 220", quantity: "2.1", uom: "l" },
          { location: "Bearing", type: "EP Grease", quantity: "To Capacity", uom: "" },
        ],
      },
      {
        plantId: "04-BC-100",
        plantItem: "Gearbox, Pully; Conveyor",
        lubePoints: [
          { location: "Gearbox", type: "CLP 220", quantity: "3", uom: "l" },
          { location: "Bearing", type: "EP Grease", quantity: "To Capacity", uom: "" },
        ],
      },
    ],
  },
  {
    id: "lube-agitators-3monthly",
    name: "Agitator Gearboxes",
    title: "Agitators – Gearbox Lubrication",
    subtitle: "3 Monthly Lubrication PM",
    frequency: "3 Monthly",
    frequencyGroup: "12-week",
    items: [
      { plantId: "05-AG-001", plantItem: "Gearbox, Agitator; CIP Tank #1", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "05-AG-002", plantItem: "Gearbox, Agitator; CIP Tank #2", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "05-AG-003", plantItem: "Gearbox, Agitator; CIL Tank #1", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "05-AG-004", plantItem: "Gearbox, Agitator; CIL Tank #2", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "05-AG-005", plantItem: "Gearbox, Agitator; CIL Tank #3", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "05-AG-006", plantItem: "Gearbox, Agitator; CIL Tank #4", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "05-AG-007", plantItem: "Gearbox, Agitator; CIL Tank #5", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "05-AG-008", plantItem: "Gearbox, Agitator; CIL Tank #6", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "06-AG-001", plantItem: "Gearbox, Agitator; Cyanide Mixing", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "4.4", uom: "l" }] },
    ],
  },
  {
    id: "lube-pumps-3monthly",
    name: "Pump Bearings",
    title: "Pumps – Bearing Lubrication",
    subtitle: "3 Monthly Lubrication PM",
    frequency: "3 Monthly",
    frequencyGroup: "12-week",
    items: [
      { plantId: "04-PU-102A", plantItem: "Bearing Assembly; Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "04-PU-102B", plantItem: "Gearbox, Pump; Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "04-PU-120", plantItem: "Gearbox, Pump; Sump Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "2", uom: "g" }] },
      { plantId: "05-PU-003", plantItem: "Gearbox, Pump; Sump Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "2", uom: "g" }] },
      { plantId: "05-PU-108A", plantItem: "Bearing Assembly; Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "05-PU-108B", plantItem: "Bearing Assembly; Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "06-PU-001", plantItem: "Bearing, Pump; Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "To Capacity", uom: "" }] },
      { plantId: "06-PU-002", plantItem: "Bearing, Pump; Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "To Capacity", uom: "" }] },
      { plantId: "06-PU-003", plantItem: "Bearing, Pump; Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "To Capacity", uom: "" }] },
      { plantId: "05-PU-004", plantItem: "Gearbox, Pump; Sump Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "2", uom: "g" }] },
      { plantId: "06-PU-004", plantItem: "Gearbox, Pump; Sump Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "2", uom: "g" }] },
      { plantId: "08-PU-001", plantItem: "Bearing, Pump; Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "To Capacity", uom: "" }] },
      { plantId: "08-PU-006", plantItem: "Bearing, Pump; Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "To Capacity", uom: "" }] },
      { plantId: "08-PU-007", plantItem: "Bearing Assembly; Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "11-PU-130A", plantItem: "Bearing Assembly; Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "11-PU-130B", plantItem: "Bearing Assembly; Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "12-PU-200A", plantItem: "Bearing Assembly; Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "12-PU-200B", plantItem: "Bearing Assembly; Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "13-PU-101", plantItem: "Bearing Assembly; Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "13-PU-102", plantItem: "Bearing Assembly; Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
    ],
  },
  {
    id: "lube-gantry-crane-3monthly",
    name: "Gantry Crane",
    title: "Gantry Crane – Lubrication Schedule",
    subtitle: "3 Monthly Lubrication PM",
    frequency: "3 Monthly",
    frequencyGroup: "12-week",
    items: [
      {
        plantId: "05-HT-001",
        plantItem: "Gearbox, Hoist, Trolly; Gantry Crane",
        lubePoints: [
          { location: "Gearbox", type: "VG150", quantity: "To Capacity", uom: "" },
          { location: "Hoist", type: "EP2", quantity: "To Capacity", uom: "" },
          { location: "Bearing", type: "EP Grease", quantity: "To Capacity", uom: "" },
        ],
      },
    ],
  },
  {
    id: "lube-thickener-3monthly",
    name: "Thickener Powerpack & Rake",
    title: "Thickener – Powerpack, Rake Lift & Gearbox Lubrication",
    subtitle: "3 Monthly Lubrication PM",
    frequency: "3 Monthly",
    frequencyGroup: "12-week",
    items: [
      {
        plantId: "12-TM-001",
        plantItem: "Powerpack, Rake Lift, hydraulic; Thickener",
        lubePoints: [
          { location: "Powerpack", type: "VG 68", quantity: "85% of Capacity", uom: "" },
          { location: "Rake Lift", type: "GP Grease", quantity: "0.5", uom: "l" },
          { location: "Gearbox", type: "VG 220", quantity: "50% of gauge", uom: "" },
        ],
      },
    ],
  },

  // ── 6 MONTHLY ──
  {
    id: "lube-compressors-6monthly",
    name: "Compressor Oil Reservoirs",
    title: "Compressors – Oil Reservoir Service",
    subtitle: "6 Monthly Lubrication PM",
    frequency: "6 Monthly",
    frequencyGroup: "26-week",
    items: [
      { plantId: "05-CP-132", plantItem: "Oil Reservoir; Compressor", lubePoints: [{ location: "Reservoir", type: "Roto-Xtend Duty Fluid", quantity: "14.7", uom: "l" }] },
      { plantId: "05-CP-133", plantItem: "Oil Reservoir; Compressor", lubePoints: [{ location: "Reservoir", type: "Roto-Xtend Duty Fluid", quantity: "14.7", uom: "l" }] },
      { plantId: "13-CP-100", plantItem: "Oil Reservoir; Compressor", lubePoints: [{ location: "Reservoir", type: "Roto-Xtend Duty Fluid", quantity: "14.7", uom: "l" }] },
    ],
  },

  // ── 12 MONTHLY ──
  {
    id: "lube-rotary-valve-12monthly",
    name: "Rotary Valve Gearbox",
    title: "Rotary Valve – Gearbox Lubrication",
    subtitle: "12 Monthly Lubrication PM",
    frequency: "12 Monthly",
    frequencyGroup: "52-week",
    items: [
      {
        plantId: "04-FE-102",
        plantItem: "Gearbox, Rotary Valve; Lime Silo",
        lubePoints: [
          { location: "Gearbox", type: "EP2", quantity: "2", uom: "g" },
          { location: "Rotary Valve", type: "EP2", quantity: "To Capacity", uom: "" },
        ],
      },
    ],
  },
  {
    id: "lube-monorails-12monthly",
    name: "Monorail Hoists",
    title: "Monorails – Gearbox, Hoist & Bearing Lubrication",
    subtitle: "12 Monthly Lubrication PM",
    frequency: "12 Monthly",
    frequencyGroup: "52-week",
    items: [
      {
        plantId: "06-MR-101",
        plantItem: "Gearbox, Hoist, Trolly; Monorail",
        lubePoints: [
          { location: "Gearbox", type: "VG150", quantity: "To Capacity", uom: "" },
          { location: "Hoist", type: "EP2", quantity: "To Capacity", uom: "" },
          { location: "Bearing", type: "EP Grease", quantity: "To Capacity", uom: "" },
        ],
      },
      {
        plantId: "08-MR-001",
        plantItem: "Gearbox, Hoist, Trolly; Monorail",
        lubePoints: [
          { location: "Gearbox", type: "VG150", quantity: "To Capacity", uom: "" },
          { location: "Hoist", type: "EP2", quantity: "To Capacity", uom: "" },
          { location: "Bearing", type: "EP Grease", quantity: "To Capacity", uom: "" },
        ],
      },
      {
        plantId: "12-MR-001",
        plantItem: "Gearbox, Hoist, Trolly; Monorail",
        lubePoints: [
          { location: "Gearbox", type: "VG150", quantity: "To Capacity", uom: "" },
          { location: "Hoist", type: "EP2", quantity: "To Capacity", uom: "" },
          { location: "Bearing", type: "EP Grease", quantity: "To Capacity", uom: "" },
        ],
      },
    ],
  },
];

// Helper to get a template by ID
export const getLubePMTemplate = (id: string) =>
  lubePMTemplates.find((t) => t.id === id);
