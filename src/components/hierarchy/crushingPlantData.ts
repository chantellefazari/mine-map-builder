// ============================================================
// CRU – Crushing Plant Asset Hierarchy
// Format: Area → Sub-Area → Parent Asset → Equipment → Component
// Functional Location: TCMG-CRU-[AREA]-[EQUIPMENT]
// Governance: DO NOT merge with Processing Plant (PRO) structure
// ============================================================

import { Equipment } from "./assetData";

export interface CRUParentAsset {
  label: string;
  equipment: Equipment[];
}

export interface CRUSubArea {
  label: string;
  areaCode: string; // e.g. CRU-ROM, CRU-PRI
  parentAssets: CRUParentAsset[];
}

export const crushingPlantAreas: CRUSubArea[] = [

  // ─────────────────────────────────────────────────────────────
  // CRU-ROM – ROM & Primary Feed
  // ─────────────────────────────────────────────────────────────
  {
    label: "ROM & Primary Feed",
    areaCode: "CRU-ROM",
    parentAssets: [
      {
        label: "ROM Wall",
        equipment: [
          { assetNumber: "ROM-WALL01", name: "ROM Wall – Steel Structure (B&W Supply, excl. concrete)" },
        ],
      },
      {
        label: "Primary Feeder",
        equipment: [
          {
            assetNumber: "ROM-FDR01",
            name: "Primary Feeder",
            components: [
              { componentCode: "ROM-FDR01-MTR01", componentType: "MTR", componentName: "Feeder Motor – 45kW (converted via hydraulic drive)", manufacturer: "TBC", voltage: "415V", motorSpeed: "TBC" },
              { componentCode: "ROM-FDR01-HYD01", componentType: "HYD", componentName: "Hydraulic Motor Drive", manufacturer: "Danfoss", model: "Danfoss Valve" },
              { componentCode: "ROM-FDR01-VSD01", componentType: "VSD", componentName: "Feeder Variable Speed Drive", manufacturer: "TBC" },
              { componentCode: "ROM-FDR01-FRM01", componentType: "FRM", componentName: "Feeder Support Frame", manufacturer: "TBC" },
              { componentCode: "ROM-FDR01-HOS01", componentType: "HOS", componentName: "Hydraulic Hose Set (replacement)", manufacturer: "TBC" },
              { componentCode: "ROM-FDR01-SNS01", componentType: "SNS", componentName: "Feeder Sensor (Speed/Level)", manufacturer: "TBC" },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRU-PRI – Primary Crushing
  // ─────────────────────────────────────────────────────────────
  {
    label: "Primary Crushing",
    areaCode: "CRU-PRI",
    parentAssets: [
      {
        label: "CR01 – Jaw Crusher – JM120",
        equipment: [
          {
            assetNumber: "CR01",
            name: "CR01 – Jaw Crusher – JM120 (1280mm x 800mm Single Toggle)",
            components: [
              { componentCode: "CR01-BDY01", componentType: "BDY", componentName: "Crusher Body – Cast Frame", manufacturer: "JM120" },
              { componentCode: "CR01-JAW01", componentType: "JAW", componentName: "Jaw Assembly – Fixed & Moving Plates", manufacturer: "TBC" },
              { componentCode: "CR01-MTR01", componentType: "MTR", componentName: "Crusher Motor – 160kW (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CR01-JKS01", componentType: "JKS", componentName: "Jackshaft Assembly", manufacturer: "TBC" },
              { componentCode: "CR01-GRD01", componentType: "GRD", componentName: "Drive Guard", manufacturer: "TBC" },
              { componentCode: "CR01-MTB01", componentType: "MTB", componentName: "Motor Base (new drive arrangement)", manufacturer: "TBC" },
              { componentCode: "CR01-BRG01", componentType: "BRG", componentName: "Crusher Bearings", manufacturer: "TBC" },
              { componentCode: "CR01-LUB01", componentType: "LUB", componentName: "Crusher Lubrication System", manufacturer: "TBC" },
            ],
          },
          {
            assetNumber: "CR01-MCC01",
            name: "CR01 – MCC Cell / Starter",
          },
        ],
      },
      {
        label: "CV01 – Forward Conveyor",
        equipment: [
          {
            assetNumber: "CV01",
            name: "CV01 – Forward Conveyor",
            components: [
              { componentCode: "CV01-MTR01", componentType: "MTR", componentName: "Head Drive Motor A – 11kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV01-MTR02", componentType: "MTR", componentName: "Head Drive Motor B – 11kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV01-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV01-TRQ01", componentType: "TRQ", componentName: "Torque Arm", manufacturer: "TBC" },
              { componentCode: "CV01-TRQB01", componentType: "TRQ", componentName: "Torque Arm Bracket", manufacturer: "TBC" },
              { componentCode: "CV01-BLT01", componentType: "BLT", componentName: "Conveyor Belt", manufacturer: "TBC" },
              { componentCode: "CV01-HDR01", componentType: "HDR", componentName: "Head Drum – Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV01-TDR01", componentType: "TDR", componentName: "Tail Drum – Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV01-IMP01", componentType: "IMP", componentName: "Impact Bed – CV01 Transition", manufacturer: "TBC" },
              { componentCode: "CV01-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV01-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV01-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV01-MCC01", name: "CV01 – MCC Cell / Starter" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRU-SCR – Screening Section
  // ─────────────────────────────────────────────────────────────
  {
    label: "Screening Section",
    areaCode: "CRU-SCR",
    parentAssets: [
      {
        label: "Screen Feed Bin (15m³)",
        equipment: [
          {
            assetNumber: "SCR-FDB01",
            name: "Screen Feed Bin – 15m³ Fabricated Steel",
            components: [
              { componentCode: "SCR-FDB01-PNL01", componentType: "PNL", componentName: "Side Plates – 6mm Steel with 10mm Hardox 400 Liners", manufacturer: "TBC" },
              { componentCode: "SCR-FDB01-LVL01", componentType: "LVL", componentName: "Vega Level Sensor (interlocked to plant)", manufacturer: "Vega" },
              { componentCode: "SCR-FDB01-STR01", componentType: "STR", componentName: "Bin Structure – Rolled Steel Section (32MPa concrete base)", manufacturer: "TBC" },
              { componentCode: "SCR-FDB01-PLT01", componentType: "PLT", componentName: "Lower Access / Maintenance Platform", manufacturer: "TBC" },
            ],
          },
          {
            assetNumber: "SCR-FDB01-FDR01",
            name: "Screen Feed Bin Feeder – PF1200 Vibrating (x1)",
            components: [
              { componentCode: "SCR-FDB01-FDR01-EXC01", componentType: "EXC", componentName: "Feeder Exciter Unit A – 4kW Out of Balance", manufacturer: "TBC" },
              { componentCode: "SCR-FDB01-FDR01-EXC02", componentType: "EXC", componentName: "Feeder Exciter Unit B – 4kW Out of Balance", manufacturer: "TBC" },
              { componentCode: "SCR-FDB01-FDR01-VSD01", componentType: "VSD", componentName: "Feeder VSD (gang control capable)", manufacturer: "TBC" },
              { componentCode: "SCR-FDB01-FDR01-LNR01", componentType: "LNR", componentName: "Feeder Liners – 10mm BIS 500 (adjustable, 90°)", manufacturer: "TBC" },
              { componentCode: "SCR-FDB01-FDR01-FRM01", componentType: "FRM", componentName: "Feeder Frame – Heavy Duty Rolled Steel", manufacturer: "TBC" },
            ],
          },
        ],
      },
      {
        label: "SC01 – Screen – BWC208 20x8",
        equipment: [
          {
            assetNumber: "SC01",
            name: "SC01 – Horizontal Vibrating Screen – BW BWC208 (20ft x 8ft)",
            components: [
              { componentCode: "SC01-MTR01", componentType: "MTR", componentName: "Screen Drive Motor – 45kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "SC01-DRV01", componentType: "DRV", componentName: "Shaft Drive (coupled to motor)", manufacturer: "TBC" },
              { componentCode: "SC01-DK01", componentType: "DK", componentName: "Top Deck (oversize discharge → CV05)", manufacturer: "TBC" },
              { componentCode: "SC01-DK02", componentType: "DK", componentName: "Second Deck (mid discharge → CV08)", manufacturer: "TBC" },
              { componentCode: "SC01-DK03", componentType: "DK", componentName: "Bottom Deck (undersize discharge → CV11)", manufacturer: "TBC" },
              { componentCode: "SC01-STR01", componentType: "STR", componentName: "Screen Structure / Frame", manufacturer: "TBC" },
              { componentCode: "SC01-PLT01", componentType: "PLT", componentName: "Access Platforms", manufacturer: "TBC" },
              { componentCode: "SC01-CHT01", componentType: "CHT", componentName: "Split Chute Discharge System", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "SC01-MCC01", name: "SC01 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CV04 – Screen Feed Conveyor",
        equipment: [
          {
            assetNumber: "CV04",
            name: "CV04 – Screen Feed Conveyor – 1000mm x 24m",
            components: [
              { componentCode: "CV04-MTR01", componentType: "MTR", componentName: "Drive Motor A – 18.5kW Gear Motor", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV04-MTR02", componentType: "MTR", componentName: "Drive Motor B – 18.5kW Gear Motor", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV04-BLT01", componentType: "BLT", componentName: "Belt – PN200/4 Ply 6+2 Covers 1000mm", manufacturer: "TBC" },
              { componentCode: "CV04-HDR01", componentType: "HDR", componentName: "Head Drum – 376mm Dia. Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV04-TDR01", componentType: "TDR", componentName: "Tail Drum – 376mm Dia. Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV04-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV04-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV04-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV04-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV04-SKT01", componentType: "SKT", componentName: "Skirt Panels & Rock Ledges", manufacturer: "TBC" },
              { componentCode: "CV04-IMP01", componentType: "IMP", componentName: "Impact Bed – 1.5m at Hopper", manufacturer: "TBC" },
              { componentCode: "CV04-CHT01", componentType: "CHT", componentName: "Head Chute – 6mm Dust Cover with Spray Nozzle Holes", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV04-MCC01", name: "CV04 – MCC Cell / Starter" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRU-SEC – Secondary / Tertiary Crushing
  // ─────────────────────────────────────────────────────────────
  {
    label: "Secondary / Tertiary Crushing",
    areaCode: "CRU-SEC",
    parentAssets: [
      {
        label: "Cone Feed Bin (30m³)",
        equipment: [
          {
            assetNumber: "SEC-CFB01",
            name: "Cone Feed Bin – 30m³ Dual Chamber Fabricated Steel",
            components: [
              { componentCode: "SEC-CFB01-PNL01", componentType: "PNL", componentName: "Side Plates – 6mm Steel with 10mm Hardox 400 Liners", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-SEP01", componentType: "SEP", componentName: "Separator Plate (secondary/tertiary feed separation)", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-LVL01", componentType: "LVL", componentName: "Vega Level Sensor", manufacturer: "Vega" },
              { componentCode: "SEC-CFB01-STR01", componentType: "STR", componentName: "Bin Structure – Steel on Concrete Bases (32MPa)", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-PLT01", componentType: "PLT", componentName: "Lower Access Platform", manufacturer: "TBC" },
            ],
          },
          {
            assetNumber: "SEC-CFB01-FDR01",
            name: "Cone Feed Bin Feeder A – PF1200 Vibrating (→ CV07)",
            components: [
              { componentCode: "SEC-CFB01-FDR01-EXC01", componentType: "EXC", componentName: "Exciter Unit A – 4kW", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR01-EXC02", componentType: "EXC", componentName: "Exciter Unit B – 4kW", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR01-VSD01", componentType: "VSD", componentName: "Feeder VSD", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR01-LNR01", componentType: "LNR", componentName: "Feeder Liners – 10mm BIS 500", manufacturer: "TBC" },
            ],
          },
          {
            assetNumber: "SEC-CFB01-FDR02",
            name: "Cone Feed Bin Feeder B – PF1200 Vibrating (→ CV10)",
            components: [
              { componentCode: "SEC-CFB01-FDR02-EXC01", componentType: "EXC", componentName: "Exciter Unit A – 4kW", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR02-EXC02", componentType: "EXC", componentName: "Exciter Unit B – 4kW", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR02-VSD01", componentType: "VSD", componentName: "Feeder VSD", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR02-LNR01", componentType: "LNR", componentName: "Feeder Liners – 10mm BIS 500", manufacturer: "TBC" },
            ],
          },
        ],
      },
      {
        label: "CR02 – Cone Crusher – CS400",
        equipment: [
          {
            assetNumber: "CR02",
            name: "CR02 – Cone Crusher – CS400 (up to 250 tph, 200mm, 6-50mm setting)",
            components: [
              { componentCode: "CR02-BDY01", componentType: "BDY", componentName: "Crusher Body – Cast", manufacturer: "CS400" },
              { componentCode: "CR02-MTR01", componentType: "MTR", componentName: "Crusher Motor – 220kW", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CR02-DRV01", componentType: "DRV", componentName: "Vee Belt Drive & Pulleys", manufacturer: "TBC" },
              { componentCode: "CR02-BWL01", componentType: "BWL", componentName: "Bowl Liner – Self-tightening helix & locks", manufacturer: "TBC" },
              { componentCode: "CR02-MNT01", componentType: "MNT", componentName: "Mantle – Self-tightening", manufacturer: "TBC" },
              { componentCode: "CR02-TRC01", componentType: "TRC", componentName: "Tramp Release Cylinders – Dual Acting Hydraulic", manufacturer: "TBC" },
              { componentCode: "CR02-HYD01", componentType: "HYD", componentName: "Hydraulic Tank – 125L with 125 micron suction filter", manufacturer: "TBC" },
              { componentCode: "CR02-HYD02", componentType: "HYD", componentName: "Hydraulic Pump – 7.5kW flange mounted", manufacturer: "TBC" },
              { componentCode: "CR02-LUB01", componentType: "LUB", componentName: "Lube Tank – 400L with 50 micron filter", manufacturer: "TBC" },
              { componentCode: "CR02-LUB02", componentType: "LUB", componentName: "Lube Pump – 7.5kW flange mounted", manufacturer: "TBC" },
              { componentCode: "CR02-LUB03", componentType: "LUB", componentName: "Lube Cooler – 2.2kW (high temperature environments)", manufacturer: "TBC" },
              { componentCode: "CR02-LUB04", componentType: "LUB", componentName: "Lube Temp Sensors (x2)", manufacturer: "TBC" },
              { componentCode: "CR02-LUB05", componentType: "LUB", componentName: "Lube Low Level Sensor", manufacturer: "TBC" },
              { componentCode: "CR02-BRG01", componentType: "BRG", componentName: "Bronze Bushings – throughout", manufacturer: "TBC" },
              { componentCode: "CR02-WRP01", componentType: "WRP", componentName: "Wear Protection Set (head ball, mainframe liners, countershaft guards, dead-bed hopper)", manufacturer: "TBC" },
              { componentCode: "CR02-PLT01", componentType: "PLT", componentName: "Access Platforms (crusher & feeder)", manufacturer: "TBC" },
              { componentCode: "CR02-HOP01", componentType: "HOP", componentName: "Feeder Hopper – Mild Steel with Hardox Liners", manufacturer: "TBC" },
              { componentCode: "CR02-LUB-ROOM01", componentType: "ENC", componentName: "Lubrication Room – Half Sea Container (x2)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CR02-MCC01", name: "CR02 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CR03 – Cone Crusher – CS3",
        equipment: [
          {
            assetNumber: "CR03",
            name: "CR03 – Cone Crusher – CS3 (up to 250 tph, 200mm, 6-50mm setting)",
            components: [
              { componentCode: "CR03-BDY01", componentType: "BDY", componentName: "Crusher Body – Cast", manufacturer: "CS3" },
              { componentCode: "CR03-MTR01", componentType: "MTR", componentName: "Crusher Motor – 220kW", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CR03-DRV01", componentType: "DRV", componentName: "Vee Belt Drive & Pulleys", manufacturer: "TBC" },
              { componentCode: "CR03-BWL01", componentType: "BWL", componentName: "Bowl Liner – Self-tightening helix & locks", manufacturer: "TBC" },
              { componentCode: "CR03-MNT01", componentType: "MNT", componentName: "Mantle – Self-tightening", manufacturer: "TBC" },
              { componentCode: "CR03-TRC01", componentType: "TRC", componentName: "Tramp Release Cylinders – Dual Acting Hydraulic", manufacturer: "TBC" },
              { componentCode: "CR03-HYD01", componentType: "HYD", componentName: "Hydraulic Tank – 125L with 125 micron suction filter", manufacturer: "TBC" },
              { componentCode: "CR03-HYD02", componentType: "HYD", componentName: "Hydraulic Pump – 7.5kW flange mounted", manufacturer: "TBC" },
              { componentCode: "CR03-LUB01", componentType: "LUB", componentName: "Lube Tank – 400L with 50 micron filter", manufacturer: "TBC" },
              { componentCode: "CR03-LUB02", componentType: "LUB", componentName: "Lube Pump – 7.5kW flange mounted", manufacturer: "TBC" },
              { componentCode: "CR03-LUB03", componentType: "LUB", componentName: "Lube Cooler – 2.2kW", manufacturer: "TBC" },
              { componentCode: "CR03-LUB04", componentType: "LUB", componentName: "Lube Temp Sensors (x2)", manufacturer: "TBC" },
              { componentCode: "CR03-LUB05", componentType: "LUB", componentName: "Lube Low Level Sensor", manufacturer: "TBC" },
              { componentCode: "CR03-BRG01", componentType: "BRG", componentName: "Bronze Bushings – throughout", manufacturer: "TBC" },
              { componentCode: "CR03-WRP01", componentType: "WRP", componentName: "Wear Protection Set", manufacturer: "TBC" },
              { componentCode: "CR03-PLT01", componentType: "PLT", componentName: "Access Platforms", manufacturer: "TBC" },
              { componentCode: "CR03-HOP01", componentType: "HOP", componentName: "Feeder Hopper – Mild Steel with Hardox Liners", manufacturer: "TBC" },
              { componentCode: "CR03-LUB-ROOM01", componentType: "ENC", componentName: "Lubrication Room – Half Sea Container (x2)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CR03-MCC01", name: "CR03 – MCC Cell / Starter" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRU-STK – Conveying & Stockpile
  // ─────────────────────────────────────────────────────────────
  {
    label: "Conveying & Stockpiling",
    areaCode: "CRU-STK",
    parentAssets: [
      // CV02 – Jaw & Cone Discharge Conveyor (1200mm x 30m)
      {
        label: "CV02 – Jaw & Cone Discharge Conveyor",
        equipment: [
          {
            assetNumber: "CV02",
            name: "CV02 – Jaw & Cone Discharge Conveyor – 1200mm x 30m (ST2412)",
            components: [
              { componentCode: "CV02-MTR01", componentType: "MTR", componentName: "Drive Motor – 30kW Gear Motor", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV02-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV02-BLT01", componentType: "BLT", componentName: "Belt – PN200/4 Ply 6+2 Covers 1200mm", manufacturer: "TBC" },
              { componentCode: "CV02-HDR01", componentType: "HDR", componentName: "Drive Drum – 376mm Dia. Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV02-TDR01", componentType: "TDR", componentName: "Tail Drum – 376mm Dia. Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV02-BRG01", componentType: "BRG", componentName: "Sealed Self-aligning Spherical Roller Bearings", manufacturer: "TBC" },
              { componentCode: "CV02-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV02-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV02-SKT01", componentType: "SKT", componentName: "Skirt Rubbers – 150mm x 15mm 50 Shore & Rock Ledges", manufacturer: "TBC" },
              { componentCode: "CV02-IMP01", componentType: "IMP", componentName: "Impact Bed – CV01 Transition & 1.5m Impact Idlers (Cone discharge)", manufacturer: "TBC" },
              { componentCode: "CV02-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV02-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV02-BWS01", componentType: "BWS", componentName: "Belt Weigher / Weigh Scale (display in control room)", manufacturer: "TBC" },
              { componentCode: "CV02-HOP01", componentType: "HOP", componentName: "Heavy Duty Hopper with Jaw Liner & Rock Ledges", manufacturer: "TBC" },
              { componentCode: "CV02-MDE01", componentType: "MDE", componentName: "Metal Detector with Dropper (before cones)", manufacturer: "TBC" },
              { componentCode: "CV02-PLT01", componentType: "PLT", componentName: "Access Stairs & Platforms (metal detector removal)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV02-MCC01", name: "CV02 – MCC Cell / Starter" },
        ],
      },
      // CV03 – Feed Bin Conveyor (1200mm x 24m)
      {
        label: "CV03 – Feed Bin Conveyor",
        equipment: [
          {
            assetNumber: "CV03",
            name: "CV03 – Feed Bin Conveyor – 1200mm x 24m (ST2412)",
            components: [
              { componentCode: "CV03-MTR01", componentType: "MTR", componentName: "Drive Motor – Gear Motor", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV03-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV03-BLT01", componentType: "BLT", componentName: "Belt – PN200/4 Ply 6+2 Covers 1200mm", manufacturer: "TBC" },
              { componentCode: "CV03-HDR01", componentType: "HDR", componentName: "Drive Drum – 376mm Dia. Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV03-TDR01", componentType: "TDR", componentName: "Tail Drum – 376mm Dia. Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV03-BRG01", componentType: "BRG", componentName: "Sealed Self-aligning Spherical Roller Bearings", manufacturer: "TBC" },
              { componentCode: "CV03-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV03-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV03-SKT01", componentType: "SKT", componentName: "Skirt Rubbers – 150mm x 15mm 50 Shore & Rock Ledges", manufacturer: "TBC" },
              { componentCode: "CV03-IMP01", componentType: "IMP", componentName: "Impact Bed – 1.5m at Hopper", manufacturer: "TBC" },
              { componentCode: "CV03-HOP01", componentType: "HOP", componentName: "Heavy Duty Hopper with Rock Ledges", manufacturer: "TBC" },
              { componentCode: "CV03-CHT01", componentType: "CHT", componentName: "Head Chute – 6mm Dust Cover with Spray Nozzle Holes", manufacturer: "TBC" },
              { componentCode: "CV03-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV03-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV03-MCC01", name: "CV03 – MCC Cell / Starter" },
        ],
      },
      // CV05 – Top Deck Discharge Conveyor (1000mm x 24m)
      {
        label: "CV05 – Top Deck Discharge Conveyor",
        equipment: [
          {
            assetNumber: "CV05",
            name: "CV05 – Top Deck Discharge Conveyor – 1000mm x 24m",
            components: [
              { componentCode: "CV05-MTR01", componentType: "MTR", componentName: "Drive Motor – 7.5kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV05-BLT01", componentType: "BLT", componentName: "Belt – 1000mm 3-Ply PN150 Mining Grade", manufacturer: "TBC" },
              { componentCode: "CV05-HDR01", componentType: "HDR", componentName: "Head Drum – Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV05-TDR01", componentType: "TDR", componentName: "Tail Drum – Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV05-IDL01", componentType: "IDL", componentName: "Idlers – Troughed on Steel Section Frame", manufacturer: "TBC" },
              { componentCode: "CV05-IDL02", componentType: "IDL", componentName: "Impact Rollers (at transfer points)", manufacturer: "TBC" },
              { componentCode: "CV05-GDE01", componentType: "GDE", componentName: "Guide Rollers", manufacturer: "TBC" },
              { componentCode: "CV05-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV05-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV05-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV05-MCC01", name: "CV05 – MCC Cell / Starter" },
        ],
      },
      // CV06 – Oversize Transfer Conveyor (1000mm x 24m→21m)
      {
        label: "CV06 – Oversize Transfer Conveyor",
        equipment: [
          {
            assetNumber: "CV06",
            name: "CV06 – Oversize Transfer Conveyor – 1000mm x 21m (modified from 24m)",
            components: [
              { componentCode: "CV06-MTR01", componentType: "MTR", componentName: "Drive Motor – 15kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV06-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV06-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV06-TRQ01", componentType: "TRQ", componentName: "Torque Arm & Bracket", manufacturer: "TBC" },
              { componentCode: "CV06-RAD01", componentType: "MTR", componentName: "Radial Drive Motor – 1.5kW (new)", manufacturer: "TBC" },
              { componentCode: "CV06-CHT01", componentType: "CHT", componentName: "Head Chute – 6mm Dust Cover with Spray Nozzle Holes", manufacturer: "TBC" },
              { componentCode: "CV06-BLT01", componentType: "BLT", componentName: "Belt", manufacturer: "TBC" },
              { componentCode: "CV06-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV06-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV06-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV06-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV06-MCC01", name: "CV06 – MCC Cell / Starter" },
        ],
      },
      // CV07 – Oversize Transfer Conveyor (1000mm x 24m → CR02)
      {
        label: "CV07 – Oversize Transfer Conveyor (→ CR02)",
        equipment: [
          {
            assetNumber: "CV07",
            name: "CV07 – Oversize Transfer Conveyor – 1000mm x 24m (→ CR02)",
            components: [
              { componentCode: "CV07-MTR01", componentType: "MTR", componentName: "Drive Motor – 15kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV07-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV07-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV07-TRQ01", componentType: "TRQ", componentName: "Torque Arm & Bracket", manufacturer: "TBC" },
              { componentCode: "CV07-BLT01", componentType: "BLT", componentName: "Belt", manufacturer: "TBC" },
              { componentCode: "CV07-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV07-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV07-MDE01", componentType: "MDE", componentName: "Metal Detector (prevents uncrushable material entering crusher)", manufacturer: "TBC" },
              { componentCode: "CV07-PLT01", componentType: "PLT", componentName: "Fixed & Portable Access Platform (metal detector removal)", manufacturer: "TBC" },
              { componentCode: "CV07-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV07-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV07-MCC01", name: "CV07 – MCC Cell / Starter" },
        ],
      },
      // CV08 – Second Deck Discharge Conveyor (1000mm x 24m)
      {
        label: "CV08 – Second Deck Discharge Conveyor",
        equipment: [
          {
            assetNumber: "CV08",
            name: "CV08 – Second Deck Discharge Conveyor – 1000mm x 24m",
            components: [
              { componentCode: "CV08-MTR01", componentType: "MTR", componentName: "Drive Motor – 7.5kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV08-BLT01", componentType: "BLT", componentName: "Belt – 1000mm 3-Ply PN150 Mining Grade", manufacturer: "TBC" },
              { componentCode: "CV08-HDR01", componentType: "HDR", componentName: "Head Drum – Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV08-TDR01", componentType: "TDR", componentName: "Tail Drum – Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV08-IDL01", componentType: "IDL", componentName: "Idlers – Troughed on Steel Section Frame", manufacturer: "TBC" },
              { componentCode: "CV08-IDL02", componentType: "IDL", componentName: "Impact Rollers (at transfer points)", manufacturer: "TBC" },
              { componentCode: "CV08-GDE01", componentType: "GDE", componentName: "Guide Rollers", manufacturer: "TBC" },
              { componentCode: "CV08-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV08-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV08-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV08-MCC01", name: "CV08 – MCC Cell / Starter" },
        ],
      },
      // CV09 – Oversize Transfer Conveyor (1000mm 18m→21m extended)
      {
        label: "CV09 – Oversize Transfer Conveyor (extended)",
        equipment: [
          {
            assetNumber: "CV09",
            name: "CV09 – Oversize Transfer Conveyor – 1000mm x 21m (extended from 18m, fed from CV08)",
            components: [
              { componentCode: "CV09-MTR01", componentType: "MTR", componentName: "Drive Motor – 15kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV09-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV09-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV09-TRQ01", componentType: "TRQ", componentName: "Torque Arm & Bracket", manufacturer: "TBC" },
              { componentCode: "CV09-BLT01", componentType: "BLT", componentName: "Belt – 1000mm 3-Ply PN150 (extended)", manufacturer: "TBC" },
              { componentCode: "CV09-CHT01", componentType: "CHT", componentName: "Head Chute – 6mm Dust Cover with Spray Nozzle Holes", manufacturer: "TBC" },
              { componentCode: "CV09-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV09-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV09-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV09-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV09-MCC01", name: "CV09 – MCC Cell / Starter" },
        ],
      },
      // CV10 – Lump Oversize Transfer Conveyor (1000mm x 24m → CR03)
      {
        label: "CV10 – Lump Oversize Transfer Conveyor (→ CR03)",
        equipment: [
          {
            assetNumber: "CV10",
            name: "CV10 – Lump Oversize Transfer Conveyor – 1000mm x 24m (→ CR03)",
            components: [
              { componentCode: "CV10-MTR01", componentType: "MTR", componentName: "Drive Motor – 15kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV10-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV10-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV10-TRQ01", componentType: "TRQ", componentName: "Torque Arm & Bracket", manufacturer: "TBC" },
              { componentCode: "CV10-BLT01", componentType: "BLT", componentName: "Belt", manufacturer: "TBC" },
              { componentCode: "CV10-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV10-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV10-MDE01", componentType: "MDE", componentName: "Metal Detector (prevents uncrushable material entering crusher)", manufacturer: "TBC" },
              { componentCode: "CV10-PLT01", componentType: "PLT", componentName: "Fixed & Portable Access Platform (metal detector removal)", manufacturer: "TBC" },
              { componentCode: "CV10-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV10-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV10-MCC01", name: "CV10 – MCC Cell / Starter" },
        ],
      },
      // CV11 – Bottom Deck Discharge Conveyor (1000mm x 10m)
      {
        label: "CV11 – Bottom Deck Discharge Conveyor",
        equipment: [
          {
            assetNumber: "CV11",
            name: "CV11 – Bottom Deck Discharge Conveyor – 1000mm x 10m",
            components: [
              { componentCode: "CV11-MTR01", componentType: "MTR", componentName: "Drive Motor – 7.5kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV11-BLT01", componentType: "BLT", componentName: "Belt – 1000mm 3-Ply PN150 Mining Grade", manufacturer: "TBC" },
              { componentCode: "CV11-HDR01", componentType: "HDR", componentName: "Head Drum – Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV11-TDR01", componentType: "TDR", componentName: "Tail Drum – Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV11-IDL01", componentType: "IDL", componentName: "Idlers – Troughed on Steel Section Frame", manufacturer: "TBC" },
              { componentCode: "CV11-IDL02", componentType: "IDL", componentName: "Impact Rollers (at transfer points)", manufacturer: "TBC" },
              { componentCode: "CV11-GDE01", componentType: "GDE", componentName: "Guide Rollers", manufacturer: "TBC" },
              { componentCode: "CV11-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV11-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV11-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV11-MCC01", name: "CV11 – MCC Cell / Starter" },
        ],
      },
      // CV12 – Fines Collecting Conveyor (under screen / radial stacking)
      {
        label: "CV12 – Fines / Radial Stacking Conveyor",
        equipment: [
          {
            assetNumber: "CV12",
            name: "CV12 – Fines Collecting / Radial Stacking Conveyor – 1000mm x 24m (ST2410)",
            components: [
              { componentCode: "CV12-MTR01", componentType: "MTR", componentName: "Drive Motor – 15kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV12-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV12-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV12-TRQ01", componentType: "TRQ", componentName: "Torque Arm & Bracket", manufacturer: "TBC" },
              { componentCode: "CV12-RAD01", componentType: "MTR", componentName: "Radial Drive Motor – 1.5kW (converted electric)", manufacturer: "TBC" },
              { componentCode: "CV12-BLT01", componentType: "BLT", componentName: "Belt", manufacturer: "TBC" },
              { componentCode: "CV12-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV12-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV12-BWS01", componentType: "BWS", componentName: "Belt Weigher / Weigh Scale", manufacturer: "TBC" },
              { componentCode: "CV12-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV12-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV12-MCC01", name: "CV12 – MCC Cell / Starter" },
        ],
      },
      // CV15 – Radial Stacking Conveyor (1000mm x 24m)
      {
        label: "CV15 – Radial Stacking Conveyor",
        equipment: [
          {
            assetNumber: "CV15",
            name: "CV15 – Radial Stacking Conveyor – 1000mm x 24m (ST2410, fed from CV14)",
            components: [
              { componentCode: "CV15-MTR01", componentType: "MTR", componentName: "Drive Motor – 18.5kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV15-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV15-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV15-TRQ01", componentType: "TRQ", componentName: "Torque Arm & Bracket", manufacturer: "TBC" },
              { componentCode: "CV15-RAD01", componentType: "MTR", componentName: "Radial Drive Motor – 1.5kW (converted electric)", manufacturer: "TBC" },
              { componentCode: "CV15-BLT01", componentType: "BLT", componentName: "Belt", manufacturer: "TBC" },
              { componentCode: "CV15-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV15-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV15-BWS01", componentType: "BWS", componentName: "Belt Weigher / Weigh Scale", manufacturer: "TBC" },
              { componentCode: "CV15-CHT01", componentType: "CHT", componentName: "Head Chute – 6mm Dust Hood with Spray Nozzle Holes", manufacturer: "TBC" },
              { componentCode: "CV15-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV15-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV15-MCC01", name: "CV15 – MCC Cell / Starter" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRU-CTL – Controls & MCC
  // ─────────────────────────────────────────────────────────────
  {
    label: "Controls & MCC",
    areaCode: "CRU-CTL",
    parentAssets: [
      {
        label: "MCC01 – Main Control Centre",
        equipment: [
          {
            assetNumber: "CTL-MCC01",
            name: "MCC01 – Motor Control Centre",
            components: [
              { componentCode: "CTL-MCC01-STR01", componentType: "STR", componentName: "Motor Starters (all drives)", manufacturer: "TBC" },
              { componentCode: "CTL-MCC01-ISO01", componentType: "ISO", componentName: "Incoming Isolator Switch with Lock-out", manufacturer: "TBC" },
              { componentCode: "CTL-MCC01-TRF01", componentType: "TRF", componentName: "Control Circuit Transformer – 24V", manufacturer: "TBC" },
              { componentCode: "CTL-MCC01-CBL01", componentType: "CBL", componentName: "PVC Control Cabling (numbered)", manufacturer: "TBC" },
              { componentCode: "CTL-MCC01-DCT01", componentType: "DCT", componentName: "PVC Cable Ducting & Galvanised Heavy Duty Cable Ladder", manufacturer: "TBC" },
              { componentCode: "CTL-MCC01-OUT01", componentType: "OUT", componentName: "Auxiliary Power Outlets (around plant)", manufacturer: "TBC" },
            ],
          },
          {
            assetNumber: "CTL-PLC01",
            name: "PLC – CompactLogix 1769-L33ER Controller",
            components: [
              { componentCode: "CTL-PLC01-ETH01", componentType: "NET", componentName: "Ethernet Switch", manufacturer: "TBC" },
              { componentCode: "CTL-PLC01-SFP01", componentType: "NET", componentName: "SFP Transceivers", manufacturer: "TBC" },
              { componentCode: "CTL-PLC01-EWN01", componentType: "NET", componentName: "eWON Remote Access Device", manufacturer: "eWON" },
            ],
          },
          {
            assetNumber: "CTL-SCADA01",
            name: "SCADA Server & Workstation (Citect)",
            components: [
              { componentCode: "CTL-SCADA01-SRV01", componentType: "SRV", componentName: "SCADA Server", manufacturer: "TBC" },
              { componentCode: "CTL-SCADA01-WKS01", componentType: "WKS", componentName: "Workstation PC with Citect Licences", manufacturer: "TBC" },
            ],
          },
          {
            assetNumber: "CTL-HMI01",
            name: "Operator HMI – Dual 24\" Monitors",
            components: [
              { componentCode: "CTL-HMI01-MON01", componentType: "MON", componentName: "Monitor A – 24\"", manufacturer: "TBC" },
              { componentCode: "CTL-HMI01-MON02", componentType: "MON", componentName: "Monitor B – 24\"", manufacturer: "TBC" },
            ],
          },
          {
            assetNumber: "CTL-CAB01",
            name: "Operators Control Cabin – 20ft Container (BW Plant Standard)",
            components: [
              { componentCode: "CTL-CAB01-EMS01", componentType: "EMS", componentName: "Emergency Stop Pushbutton – IP55, Clearly Marked", manufacturer: "TBC" },
              { componentCode: "CTL-CAB01-STR01", componentType: "STR", componentName: "Support Stand Structure with Platforms & Access Ladder", manufacturer: "TBC" },
            ],
          },
          {
            assetNumber: "CTL-EGD01",
            name: "Earth Grid – Earth Mat System",
            components: [
              { componentCode: "CTL-EGD01-EMT01", componentType: "EMT", componentName: "Earth Mat (covering 1000kVA generator & MCC building)", manufacturer: "TBC" },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRU-DUS – Dust Suppression
  // ─────────────────────────────────────────────────────────────
  {
    label: "Dust Suppression",
    areaCode: "CRU-DUS",
    parentAssets: [
      {
        label: "Dust Suppression System",
        equipment: [
          {
            assetNumber: "DUS-PMP01",
            name: "Dust Suppression Pump (client supplied, interlocked to primary feeder)",
            components: [
              { componentCode: "DUS-PMP01-ILK01", componentType: "ILK", componentName: "Interlock – Primary Feeder Shutdown (no flow when plant stopped)", manufacturer: "TBC" },
            ],
          },
          {
            assetNumber: "DUS-SPR01",
            name: "Spray Suppression System",
            components: [
              { componentCode: "DUS-SPR01-PPE01", componentType: "PIP", componentName: "Poly Pipe Supply (client supplied)", manufacturer: "TBC" },
              { componentCode: "DUS-SPR01-NOZ01", componentType: "NOZ", componentName: "Spray Nozzles", manufacturer: "TBC" },
              { componentCode: "DUS-SPR01-BRK01", componentType: "BRK", componentName: "75mm SHS Brackets (pipe supports on conveyor sides)", manufacturer: "TBC" },
            ],
          },
        ],
      },
    ],
  },
];
