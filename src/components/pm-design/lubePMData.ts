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
  plantArea: string;
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
    plantArea: "Grinding",
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
    plantArea: "Ore Handling",
    items: [
      {
        plantId: "RCFD01",
        plantItem: "Gearbox, Pully; Conveyor",
        lubePoints: [
          { location: "Gearbox", type: "CLP 220", quantity: "1.2", uom: "l" },
          { location: "Bearing", type: "EP Grease", quantity: "To Capacity", uom: "" },
        ],
      },
      {
        plantId: "TRCV01",
        plantItem: "Gearbox, Pully; Conveyor",
        lubePoints: [
          { location: "Gearbox", type: "CLP 220", quantity: "2.1", uom: "l" },
          { location: "Bearing", type: "EP Grease", quantity: "To Capacity", uom: "" },
        ],
      },
      {
        plantId: "MFCV01",
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
      { plantId: "LCH01-TK01-AGT01", plantItem: "Gearbox, Agitator; Leach Tank #1", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "LCH01-TK02-AGT01", plantItem: "Gearbox, Agitator; Leach Tank #2", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "CIP01-TK03-AGT01", plantItem: "Gearbox, Agitator; CIP Tank #1", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "CIP01-TK04-AGT01", plantItem: "Gearbox, Agitator; CIP Tank #2", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "CIP01-TK05-AGT01", plantItem: "Gearbox, Agitator; CIP Tank #3", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "CIP01-TK06-AGT01", plantItem: "Gearbox, Agitator; CIP Tank #4", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "CIP01-TK07-AGT01", plantItem: "Gearbox, Agitator; CIP Tank #5", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "CIP01-TK08-AGT01", plantItem: "Gearbox, Agitator; CIP Tank #6", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "8.8", uom: "l" }] },
      { plantId: "CN01-MXT01-AGT01", plantItem: "Gearbox, Agitator; Cyanide Mixing", lubePoints: [{ location: "Gearbox", type: "CLP 220", quantity: "4.4", uom: "l" }] },
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
      { plantId: "CFP01-PA01", plantItem: "Bearing Assembly; Cyclone Feed Pump (Duty)", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "CFP01-PB01", plantItem: "Bearing Assembly; Cyclone Feed Pump (Standby)", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "MLA01-PMP01", plantItem: "Gearbox, Pump; Grinding Area Sump Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "2", uom: "g" }] },
      { plantId: "LCA01-PMP01", plantItem: "Gearbox, Pump; CIP Area Sump Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "2", uom: "g" }] },
      { plantId: "ADS01-PMP03", plantItem: "Bearing Assembly; CIP Tailings Pump (Duty)", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "ADS01-PMP02", plantItem: "Bearing Assembly; CIP Tailings Pump (Standby)", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "CN01-PMP01", plantItem: "Bearing, Pump; Cyanide Solution Transfer Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "To Capacity", uom: "" }] },
      { plantId: "CN01-DPA01", plantItem: "Bearing, Pump; Cyanide Dosing Pump (Duty)", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "To Capacity", uom: "" }] },
      { plantId: "CN01-DPB01", plantItem: "Bearing, Pump; Cyanide Dosing Pump (Standby)", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "To Capacity", uom: "" }] },
      { plantId: "ADS01-PMP01", plantItem: "Gearbox, Pump; CIP Area Tails Sump Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "2", uom: "g" }] },
      { plantId: "CN01-SMP01", plantItem: "Gearbox, Pump; Cyanide Area Sump Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "2", uom: "g" }] },
      { plantId: "EW01-PMP02", plantItem: "Bearing, Pump; Eluate Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "To Capacity", uom: "" }] },
      { plantId: "CREG01-PMP01", plantItem: "Bearing, Pump; Carbon Transfer Pump", lubePoints: [{ location: "Bearing", type: "EP2", quantity: "To Capacity", uom: "" }] },
      { plantId: "CREG01-SMP01", plantItem: "Bearing Assembly; Regen Area Sump Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "PCW01-PA01", plantItem: "Bearing Assembly; Process Water Pump (Duty)", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "PCW01-PB01", plantItem: "Bearing Assembly; Process Water Pump (Standby)", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "TUFP01-PMP01", plantItem: "Bearing Assembly; Thickener U/F Pump (Duty)", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "TUFP01-PMP02", plantItem: "Bearing Assembly; Thickener U/F Pump (Standby)", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "FP01-PMP01", plantItem: "Bearing Assembly; Filter 1 Feed Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
      { plantId: "FP02-PMP01", plantItem: "Bearing Assembly; Filter 2 Feed Pump", lubePoints: [{ location: "Bearing", type: "VG 100", quantity: "To Capacity", uom: "" }] },
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
        plantId: "ADS01-CRN01",
        plantItem: "Gearbox, Hoist, Trolly; CIP Area Gantry Crane",
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
        plantId: "THK01",
        plantItem: "Powerpack, Rake Lift, hydraulic; Tails Thickener",
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
      { plantId: "COMP01-HPAC01", plantItem: "Oil Reservoir; HP Air Compressor 1", lubePoints: [{ location: "Reservoir", type: "Roto-Xtend Duty Fluid", quantity: "14.7", uom: "l" }] },
      { plantId: "COMP01-HPAC02", plantItem: "Oil Reservoir; HP Air Compressor 2", lubePoints: [{ location: "Reservoir", type: "Roto-Xtend Duty Fluid", quantity: "14.7", uom: "l" }] },
      { plantId: "FPAR01-CMP02", plantItem: "Oil Reservoir; Filter Area HP Air Compressor", lubePoints: [{ location: "Reservoir", type: "Roto-Xtend Duty Fluid", quantity: "14.7", uom: "l" }] },
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
        plantId: "MLA01-SILO01-RVL01",
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
        plantId: "CN01-MR01",
        plantItem: "Gearbox, Hoist, Trolly; Cyanide Monorail",
        lubePoints: [
          { location: "Gearbox", type: "VG150", quantity: "To Capacity", uom: "" },
          { location: "Hoist", type: "EP2", quantity: "To Capacity", uom: "" },
          { location: "Bearing", type: "EP Grease", quantity: "To Capacity", uom: "" },
        ],
      },
      {
        plantId: "EW01-MNR01",
        plantItem: "Gearbox, Hoist, Trolly; Electrowinning Monorail",
        lubePoints: [
          { location: "Gearbox", type: "VG150", quantity: "To Capacity", uom: "" },
          { location: "Hoist", type: "EP2", quantity: "To Capacity", uom: "" },
          { location: "Bearing", type: "EP Grease", quantity: "To Capacity", uom: "" },
        ],
      },
      {
        plantId: "THKA01-MRL01",
        plantItem: "Gearbox, Hoist, Trolly; Thickener Monorail",
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
