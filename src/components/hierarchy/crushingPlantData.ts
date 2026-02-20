// ============================================================
// CRU – Crushing Plant Asset Hierarchy
// Format: Area → Parent Asset → Equipment → Component
// Functional Location: TCMG-CRU-[AREA]-[EQUIPMENT]
// Governance: DO NOT merge with Processing Plant (PRO) structure
//
// MATERIAL FLOW (Bottom Right → Across → Up → Across → Down → Left):
//   ROM Bin
//     → Primary Vibrating Feeder
//     → Overband Magnet (metal removal)
//     → CR01 Jaw Crusher (Primary)
//     → CV01 Forward Conveyor
//     → Ground Feed Bin
//     → CV04 Screen Feed Conveyor
//     → SC01 Vibrating Screen
//         ├─ CV05 Top Deck → CV06 Oversize Transfer → Cone Feed Bin
//         ├─ CV08 Second Deck → CV09 Oversize Transfer → Cone Feed Bin
//         └─ CV11 Bottom Deck (Fines) → CV12 / CV15 Radial Stackers
//     → Cone Feed Bin
//         ├─ Vibrating Feeder A → CV07 → CR02 Secondary Cone
//         └─ Vibrating Feeder B → CV10 → CR03 Tertiary Cone
//     → CR02 / CR03 discharge → CV02 → back to screen (closed circuit)
// ============================================================

import { Equipment } from "./assetData";

export interface CRUParentAsset {
  label: string;
  equipment: Equipment[];
}

export interface CRUSubArea {
  label: string;
  areaCode: string;
  parentAssets: CRUParentAsset[];
}

