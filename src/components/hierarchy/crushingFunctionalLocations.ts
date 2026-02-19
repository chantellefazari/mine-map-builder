// ============================================================
// CRU – Crushing Plant Functional Locations
// Format: TCMG-CRU-[AREA]-[EQUIPMENT]
// FLs stop at SYSTEM/EQUIPMENT level
// Governance: DO NOT mix with Processing Plant FLs
// ============================================================

export interface CRUFunctionalLocation {
  code: string;
  area: string;
  areaCode: string;
  subArea: string;
  systemName: string;
}

export const cruFunctionalLocations: CRUFunctionalLocation[] = [
  // ── CRU-ROM – ROM & Primary Feed ────────────────────────────
  { code: "TCMG-CRU-ROM-ROMWALL", areaCode: "ROM", area: "ROM & Primary Feed", subArea: "ROM & Primary Feed", systemName: "ROM Wall – Steel Structure" },
  { code: "TCMG-CRU-ROM-FDR01",  areaCode: "ROM", area: "ROM & Primary Feed", subArea: "ROM & Primary Feed", systemName: "Primary Feeder (FDR01)" },

  // ── CRU-PRI – Primary Crushing ──────────────────────────────
  { code: "TCMG-CRU-PRI-CR01",   areaCode: "PRI", area: "Primary Crushing", subArea: "Primary Crushing", systemName: "CR01 – Jaw Crusher JM120" },
  { code: "TCMG-CRU-PRI-CV01",   areaCode: "PRI", area: "Primary Crushing", subArea: "Primary Crushing", systemName: "CV01 – Forward Conveyor" },

  // ── CRU-SCR – Screening Section ─────────────────────────────
  { code: "TCMG-CRU-SCR-FDB01",  areaCode: "SCR", area: "Screening Section", subArea: "Screening Section", systemName: "Screen Feed Bin 15m³ (FDB01)" },
  { code: "TCMG-CRU-SCR-SC01",   areaCode: "SCR", area: "Screening Section", subArea: "Screening Section", systemName: "SC01 – Vibrating Screen BWC208 20x8" },
  { code: "TCMG-CRU-SCR-CV04",   areaCode: "SCR", area: "Screening Section", subArea: "Screening Section", systemName: "CV04 – Screen Feed Conveyor 1000mm x 24m" },

  // ── CRU-SEC – Secondary Crushing ────────────────────────────
  { code: "TCMG-CRU-SEC-CFB01",  areaCode: "SEC", area: "Secondary Crushing", subArea: "Secondary Crushing", systemName: "Cone Feed Bin 30m³ (CFB01)" },
  { code: "TCMG-CRU-SEC-CR02",   areaCode: "SEC", area: "Secondary Crushing", subArea: "Secondary Crushing", systemName: "CR02 – Cone Crusher CS400" },
  { code: "TCMG-CRU-SEC-CR03",   areaCode: "SEC", area: "Secondary Crushing", subArea: "Secondary Crushing", systemName: "CR03 – Cone Crusher CS3" },

  // ── CRU-STK – Conveying & Stockpiling ───────────────────────
  { code: "TCMG-CRU-STK-CV02",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV02 – Jaw & Cone Discharge Conveyor 1200mm x 30m" },
  { code: "TCMG-CRU-STK-CV03",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV03 – Feed Bin Conveyor 1200mm x 24m" },
  { code: "TCMG-CRU-STK-CV05",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV05 – Top Deck Discharge Conveyor 1000mm x 24m" },
  { code: "TCMG-CRU-STK-CV06",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV06 – Oversize Transfer Conveyor 1000mm x 21m" },
  { code: "TCMG-CRU-STK-CV07",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV07 – Cone Feed Conveyor 1000mm x 24m" },
  { code: "TCMG-CRU-STK-CV08",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV08 – 2nd Deck Discharge Conveyor 1000mm x 24m" },
  { code: "TCMG-CRU-STK-CV09",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV09 – Oversize Transfer Conveyor 1000mm x 21m" },
  { code: "TCMG-CRU-STK-CV10",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV10 – Lump Oversize Transfer Conveyor 1000mm x 24m" },
  { code: "TCMG-CRU-STK-CV11",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV11 – Bottom Deck Discharge Conveyor 1000mm x 10m" },
  { code: "TCMG-CRU-STK-CV12",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV12 – Radial Stockpile Conveyor 1000mm x 24m" },
  { code: "TCMG-CRU-STK-CV13",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV13 – Fines Collecting Conveyor (Screen U/S)" },
  { code: "TCMG-CRU-STK-CV14",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV14 – Fines Transfer Conveyor (to CV15)" },
  { code: "TCMG-CRU-STK-CV15",   areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV15 – Radial Stockpile Conveyor (Fines) 1000mm x 24m" },
  { code: "TCMG-CRU-STK-FINES01",areaCode: "STK", area: "Conveying & Stockpiling", subArea: "Conveying & Stockpiling", systemName: "CV12 Fines Conveyor – 10m (Under Screen)" },

  // ── CRU-CTL – Controls & MCC ────────────────────────────────
  { code: "TCMG-CRU-CTL-MCC01",  areaCode: "CTL", area: "Controls & MCC", subArea: "Controls & MCC", systemName: "MCC Board – Motor Control Centre" },
  { code: "TCMG-CRU-CTL-PLC01",  areaCode: "CTL", area: "Controls & MCC", subArea: "Controls & MCC", systemName: "PLC – CompactLogix 1769-L33ER" },
  { code: "TCMG-CRU-CTL-HMI01",  areaCode: "CTL", area: "Controls & MCC", subArea: "Controls & MCC", systemName: "HMI – Operator Station (Dual 24\" Monitors)" },
  { code: "TCMG-CRU-CTL-SCADA01",areaCode: "CTL", area: "Controls & MCC", subArea: "Controls & MCC", systemName: "SCADA Server & Workstation (Citect)" },
  { code: "TCMG-CRU-CTL-NETW01", areaCode: "CTL", area: "Controls & MCC", subArea: "Controls & MCC", systemName: "Network – Ethernet Switch & eWON Comms" },
  { code: "TCMG-CRU-CTL-CABIN01",areaCode: "CTL", area: "Controls & MCC", subArea: "Controls & MCC", systemName: "Operators Cabin – 20ft Container & Structure" },
  { code: "TCMG-CRU-CTL-EGRD01", areaCode: "CTL", area: "Controls & MCC", subArea: "Controls & MCC", systemName: "Earth Grid – Earth Mat System" },

  // ── CRU-DUS – Dust Suppression ──────────────────────────────
  { code: "TCMG-CRU-DUS-PMP01",  areaCode: "DUS", area: "Dust Suppression", subArea: "Dust Suppression", systemName: "Dust Suppression Pump (client supplied, interlocked)" },
  { code: "TCMG-CRU-DUS-SPRAY01",areaCode: "DUS", area: "Dust Suppression", subArea: "Dust Suppression", systemName: "Spray System – Poly Pipe & Nozzles (client supplied)" },
];

export const cruAreaColors: Record<string, string> = {
  ROM: "bg-amber-600",
  PRI: "bg-orange-600",
  SCR: "bg-yellow-600",
  SEC: "bg-red-600",
  STK: "bg-stone-600",
  CTL: "bg-blue-700",
  DUS: "bg-teal-600",
};

export const cruAreaLabels: Record<string, string> = {
  ROM: "ROM & Primary Feed",
  PRI: "Primary Crushing",
  SCR: "Screening Section",
  SEC: "Secondary Crushing",
  STK: "Conveying & Stockpile",
  CTL: "Controls & MCC",
  DUS: "Dust Suppression",
};

export const cruFlSummary = {
  totalFunctionalLocations: cruFunctionalLocations.length,
  byArea: {
    ROM: cruFunctionalLocations.filter(fl => fl.areaCode === "ROM").length,
    PRI: cruFunctionalLocations.filter(fl => fl.areaCode === "PRI").length,
    SCR: cruFunctionalLocations.filter(fl => fl.areaCode === "SCR").length,
    SEC: cruFunctionalLocations.filter(fl => fl.areaCode === "SEC").length,
    STK: cruFunctionalLocations.filter(fl => fl.areaCode === "STK").length,
    CTL: cruFunctionalLocations.filter(fl => fl.areaCode === "CTL").length,
    DUS: cruFunctionalLocations.filter(fl => fl.areaCode === "DUS").length,
  }
};