export const crushingPlantAreas: CRUSubArea[] = [

  // ─────────────────────────────────────────────────────────────
  // CRU-ROM – ROM Bin & Primary Feed
  // FLOW STEP 1: Material enters via ROM Bin → feeder → magnet → primary jaw
  // ─────────────────────────────────────────────────────────────
  {
    label: "ROM & Primary Feed",
    areaCode: "CRU-ROM",
    parentAssets: [
      {
        label: "ROM Bin",
        equipment: [
          {
            assetNumber: "ROM-BIN01",
            name: "ROM Bin – Steel Structure (B&W Supply, excl. concrete)",
            components: [
              { componentCode: "ROM-BIN01-PNL01", componentType: "PNL", componentName: "Side Plates – 6mm Steel with Hardox 400 Liners", manufacturer: "TBC" },
              { componentCode: "ROM-BIN01-LVL01", componentType: "LVL", componentName: "Vega Level Sensor (bin level monitoring)", manufacturer: "Vega" },
              { componentCode: "ROM-BIN01-STR01", componentType: "STR", componentName: "Bin Structure – Rolled Steel Section", manufacturer: "TBC" },
              { componentCode: "ROM-BIN01-PLT01", componentType: "PLT", componentName: "Access Platform & Ladder", manufacturer: "TBC" },
            ],
          },
        ],
      },
      {
        label: "Primary Vibrating Feeder",
        equipment: [
          {
            assetNumber: "ROM-FDR01",
            name: "ROM-FDR01 – Primary Vibrating Feeder",
            components: [
              { componentCode: "ROM-FDR01-MTR01", componentType: "MTR", componentName: "Feeder Motor – 45kW (via hydraulic drive)", manufacturer: "TBC", voltage: "415V", motorSpeed: "TBC" },
              { componentCode: "ROM-FDR01-HYD01", componentType: "HYD", componentName: "Hydraulic Motor Drive", manufacturer: "Danfoss", model: "Danfoss Valve" },
              { componentCode: "ROM-FDR01-VSD01", componentType: "VSD", componentName: "Feeder Variable Speed Drive", manufacturer: "TBC" },
              { componentCode: "ROM-FDR01-EXC01", componentType: "EXC", componentName: "Exciter Unit A – Out of Balance", manufacturer: "TBC" },
              { componentCode: "ROM-FDR01-EXC02", componentType: "EXC", componentName: "Exciter Unit B – Out of Balance", manufacturer: "TBC" },
              { componentCode: "ROM-FDR01-FRM01", componentType: "FRM", componentName: "Feeder Support Frame", manufacturer: "TBC" },
              { componentCode: "ROM-FDR01-LNR01", componentType: "LNR", componentName: "Feeder Liners – 10mm BIS 500", manufacturer: "TBC" },
              { componentCode: "ROM-FDR01-HOS01", componentType: "HOS", componentName: "Hydraulic Hose Set (replacement)", manufacturer: "TBC" },
              { componentCode: "ROM-FDR01-SNS01", componentType: "SNS", componentName: "Speed / Level Sensor", manufacturer: "TBC" },
              { componentCode: "ROM-FDR01-GRD01", componentType: "GRD", componentName: "Drive Guard", manufacturer: "TBC" },
              { componentCode: "ROM-FDR01-PLT01", componentType: "PLT", componentName: "Access Platform", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "ROM-FDR01-MCC01", name: "ROM-FDR01 – MCC Cell / Starter" },
        ],
      },
      {
        label: "Overband Magnet",
        equipment: [
          {
            assetNumber: "ROM-MAG01",
            name: "ROM-MAG01 – Overband Magnet (Metal Removal – after feeder discharge, before CR01)",
            components: [
              { componentCode: "ROM-MAG01-MTR01", componentType: "MTR", componentName: "Magnet Drive Motor", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "ROM-MAG01-BLT01", componentType: "BLT", componentName: "Magnet Belt (self-cleaning)", manufacturer: "TBC" },
              { componentCode: "ROM-MAG01-FRM01", componentType: "FRM", componentName: "Magnet Frame & Suspension Structure", manufacturer: "TBC" },
              { componentCode: "ROM-MAG01-COI01", componentType: "COI", componentName: "Electromagnetic Coil Assembly", manufacturer: "TBC" },
              { componentCode: "ROM-MAG01-GRD01", componentType: "GRD", componentName: "Drive & Coil Guard", manufacturer: "TBC" },
              { componentCode: "ROM-MAG01-PLT01", componentType: "PLT", componentName: "Access Platform & Walkway", manufacturer: "TBC" },
              { componentCode: "ROM-MAG01-SNS01", componentType: "SNS", componentName: "Metal Detection Sensor", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "ROM-MAG01-MCC01", name: "ROM-MAG01 – MCC Cell / Starter" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRU-PRI – Primary Crushing
  // FLOW STEP 2: ROM Bin → Feeder → Magnet → CR01 Jaw → CV01 → Ground Feed Bin
  // ─────────────────────────────────────────────────────────────
  {
    label: "Primary Crushing",
    areaCode: "CRU-PRI",
    parentAssets: [
      {
        label: "CR01 – Primary Jaw Crusher",
        equipment: [
          {
            assetNumber: "CR01",
            name: "CR01 – Primary Jaw Crusher – JM120 (1280mm x 800mm Single Toggle)",
            components: [
              { componentCode: "CR01-BDY01", componentType: "BDY", componentName: "Crusher Body – Cast Frame", manufacturer: "JM120" },
              { componentCode: "CR01-JAW01", componentType: "JAW", componentName: "Jaw Assembly – Fixed & Moving Plates", manufacturer: "TBC" },
              { componentCode: "CR01-MTR01", componentType: "MTR", componentName: "Crusher Motor – 160kW (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CR01-JKS01", componentType: "JKS", componentName: "Jackshaft Assembly", manufacturer: "TBC" },
              { componentCode: "CR01-GBX01", componentType: "GBX", componentName: "Gearbox / Drive Assembly", manufacturer: "TBC" },
              { componentCode: "CR01-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CR01-BRG01", componentType: "BRG", componentName: "Crusher Bearings", manufacturer: "TBC" },
              { componentCode: "CR01-LUB01", componentType: "LUB", componentName: "Crusher Lubrication System", manufacturer: "TBC" },
              { componentCode: "CR01-GRD01", componentType: "GRD", componentName: "Drive Guard", manufacturer: "TBC" },
              { componentCode: "CR01-MTB01", componentType: "MTB", componentName: "Motor Base (new drive arrangement)", manufacturer: "TBC" },
              { componentCode: "CR01-HOP01", componentType: "HOP", componentName: "Feed Hopper – Mild Steel with Hardox Liners", manufacturer: "TBC" },
              { componentCode: "CR01-STR01", componentType: "STR", componentName: "Crusher Structure & Frame", manufacturer: "TBC" },
              { componentCode: "CR01-PLT01", componentType: "PLT", componentName: "Access Platform", manufacturer: "TBC" },
              { componentCode: "CR01-SNS01", componentType: "SNS", componentName: "Speed / Load Sensor", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CR01-MCC01", name: "CR01 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CV01 – Forward Conveyor",
        equipment: [
          {
            assetNumber: "CV01",
            name: "CV01 – Forward Conveyor (CR01 discharge → Ground Feed Bin)",
            components: [
              { componentCode: "CV01-MTR01", componentType: "MTR", componentName: "Head Drive Motor A – 11kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV01-MTR02", componentType: "MTR", componentName: "Head Drive Motor B – 11kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV01-GBX01", componentType: "GBX", componentName: "Gearbox", manufacturer: "TBC" },
              { componentCode: "CV01-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV01-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV01-TRQ01", componentType: "TRQ", componentName: "Torque Arm", manufacturer: "TBC" },
              { componentCode: "CV01-TRQB01", componentType: "TRQ", componentName: "Torque Arm Bracket", manufacturer: "TBC" },
              { componentCode: "CV01-BLT01", componentType: "BLT", componentName: "Conveyor Belt", manufacturer: "TBC" },
              { componentCode: "CV01-HDR01", componentType: "HDR", componentName: "Head Drum – Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV01-TDR01", componentType: "TDR", componentName: "Tail Drum – Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV01-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV01-IMP01", componentType: "IMP", componentName: "Impact Bed – CV01 Transition", manufacturer: "TBC" },
              { componentCode: "CV01-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV01-SKT01", componentType: "SKT", componentName: "Skirt Panels & Rock Ledges", manufacturer: "TBC" },
              { componentCode: "CV01-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV01-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV01-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
              { componentCode: "CV01-PLT01", componentType: "PLT", componentName: "Access Platform & Walkway", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV01-MCC01", name: "CV01 – MCC Cell / Starter" },
        ],
      },
      {
        label: "Ground Feed Bin",
        equipment: [
          {
            assetNumber: "PRI-GFB01",
            name: "PRI-GFB01 – Ground Feed Bin (CV01 discharge → Screen Feed System)",
            components: [
              { componentCode: "PRI-GFB01-PNL01", componentType: "PNL", componentName: "Side Plates – 6mm Steel with 10mm Hardox 400 Liners", manufacturer: "TBC" },
              { componentCode: "PRI-GFB01-LVL01", componentType: "LVL", componentName: "Vega Level Sensor (interlocked to plant)", manufacturer: "Vega" },
              { componentCode: "PRI-GFB01-STR01", componentType: "STR", componentName: "Bin Structure – Rolled Steel Section (32MPa concrete base)", manufacturer: "TBC" },
              { componentCode: "PRI-GFB01-PLT01", componentType: "PLT", componentName: "Lower Access / Maintenance Platform", manufacturer: "TBC" },
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRU-SCN – Screening Section
  // FLOW STEP 3: Ground Feed Bin → Screen Feed Conveyor → SC01 → discharge conveyors
  // ─────────────────────────────────────────────────────────────
  {
    label: "Screening Section",
    areaCode: "CRU-SCN",
    parentAssets: [
      {
        label: "CV04 – Screen Feed Conveyor",
        equipment: [
          {
            assetNumber: "CV04",
            name: "CV04 – Screen Feed Conveyor – 1000mm x 24m (Ground Feed Bin → SC01)",
            components: [
              { componentCode: "CV04-MTR01", componentType: "MTR", componentName: "Drive Motor A – 18.5kW Gear Motor", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV04-MTR02", componentType: "MTR", componentName: "Drive Motor B – 18.5kW Gear Motor", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV04-GBX01", componentType: "GBX", componentName: "Gearbox", manufacturer: "TBC" },
              { componentCode: "CV04-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV04-BLT01", componentType: "BLT", componentName: "Belt – PN200/4 Ply 6+2 Covers 1000mm", manufacturer: "TBC" },
              { componentCode: "CV04-HDR01", componentType: "HDR", componentName: "Head Drum – 376mm Dia. Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV04-TDR01", componentType: "TDR", componentName: "Tail Drum – 376mm Dia. Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV04-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV04-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV04-SKT01", componentType: "SKT", componentName: "Skirt Panels & Rock Ledges", manufacturer: "TBC" },
              { componentCode: "CV04-IMP01", componentType: "IMP", componentName: "Impact Bed – 1.5m at Hopper", manufacturer: "TBC" },
              { componentCode: "CV04-CHT01", componentType: "CHT", componentName: "Head Chute – 6mm Dust Cover with Spray Nozzle Holes", manufacturer: "TBC" },
              { componentCode: "CV04-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV04-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV04-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
              { componentCode: "CV04-PLT01", componentType: "PLT", componentName: "Access Platform & Walkway", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV04-MCC01", name: "CV04 – MCC Cell / Starter" },
        ],
      },
      {
        label: "SC01 – Vibrating Screen",
        equipment: [
          {
            assetNumber: "SC01",
            name: "SC01 – Horizontal Vibrating Screen – BW BWC208 (20ft x 8ft)",
            components: [
              { componentCode: "SC01-MTR01", componentType: "MTR", componentName: "Screen Drive Motor – 45kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "SC01-GBX01", componentType: "GBX", componentName: "Exciter / Gearbox Assembly", manufacturer: "TBC" },
              { componentCode: "SC01-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "SC01-BRG01", componentType: "BRG", componentName: "Screen Bearings", manufacturer: "TBC" },
              { componentCode: "SC01-DRV01", componentType: "DRV", componentName: "Shaft Drive (coupled to motor)", manufacturer: "TBC" },
              { componentCode: "SC01-DK01", componentType: "DK", componentName: "Top Deck – Oversize discharge → CV05", manufacturer: "TBC" },
              { componentCode: "SC01-DK02", componentType: "DK", componentName: "Second Deck – Mid discharge → CV08", manufacturer: "TBC" },
              { componentCode: "SC01-DK03", componentType: "DK", componentName: "Bottom Deck – Undersize (Fines) discharge → CV11", manufacturer: "TBC" },
              { componentCode: "SC01-PNL01", componentType: "PNL", componentName: "Screen Panels / Media – Top Deck", manufacturer: "TBC" },
              { componentCode: "SC01-PNL02", componentType: "PNL", componentName: "Screen Panels / Media – Second Deck", manufacturer: "TBC" },
              { componentCode: "SC01-PNL03", componentType: "PNL", componentName: "Screen Panels / Media – Bottom Deck", manufacturer: "TBC" },
              { componentCode: "SC01-STR01", componentType: "STR", componentName: "Screen Structure / Frame", manufacturer: "TBC" },
              { componentCode: "SC01-SPR01", componentType: "SPR", componentName: "Isolation Springs", manufacturer: "TBC" },
              { componentCode: "SC01-PLT01", componentType: "PLT", componentName: "Access Platforms", manufacturer: "TBC" },
              { componentCode: "SC01-CHT01", componentType: "CHT", componentName: "Split Chute Discharge System", manufacturer: "TBC" },
              { componentCode: "SC01-GRD01", componentType: "GRD", componentName: "Drive Guard", manufacturer: "TBC" },
              { componentCode: "SC01-SNS01", componentType: "SNS", componentName: "Speed / Vibration Sensor", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "SC01-MCC01", name: "SC01 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CV05 – Top Deck Discharge Conveyor",
        equipment: [
          {
            assetNumber: "CV05",
            name: "CV05 – Top Deck Discharge Conveyor – 1000mm x 24m (SC01 Top Deck → Cone Feed Bin via CV06)",
            components: [
              { componentCode: "CV05-MTR01", componentType: "MTR", componentName: "Drive Motor – 7.5kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV05-GBX01", componentType: "GBX", componentName: "Gearbox", manufacturer: "TBC" },
              { componentCode: "CV05-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV05-BRG01", componentType: "BRG", componentName: "Drum Bearings", manufacturer: "TBC" },
              { componentCode: "CV05-BLT01", componentType: "BLT", componentName: "Belt – 1000mm 3-Ply PN150 Mining Grade", manufacturer: "TBC" },
              { componentCode: "CV05-HDR01", componentType: "HDR", componentName: "Head Drum – Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV05-TDR01", componentType: "TDR", componentName: "Tail Drum – Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV05-IDL01", componentType: "IDL", componentName: "Idlers – Troughed on Steel Section Frame", manufacturer: "TBC" },
              { componentCode: "CV05-IDL02", componentType: "IDL", componentName: "Impact Rollers (at transfer points)", manufacturer: "TBC" },
              { componentCode: "CV05-GDE01", componentType: "GDE", componentName: "Guide Rollers", manufacturer: "TBC" },
              { componentCode: "CV05-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV05-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV05-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV05-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
              { componentCode: "CV05-PLT01", componentType: "PLT", componentName: "Access Platform", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV05-MCC01", name: "CV05 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CV06 – Oversize Transfer Conveyor",
        equipment: [
          {
            assetNumber: "CV06",
            name: "CV06 – Oversize Transfer Conveyor – 1000mm x 21m (CV05 → Cone Feed Bin)",
            components: [
              { componentCode: "CV06-MTR01", componentType: "MTR", componentName: "Drive Motor – 15kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV06-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV06-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV06-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV06-TRQ01", componentType: "TRQ", componentName: "Torque Arm & Bracket", manufacturer: "TBC" },
              { componentCode: "CV06-RAD01", componentType: "MTR", componentName: "Radial Drive Motor – 1.5kW (new)", manufacturer: "TBC" },
              { componentCode: "CV06-CHT01", componentType: "CHT", componentName: "Head Chute – 6mm Dust Cover with Spray Nozzle Holes", manufacturer: "TBC" },
              { componentCode: "CV06-BLT01", componentType: "BLT", componentName: "Belt", manufacturer: "TBC" },
              { componentCode: "CV06-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV06-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV06-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV06-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV06-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
              { componentCode: "CV06-PLT01", componentType: "PLT", componentName: "Access Platform", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV06-MCC01", name: "CV06 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CV08 – Second Deck Discharge Conveyor",
        equipment: [
          {
            assetNumber: "CV08",
            name: "CV08 – Second Deck Discharge Conveyor – 1000mm x 24m (SC01 Second Deck → Cone Feed Bin via CV09)",
            components: [
              { componentCode: "CV08-MTR01", componentType: "MTR", componentName: "Drive Motor – 7.5kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV08-GBX01", componentType: "GBX", componentName: "Gearbox", manufacturer: "TBC" },
              { componentCode: "CV08-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV08-BRG01", componentType: "BRG", componentName: "Drum Bearings", manufacturer: "TBC" },
              { componentCode: "CV08-BLT01", componentType: "BLT", componentName: "Belt – 1000mm 3-Ply PN150 Mining Grade", manufacturer: "TBC" },
              { componentCode: "CV08-HDR01", componentType: "HDR", componentName: "Head Drum – Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV08-TDR01", componentType: "TDR", componentName: "Tail Drum – Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV08-IDL01", componentType: "IDL", componentName: "Idlers – Troughed on Steel Section Frame", manufacturer: "TBC" },
              { componentCode: "CV08-IDL02", componentType: "IDL", componentName: "Impact Rollers (at transfer points)", manufacturer: "TBC" },
              { componentCode: "CV08-GDE01", componentType: "GDE", componentName: "Guide Rollers", manufacturer: "TBC" },
              { componentCode: "CV08-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV08-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV08-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV08-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
              { componentCode: "CV08-PLT01", componentType: "PLT", componentName: "Access Platform", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV08-MCC01", name: "CV08 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CV09 – Oversize Transfer Conveyor",
        equipment: [
          {
            assetNumber: "CV09",
            name: "CV09 – Oversize Transfer Conveyor – 1000mm x 21m (CV08 → Cone Feed Bin)",
            components: [
              { componentCode: "CV09-MTR01", componentType: "MTR", componentName: "Drive Motor – 15kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV09-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV09-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV09-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV09-TRQ01", componentType: "TRQ", componentName: "Torque Arm & Bracket", manufacturer: "TBC" },
              { componentCode: "CV09-BLT01", componentType: "BLT", componentName: "Belt – 1000mm 3-Ply PN150 (extended)", manufacturer: "TBC" },
              { componentCode: "CV09-CHT01", componentType: "CHT", componentName: "Head Chute – 6mm Dust Cover with Spray Nozzle Holes", manufacturer: "TBC" },
              { componentCode: "CV09-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV09-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV09-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV09-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV09-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
              { componentCode: "CV09-PLT01", componentType: "PLT", componentName: "Access Platform", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV09-MCC01", name: "CV09 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CV11 – Fines Discharge Conveyor",
        equipment: [
          {
            assetNumber: "CV11",
            name: "CV11 – Fines Discharge Conveyor – 1000mm x 10m (SC01 Bottom Deck → Radial Stackers)",
            components: [
              { componentCode: "CV11-MTR01", componentType: "MTR", componentName: "Drive Motor – 7.5kW Electric", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV11-GBX01", componentType: "GBX", componentName: "Gearbox", manufacturer: "TBC" },
              { componentCode: "CV11-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV11-BRG01", componentType: "BRG", componentName: "Drum Bearings", manufacturer: "TBC" },
              { componentCode: "CV11-BLT01", componentType: "BLT", componentName: "Belt – 1000mm 3-Ply PN150 Mining Grade", manufacturer: "TBC" },
              { componentCode: "CV11-HDR01", componentType: "HDR", componentName: "Head Drum – Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV11-TDR01", componentType: "TDR", componentName: "Tail Drum – Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV11-IDL01", componentType: "IDL", componentName: "Idlers – Troughed on Steel Section Frame", manufacturer: "TBC" },
              { componentCode: "CV11-IDL02", componentType: "IDL", componentName: "Impact Rollers (at transfer points)", manufacturer: "TBC" },
              { componentCode: "CV11-GDE01", componentType: "GDE", componentName: "Guide Rollers", manufacturer: "TBC" },
              { componentCode: "CV11-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV11-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV11-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV11-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
              { componentCode: "CV11-PLT01", componentType: "PLT", componentName: "Access Platform", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV11-MCC01", name: "CV11 – MCC Cell / Starter" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRU-SEC – Secondary & Tertiary Crushing
  // FLOW STEP 4: Cone Feed Bin (from CV06/CV09) → Feeders A/B → CR02/CR03 → CV02 → back to screen
  // ─────────────────────────────────────────────────────────────
  {
    label: "Secondary & Tertiary Crushing",
    areaCode: "CRU-SEC",
    parentAssets: [
      {
        label: "Cone Feed Bin",
        equipment: [
          {
            assetNumber: "SEC-CFB01",
            name: "SEC-CFB01 – Cone Feed Bin – 30m³ Dual Chamber (feeds CR02 & CR03)",
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
            name: "SEC-CFB01-FDR01 – Vibrating Feeder A – PF1200 (→ CV07 → CR02 Secondary Cone)",
            components: [
              { componentCode: "SEC-CFB01-FDR01-EXC01", componentType: "EXC", componentName: "Exciter Unit A – 4kW Out of Balance", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR01-EXC02", componentType: "EXC", componentName: "Exciter Unit B – 4kW Out of Balance", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR01-VSD01", componentType: "VSD", componentName: "Feeder VSD (gang control capable)", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR01-LNR01", componentType: "LNR", componentName: "Feeder Liners – 10mm BIS 500", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR01-FRM01", componentType: "FRM", componentName: "Feeder Frame – Heavy Duty Rolled Steel", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR01-SNS01", componentType: "SNS", componentName: "Speed / Level Sensor", manufacturer: "TBC" },
            ],
          },
          {
            assetNumber: "SEC-CFB01-FDR02",
            name: "SEC-CFB01-FDR02 – Vibrating Feeder B – PF1200 (→ CV10 → CR03 Tertiary Cone)",
            components: [
              { componentCode: "SEC-CFB01-FDR02-EXC01", componentType: "EXC", componentName: "Exciter Unit A – 4kW Out of Balance", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR02-EXC02", componentType: "EXC", componentName: "Exciter Unit B – 4kW Out of Balance", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR02-VSD01", componentType: "VSD", componentName: "Feeder VSD (gang control capable)", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR02-LNR01", componentType: "LNR", componentName: "Feeder Liners – 10mm BIS 500", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR02-FRM01", componentType: "FRM", componentName: "Feeder Frame – Heavy Duty Rolled Steel", manufacturer: "TBC" },
              { componentCode: "SEC-CFB01-FDR02-SNS01", componentType: "SNS", componentName: "Speed / Level Sensor", manufacturer: "TBC" },
            ],
          },
        ],
      },
      {
        label: "CV07 – Secondary Cone Feed Conveyor",
        equipment: [
          {
            assetNumber: "CV07",
            name: "CV07 – Secondary Cone Feed Conveyor – 1000mm x 24m (Feeder A → CR02)",
            components: [
              { componentCode: "CV07-MTR01", componentType: "MTR", componentName: "Drive Motor – 15kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV07-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV07-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV07-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV07-TRQ01", componentType: "TRQ", componentName: "Torque Arm & Bracket", manufacturer: "TBC" },
              { componentCode: "CV07-BLT01", componentType: "BLT", componentName: "Belt", manufacturer: "TBC" },
              { componentCode: "CV07-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV07-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV07-MDE01", componentType: "MDE", componentName: "Metal Detector (prevents uncrushable material entering crusher)", manufacturer: "TBC" },
              { componentCode: "CV07-PLT01", componentType: "PLT", componentName: "Fixed & Portable Access Platform (metal detector removal)", manufacturer: "TBC" },
              { componentCode: "CV07-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV07-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV07-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV07-MCC01", name: "CV07 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CR02 – Secondary Cone Crusher",
        equipment: [
          {
            assetNumber: "CR02",
            name: "CR02 – Secondary Cone Crusher – CS400 (up to 250 tph, 200mm, 6-50mm setting)",
            components: [
              { componentCode: "CR02-BDY01", componentType: "BDY", componentName: "Crusher Body – Cast", manufacturer: "CS400" },
              { componentCode: "CR02-MTR01", componentType: "MTR", componentName: "Crusher Motor – 220kW", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CR02-GBX01", componentType: "GBX", componentName: "Gearbox / Countershaft Assembly", manufacturer: "TBC" },
              { componentCode: "CR02-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CR02-DRV01", componentType: "DRV", componentName: "Vee Belt Drive & Pulleys", manufacturer: "TBC" },
              { componentCode: "CR02-BRG01", componentType: "BRG", componentName: "Bronze Bushings – throughout", manufacturer: "TBC" },
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
              { componentCode: "CR02-WRP01", componentType: "WRP", componentName: "Wear Protection Set (head ball, mainframe liners, countershaft guards, dead-bed hopper)", manufacturer: "TBC" },
              { componentCode: "CR02-HOP01", componentType: "HOP", componentName: "Feeder Hopper – Mild Steel with Hardox Liners", manufacturer: "TBC" },
              { componentCode: "CR02-PLT01", componentType: "PLT", componentName: "Access Platforms (crusher & feeder)", manufacturer: "TBC" },
              { componentCode: "CR02-LUB-ROOM01", componentType: "ENC", componentName: "Lubrication Room – Half Sea Container (x2)", manufacturer: "TBC" },
              { componentCode: "CR02-GRD01", componentType: "GRD", componentName: "Drive Guard", manufacturer: "TBC" },
              { componentCode: "CR02-SNS01", componentType: "SNS", componentName: "Speed / Load / Temperature Sensors", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CR02-MCC01", name: "CR02 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CV10 – Tertiary Cone Feed Conveyor",
        equipment: [
          {
            assetNumber: "CV10",
            name: "CV10 – Tertiary Cone Feed Conveyor – 1000mm x 24m (Feeder B → CR03)",
            components: [
              { componentCode: "CV10-MTR01", componentType: "MTR", componentName: "Drive Motor – 15kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV10-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV10-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV10-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV10-TRQ01", componentType: "TRQ", componentName: "Torque Arm & Bracket", manufacturer: "TBC" },
              { componentCode: "CV10-BLT01", componentType: "BLT", componentName: "Belt", manufacturer: "TBC" },
              { componentCode: "CV10-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV10-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV10-MDE01", componentType: "MDE", componentName: "Metal Detector (prevents uncrushable material entering crusher)", manufacturer: "TBC" },
              { componentCode: "CV10-PLT01", componentType: "PLT", componentName: "Fixed & Portable Access Platform (metal detector removal)", manufacturer: "TBC" },
              { componentCode: "CV10-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV10-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV10-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV10-MCC01", name: "CV10 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CR03 – Tertiary Cone Crusher",
        equipment: [
          {
            assetNumber: "CR03",
            name: "CR03 – Tertiary Cone Crusher – CS3 (up to 250 tph, 200mm, 6-50mm setting)",
            components: [
              { componentCode: "CR03-BDY01", componentType: "BDY", componentName: "Crusher Body – Cast", manufacturer: "CS3" },
              { componentCode: "CR03-MTR01", componentType: "MTR", componentName: "Crusher Motor – 220kW", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CR03-GBX01", componentType: "GBX", componentName: "Gearbox / Countershaft Assembly", manufacturer: "TBC" },
              { componentCode: "CR03-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CR03-DRV01", componentType: "DRV", componentName: "Vee Belt Drive & Pulleys", manufacturer: "TBC" },
              { componentCode: "CR03-BRG01", componentType: "BRG", componentName: "Bronze Bushings – throughout", manufacturer: "TBC" },
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
              { componentCode: "CR03-WRP01", componentType: "WRP", componentName: "Wear Protection Set", manufacturer: "TBC" },
              { componentCode: "CR03-HOP01", componentType: "HOP", componentName: "Feeder Hopper – Mild Steel with Hardox Liners", manufacturer: "TBC" },
              { componentCode: "CR03-PLT01", componentType: "PLT", componentName: "Access Platforms", manufacturer: "TBC" },
              { componentCode: "CR03-LUB-ROOM01", componentType: "ENC", componentName: "Lubrication Room – Half Sea Container (x2)", manufacturer: "TBC" },
              { componentCode: "CR03-GRD01", componentType: "GRD", componentName: "Drive Guard", manufacturer: "TBC" },
              { componentCode: "CR03-SNS01", componentType: "SNS", componentName: "Speed / Load / Temperature Sensors", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CR03-MCC01", name: "CR03 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CV02 – Cone Discharge Conveyor",
        equipment: [
          {
            assetNumber: "CV02",
            name: "CV02 – Cone Discharge Conveyor – 1200mm x 30m (CR02 & CR03 discharge → back to screen CV04)",
            components: [
              { componentCode: "CV02-MTR01", componentType: "MTR", componentName: "Drive Motor – 30kW Gear Motor", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV02-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV02-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV02-BRG01", componentType: "BRG", componentName: "Sealed Self-aligning Spherical Roller Bearings", manufacturer: "TBC" },
              { componentCode: "CV02-BLT01", componentType: "BLT", componentName: "Belt – PN200/4 Ply 6+2 Covers 1200mm", manufacturer: "TBC" },
              { componentCode: "CV02-HDR01", componentType: "HDR", componentName: "Drive Drum – 376mm Dia. Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV02-TDR01", componentType: "TDR", componentName: "Tail Drum – 376mm Dia. Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV02-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV02-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV02-SKT01", componentType: "SKT", componentName: "Skirt Rubbers – 150mm x 15mm 50 Shore & Rock Ledges", manufacturer: "TBC" },
              { componentCode: "CV02-IMP01", componentType: "IMP", componentName: "Impact Bed – 1.5m Impact Idlers (Cone discharge)", manufacturer: "TBC" },
              { componentCode: "CV02-HOP01", componentType: "HOP", componentName: "Heavy Duty Hopper with Jaw Liner & Rock Ledges", manufacturer: "TBC" },
              { componentCode: "CV02-BWS01", componentType: "BWS", componentName: "Belt Weigher / Weigh Scale (display in control room)", manufacturer: "TBC" },
              { componentCode: "CV02-MDE01", componentType: "MDE", componentName: "Metal Detector with Dropper (prevents uncrushable back to screen)", manufacturer: "TBC" },
              { componentCode: "CV02-PLT01", componentType: "PLT", componentName: "Access Stairs & Platforms (metal detector removal)", manufacturer: "TBC" },
              { componentCode: "CV02-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV02-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV02-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV02-MCC01", name: "CV02 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CV03 – Feed Bin Conveyor",
        equipment: [
          {
            assetNumber: "CV03",
            name: "CV03 – Feed Bin Conveyor – 1200mm x 24m (supplementary – ground feed bin to screen feed)",
            components: [
              { componentCode: "CV03-MTR01", componentType: "MTR", componentName: "Drive Motor – Gear Motor", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV03-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV03-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV03-BRG01", componentType: "BRG", componentName: "Drum Bearings", manufacturer: "TBC" },
              { componentCode: "CV03-BLT01", componentType: "BLT", componentName: "Belt – PN200/4 Ply 6+2 Covers 1200mm", manufacturer: "TBC" },
              { componentCode: "CV03-HDR01", componentType: "HDR", componentName: "Drive Drum – 376mm Dia. Rubber Lagged", manufacturer: "TBC" },
              { componentCode: "CV03-TDR01", componentType: "TDR", componentName: "Tail Drum – 376mm Dia. Machined Crown", manufacturer: "TBC" },
              { componentCode: "CV03-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV03-SCR01", componentType: "SCR", componentName: "Belt Scraper – BW Standard", manufacturer: "TBC" },
              { componentCode: "CV03-SKT01", componentType: "SKT", componentName: "Skirt Rubbers – 150mm x 15mm 50 Shore & Rock Ledges", manufacturer: "TBC" },
              { componentCode: "CV03-IMP01", componentType: "IMP", componentName: "Impact Bed – 1.5m at Hopper", manufacturer: "TBC" },
              { componentCode: "CV03-HOP01", componentType: "HOP", componentName: "Heavy Duty Hopper with Rock Ledges", manufacturer: "TBC" },
              { componentCode: "CV03-CHT01", componentType: "CHT", componentName: "Head Chute – 6mm Dust Cover with Spray Nozzle Holes", manufacturer: "TBC" },
              { componentCode: "CV03-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV03-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV03-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
              { componentCode: "CV03-PLT01", componentType: "PLT", componentName: "Access Platform & Walkway", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV03-MCC01", name: "CV03 – MCC Cell / Starter" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CRU-STK – Product Conveying & Radial Stackers
  // FLOW STEP 5: CV11 (fines) → CV12 / CV15 radial stackers → product stockpile
  // ─────────────────────────────────────────────────────────────
  {
    label: "Conveying & Stockpiling",
    areaCode: "CRU-STK",
    parentAssets: [
      {
        label: "CV12 – Fines / Radial Stacking Conveyor",
        equipment: [
          {
            assetNumber: "CV12",
            name: "CV12 – Fines Collecting / Radial Stacking Conveyor – 1000mm x 24m (ST2410, from CV11)",
            components: [
              { componentCode: "CV12-MTR01", componentType: "MTR", componentName: "Drive Motor – 15kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV12-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV12-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
              { componentCode: "CV12-DRV01", componentType: "DRV", componentName: "Drive Shaft (new)", manufacturer: "TBC" },
              { componentCode: "CV12-TRQ01", componentType: "TRQ", componentName: "Torque Arm & Bracket", manufacturer: "TBC" },
              { componentCode: "CV12-RAD01", componentType: "MTR", componentName: "Radial Drive Motor – 1.5kW (converted electric)", manufacturer: "TBC" },
              { componentCode: "CV12-BLT01", componentType: "BLT", componentName: "Belt", manufacturer: "TBC" },
              { componentCode: "CV12-IDL01", componentType: "IDL", componentName: "Idlers – Troughed", manufacturer: "TBC" },
              { componentCode: "CV12-SCR01", componentType: "SCR", componentName: "Belt Scraper", manufacturer: "TBC" },
              { componentCode: "CV12-BWS01", componentType: "BWS", componentName: "Belt Weigher / Weigh Scale", manufacturer: "TBC" },
              { componentCode: "CV12-LNY01", componentType: "LNY", componentName: "Lanyard Safety Switches – IP55", manufacturer: "TBC" },
              { componentCode: "CV12-SPD01", componentType: "SPD", componentName: "Speed Detection Sensor (Underspeed)", manufacturer: "TBC" },
              { componentCode: "CV12-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
              { componentCode: "CV12-PLT01", componentType: "PLT", componentName: "Access Platform & Walkway", manufacturer: "TBC" },
            ],
          },
          { assetNumber: "CV12-MCC01", name: "CV12 – MCC Cell / Starter" },
        ],
      },
      {
        label: "CV15 – Radial Stacking Conveyor",
        equipment: [
          {
            assetNumber: "CV15",
            name: "CV15 – Radial Stacking Conveyor – 1000mm x 24m (ST2410, fed from CV14)",
            components: [
              { componentCode: "CV15-MTR01", componentType: "MTR", componentName: "Drive Motor – 18.5kW Gear Motor (converted)", manufacturer: "TBC", voltage: "415V" },
              { componentCode: "CV15-GBX01", componentType: "GBX", componentName: "Gear Motor / Gearbox", manufacturer: "TBC" },
              { componentCode: "CV15-CPL01", componentType: "CPL", componentName: "Drive Coupling", manufacturer: "TBC" },
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
              { componentCode: "CV15-STR01", componentType: "STR", componentName: "Conveyor Structure & Frame", manufacturer: "TBC" },
              { componentCode: "CV15-PLT01", componentType: "PLT", componentName: "Access Platform & Walkway", manufacturer: "TBC" },
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
              { componentCode: "DUS-PMP01-MTR01", componentType: "MTR", componentName: "Pump Motor", manufacturer: "TBC", voltage: "415V" },
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
