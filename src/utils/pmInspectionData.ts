/**
 * Centralized PM inspection data extracted from all 77 hardcoded PM template components.
 * This is the single source of truth for task data that gets seeded into the pm_master_list.tasks JSONB column.
 * Each key matches the pm_name in the database exactly.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pmInspectionData: Record<string, any> = {

  // ══════════════════════════════════════════════════════════════════
  // MECHANICAL DAILY
  // ══════════════════════════════════════════════════════════════════

  "Mill Daily Inspection": {
    sections: [
      { equipmentId: "MILL", equipmentName: "Ball Mill - System, Assembly and Components", tasks: [
        { task: "Inspect Feed Chute & Seals for Leaks/Wear. Note any Faults" },
        { task: "Inspect Trunnion & Pinion Bearing Labyrinths. Note Excessive Grease" },
        { task: "Grease Pinion Bearings (4 PUMPS PER DAY)" },
        { task: "Inspect Mill Drivelines. Note any excessive noise or wear" },
        { task: "Inspect/Check operation of Girth Gear Grease Sprayer" },
        { task: "Check Cycle Frequency on Girth Gear Lube and Note times (Approx 120 Seconds)" },
        { task: "Inspect mill for loose or leaking liner bolts. Note any faults" },
        { task: "Inspect gearbox lube pump, radiator & hoses for operation, leaks or noise" },
        { task: "Inspect mill grease pump airline systems, Top up airline oiler & check water traps" },
        { task: "Check level of bulky bins & note any that are getting low" },
      ]},
      { equipmentId: "GENERAL", equipmentName: "General Area Inspection", tasks: [
        { task: "Inspect cyclone tower pipe work and hoppers for leaks or wear. Note any faults" },
        { task: "Inspect air compressors for operation" },
        { task: "Check main air receiver & drain water from bottom valve" },
        { task: "Check general pipe work for leaks" },
        { task: "Check condition of walkway mesh & handrails" },
        { task: "Check operation of sump pumps" },
      ]},
      { equipmentId: "FE-100", equipmentName: "FE-100 Hopper", tasks: [
        { task: "Inspect Feed & Discharge chutes for holes or leakage" },
        { task: "Inspect belt condition, tracking, tag any faulty rollers" },
        { task: "Inspect Feeder gearbox for noise or leaks" },
        { task: "Inspect scraper operation & condition. Note any faults" },
        { task: "Check head & tail drum bearings for noise or lumpiness", hasTemp: true, tempLabel: "DE: ___°C | NDE: ___°C" },
      ]},
      { equipmentId: "FE-101", equipmentName: "FE-101 Transfer Conveyor", tasks: [
        { task: "Inspect Feed & Discharge chutes for holes or leakage" },
        { task: "Inspect belt condition, tracking, tag any faulty rollers" },
        { task: "Inspect Feeder gearbox for noise or leaks. Record Temp", hasTemp: true, tempLabel: "Gearbox: ___°C" },
        { task: "Inspect scraper operation & condition. Note any faults" },
        { task: "Check head & tail drum bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "NDE: ___°C | DE: ___°C" },
      ]},
      { equipmentId: "BC-100", equipmentName: "BC-100 Mill Feed Conveyor", tasks: [
        { task: "Inspect Feed & Discharge chutes for holes or leakage" },
        { task: "Inspect belt condition, tracking, tag any faulty rollers" },
        { task: "Inspect Feeder gearbox for noise or leaks. Record Temp", hasTemp: true, tempLabel: "Gearbox: ___°C" },
        { task: "Inspect scraper operation & condition. Note any faults" },
        { task: "Check head & tail drum bearings for noise or lumpiness", hasTemp: true, tempLabel: "TD: ___°C | HD: ___°C" },
        { task: "Check belt tracking & tracking frames for correct operation" },
        { task: "Check conveyor belt for noisy or hot bearings. Report any issues to supervisor" },
      ]},
      { equipmentId: "CV-011", equipmentName: "CV-011 Scats Conveyor", tasks: [
        { task: "Inspect Feed chute for holes or leakage" },
        { task: "Inspect belt condition, tracking, tag any faulty rollers" },
        { task: "Inspect Feeder gearbox for noise or leaks" },
        { task: "Check head & tail drum bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Tail Plant Side: ___°C | Tail Thickener Side: ___°C" },
      ]},
      { equipmentId: "MILL-SUMP", equipmentName: "Mill Sump Pump", tasks: [
        { task: "Inspect Discharge pipework for holes or leakage" },
        { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
        { task: "Inspect pump operation & condition. Inspect guarding" },
        { task: "Check pump bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Top: ___°C | Lower: ___°C" },
        { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Top: ___°C | Lower: ___°C" },
      ]},
      { equipmentId: "PU102A/B", equipmentName: "Cyclone Feed Pumps PU102A/PU102B", tasks: [
        { task: "Inspect Discharge pipework for holes or leakage" },
        { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
        { task: "Inspect pump operation & condition. Inspect guarding" },
        { task: "Check pump bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Drive: ___°C | Non-Drive: ___°C" },
        { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Drive: ___°C | Non-Drive: ___°C" },
        { task: "Note any leakage, and note which pump is running" },
      ]},
    ],
    additionalData: {
      bc100BearingTemps: [
        { label: "Upper Bend Pulley", fields: "D/S: ___°C | N/D: ___°C" },
        { label: "Lower Bend Pulley", fields: "D/S: ___°C | N/D: ___°C" },
        { label: "Take-up Pulley", fields: "D/S: ___°C | N/D: ___°C" },
      ],
      millData: {
        ambientTemp: "___°C",
        throughputTonnes: "_________",
        pinionFaceTemps: { left: "___°C", centre: "___°C", right: "___°C" },
        bearings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        gearboxLubeTemp: "___°C",
      },
    },
  },

  "Filter Press Daily Online Inspection": {
    sections: [
      { equipmentName: "Filter Press 1 – Hydraulics", tasks: [
        { task: "Verify closing pressure at setpoint" }, { task: "Confirm pressure holding (no rapid decrease)" },
        { task: "Record hydraulic oil temperature (TEMP-)" }, { task: "Listen for pump cavitation or whining" }, { task: "Inspect for visible oil leaks" },
      ], tempGuidelines: "Normal: 35–55°C | Caution: 55–65°C | Critical: >65°C → Investigate cooling / contamination" },
      { equipmentName: "Filter Press 1 – Filtration", tasks: [
        { task: "Check cake dryness uniformity" }, { task: "Compare cycle time to baseline. Ask Operator for Baseline" },
        { task: "Observe slurry leakage between plates" }, { task: "Confirm smooth plate opening" },
        { task: "Listen for abnormal mechanical noise" }, { task: "Inspect Core Blow Pipe work for Leaks" },
        { task: "Inspect Slurry Feed Pipework for leaks" }, { task: "Inspect Core Blow and Feed line valves for smooth operation and leaks" },
        { task: "Inspect Filter Feed tank fill valve for smooth operation and leaks" }, { task: "Inspect Airlines for Leaks" },
        { task: "Inspect Feed Tank Agitator for operation" }, { task: "Check pneumatic Rail shakers for operation and air leaks" },
      ]},
      { equipmentName: "Filter Press 1 – Feed Pump", tasks: [
        { task: "Check feed pressure stability" }, { task: "Listen for cavitation" },
        { task: "Inspect mechanical seal" }, { task: "Check pump Bearing temperature (TEMP-)" },
      ], tempGuidelines: "Normal: 40–75°C | Caution: 75–85°C | Critical: >90°C" },
      { equipmentName: "Filter Press 2 – Hydraulics", tasks: [
        { task: "Verify closing pressure at setpoint" }, { task: "Confirm pressure holding (no rapid decay)" },
        { task: "Record hydraulic oil temperature (TEMP-)" }, { task: "Listen for pump cavitation or whining" }, { task: "Inspect for visible oil leaks" },
      ], tempGuidelines: "Normal: 35–55°C | Caution: 55–65°C | Critical: >65°C" },
      { equipmentName: "Filter Press 2 – Filtration", tasks: [
        { task: "Check cake dryness uniformity" }, { task: "Compare cycle time to baseline. Ask Operator for Baseline" },
        { task: "Observe slurry leakage between plates" }, { task: "Confirm smooth plate opening" },
        { task: "Listen for abnormal mechanical noise" }, { task: "Inspect Core Blow Pipe work for Leaks" },
        { task: "Inspect Slurry Feed Pipework for leaks" }, { task: "Inspect Core Blow and Feed line valves for smooth operation and leaks" },
        { task: "Inspect Filter Feed tank fill valve for smooth operation and leaks" }, { task: "Inspect Airlines for Leaks" },
        { task: "Inspect Feed Tank Agitator for operation" }, { task: "Check pneumatic Rail shakers for operation and air leaks" },
      ]},
      { equipmentName: "Filter Press 2 – Feed Pump", tasks: [
        { task: "Check feed pressure stability" }, { task: "Listen for cavitation" },
        { task: "Inspect mechanical seal" }, { task: "Check pump Bearing temperature (TEMP-)" },
      ], tempGuidelines: "Normal: 40–75°C | Caution: 75–85°C | Critical: >90°C" },
      { equipmentName: "Filter 1 Extraction Conveyor", tasks: [
        { task: "Check Tail Drum Bearings x2 (TEMP-)" }, { task: "Check Head Drum Bearings x2 (TEMP-)" },
        { task: "Check Tension roller bearings. Located at Head end of Conveyor (TEMP-)" },
        { task: "Check all grease points are not Damaged" },
        { task: "Check all Wing Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check all Center Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check all Return Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check all Frames are Secure and are not moving under load" },
        { task: "Check that Head end belt Scrapper is functioning" },
        { task: "Verify belt centered on pulleys" }, { task: "Inspect for edge wear" },
        { task: "Observe material loading alignment" }, { task: "Listen for belt slapping" },
      ], tempGuidelines: "Normal: 30–70°C | Monitor: 70–85°C | Warning: 85–95°C | Critical: >95°C → Immediate shutdown" },
      { equipmentName: "Filter 1 Extraction – Gearbox", tasks: [
        { task: "Check Gearbox Temperature (TEMP-)" }, { task: "Listen for gearbox Noise" },
        { task: "Inspect coupling vibration" }, { task: "Inspect Belt tension. Visual" },
      ], tempGuidelines: "Normal: 40–75°C | Critical: >85°C" },
      { equipmentName: "Filter 2 Extraction Conveyor", tasks: [
        { task: "Check Tail Drum Bearings x2 (TEMP-)" }, { task: "Check Head Drum Bearings x2 (TEMP-)" },
        { task: "Check Tension roller bearings. Located at Head end of Conveyor (TEMP-)" },
        { task: "Check all grease points are not Damaged" },
        { task: "Check all Wing Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check all Center Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check all Return Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check all Frames are Secure and are not moving under load" },
        { task: "Check that Head end belt Scrapper is functioning" },
        { task: "Verify belt centered on pulleys" }, { task: "Inspect for edge wear" },
        { task: "Observe material loading alignment" }, { task: "Listen for belt slapping" },
      ]},
      { equipmentName: "Filter 2 Extraction – Gearbox", tasks: [
        { task: "Check Gearbox Temperature (TEMP-)" }, { task: "Listen for gearbox Noise" },
        { task: "Inspect coupling vibration" }, { task: "Inspect Belt tension. Visual" },
      ], tempGuidelines: "Normal: 40–75°C | Critical: >85°C" },
      { equipmentName: "Collection Conveyor", tasks: [
        { task: "Check Tail Drum Bearings x2 (TEMP-)" }, { task: "Check Head Drum Bearings x2 (TEMP-)" },
        { task: "Check Tension roller bearings. Located at Head end of Conveyor (TEMP-)" },
        { task: "Check all grease points are not Damaged" },
        { task: "Check all Wing Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check all Center Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check all Frames are Secure and are not moving under load" },
        { task: "Check all Return Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check that Head end belt Scrapper is functioning" },
        { task: "Verify belt centered on pulleys" }, { task: "Inspect for edge wear" },
        { task: "Observe material loading alignment" }, { task: "Listen for belt slapping" },
      ]},
      { equipmentName: "Collection Conveyor – Gearbox", tasks: [
        { task: "Check Gearbox Temperature (TEMP-)" }, { task: "Listen for gearbox Noise" },
        { task: "Inspect coupling vibration" }, { task: "Inspect Belt tension. Visual" },
      ], tempGuidelines: "Normal: 40–75°C | Critical: >85°C" },
      { equipmentName: "Radial Stacker Conveyor", tasks: [
        { task: "Check Tail Drum Bearings x2 (TEMP-)" }, { task: "Check Head Drum Bearings x2 (TEMP-)" },
        { task: "Check Tension roller bearings (TEMP-)" },
        { task: "Check all Wing Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check all Center Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check all Frames are Secure and are not moving under load. Mark with info tag if roller requires replacing" },
        { task: "Check all Return Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
        { task: "Check that Head end belt Scrapper is functioning" },
        { task: "Verify belt centered on pulleys" }, { task: "Observe material loading alignment" },
        { task: "Listen for belt slapping" },
        { task: "Ensure Turn Table is clear of Build up" },
        { task: "Ensure wheels are operating smoothly and concrete clear of build up" },
      ]},
      { equipmentName: "Radial Stacker – Gearbox", tasks: [
        { task: "Check Gearbox Temperature (TEMP-)" }, { task: "Listen for gearbox Noise" },
        { task: "Inspect coupling vibration" }, { task: "Inspect Belt tension. Visual" },
      ], tempGuidelines: "Normal: 40–75°C | Critical: >85°C" },
    ],
    shutdownTriggers: [
      "Bearing temperature >95°C", "Smoke or burning smell", "Sudden pressure drop in press",
      "Gearbox oil leak + high temperature", "Severe belt mistracking", "Abnormal vibration + temperature rise",
    ],
  },

  "Filter Press Daily Offline Inspection": {
    sections: [
      { equipmentId: "FP-01", equipmentName: "Filter Press", tasks: [
        { task: "Check general condition of the filter press structure" }, { task: "Inspect filter cloths for wear, damage, or blinding" },
        { task: "Check plate alignment and condition" }, { task: "Inspect plate shifting mechanism for proper operation" },
        { task: "Check hydraulic cylinder and hoses for leaks or damage" }, { task: "Inspect safety interlocks and emergency stop functions" },
        { task: "Check drip trays and containment areas for leaks or spills" }, { task: "Inspect filtrate discharge points for blockages or leaks" },
        { task: "Check air blow system for proper operation (if equipped)" }, { task: "Inspect cake discharge system for proper operation" },
      ]},
      { equipmentId: "FP-02", equipmentName: "Hydraulic Unit", tasks: [
        { task: "Check hydraulic oil level" }, { task: "Inspect hydraulic pump for leaks or unusual noise" },
        { task: "Check hydraulic pressure gauges for correct readings" }, { task: "Inspect hydraulic hoses and fittings for leaks or damage" },
        { task: "Check hydraulic oil cooler for proper operation" }, { task: "Inspect hydraulic filters and replace if necessary" },
        { task: "Check hydraulic relief valve setting" }, { task: "Inspect hydraulic accumulator for proper charge (if equipped)" },
      ]},
      { equipmentId: "FP-03", equipmentName: "Feed System", tasks: [
        { task: "Check feed pump for leaks or unusual noise" }, { task: "Inspect feed pump suction and discharge lines for leaks" },
        { task: "Check feed pump motor for proper operation" }, { task: "Inspect feed tank level and condition" },
        { task: "Check feed tank agitator for proper operation (if equipped)" }, { task: "Inspect feed line pressure gauges for correct readings" },
        { task: "Check feed line flow meters for accuracy" }, { task: "Inspect feed line valves for proper operation" },
      ]},
      { equipmentId: "FP-04", equipmentName: "Ancillary Equipment", tasks: [
        { task: "Check air compressor for proper operation (if equipped)" }, { task: "Inspect air lines and fittings for leaks (if equipped)" },
        { task: "Check polymer make-up system for proper operation (if equipped)" }, { task: "Inspect polymer dosing pumps for leaks or damage (if equipped)" },
        { task: "Check cake conveyor system for proper operation (if equipped)" }, { task: "Inspect conveyor belt for wear or damage (if equipped)" },
        { task: "Check conveyor belt alignment (if equipped)" }, { task: "Inspect conveyor belt scrapers for proper operation (if equipped)" },
      ]},
    ],
    immediateAttentionTriggers: [
      "Plate cracks or damaged sealing edges", "Cylinder rod scoring or seal failure",
      "Chain elongation >3%", "Seized or hot bearings", "Misaligned frame or tie bars", "Visible hydraulic leaks",
    ],
  },

  "RO Plant Daily Inspection": [
    "Inspect Reject Water Colour", "Inspect Cartridge Filter", "Record Date of Cartridge Filter Install",
    "Inspect/Record Level of Anti-scalant", "Inspect HMI for any present Faults",
    "Inspect Pipework/Valving for Damage or Leaks",
    "Inspect Dosing Pump Function (Should be set to 25 Pulses per minute)",
    "Check Aircon Operation and Cleanliness", "Inspect and Clean Container", "Inspect Flush Tank Level",
  ],

  // ══════════════════════════════════════════════════════════════════
  // MECHANICAL WEEKLY
  // ══════════════════════════════════════════════════════════════════

  "Mill Weekly Inspection": {
    sections: [
      { equipmentId: "LUBE PUMPS", equipmentName: "Lube Pumps", tasks: [
        { task: "HIGH PRESSURE PUMP", hasPressure: true, pressureLabel: "_______ BAR" },
        { task: "LOW PRESSURE PUMP", hasPressure: true, pressureLabel: "_______ BAR" },
        { task: "CONDITIONING PUMP", hasPressure: true, pressureLabel: "_______ BAR" },
      ]},
      { equipmentId: "MILL CHECKS", equipmentName: "Mill Checks", tasks: [
        { task: "Inspect Feed Chute & Seals for Leaks/Wear. Note any Faults" },
        { task: "Inspect Trunion & Pinion Bearing Labyrinths. Note Excessive Grease" },
        { task: "Grease Pinion Bearings (4 PUMPS PER DAY)" },
        { task: "Inspect/Check Operation of Girth Gear Grease Injection System" },
        { task: "Inspect Mill Drivelines. Note any excessive noise or wear" },
        { task: "Inspect/Check operation of Girth Gear Grease Sprayer Operation. Note any Blocked Sprays" },
        { task: "Check Cycle Frequency on Girth Gear Lube and Note times (Approx 90 Seconds) (28KG-3.8KG)" },
        { task: "Record Pinion Bearing Temps (FEED END)", hasTemp: true },
        { task: "Record Pinion Bearing Temps (DISCHARGE END)", hasTemp: true },
        { task: "Inspect mill for loose or leaking liner bolts. Note any faults" },
        { task: "Inspect gearbox lube pump, radiator & hoses for operation, leaks or noise" },
        { task: "Inspect mill grease pump airline systems, Top up airline oilers & check water traps" },
        { task: "Record gearbox bearing temps - High speed Input", hasTemp: true },
        { task: "Record gearbox bearing temps - Low Speed Output", hasTemp: true },
        { task: "Check level of bulky bins & note any that are getting low" },
        { task: "Empty Grease bags" },
      ]},
      { equipmentId: "GENERAL", equipmentName: "General", tasks: [
        { task: "Inspect cyclone tower pipe work and hoppers for leaks or wear. Note any faults" },
        { task: "Inspect air compressors for operation" },
        { task: "Check main air receiver & drain water from bottom valve" },
        { task: "Check general pipe work for leaks" },
        { task: "Check condition of walkway mesh & handrails" },
        { task: "Check operation of sump pumps. Grease bearings 4 pumps each" },
      ]},
      { equipmentId: "FE-100", equipmentName: "FE-100 Hopper", tasks: [
        { task: "Inspect Feed & Discharge chutes for holes or leakage" },
        { task: "Inspect belt condition, tracking, tag any faulty rollers" },
        { task: "Inspect Feeder gearbox for noise or leaks & Record Temp", hasTemp: true },
        { task: "Inspect scraper operation & condition. Note any faults" },
        { task: "Check head & tail drum bearings for noise or lumpiness, Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Head: _______ °C / Tail: _______ °C" },
      ]},
      { equipmentId: "FE-101", equipmentName: "FE-101 Transfer Conveyor", tasks: [
        { task: "Inspect Feed & Discharge chutes for holes or leakage" },
        { task: "Inspect belt condition, tracking, tag any faulty rollers" },
        { task: "Inspect Feeder gearbox for noise or leaks", hasTemp: true },
        { task: "Inspect scraper operation & condition. Note any faults" },
        { task: "Check head & tail drum bearings for noise or lumpiness. Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Head: _______ °C / Tail: _______ °C" },
      ]},
      { equipmentId: "BC-100", equipmentName: "BC-100 Mill Feed Conveyor", tasks: [
        { task: "Inspect Feed & Discharge chutes for holes or leakage" },
        { task: "Inspect belt condition, tracking, tag any faulty rollers" },
        { task: "Inspect Feeder gearbox for noise or leaks", hasTemp: true },
        { task: "Inspect scraper operation & condition. Note any faults" },
        { task: "Check head & tail drum bearings for noise or lumpiness, Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Head: _______ °C / Tail: _______ °C" },
        { task: "Check belt tracking & tracking frames for correct operation" },
        { task: "Check conveyor belt for noisy or hot bearings. Report any issues to supervisor" },
      ]},
      { equipmentId: "CV-011", equipmentName: "CV-011 Scats Conveyor", tasks: [
        { task: "Inspect Feed chute for holes or leakage" },
        { task: "Inspect belt condition, tracking, tag any faulty rollers" },
        { task: "Inspect Feeder gearbox for noise or leaks" },
        { task: "Inspect scraper operation & condition. Note any faults" },
        { task: "Check head & tail drum bearings for noise or lumpiness & Temps, Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Thickener Side: _______ °C / Plant Side: _______ °C" },
      ]},
      { equipmentId: "MILL SUMP PUMP", equipmentName: "Mill Sump Pump", tasks: [
        { task: "Inspect Discharge pipework for holes or leakage" },
        { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
        { task: "Inspect pump operation & condition. Inspect guarding" },
        { task: "Check pump bearings for noise or lumpiness & Temps, Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Top: _______ °C / Lower: _______ °C" },
        { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Top: _______ °C / Lower: _______ °C" },
      ]},
      { equipmentId: "PU102A/PU102B", equipmentName: "Cyclone Feed Pumps PU102A/PU102B", tasks: [
        { task: "Inspect Discharge pipework for holes or leakage" },
        { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
        { task: "Inspect pump operation & condition. Inspect guarding" },
        { task: "Check pump bearings for noise or lumpiness & Temps, Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Drive: _______ °C / Non Drive: _______ °C" },
        { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Drive: _______ °C / Non Drive: _______ °C" },
      ]},
      { equipmentId: "CHILLER", equipmentName: "Mill Gearbox Cooling Chiller Unit", tasks: [
        { task: "Inspect pipework and connections for leakage" },
        { task: "Visually inspect unit for normal operation, water level etc" },
        { task: "Remove front cover and inspect/clean filters as needed" },
        { task: "Inspect Condition and Record Working Pressures", hasPressure: true, pressureLabel: "High: _______ / Low: _______" },
      ]},
    ],
  },

  "Thickener Weekly Inspection": {
    sections: [
      { equipmentName: "Thickener Tank", tasks: [
        { task: "Inspect Thickener tank for leaks" }, { task: "Check Thickener tank for signs of rust or damage" },
        { task: "Check walkways, ladders and stairs for signs of rust or damage" },
      ]},
      { equipmentName: "Hydraulic Power Pack", tasks: [
        { task: "Check fluid level in hydraulic tank (2/3rds on sight glass)" }, { task: "Check the indicator on filters" },
        { task: "Check oil breather is free from dirt build-up" },
        { task: "Visually check reservoir covers, solenoids and hose connections for oil leaks" },
        { task: "Check drip tray and drain valve are free from dirt build-up" },
      ]},
      { equipmentName: "Thickener Drive", tasks: [
        { task: "Visually check gearbox for any oil leaks" }, { task: "Check for any undue noise or vibration" },
        { task: "HS gearbox temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
        { task: "LS gearbox temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
        { task: "Ensure all safety guards are fitted correctly" },
      ]},
      { equipmentName: "Rake Lift", tasks: [
        { task: "Ensure there are no foreign objects hindering the rake lift operation" },
        { task: "Check the rake lift cylinders for leaks on the seals and connections" },
        { task: "Grease Rake Lift - 8 x Grease points", hasInput: true, inputLabel: "GP Grease" },
      ]},
      { equipmentName: "Control Panel & Instruments (PN 205)", tasks: [{ task: "Press Lamp Test on panel to check indicator lights" }]},
      { equipmentName: "Floc Box", tasks: [
        { task: "Check for signs of leakage at the fittings between the Floc Box, valves and piping" },
        { task: "Visually inspect the box for signs of build-up of solids" },
      ]},
      { equipmentName: "Flocculant Powder Hopper", tasks: [
        { task: "Confirm heater is operational and area is warm and clean to prevent any blockage" },
        { task: "Check Anti-Static powder hose for wear" },
        { task: "Ensure that all services are properly connected and check for any water or air leaks" },
      ]},
      { equipmentName: "Flocculant Mixing Tank", tasks: [
        { task: "Inspect Dispersion Cylinder for any algae/scale build-up" },
        { task: "Inspect Dispersion Spigot and Nozzles for any gel build-up" },
      ]},
      { equipmentName: "Underflow Pump A", tasks: [
        { task: "Running or Standby (skip if pump on standby)", hasInput: true, inputLabel: "Running □ Standby □" },
        { task: "Bearing assembly temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
        { task: "Gland water pressure (Serviceable range: ~400 kPa)", hasInput: true, inputLabel: "Pressure: _______ kPa" },
        { task: "Check gland leakage and adjust if required" },
      ]},
      { equipmentName: "Underflow Pump B", tasks: [
        { task: "Running or Standby (skip if pump on standby)", hasInput: true, inputLabel: "Running □ Standby □" },
        { task: "Bearing assembly temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
        { task: "Gland water pressure (Serviceable range: ~400 kPa)", hasInput: true, inputLabel: "Pressure: _______ kPa" },
        { task: "Check gland leakage and adjust if required" },
      ]},
      { equipmentName: "Thickener Sump Pump", tasks: [{ task: "Check pump for heat, noise and vibration" }]},
    ],
  },

  "Top of Tanks Weekly Inspection": {
    sections: [
      { equipmentName: "Leach Tank 1 - Gearbox, Agitator 5-AG-1", tasks: [
        { task: "Check for leaks, vibration, noise" }, { task: "Check agitator operation" }, { task: "Check condition of launders" },
        { task: "Grease Gearbox" }, { task: "Check condition of walkway mesh & handrails" },
        { task: "Visually check hold down bolts are tight" },
        { task: "HS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
      ]},
      { equipmentName: "Trash Screen", tasks: [
        { task: "Check Screen Operation" }, { task: "Visually check Screen Springs condition" },
        { task: "Check Discharge Pipe for Build up / Blockage" }, { task: "Check all pipework and valves for leaks" },
        { task: "Check screen overflow is not blocked" }, { task: "Check working condition of Spray bar" },
        { task: "Visually check Screen Vibrators operation, noise and fasteners" }, { task: "Check Screens are not Pegged/blocked" },
      ]},
      { equipmentName: "Leach Tank 2 - Gearbox, Agitator 5-AG-2", tasks: [
        { task: "Check for leaks, vibration, noise" }, { task: "Visually check hold down bolts are tight" },
        { task: "Check agitator operation" }, { task: "Check condition of launders" }, { task: "Grease Gearbox" },
        { task: "Check condition of walkway mesh & handrails" },
        { task: "HS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
        { task: "LS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
        { task: "Air Sparge Condition" },
      ]},
      { equipmentName: "Gearbox, Agitator; CIP Tank #3", tasks: [
        { task: "Check for leaks, vibration, noise" }, { task: "Check agitator operation" }, { task: "Check condition of launders" },
        { task: "Grease Gearbox" }, { task: "Check operation of airleg and pipework for leaks" },
        { task: "Check condition of walkway mesh & handrails" }, { task: "Visually check hold down bolts are tight" },
        { task: "HS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
        { task: "LS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
      ]},
      { equipmentName: "Loaded Carbon Screen", tasks: [
        { task: "Check Screen Operation" }, { task: "Visually check Screen Springs condition" },
        { task: "Check Discharge Pipe for Build up / Blockage" }, { task: "Check all pipework and valves for leaks" },
        { task: "Check screen overflow is not blocked" }, { task: "Check working condition of Spray bar" },
        { task: "Visually check Screen Vibrators operation, noise and fasteners" }, { task: "Check Screens are not Pegged/blocked" },
      ]},
      { equipmentName: "CIP Tanks #4-8 Gearboxes & Agitators", tasks: [
        { task: "Check for leaks, vibration, noise (all tanks)" }, { task: "Check agitator operation (all tanks)" },
        { task: "Check condition of launders (all tanks)" }, { task: "Grease all Gearboxes" },
        { task: "Check condition of walkway mesh & handrails (all tanks)" },
        { task: "Visually check hold down bolts are tight (all tanks)" },
        { task: "HS/LS gearbox bearing temperatures (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Record temps" },
        { task: "Air Sparge Condition (Tank 5)" },
      ]},
      { equipmentName: "Carbon Sizing Screen", tasks: [
        { task: "Check Screen Operation" }, { task: "Visually check Screen Springs condition" },
        { task: "Check Discharge Pipe for Build up / Blockage" }, { task: "Check all pipework and valves for leaks" },
        { task: "Check screen overflow is not blocked" }, { task: "Check working condition of Spray bar" },
        { task: "Visually check Screen Vibrators operation, noise and fasteners" }, { task: "Check Screens are not Pegged/blocked" },
      ]},
      { equipmentName: "Gantry Crane 2.5t", tasks: [
        { task: "Check operation of crane" }, { task: "Check Crane prestart book for any faults" },
        { task: "Inspect Crane hook for any damage" }, { task: "Check lifting equipment is in test date" },
        { task: "Visually Check buzz bar / brackets" },
      ]},
      { equipmentName: "General Inspections", tasks: [
        { task: "Inspect all walkway mesh and hold down clips" }, { task: "Check all handrails" },
        { task: "Check Airleg air manifold for leaks or damage" },
      ]},
    ],
  },

  "Bottom of Tanks Weekly Inspection": {
    sections: [
      { equipmentName: "Tank 1", tasks: [{ task: "Check bund for leaks or spills" }, { task: "Check tank for corrosion" }, { task: "Inspect level indicators for proper function" }]},
      { equipmentName: "Tank 2", tasks: [{ task: "Check bund for leaks or spills" }, { task: "Check tank for corrosion" }]},
      { equipmentName: "Tank 3", tasks: [{ task: "Check bund for leaks or spills" }, { task: "Check tank for corrosion" }]},
      { equipmentName: "Tank 4", tasks: [{ task: "Check bund for leaks or spills" }, { task: "Check tank for corrosion" }]},
      { equipmentName: "Tank 5", tasks: [{ task: "Check bund for leaks or spills" }, { task: "Check tank for corrosion" }]},
      { equipmentName: "Tank 6", tasks: [{ task: "Check bund for leaks or spills" }, { task: "Check tank for corrosion" }]},
      { equipmentName: "Tank 7", tasks: [{ task: "Check bund for leaks or spills" }, { task: "Check tank for corrosion" }]},
    ],
  },

  "Gold Room Weekly Inspection": {
    sections: [
      { equipmentName: "Electrowinning Cells", tasks: [
        { task: "Visual inspection of cells for leaks or damage" }, { task: "Check electrical connections for corrosion or loose connections" },
        { task: "Inspect anodes and cathodes for wear or buildup" }, { task: "Verify proper electrolyte levels" },
      ]},
      { equipmentName: "Sludge Pumps", tasks: [
        { task: "Inspect pump housing and connections for leaks" }, { task: "Check motor and electrical connections" },
        { task: "Listen for unusual noises or vibrations during operation" }, { task: "Verify proper flow rates" },
      ]},
      { equipmentName: "Furnace Equipment", tasks: [
        { task: "Inspect furnace shell for cracks or hot spots" }, { task: "Check burner operation and flame stability" },
        { task: "Verify proper temperature control settings" }, { task: "Inspect exhaust system for leaks or blockages" },
      ]},
    ],
  },

  "Grease & Oils Weekly Inspection": [
    { task: "Renolin CLP 320", recommendedAmount: "1000L" },
    { task: "Renolin CLP 220", recommendedAmount: "1000L" },
    { task: "Hydraulic 46", recommendedAmount: "1000L" },
    { task: "Hydraulic 68", recommendedAmount: "400L" },
    { task: "XTB2 General Purpose Grease Cartridges", recommendedAmount: "36" },
    { task: "Electrical Motor Grease Cartridges", recommendedAmount: "24" },
  ],

  "Reagents Weekly Inspection": {
    sections: [
      { equipmentName: "Cyanide Monorail", tasks: [
        { task: "Check operation of crane" }, { task: "Inspect Crane hook for any damage" }, { task: "Check lifting equipment is in test date" },
      ]},
      { equipmentName: "Cyanide Mixing Tank and Agitator", tasks: [
        { task: "Check Tank for any damage or rust" }, { task: "Check that there is no obstruction on agitator motor fan" },
        { task: "HS gearbox temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
        { task: "LS gearbox temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
      ]},
      { equipmentName: "Cyanide Solution Transfer Pump", tasks: [
        { task: "Check pump condition" }, { task: "Check pump for heat, noise and vibration" }, { task: "Check inlet and outlet connection, look for leaks" },
      ]},
      { equipmentName: "Cyanide Dosing Pump (Duty)", tasks: [
        { task: "Check pump condition" }, { task: "Check pump for heat, noise and vibration" }, { task: "Check inlet and outlet connection, look for leaks" },
      ]},
      { equipmentName: "Cyanide Dosing Pump (Standby)", tasks: [
        { task: "Check pump condition" }, { task: "Check pump for heat, noise and vibration" }, { task: "Check inlet and outlet connection, look for leaks" },
      ]},
      { equipmentName: "Back Pressure Valve", tasks: [
        { task: "Visual inspection of Back Pressure Valve (stainless steel). Look for any rust penetrations, leaks on junctions or damages" },
      ]},
      { equipmentName: "Cyanide Area Sump Pump", tasks: [
        { task: "Check pipework condition and look for leaks" }, { task: "Check operation of sump pump" }, { task: "Check pump for heat, noise and vibration" },
      ]},
    ],
  },

  "Diesel Farm Weekly Inspection": {
    sections: [
      { equipmentName: "CIP Plant Fuel Tank", tasks: [
        { task: "Check Condition of hoses" }, { task: "Check condition of fuel nozzles" }, { task: "Check pumps" },
        { task: "Check all connections" }, { task: "Check for Leaks" }, { task: "Check Fire extinguisher" }, { task: "Check/replace spill kit" },
      ]},
      { equipmentName: "Crusher Fuel Tank", tasks: [
        { task: "Check Discharge Pipe for Build up / Blockage" }, { task: "Check all pipework and valves for leaks" },
        { task: "Check working condition of Spray bar" }, { task: "Visually check Screen Vibrators operation, noise and fasteners" },
        { task: "Check Condition of hoses" }, { task: "Check condition of fuel nozzles" }, { task: "Check pumps" },
        { task: "Check all connections" }, { task: "Check for Leaks" }, { task: "Check Fire extinguisher" }, { task: "Check/replace spill kit" },
      ]},
    ],
  },

  "Potable Water Weekly Inspection": {
    sections: [
      { equipmentName: "Potable Water System", tasks: [
        { task: "Inspect Potable Water Filter Housings" }, { task: "Inspect Cartridge Filter" },
        { task: "Record Date of Cartridge Filter Install", hasInput: true, inputLabel: "Install Date: _______" },
        { task: "Inspect UV Light (Functioning or Not)" },
        { task: "Inspect and Record Potable Water Level in Potable Water Tank", hasInput: true, inputLabel: "Level: _______%" },
        { task: "Inspect Pipework/Valving for Damage or Leaks" }, { task: "Inspect Potable Pump" },
      ]},
    ],
  },

  "Air & Water Services Weekly Inspection": {
    sections: [
      { equipmentName: "Water Pump 1", tasks: [
        { task: "Inspect pump and motor for unusual noise or vibration" }, { task: "Check pump and motor for leaks" },
        { task: "Inspect pipework and fittings for leaks or damage" }, { task: "Check the condition of the pump mounting base" },
        { task: "Inspect electrical connections for corrosion or damage" }, { task: "Check the operation of the pump control panel" },
        { task: "Verify the pump is operating at the correct pressure and flow rate" },
        { task: "Inspect the condition of the pump suction strainer" }, { task: "Check the pump gland packing for proper adjustment" },
        { task: "Inspect the pump coupling for wear or damage" }, { task: "Check motor DE and NDE bearing temperature", hasTemp: true },
      ]},
      { equipmentName: "Water Pump 2", tasks: [
        { task: "Inspect pump and motor for unusual noise or vibration" }, { task: "Check pump and motor for leaks" },
        { task: "Inspect pipework and fittings for leaks or damage" }, { task: "Check the condition of the pump mounting base" },
        { task: "Inspect electrical connections for corrosion or damage" }, { task: "Check the operation of the pump control panel" },
        { task: "Verify the pump is operating at the correct pressure and flow rate" },
        { task: "Inspect the condition of the pump suction strainer" }, { task: "Check the pump gland packing for proper adjustment" },
        { task: "Inspect the pump coupling for wear or damage" }, { task: "Check motor DE and NDE bearing temperature", hasTemp: true },
      ]},
      { equipmentName: "Air Compressor 1", tasks: [
        { task: "Inspect compressor and motor for unusual noise or vibration" }, { task: "Check compressor and motor for leaks" },
        { task: "Inspect pipework and fittings for leaks or damage" }, { task: "Check the condition of the compressor mounting base" },
        { task: "Inspect electrical connections for corrosion or damage" }, { task: "Check the operation of the compressor control panel" },
        { task: "Verify the compressor is operating at the correct pressure" },
        { task: "Inspect the condition of the compressor air filter" }, { task: "Check the compressor oil level" },
        { task: "Inspect the compressor belt for wear or damage" }, { task: "Check motor DE and NDE bearing temperature", hasTemp: true },
      ]},
      { equipmentName: "Air Compressor 2", tasks: [
        { task: "Inspect compressor and motor for unusual noise or vibration" }, { task: "Check compressor and motor for leaks" },
        { task: "Inspect pipework and fittings for leaks or damage" }, { task: "Check the condition of the compressor mounting base" },
        { task: "Inspect electrical connections for corrosion or damage" }, { task: "Check the operation of the compressor control panel" },
        { task: "Verify the compressor is operating at the correct pressure" },
        { task: "Inspect the condition of the compressor air filter" }, { task: "Check the compressor oil level" },
        { task: "Inspect the compressor belt for wear or damage" }, { task: "Check motor DE and NDE bearing temperature", hasTemp: true },
      ]},
    ],
  },

  "Acid Wash & Elution Weekly Inspection": {
    sections: [
      { equipmentName: "Elution Tank", tasks: [
        { task: "Check for leaks (seals, flanges, body)" }, { task: "Inspect tank supports and structure" }, { task: "Check level indicators for functionality" },
      ]},
      { equipmentName: "Elution Pump", tasks: [
        { task: "Inspect pump for leaks (seals, flanges, body)" }, { task: "Check pump mounting and base" },
        { task: "Inspect coupling and guard" }, { task: "Check motor fan and cowling" }, { task: "Check motor terminal box for integrity" },
        { task: "Check pressure gauge", hasInput: true, inputLabel: "Pressure (kPa):" },
      ]},
      { equipmentName: "Acid Tank", tasks: [
        { task: "Check for leaks (seals, flanges, body)" }, { task: "Inspect tank supports and structure" }, { task: "Check level indicators for functionality" },
      ]},
      { equipmentName: "Acid Pump", tasks: [
        { task: "Inspect pump for leaks (seals, flanges, body)" }, { task: "Check pump mounting and base" },
        { task: "Inspect coupling and guard" }, { task: "Check motor fan and cowling" }, { task: "Check motor terminal box for integrity" },
        { task: "Check pressure gauge", hasInput: true, inputLabel: "Pressure (kPa):" },
      ]},
      { equipmentName: "Elution Valves", tasks: [
        { task: "Inspect valve body for leaks" }, { task: "Check valve actuator and linkages" }, { task: "Inspect position indicators" },
      ]},
      { equipmentName: "Elution Piping", tasks: [
        { task: "Inspect pipe supports and hangers" }, { task: "Check pipe for corrosion or damage" }, { task: "Inspect flanges and fittings for leaks" },
      ]},
      { equipmentName: "Elution Instruments", tasks: [
        { task: "Check instrument mounting and protection" }, { task: "Inspect wiring and connections" },
        { task: "Verify instrument readings", hasInput: true, inputLabel: "Reading:" },
      ]},
    ],
  },

  "Filter Press Weekly Inspection": {
    sections: [
      { equipmentId: "01-ES-001", equipmentName: "Emergency Stop System", tasks: [{ task: "Check All Estops are Functioning" }, { task: "Check All Estops are Accessible" }]},
      { equipmentId: "01-LT-001", equipmentName: "Lighting Tower", tasks: [{ task: "Check Tower Lights are Functioning" }, { task: "Check Tower Structure" }]},
      { equipmentId: "13-MN-001", equipmentName: "Main Air Compressor", tasks: [
        { task: "Check Oil Level" }, { task: "Check Auto Drains are operational" },
        { task: "Check for Leaks or Damage" }, { task: "Check all Pipework and Valves for leaks or damage" },
      ]},
      { equipmentId: "13-MN-002", equipmentName: "Main Air Receiver", tasks: [
        { task: "Check Auto Drains are operational" }, { task: "Check for Leaks or Damage" }, { task: "Check all Pipework and Valves for leaks or damage" },
      ]},
      { equipmentId: "13-FP-101", equipmentName: "Filter Press 1", tasks: [
        { task: "Check all Plate connection bolts and chains" }, { task: "Check all Air actuated Rams, fittings and hoses for leaks and damage" },
        { task: "Check Trough for leaks and Clear of Cake" }, { task: "Check Plate slide for build up or damage" },
        { task: "Check Hydraulic Tank Level, top up if required" }, { task: "Check all Hydraulic lines for leaks or damage" },
        { task: "Check Handrails and Walkway mesh" }, { task: "Check all Guarding" },
      ]},
      { equipmentId: "13-FP-102", equipmentName: "Filter Press 2", tasks: [
        { task: "Check all Plate connection bolts and chains" }, { task: "Grease Plate wheel assembly located at end of filter top level" },
        { task: "Check all Air actuated Rams, fittings and hoses for leaks and damage" }, { task: "Check Trough for leaks and Clear of Cake" },
        { task: "Check Plate slide for build up or damage" }, { task: "Check Hydraulic Tank Level, top up if required" },
        { task: "Check all Hydraulic lines for leaks or damage" }, { task: "Check Handrails and Walkway mesh" }, { task: "Check all Guarding" },
      ]},
      { equipmentId: "13-CV-101", equipmentName: "Filter Press 1 Conveyor", tasks: [
        { task: "Check Head End Tail Drum Bearings for Noise or heat", hasTemp: true }, { task: "Check Tail end Bearings for heat or Noise", hasTemp: true },
        { task: "Grease Head and Tail end Bearing Assembly" }, { task: "Check Guarding" }, { task: "Check all Rollers. Trough, Return and Guide" },
        { task: "Check all scrapers, V-plough position & condition" }, { task: "Check Drive belts" }, { task: "Check gearbox for unusual noise or Leaks" }, { task: "Check Skirts Condition" },
      ]},
      { equipmentId: "13-CV-102", equipmentName: "Filter Press 2 Conveyor", tasks: [
        { task: "Check Head End Tail Drum Bearings for Noise or heat", hasTemp: true }, { task: "Check Tail end Bearings for heat or Noise", hasTemp: true },
        { task: "Grease Head and Tail end Bearing Assembly" }, { task: "Check Guarding" }, { task: "Check all Rollers. Trough, Return and Guide" },
        { task: "Check all scrapers, V-plough position & condition" }, { task: "Check Drive belts" }, { task: "Check gearbox for unusual noise or Leaks" }, { task: "Check Skirts Condition" },
      ]},
      { equipmentId: "13-CV-103", equipmentName: "Transfer Conveyor", tasks: [
        { task: "Check Head End Tail Drum Bearings for Noise or heat", hasTemp: true }, { task: "Check Tail end Bearings for heat or Noise", hasTemp: true },
        { task: "Grease Head and Tail end Bearing Assembly" }, { task: "Check Guarding" }, { task: "Check all Rollers. Trough, Return and Guide" },
        { task: "Check all scrapers, V-plough position & condition" }, { task: "Check Drive belts" }, { task: "Check gearbox for unusual noise or Leaks" }, { task: "Check Skirts Condition" },
      ]},
      { equipmentId: "13-CV-104", equipmentName: "Radial Conveyor", tasks: [
        { task: "Check Head End Tail Drum Bearings for Noise or heat", hasTemp: true }, { task: "Check Tail end Bearings for heat or Noise", hasTemp: true },
        { task: "Grease Head and Tail end Bearing Assembly" }, { task: "Check Guarding" }, { task: "Check all Rollers. Trough, Return and Guide" },
        { task: "Check all scrapers, V-plough position & condition" }, { task: "Check Drive belts" }, { task: "Check gearbox for unusual noise or Leaks" },
        { task: "Check Skirts Condition" }, { task: "Check Drive wheels" }, { task: "Check Conveyor Turn Table" },
      ]},
      { equipmentId: "13-PU-101", equipmentName: "Filter Press Feed Pump 1", tasks: [
        { task: "Check Guarding/Mounts" }, { task: "Check Pipework and Valves for leaks or Damage" }, { task: "Check Drive Belts for any wear marks" },
        { task: "Check Oil Level" }, { task: "Bearing assembly temperature, Serviceable range: < 80°C", hasTemp: true },
        { task: "Gland water pressure Serviceable range: ~400 kPa", hasPressure: true }, { task: "Check gland leakage and adjust if required" },
      ]},
      { equipmentId: "13-PU-102", equipmentName: "Filter Press Feed Pump 2", tasks: [
        { task: "Check Guarding/Mounts" }, { task: "Check Pipework and Valves for leaks or Damage" }, { task: "Check Drive Belts for any wear marks" },
        { task: "Check Oil Level" }, { task: "Bearing assembly temperature, Serviceable range: < 80°C", hasTemp: true },
        { task: "Gland water pressure Serviceable range: ~400 kPa", hasPressure: true }, { task: "Check gland leakage and adjust if required" },
        { task: "Check pump for heat, noise and vibration" },
      ]},
      { equipmentId: "13-CP-100, 13-AR-101, 13-AR-102, 13-AR-103, 13-AR-104", equipmentName: "Filter Press Air Compressor and Air Receivers", tasks: [
        { task: "Clean Air Filter" }, { task: "Clean top Filters" }, { task: "Check oil level" },
        { task: "Check Auto Drains are operational" }, { task: "Check Receivers for Leaks or Damage" }, { task: "Check all Pipework and Valves for leaks or damage" },
      ]},
    ],
  },

  "Filter Press Compressor (Online) Weekly Inspection": {
    sections: [
      { equipmentName: "Motor", tasks: [
        { task: "Observe motor and drive assembly for smooth rotation" }, { task: "Check Motor Temperature" },
        { task: "Motor Temp Guidelines (Online): Normal: 40–75 °C | Monitor: 75–85 °C | Warning: 85–95 °C | Critical: >95 °C – investigate urgently" },
      ]},
      { equipmentName: "Bearings", tasks: [{ task: "Check Temperature of all bearings" }, { task: "Listen for unusual bearing noise" }]},
      { equipmentName: "Integrated Refrigerant Dryer", tasks: [
        { task: "Monitor dryer inlet & outlet temperatures (via HMI/PLC)" }, { task: "Listen for unusual dryer fan noise" },
        { task: "Check for condensate drain cycling activity" },
      ]},
      { equipmentName: "Cooling System", tasks: [
        { task: "Observe cooling fan(s) running normally" }, { task: "Check airflow around compressor fins / heat exchangers" },
        { task: "Scan radiator or condenser area for hot spots" },
      ]},
    ],
    mechanicalAlerts: [
      "Motor or bearing temp >95 °C", "Persistent or increasing vibration", "Unusual knocking / grinding noises",
      "Coupling misalignment", "Reduced airflow over cooling surfaces", "Condensate drain failure or dryer performance issues",
      "Safety interlocks showing warnings",
    ],
  },

  "Filter Press Compressor (Offline) Weekly Inspection": {
    sections: [
      { equipmentName: "Motor and Drive Assembly", tasks: [
        { task: "Inspect motor exterior for dust buildup or overheating marks" },
        { task: "Manually rotate shaft (if accessible) – check for smooth rotation" },
        { task: "Inspect motor mounting bolts and base tightness" }, { task: "Check coupling or belt alignment" },
        { task: "Inspect flexible coupling insert for cracks or wear" }, { task: "Inspect motor cooling fan and shroud condition" },
      ]},
      { equipmentName: "Compressor Element", tasks: [
        { task: "Inspect air end housing for oil leaks" }, { task: "Check mounting bolts for tightness" },
        { task: "Inspect inlet valve linkage and movement" }, { task: "Inspect discharge piping connections" },
        { task: "Check vibration isolators / mounts condition" },
      ]},
      { equipmentName: "Bearings & Rotating Components", tasks: [
        { task: "Inspect exposed bearings for grease leakage" }, { task: "Check bearing housings for discoloration" },
        { task: "Verify bearing locking collars or retaining hardware" }, { task: "Check shaft seals condition" },
        { task: "Re-grease bearings if applicable" }, { task: "Record bearing condition and trend observations" },
      ]},
      { equipmentName: "Drive Couplings and Belts", tasks: [
        { task: "Inspect belts for cracks, glazing, fraying" }, { task: "Check belt tension" },
        { task: "Inspect pulley wear and alignment" }, { task: "Inspect rigid or flexible coupling for wear" },
      ]},
      { equipmentName: "Integrated Refrigerant Dryer", tasks: [
        { task: "Inspect and clean dryer condenser and evaporator coils" }, { task: "Inspect refrigerant lines for oil residue or leaks" },
        { task: "Check dryer fan blades and motor mounting" }, { task: "Inspect automatic condensate drain assembly" },
        { task: "Verify drain solenoid condition" }, { task: "Check insulation integrity" },
      ]},
      { equipmentName: "Cooling System", tasks: [
        { task: "Clean radiator / oil cooler fins" }, { task: "Inspect cooling fan blades for cracks" },
        { task: "Check fan motor mounting bolts" }, { task: "Inspect airflow path for obstructions" },
        { task: "Clean internal cabinet dust buildup" }, { task: "Clean all Filters" },
      ]},
      { equipmentName: "Structure", tasks: [
        { task: "Inspect base frame for cracks or corrosion" }, { task: "Check anchor bolts tightness" },
        { task: "Inspect vibration pads or anti-vibration mounts" }, { task: "Inspect enclosure panels and hinges" },
      ]},
    ],
    mechanicalFindings: [
      "Excessive shaft play", "Bearing roughness during manual rotation", "Oil leakage from air end",
      "Cracked coupling insert", "Loose anchor bolts", "Damaged vibration mounts", "Refrigerant oil traces at fittings",
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // MECHANICAL GENERATORS WEEKLY
  // ══════════════════════════════════════════════════════════════════

  "Admin Generator Weekly Inspection": {
    sections: [
      { equipmentName: "Visual Running Checks", tasks: [
        { task: "Check all gauges" },
        { task: "Check Engine Protection Relay, record fault history, Engine Hours etc.", hasInput: true, inputLabel: "Engine Hours:" },
        { task: "Walk around Unit - Visually Inspect/Listen for Damage/Defects" },
        { task: "Open all doors - Visually Inspect/Listen for Damage/Defects i.e Excessive vibration, loose/rattling components or panels, leaking exhaust/Turbo etc." },
        { task: "Check Engine Guards are in place and compliant" }, { task: "Push Emergency Stop Button to Shut Unit Down" }, { task: "Check Exhaust Flap closes" },
      ]},
      { equipmentName: "Fire Extinguisher", tasks: [{ task: "Check fire extinguisher charged and mounted securely" }]},
      { equipmentName: "Electrical Offline", tasks: [
        { task: "Check battery Isolator is Operational & Lockable" }, { task: "Check battery & battery Cabling" },
        { task: "Check battery terminals are tight and corrosion free" }, { task: "Check condition of all battery, starter and alternator cables" },
        { task: "Check wiring harnesses are securely mounted and undamaged" }, { task: "Check battery electrolyte level and that batteries are mounted securely" },
        { task: "Check Engine and Generator Mounts" }, { task: "Check Generator Cabling - look for signs of damage, chaffing, secured etc." },
        { task: "Check Generator covers and guards are all in place" }, { task: "Check Main Switch/ Circuit Breaker is Operational and Lockable" },
        { task: "Check Main Switch/ Circuit Breaker is Labelled" },
      ]},
      { equipmentName: "General", tasks: [
        { task: "Check all engine hoses, pipes and clamps for damage" }, { task: "Check engine alternator and fan v-belt adjustment" },
        { task: "Check Engine alternator mounted securely" }, { task: "Check for engine oil leaks" },
        { task: "Check fuel hoses mounted securely, replace any chafed or worn hoses" }, { task: "Check/drain Fuel Filters" },
        { task: "Check all radiator hoses, clamps and coolant lines for deterioration or damage" }, { task: "Check radiator for damage, blockage and leaks" },
      ]},
      { equipmentName: "Service Items", tasks: [
        { task: "Check outer air filter and clean if necessary" }, { task: "Check/Top up Coolant level" },
        { task: "Check/Top up Engine Oil level" }, { task: "Prestart Check, Close all doors & Restart" }, { task: "Clean Pre-filter" },
      ]},
      { equipmentName: "Restart Unit - Electrical (Online)", tasks: [
        { task: "Check all gauges" }, { task: "Check Engine Protection Relay" }, { task: "Check operation of all emergency stop switches (if equipped)" },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // OPS / MOBILE EQUIPMENT DAILY
  // ══════════════════════════════════════════════════════════════════

  "CAT D8 Dozer Daily Inspection": {
    sections: [
      { sectionName: "Walk Around Inspection", items: [
        { id: "1", description: "Check for visible damage to the dozer frame, blade, and ripper" },
        { id: "2", description: "Inspect guards, panels, and covers for proper attachment" },
        { id: "3", description: "Check for fluid leaks (oil, fuel, coolant, hydraulic)" },
        { id: "4", description: "Check for loose or missing bolts, nuts, or pins" },
        { id: "5", description: "Ensure steps, handrails, and safety decals are intact" },
      ]},
      { sectionName: "Fluids & Levels", items: [
        { id: "6", description: "Engine oil level" }, { id: "7", description: "Coolant level" }, { id: "8", description: "Fuel level" },
        { id: "9", description: "Hydraulic oil level" }, { id: "10", description: "Transmission oil levels" }, { id: "11", description: "Battery electrolyte level (if applicable)" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "12", description: "Inspect for oil, coolant, or fuel leaks" }, { id: "13", description: "Check belts for wear and tension" },
        { id: "14", description: "Check air filter restriction indicator" }, { id: "15", description: "Inspect air intake hoses and clamps" },
        { id: "16", description: "Check radiator/cooler areas for dust buildup" },
        { id: "17", description: "Check exhaust system for cracks, soot leaks, or loose fittings" },
      ]},
      { sectionName: "Electrical System", items: [
        { id: "18", description: "Battery terminals clean and secure" }, { id: "19", description: "Battery isolator functional and in correct position" },
        { id: "20", description: "Control panel displays working" }, { id: "21", description: "Battery terminals secure and clean" },
        { id: "22", description: "Wiring secure, no exposed or damaged cables" }, { id: "23", description: "Lights and indicators operational" },
        { id: "24", description: "Warning indicators off" },
      ]},
      { sectionName: "Hydraulic System", items: [
        { id: "25", description: "Inspect hoses, fittings, and cylinders for leaks" },
        { id: "26", description: "Check blade, ripper, and lift cylinders for damage" }, { id: "27", description: "Check hydraulic filter condition" },
      ]},
      { sectionName: "Blade & Attachments", items: [
        { id: "28", description: "Inspect blade for cracks, wear, or damage" }, { id: "29", description: "Check mounting pins and bushings" },
        { id: "30", description: "Inspect ripper and teeth for wear or damage" }, { id: "31", description: "Verify proper attachment function" },
      ]},
      { sectionName: "Operator Cab / Safety", items: [
        { id: "32", description: "Check seat, seatbelt, and controls for proper operation" }, { id: "33", description: "Fire extinguisher present and charged" },
        { id: "34", description: "Horn, backup alarm, and mirrors functional" }, { id: "35", description: "Windows and doors operate correctly" },
      ]},
      { sectionName: "Operational Checks", items: [
        { id: "36", description: "Engine starts smoothly with no unusual noise" },
        { id: "37", description: "Monitor gauges: oil pressure, coolant temp, hydraulic pressure" },
        { id: "38", description: "Test blade, ripper, and travel functions" }, { id: "39", description: "Shutdown normal with no alarms" },
      ]},
    ],
  },

  "Loader Daily Inspection": {
    sections: [
      { sectionName: "Walk Around Inspection", items: [
        { id: "1", description: "Check for body damage, loose panels, cracked welds" },
        { id: "2", description: "Check handrails, steps, and platforms for safety" },
        { id: "3", description: "Check fuel, oil, or coolant leaks under machine" },
        { id: "4", description: "Ensure all safety decals are clean and readable" },
      ]},
      { sectionName: "Fluids & Levels", items: [
        { id: "5", description: "Engine oil level" },
        { id: "6", description: "Coolant level" },
        { id: "7", description: "Hydraulic oil level" },
        { id: "8", description: "Transmission oil level (sight gauge)" },
        { id: "9", description: "Fuel level" },
        { id: "10", description: "AdBlue / DEF level (if equipped)" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "11", description: "Inspect for oil, coolant, or fuel leaks" },
        { id: "12", description: "Check belts for wear and tension" },
        { id: "13", description: "Check air filter restriction indicator" },
        { id: "14", description: "Inspect air intake hoses and clamps" },
        { id: "15", description: "Check radiator/cooler areas for dust buildup" },
        { id: "16", description: "Inspect radiator and cooler fins for blockage or damage" },
        { id: "17", description: "Verify fan operation is normal" },
      ]},
      { sectionName: "Hydraulic System", items: [
        { id: "18", description: "Check hoses and fittings for leaks or damage" },
        { id: "19", description: "Inspect lift and tilt cylinders for leaks" },
        { id: "20", description: "Inspect hydraulic tank area for leaks" },
        { id: "21", description: "Confirm bucket, lift, and tilt functions operate smoothly" },
      ]},
      { sectionName: "Auto Greaser", items: [
        { id: "22", description: "Grease reservoir level" },
        { id: "23", description: "Greaser pump cycles normally" },
        { id: "24", description: "No damaged, leaking, or missing grease lines" },
      ]},
      { sectionName: "Tires", items: [
        { id: "25", description: "Tire pressure visually OK" },
        { id: "26", description: "No cuts, cracks, or sidewall damage" },
        { id: "27", description: "No missing or loose wheel nuts" },
        { id: "28", description: "Hubs show no signs of overheating or oil leak" },
      ]},
      { sectionName: "Steering", items: [
        { id: "29", description: "Check articulation area for debris buildup" },
        { id: "30", description: "No excessive free play in articulation joint" },
        { id: "31", description: "Steering cylinders not leaking" },
        { id: "32", description: "Oscillation joint functioning normally" },
        { id: "33", description: "Axles free of leaks" },
      ]},
      { sectionName: "Braking", items: [
        { id: "34", description: "Service brakes functioning normally" },
        { id: "35", description: "Parking brake holding correctly" },
        { id: "36", description: "No brake warning indicators on display" },
      ]},
      { sectionName: "Bucket", items: [
        { id: "37", description: "Cutting edges and teeth intact" },
        { id: "38", description: "No cracks or damage on bucket" },
        { id: "39", description: "Linkage pins and bushes appear lubricated and secure" },
      ]},
      { sectionName: "Electrical", items: [
        { id: "40", description: "Lights (work lights, indicators, beacon, brake lights) operating" },
        { id: "41", description: "Horn functioning" },
        { id: "42", description: "Reverse alarm works" },
        { id: "43", description: "Battery terminals secure and clean" },
        { id: "44", description: "No exposed or damaged wiring" },
      ]},
      { sectionName: "Cab", items: [
        { id: "45", description: "Seatbelt in good condition" },
        { id: "46", description: "Mirrors and windows clean and intact" },
        { id: "47", description: "HVAC functioning" },
        { id: "48", description: "Check Cab air filter" },
        { id: "49", description: "Fire extinguisher present and charged" },
        { id: "50", description: "First-aid kit present" },
        { id: "51", description: "Monitor/display functioning with no active warnings" },
      ]},
      { sectionName: "Operational Checks", items: [
        { id: "52", description: "Engine starts smoothly with no unusual noise" },
        { id: "53", description: "Gauges and warning lights normal" },
        { id: "54", description: "Steering responsive" },
        { id: "55", description: "Hydraulics responsive and smooth" },
        { id: "56", description: "Smooth gear shifting" },
        { id: "57", description: "Test brake holding before travel" },
      ]},
    ],
  },

  "Dozer Weekly Inspection": {
    sections: [
      { sectionName: "Walk Around Inspection", items: [
        { id: "1", description: "Inspect the dozer frame, blade, ripper, and attachments for damage or cracks" },
        { id: "2", description: "Inspect guards, panels, and covers for correct attachment" },
        { id: "3", description: "Check for fluid leaks (oil, fuel, coolant, hydraulic)" },
        { id: "4", description: "Ensure steps, handrails, and safety decals are intact" },
        { id: "5", description: "Check mounting bolts, nuts, and pins for tightness" },
      ]},
      { sectionName: "Fluids & Levels", items: [
        { id: "6", description: "Engine oil level" },
        { id: "7", description: "Coolant level" },
        { id: "8", description: "Fuel level" },
        { id: "9", description: "Battery electrolyte level (if applicable)" },
        { id: "10", description: "Transmission and final drive oil levels" },
        { id: "11", description: "DEF / AdBlue level (if applicable)" },
        { id: "12", description: "Verify hydraulic oil levels" },
      ]},
      { sectionName: "Engine System", items: [
        { id: "13", description: "Inspect for oil, coolant, or fuel leaks" },
        { id: "14", description: "Check belts for wear and tension" },
        { id: "15", description: "Inspect air filter and restriction indicator" },
        { id: "16", description: "Check air intake hoses and clamps" },
        { id: "17", description: "Inspect exhaust system for leaks or damage" },
        { id: "18", description: "Check turbocharger and intercooler (if fitted)" },
        { id: "19", description: "Inspect engine mounts" },
      ]},
      { sectionName: "Cooling System", items: [
        { id: "20", description: "Radiator clean and free of debris" },
        { id: "21", description: "Radiator fins intact and not bent or blocked" },
        { id: "22", description: "Hoses, clamps, and connections inspected for wear or leaks" },
        { id: "23", description: "Fan operation smooth" },
        { id: "24", description: "Thermostat and temperature gauges functioning" },
      ]},
      { sectionName: "Hydraulic System", items: [
        { id: "25", description: "Inspect hoses, fittings, and cylinders for leaks or damage" },
        { id: "26", description: "Check blade, ripper, and lift cylinders for wear or cracks" },
        { id: "27", description: "Inspect hydraulic filter and replace if needed" },
        { id: "28", description: "Check hydraulic pump and connections" },
      ]},
      { sectionName: "Undercarriage", items: [
        { id: "29", description: "Inspect tracks, rollers, idlers, and sprockets for wear" },
        { id: "30", description: "Check track tension and alignment" },
        { id: "31", description: "Check for damaged or missing track shoes" },
        { id: "32", description: "Inspect track pins and bushings for excessive wear" },
      ]},
      { sectionName: "Electrical System", items: [
        { id: "33", description: "Battery terminals clean and secure" },
        { id: "34", description: "Battery isolator functional and in correct position" },
        { id: "35", description: "Lights and indicators operational" },
        { id: "36", description: "Control panel and gauges functioning correctly" },
        { id: "37", description: "Wiring free from damage or chafing" },
        { id: "38", description: "Check flashing light is operational" },
        { id: "39", description: "Check UHF is fitted and operational" },
      ]},
      { sectionName: "Blade and Attachments", items: [
        { id: "40", description: "Inspect blade and cutting edges for wear or damage" },
        { id: "41", description: "Inspect ripper and teeth for wear or cracks" },
        { id: "42", description: "Check attachment pins, bushings, and mounts for wear" },
      ]},
      { sectionName: "Operator Cab / Safety", items: [
        { id: "43", description: "Check seat, seatbelt, and controls for correct operation" },
        { id: "44", description: "Fire extinguisher present and charged" },
        { id: "45", description: "Horn, backup alarm, and mirrors functional" },
        { id: "46", description: "Windows and doors operate correctly" },
      ]},
      { sectionName: "Operational Checks", items: [
        { id: "47", description: "Start engine and check for smooth operation" },
        { id: "48", description: "Make note of any unusual noises, vibrations, or smoke" },
        { id: "49", description: "Test blade, ripper, and travel functions" },
        { id: "50", description: "Ensure operation of gauges: oil pressure, coolant temperature, hydraulic pressure" },
      ]},
      { sectionName: "Auto Greaser", items: [
        { id: "51", description: "Verify grease levels and automatic greasing system functioning" },
        { id: "52", description: "Check grease points for lubrication" },
      ]},
    ],
  },

  "Excavator Daily Inspection": {
    sections: [
      { sectionName: "Walk Around Inspection", items: [
        { id: "1", description: "Inspect machine structure, boom, stick, bucket, and attachments for damage or cracks" },
        { id: "2", description: "Inspect guards, panels, and covers for proper attachment" },
        { id: "3", description: "Check for loose or missing bolts, nuts, or pins" },
        { id: "4", description: "Inspect handrails, steps, and safety decals for condition" }, { id: "5", description: "Ensure warning labels and signage are intact" },
      ]},
      { sectionName: "Fluids & Levels", items: [
        { id: "6", description: "Engine oil level" }, { id: "7", description: "Coolant level" }, { id: "8", description: "Fuel level" },
        { id: "9", description: "Battery electrolyte level (if applicable)" }, { id: "10", description: "DEF / AdBlue level (if SCR equipped)" },
        { id: "11", description: "Transmission or swing drive oil levels" },
      ]},
      { sectionName: "Operator Cab / Safety", items: [
        { id: "12", description: "Seat, seatbelt, and controls functioning properly" }, { id: "13", description: "Fire extinguisher present and charged" },
        { id: "14", description: "Horn, backup alarm, and mirrors operational" }, { id: "15", description: "Windows and doors operate correctly" },
      ]},
      { sectionName: "Operational Checks", items: [
        { id: "16", description: "Engine starts smoothly with no unusual noise" },
        { id: "17", description: "Monitor gauges: oil pressure, coolant temperature, hydraulic pressure" },
        { id: "18", description: "Observe for unusual noises, vibrations, or smoke" }, { id: "19", description: "Shutdown normal with no alarms" },
      ]},
    ],
  },

  "Moxy Daily Inspection": {
    sections: [
      { sectionName: "Walk Around Inspection", items: [
        { id: "1", description: "Check for body damage, loose panels, cracked welds" },
        { id: "2", description: "Check handrails, steps, and platforms for safety" },
        { id: "3", description: "Check fuel, oil, or coolant leaks under machine" }, { id: "4", description: "Ensure all safety decals are clean and readable" },
      ]},
      { sectionName: "Fluids & Levels", items: [
        { id: "5", description: "Engine oil level" }, { id: "6", description: "Coolant level" }, { id: "7", description: "Hydraulic oil level" },
        { id: "8", description: "Transmission oil level (sight gauge)" }, { id: "9", description: "Fuel level" }, { id: "10", description: "AdBlue / DEF level (if equipped)" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "11", description: "Inspect for oil, coolant, or fuel leaks" }, { id: "12", description: "Check belts for wear and tension" },
        { id: "13", description: "Check air filter restriction indicator" }, { id: "14", description: "Inspect air intake hoses and clamps" },
        { id: "15", description: "Check radiator/cooler areas for dust buildup" }, { id: "16", description: "Inspect radiator and cooler fins for blockage or damage" },
        { id: "17", description: "Verify fan operation is normal" },
      ]},
      { sectionName: "Hydraulic System", items: [
        { id: "18", description: "Check hoses and fittings for leaks or damage" }, { id: "19", description: "Inspect lift and tilt cylinders for leaks" },
        { id: "20", description: "Inspect hydraulic tank area for leaks" }, { id: "21", description: "Confirm bucket, lift, and tilt functions operate smoothly" },
      ]},
      { sectionName: "Auto Greaser", items: [
        { id: "22", description: "Grease reservoir level" }, { id: "23", description: "Greaser pump cycles normally" },
        { id: "24", description: "No damaged, leaking, or missing grease lines" },
      ]},
      { sectionName: "Tires", items: [
        { id: "25", description: "Tire pressure visually OK" }, { id: "26", description: "No cuts, cracks, or sidewall damage" },
        { id: "27", description: "No missing or loose wheel nuts" }, { id: "28", description: "Hubs show no signs of overheating or oil leak" },
      ]},
      { sectionName: "Steering", items: [
        { id: "29", description: "Check articulation area for debris buildup" }, { id: "30", description: "No excessive free play in articulation joint" },
        { id: "31", description: "Steering cylinders not leaking" }, { id: "32", description: "Oscillation joint functioning normally" },
        { id: "33", description: "Axles free of leaks" },
      ]},
      { sectionName: "Braking", items: [
        { id: "34", description: "Service brakes functioning normally" }, { id: "35", description: "Parking brake holding correctly" },
        { id: "36", description: "No brake warning indicators on display" },
      ]},
      { sectionName: "Dump Body & Frame Structure", items: [
        { id: "37", description: "Inspect hinge pins, bushes, and grease points" }, { id: "38", description: "Inspect body floor, sides, and tailgate for cracks or damage" },
        { id: "39", description: "Inspect chassis rails and welds" }, { id: "40", description: "Check body cylinder mounts" },
        { id: "41", description: "Inspect tailgate operation (if fitted)" },
      ]},
      { sectionName: "Electrical", items: [
        { id: "42", description: "Lights (work lights, indicators, beacon, brake lights) operating" }, { id: "43", description: "Horn functioning" },
        { id: "44", description: "Reverse alarm works" }, { id: "45", description: "Battery terminals secure and clean" },
        { id: "46", description: "No exposed or damaged wiring" },
      ]},
      { sectionName: "Cab", items: [
        { id: "47", description: "Seatbelt in good condition" }, { id: "48", description: "Mirrors and windows clean and intact" },
        { id: "49", description: "HVAC functioning" }, { id: "50", description: "Check cab air filter" },
        { id: "51", description: "Fire extinguisher present and charged" }, { id: "52", description: "First-aid kit" },
        { id: "53", description: "Monitor/display functioning with no active warnings" },
      ]},
      { sectionName: "Operational Checks", items: [
        { id: "54", description: "Engine starts smoothly with no unusual noise" }, { id: "55", description: "Gauges and warning lights normal" },
        { id: "56", description: "Steering responsive" }, { id: "57", description: "Hydraulics responsive and smooth" },
        { id: "58", description: "Run full dump cycle—smooth and stable" }, { id: "59", description: "Smooth gear shifting" },
        { id: "60", description: "Test brake holding before travel" },
      ]},
    ],
  },

  "Lighting Tower Daily Inspection": {
    sections: [
      { sectionName: "Walk Around Inspection", items: [
        { id: "1", description: "Check for visible damage to frame, mast, or trailer" },
        { id: "2", description: "Check for loose panels, covers, or safety guards" }, { id: "3", description: "Ensure lights and reflectors are clean and undamaged" },
        { id: "4", description: "Ensure all safety decals are clean and readable" }, { id: "5", description: "Ensure ground clearance is adequate and stabilizers are in position" },
      ]},
      { sectionName: "Fluids & Levels", items: [
        { id: "6", description: "Engine oil level" }, { id: "7", description: "Coolant level" }, { id: "8", description: "Hydraulic oil level" },
        { id: "9", description: "Fuel level" }, { id: "10", description: "Battery electrolyte level (if applicable)" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "11", description: "Inspect for oil, coolant, or fuel leaks" }, { id: "12", description: "Check belts for wear and tension" },
        { id: "13", description: "Check air filter restriction indicator" }, { id: "14", description: "Inspect air intake hoses and clamps" },
        { id: "15", description: "Check radiator/cooler areas for dust buildup" }, { id: "16", description: "Inspect radiator and cooler fins for blockage or damage" },
      ]},
      { sectionName: "Safety Equipment", items: [
        { id: "17", description: "Fire extinguisher present and charged" }, { id: "18", description: "Wheel chocks in place (if applicable)" },
        { id: "19", description: "Emergency stop button functional" },
      ]},
      { sectionName: "Electrical / Lighting System", items: [
        { id: "20", description: "Battery terminals clean and secure" }, { id: "21", description: "Warning lights and gauges normal" },
        { id: "22", description: "All tower lights operational" }, { id: "23", description: "Wiring secured with no visible damage" },
      ]},
      { sectionName: "Operational Checks", items: [
        { id: "24", description: "Engine starts smoothly with no unusual noise" }, { id: "25", description: "Lights operate at full brightness" },
        { id: "26", description: "Shutdown normal with no alarms" }, { id: "27", description: "No unusual noises during mast operation" },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // OPS / MOBILE EQUIPMENT WEEKLY (Crane as representative)
  // ══════════════════════════════════════════════════════════════════

  "Crane Weekly Inspection": {
    sections: [
      { sectionName: "Safety", items: [
        { id: "1", description: "Load charts in cab & legible" }, { id: "2", description: "Fire extinguisher charged & accessible" },
        { id: "3", description: "First-aid kit checked" }, { id: "4", description: "ROPS/FOPS integrity" },
        { id: "5", description: "Seatbelt functioning & in good condition" }, { id: "6", description: "Battery isolator functioning & labelled" },
        { id: "7", description: "Starter isolator functioning & labelled" }, { id: "8", description: "Flashing beacon / rotating amber light functioning" },
        { id: "9", description: "Horn functioning" }, { id: "10", description: "Emergency stop switches operational" },
      ]},
      { sectionName: "Hydraulics", items: [
        { id: "11", description: "Hydraulic oil level" }, { id: "12", description: "Hydraulic hoses (cracks, abrasion, leaks)" },
        { id: "13", description: "Pump performance & abnormal noise" }, { id: "14", description: "Boom extension/retraction smooth" },
        { id: "15", description: "Slew brake (if fitted) functioning" }, { id: "16", description: "Hoist and winch hydraulics operating normally" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "17", description: "Engine oil level" }, { id: "18", description: "Coolant level & condition" },
        { id: "19", description: "Radiator clean, free of blockages" }, { id: "20", description: "Belts condition & tension" },
        { id: "21", description: "Fuel filter / water separator drained" }, { id: "22", description: "Air filters (primary and secondary)" },
        { id: "23", description: "No oil, coolant, or fuel leaks" }, { id: "24", description: "Exhaust system secure" },
      ]},
      { sectionName: "Electrical System", items: [
        { id: "25", description: "Battery condition & mounting" }, { id: "26", description: "Terminals clean, no corrosion" },
        { id: "27", description: "Wiring harness secure, no exposed wires" }, { id: "28", description: "All external lights functional" },
        { id: "29", description: "Indicators, brake lights, hazard lights" }, { id: "30", description: "Reverse alarm functional" },
        { id: "31", description: "Gauges & in-cab displays functioning" },
      ]},
      { sectionName: "Transmission", items: [
        { id: "32", description: "Transmission oil level" }, { id: "33", description: "Differential/axle oils" },
        { id: "34", description: "Universal joints drivelines condition" }, { id: "35", description: "Drive performance normal" },
        { id: "36", description: "Parking brake working correctly" }, { id: "37", description: "Service brakes working correctly" },
        { id: "38", description: "Grease all grease points" },
      ]},
      { sectionName: "Steering", items: [
        { id: "39", description: "Power steering fluid level" }, { id: "40", description: "Steering joints, tie rods, cylinder leaks" },
        { id: "41", description: "Rear steer lockout (if equipped)" }, { id: "42", description: "Suspension springs/airbags condition" },
        { id: "43", description: "No excessive free play" },
      ]},
      { sectionName: "Auto Greaser", items: [
        { id: "44", description: "Inspection operation of greaser" }, { id: "45", description: "Inspect level" },
        { id: "46", description: "Inspect grease lines and repair if required" },
      ]},
      { sectionName: "Tyres", items: [
        { id: "47", description: "Tyre condition (cuts, cracks, wear)" }, { id: "48", description: "Tyre pressures correct" },
        { id: "49", description: "Rims – cracks, distortion" }, { id: "50", description: "Wheel nuts tight, no movement" },
        { id: "51", description: "Centre pad & wheel studs condition" },
      ]},
      { sectionName: "Braking", items: [
        { id: "52", description: "Service brakes effective" }, { id: "53", description: "Park brake holding capacity" },
        { id: "54", description: "Brake lines/hoses intact" }, { id: "55", description: "Air leaks" },
      ]},
      { sectionName: "Boom, Winch and Lifting System", items: [
        { id: "56", description: "Boom sections – cracks, wear, damage" }, { id: "57", description: "Boom wear pads condition" },
        { id: "58", description: "Hook block inspection (swivel, latch, bearings)" },
        { id: "59", description: "Winch rope condition (broken wires, damage)" },
        { id: "60", description: "Drum & sheaves condition" }, { id: "61", description: "Lift cylinders (leaks, scoring)" },
        { id: "62", description: "Boom angle indicator working" }, { id: "63", description: "Rated Capacity Limiter (RCL) functional" },
        { id: "64", description: "Anti 2 Block functional" },
      ]},
      { sectionName: "Cabin", items: [
        { id: "65", description: "Operator controls smooth/functional" }, { id: "66", description: "Mirrors clean & intact" },
        { id: "67", description: "Windows/windscreen clean and undamaged" }, { id: "68", description: "Wipers & washer operation" },
        { id: "69", description: "Air-conditioning functioning" },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // ELECTRICAL WEEKLY
  // ══════════════════════════════════════════════════════════════════

  "Ice Machine Weekly Inspection": [
    { id: 1, task: "Inspect Ice Machine for Faults" }, { id: 2, task: "Inspect and Clean Inline Filters" },
    { id: 3, task: "Inspect and clean internal water tray" }, { id: 4, task: "Inspect and Clean sensors" },
    { id: 5, task: "Inspect and Clean External of Ice Machine" }, { id: 6, task: "Inspect and clean Internal Electrical components" },
  ],

  "Visual Zone Checks Weekly": {
    generalAreaChecks: [
      "Conveyors", "Ball Mill", "CIP / Tanks", "Filter Press", "Fuel Farm", "Air Compressors",
      "Lime", "Reagents", "Tail Thickener", "Raw Water", "Process Water", "Admin", "Warehouse", "Control Room", "Workshop", "Laboratory",
    ],
    lightingChecks: [
      "Conveyors", "Ball Mill", "CIP TANKS", "Filter Press", "Process Fuel Farm", "Air Compressors",
      "Lime", "Reagents", "Tail Thickener", "Raw Water", "Process Water", "Admin/Mining", "Warehouse", "Control Room", "Workshop", "Laboratory",
    ],
    generatorChecks: [
      "Juno Generator", "Admin Generator", "Nobles Natural Sump Generator", "Crusher Generator", "Lab Generator", "Fuel Farm Generator",
    ],
    cleansTasks: [
      "Weekly Workshop Cleans", "Fortnightly Light Vehicle Cleans", "Clean filters in VSD's in MCC",
    ],
  },

  "Safety Shower Inspection Weekly": {
    inspectionItems: [
      { id: 1, item: "Safety Shower" }, { id: 2, item: "Eyewash" }, { id: 3, item: "Light" },
    ],
    locations: [
      "Thickener", "Lime Silo", "Tanks North", "Tanks South", "Elution", "Gold Room",
      "Filter Press", "Cyanide Upstairs", "Cyanide Downstairs", "Cyanide Outside", "Compound Bottom Tanks North", "Acid Column",
    ],
  },

  "pH Probe Calibration Weekly": {
    calibrationReadings: [
      { id: "reading-before-clean", label: "pH Reading before clean" },
      { id: "reading-after-clean", label: "pH Reading after clean" },
      { id: "ph7-before-cal", label: "pH 7 Before Calibration" },
      { id: "ph7-after-cal", label: "pH 7 Reading after Calibration" },
      { id: "ph10-before-cal", label: "pH 10 Reading before Calibration" },
      { id: "ph10-after-cal", label: "pH 10 Reading after Calibration" },
      { id: "reading-final", label: "pH Reading after Clean" },
    ],
    cleaningProcedure: [
      "Inform operations that you are about to clean the pH probes.",
      "Place the pH control loop in manual by bringing up the faceplate for PHIT-4xxx, clicking on the MAN/AUT/CAS section of the faceplate, and selecting the manual button. Ask an operator to do this for you if you are unsure.",
      "Remove the probe from the rougher and hose it down to remove any build up of slurry.",
      "Remove the probe from the probe holder and after washing off any excess slurry place it in the beaker of hydrochloric acid to soak.",
      "Rinse the probe in the potable water to dilute the acid and wipe down the probe. The paintbrush or the side of a cloth rag may be necessary to clean between the electrodes.",
      "If necessary, scrape off any scale build up with the knife, being very careful not to fracture the glass electrode.",
      "Repeat steps 4-6 as necessary until all the scale has been removed.",
      "Ensure the probe is reading within the expected range before returning it to automatic control; refer to step 2.",
    ],
    calibrationProcedure: [
      'Select the "Gear Icon"', 'Select "Calibration"', 'Select "Automatic"', 'Select "Zero/Slope"',
      'Place Probe in pH 7 and select "pH 7"', 'Wait until pH settles out while in pH 7 Solution then select "Adjust now"',
      "Once instructed to go to next Buffer, Clean the pH Probe with water first.",
      'Place pH Probe in pH 10 Solution and select "pH 10"', 'Wait until pH settles out, then select "Adjust now"',
      'When finished select "CAL COMPLETE"', 'Select "ACCEPT DATA"', 'Select "NO" to new sensor', "Return to home screen",
    ],
  },

  "Field MCC Inspections Weekly": {
    standardTasks: [
      "Check Gland Plate Sealing and Fastening of Glands", "Check all Circuits are Active and Available",
      "Inspect all Door Seals", "Check and Lubricate all Door Hinges and Latches",
      "Check lights are all functioning correctly", "Check all labels are available and correct",
      "Check that all cables are labelled", "Clean Cabinet and Filters", "Ensure Access is not impeded in or around Field MCC",
    ],
    mccSections: [
      { mccId: "MCC-110", mccName: "Mill Feed Conveyor" }, { mccId: "MCC-111", mccName: "Mill Auxiliary" },
      { mccId: "MCC-113", mccName: "Gravity Concentrator" }, { mccId: "MCC-114", mccName: "Top of Tanks" },
      { mccId: "MCC-115", mccName: "Top of Tanks" }, { mccId: "MCC-116", mccName: "Top of Tanks" },
      { mccId: "MCC-117", mccName: "Top of Tanks" }, { mccId: "MCC-118", mccName: "Thickener" },
      { mccId: "MCC-120", mccName: "Cyanide" }, { mccId: "MCC-121", mccName: "Water Services" },
      { mccId: "MCC-122", mccName: "Process Water Ponds" }, { mccId: "MCC-125", mccName: "Filter Press" },
      { mccId: "MCC-130", mccName: "Elution" },
    ],
  },

  "Filter Press Electrical Weekly Inspection": {
    sections: [
      { equipmentId: "FP-SB-001", equipmentName: "Filter Press Switch Board", tasks: [
        { task: "Check DB door seals for integrity" }, { task: "Check all breakers are labelled correctly" },
        { task: "Check for any loose connections" }, { task: "Check for any signs of overheating on breakers" },
        { task: "Check for any damage to internal components" }, { task: "Check for any vermin or water ingress" },
        { task: "Check all cable glands are tight" }, { task: "Check all doors are closing and sealing correctly" },
        { task: "Check all lights are working correctly" }, { task: "Check the area is clean and clear of obstructions" },
      ]},
      { equipmentId: "FP-LCS-001", equipmentName: "Filter Press Local Control Station", tasks: [
        { task: "Check enclosure door seals for integrity" }, { task: "Check all pushbuttons are labelled correctly" },
        { task: "Check all lights are working correctly" }, { task: "Check the HMI is working correctly" },
        { task: "Check the area is clean and clear of obstructions" }, { task: "Check all cable glands are tight" },
        { task: "Check all doors are closing and sealing correctly" },
      ]},
      { equipmentId: "FP-ISOL-001", equipmentName: "Filter Press Isolator", tasks: [
        { task: "Check enclosure door seals for integrity" }, { task: "Check the isolator is labelled correctly" },
        { task: "Check the area is clean and clear of obstructions" }, { task: "Check all cable glands are tight" },
        { task: "Check all doors are closing and sealing correctly" },
      ]},
      { equipmentId: "FP-CABLE-001", equipmentName: "Filter Press Cables", tasks: [
        { task: "Check all cables are supported correctly" }, { task: "Check all cables are labelled correctly" },
        { task: "Check all cables are in good condition" }, { task: "Check all cable trays are in good condition" }, { task: "Check all cable glands are tight" },
      ]},
      { equipmentId: "FP-MOTOR-001", equipmentName: "Filter Press Motor", tasks: [
        { task: "Check motor fan is in good condition" }, { task: "Check motor is labelled correctly" },
        { task: "Check motor is in good condition" }, { task: "Check motor is clean and free of debris" },
        { task: "Check motor cable glands are tight" }, { task: "Check motor is mounted correctly" },
      ]},
      { equipmentId: "FP-INST-001", equipmentName: "Filter Press Instruments", tasks: [
        { task: "Check instrument is labelled correctly" }, { task: "Check instrument is in good condition" },
        { task: "Check instrument is clean and free of debris" }, { task: "Check instrument cable glands are tight" }, { task: "Check instrument is mounted correctly" },
      ]},
      { equipmentId: "FP-GUARD-001", equipmentName: "Filter Press Safety Guards", tasks: [
        { task: "Check all safety guards are in good condition" }, { task: "Check all safety guards are labelled correctly" },
        { task: "Check all safety guards are mounted correctly" }, { task: "Check all safety lanyards are in good condition" },
        { task: "Check all safety lanyards are labelled correctly" }, { task: "Check all safety lanyards are mounted correctly" },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // ELECTRICAL 2-WEEKLY
  // ══════════════════════════════════════════════════════════════════

  "Substation Inspection Fortnightly": {
    insideSubstationChecks: [
      "Check Fire extinguishers are in position", "Check Fire extinguishers in date", "Check Vesda System is not in alarm",
      "Check Fire alarm Panel for Faults", "Check lights are all functioning correctly", "Check air conditioner is on",
      "Check floor is clear from items or materials", "Vacuum floor inside Substation", "Mop Floor",
      "Ensure door locks function correctly and are locked", "Check LV rescue kit is on hooks and in date",
      "Check ARC Flash signs are in position and legible", "Check isolation tag holder is full of Tags",
    ],
    outsideSubstationChecks: [
      "Check Fire extinguishers are in position", "Check Fire extinguishers in date", "Check no rubbish or tools around the Substation",
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // ELECTRICAL QUARTERLY (12 WEEK)
  // ══════════════════════════════════════════════════════════════════

  "Emergency Light Test Quarterly": {
    inspectionSteps: [
      "Clean fittings so free of dust.",
      "Inspect all light fittings are working and are switched correctly. Note any not working on diagram",
      "Turn off circuit breakers in LAP to test emergency fittings.",
      "Note any emergency fittings which do not work when powered off.",
      "After 90 minutes. Check that emergency fittings are still operating. Note any which have failed.",
      "Fill out test sheet below.", "Report any faults identified.",
    ],
    testTableRows: 15,
  },

  "Air Conditioner Service Quarterly": {
    serviceInfoFields: [
      "Building Location", "Room Name/Number", "Location within room", "Fed From", "Circuit number",
      "Make of Air Conditioner", "KW rating", "Model Number Indoor", "Serial Number Indoor", "Model Number Outdoor", "Serial Number Outdoor",
    ],
    testItems: [
      "Clean Air Filters", "Brush and Clean indoor unit housing", "Brush and Clean outdoor unit housing",
      "Clean Condensate Tray and flush water down drain", "Check electrical connections", "Check pipework insulation",
      "Check Mounting supports", "Check for any signs of rust",
    ],
  },

  "Pull Wire Checks Quarterly": {
    assetSections: [
      { assetName: "FILTER PRESS 1", checks: [
        "Verification – Pull Wire Function (Head End)", "Verification – Pull Wire Function (Tail End)", "Verification – LCS E-STOP Function",
      ]},
      { assetName: "FILTER PRESS 2", checks: [
        "Verification – Pull Wire Function (Head End)", "Verification – Pull Wire Function (Tail End)", "Verification – LCS E-STOP Function",
      ]},
      { assetName: "FILTER PRESS 1 EXTRACTION CONVEYOR", checks: [
        "Verification – Pull Wire Function (Head End)", "Verification – Pull Wire Function (Tail End)",
      ]},
      { assetName: "FILTER PRESS TRANSFER", checks: [
        "Verification – Pull Wire Function (Head End)", "Verification – Pull Wire Function (Tail End)",
      ]},
      { assetName: "FILTER PRESS RECLAIM STACKER", checks: [
        "Verification – Pull Wire Function (Head End)", "Verification – Pull Wire Function (Tail End)",
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // ELECTRICAL RCD TESTING
  // ══════════════════════════════════════════════════════════════════

  "RCD Injection Test 6-Monthly": {
    generatorLocations: [
      { id: "admin", name: "Admin Generator", assetNumber: "GEN-009", area: "ADMIN", circuits: [
        { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "16A" },
        { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" }, { description: "", rating: "" }, { description: "", rating: "" },
      ]},
      { id: "juno-bore", name: "Juno Generator", assetNumber: "17-GN-016", area: "JUNO BORE", circuits: [
        { description: "15A OUTLET", rating: "16A" }, { description: "15A OUTLET", rating: "16A" },
        { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" }, { description: "", rating: "" }, { description: "", rating: "" },
      ]},
      { id: "nobles-natural-sump", name: "Nobles Natural Sump Generator", assetNumber: "17-GN-011", area: "NOBLES NATURAL SUMP", circuits: [
        { description: "15A OUTLET", rating: "16A" }, { description: "15A OUTLET", rating: "16A" },
        { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" }, { description: "", rating: "" }, { description: "", rating: "" },
      ]},
      { id: "lab", name: "Lab Generator", assetNumber: "GEN-012", area: "LAB", circuits: [
        { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "16A" },
        { description: "3 PHASE GPO", rating: "32A" }, { description: "3 PHASE GPO", rating: "32A" }, { description: "", rating: "" }, { description: "", rating: "" },
      ]},
      { id: "crusher-fuel-farm", name: "Crusher Fuel Farm Generator", assetNumber: "GEN-013", area: "CRUSHER FUEL FARM", circuits: [
        { description: "3 PHASE GPO", rating: "32A" }, { description: "15A GPO", rating: "16A" },
        { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "20A" }, { description: "", rating: "" }, { description: "", rating: "" },
      ]},
      { id: "crusher-workshop", name: "Crusher Workshop Generator", assetNumber: "GEN-014", area: "CRUSHER WORKSHOP", circuits: [
        { description: "RCD", rating: "32A" }, { description: "", rating: "" }, { description: "", rating: "" }, { description: "", rating: "" },
        { description: "", rating: "" }, { description: "", rating: "" }, { description: "", rating: "" }, { description: "", rating: "" },
        { description: "", rating: "" }, { description: "", rating: "" },
      ]},
    ],
  },

  "RCD Push-button Test Quarterly": {
    generatorLocations: [
      { id: "admin", name: "Admin Generator", assetNumber: "GEN-009", area: "ADMIN", circuits: [
        { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "16A" },
        { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" }, { description: "", rating: "" }, { description: "", rating: "" },
      ]},
      { id: "juno-bore", name: "Juno Generator", assetNumber: "17-GN-016", area: "JUNO BORE", circuits: [
        { description: "15A OUTLET", rating: "16A" }, { description: "15A OUTLET", rating: "16A" },
        { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" }, { description: "", rating: "" }, { description: "", rating: "" },
      ]},
      { id: "nobles-natural-sump", name: "Nobles Natural Sump Generator", assetNumber: "17-GN-011", area: "NOBLES NATURAL SUMP", circuits: [
        { description: "GPO", rating: "16A" }, { description: "GPO", rating: "16A" },
        { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" }, { description: "", rating: "" }, { description: "", rating: "" },
      ]},
      { id: "lab", name: "Lab Generator", assetNumber: "GEN-012", area: "LAB", circuits: [
        { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "16A" },
        { description: "3 PHASE GPO", rating: "32A" }, { description: "3 PHASE GPO", rating: "32A" }, { description: "", rating: "" }, { description: "", rating: "" },
      ]},
      { id: "crusher-workshop", name: "Crusher Workshop Generator", assetNumber: "GEN-013", area: "CRUSHER", circuits: [
        { description: "RCD", rating: "32A" }, { description: "", rating: "" }, { description: "", rating: "" }, { description: "", rating: "" },
      ]},
      { id: "crusher-fuel-farm", name: "Crusher Fuel Farm Generator", assetNumber: "GEN-014", area: "CRUSHER FUEL FARM", circuits: [
        { description: "3 PHASE GPO", rating: "25A" }, { description: "15A GPO", rating: "16A" },
        { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "20A" }, { description: "", rating: "" }, { description: "", rating: "" },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // ELECTRICAL YEARLY
  // ══════════════════════════════════════════════════════════════════

  "Switchboard Inspection Yearly": [
    "General Condition", "Hot Joints (Burning/Discolouration)", "Busbar Loading", "Thermoscan (If applicable)",
    "Creepage and Clearance distances maintained (Minimum 31mm, AS 3007.2)",
    "Cable Entries Watertight, Secure and Fixed in Position",
    'Live Parts Adequately Enclosed / Insulated and Marked "Isolate Elsewhere"',
    "Switch Board Mounting and Mechanical Protection", "Check Switchboard number and name labelling",
    "Legend and circuit identification", "Switchboard isolation label", "Circuit breaker lockouts available",
    "Fuse/Circuit Breaker sizes are correct and correctly marked", "Where is This DB Fed From", "Overall Cleanliness",
  ],

  // ══════════════════════════════════════════════════════════════════
  // MOTOR INSPECTIONS (Yearly) – Motor data extracted
  // ══════════════════════════════════════════════════════════════════

  "Statutory Motor Inspection - Filter Press": {
    stationaryChecks: [
      { item: "Motor", action: "Check name plate is present and matches recorded data. If no data is recorded fill in motor details" },
      { item: "Motor", action: "Check terminal box cover bolts are complete and tight. Check if densyl tape is in adequate condition. Change if necessary." },
      { item: "Motor", action: "Check Motor while running. Note any loud, irregular squealing or rumbling noises or vibrations" },
      { item: "Motor", action: "Check for dust, dirt or rock build up on motor cooling fan or in between cooling fins. Remove excess build up if necessary" },
      { item: "Motor", action: "Check cable glands are tight and shrouds are fitted. Tighten glands if necessary." },
      { item: "Isolator", action: "Check that push or switches are secure and not damaged" },
      { item: "Isolator", action: "Ensure that access to LCS is not obstructed or impaired." },
      { item: "Motor", action: "Ensure fan cowling is secure and free from damage. Ensure there is no obstruction to the flow of air." },
      { item: "Motor", action: "Check cable identification is secure and legible" },
      { item: "Motor", action: "Ensure cables are correctly routed, undamaged and are attached to cable supports. Ensure mechanical protection is secure and in place. Ensure gland is in place" },
      { item: "S/Room", action: "Ensure gland plate is in place and all spare cable entries are plugged." },
    ],
    motors: [
      { description: "Stacker Drive Motor - North", brand: "SELI", flc: "2.5 A", frequency: "50 Hz", power: "1.1 KW", voltage: "415 V", frameSize: "S3A 90 S4", rpm: "1430 RPM", ambientTemp: "40°C" },
      { description: "Stacker Drive Motor - South", brand: "SELI", flc: "2.5 A", frequency: "50 Hz", power: "1.1 KW", voltage: "415 V", frameSize: "S3A 90 S4", rpm: "1430 RPM", ambientTemp: "90°C" },
      { description: "Incline Belt - North", brand: "SELI", flc: "40 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "S3G 180 L4", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Incline Belt - South", brand: "SELI", flc: "40 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "S3G 180 L4", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Collector Belt - East", brand: "SELI", flc: "27 A", frequency: "50 Hz", power: "15 KW", voltage: "415 V", frameSize: "S3G 160 L4", rpm: "1466 RPM", ambientTemp: "40°C" },
      { description: "Collector Belt - West", brand: "SELI", flc: "2.5 A", frequency: "50 Hz", power: "1.1 kW", voltage: "415 V", frameSize: "S3G 160 L4", rpm: "1466 RPM", ambientTemp: "40°C" },
      { description: "Extraction Belt - FP1", brand: "SELI", flc: "27 A", frequency: "50 Hz", power: "15 kW", voltage: "415 V", frameSize: "S3G 160 L4", rpm: "1465 RPM", ambientTemp: "40°C" },
      { description: "Extraction Belt - FP2", brand: "SELI", flc: "27 A", frequency: "50 Hz", power: "15 kW", voltage: "415 V", frameSize: "S3G 160 L4", rpm: "1465 RPM", ambientTemp: "40°C" },
      { description: "Filter Feed Pump 1", brand: "WEG", flc: "341 A", frequency: "50 Hz", power: "200 kW", voltage: "415 V", frameSize: "NU-319-C3", rpm: "1791 RPM", ambientTemp: "40°C" },
      { description: "Filter Feed Pump 2", brand: "WEG", flc: "341 A", frequency: "50 Hz", power: "200 kW", voltage: "415 V", frameSize: "NU-319-C3", rpm: "1791 RPM", ambientTemp: "40°C" },
      { description: "FP1 Hydraulic Motor (30kW)", brand: "TECH TOP", flc: "55.1 A", frequency: "50 Hz", power: "30 kW", voltage: "415 V", frameSize: "T3CR 200LI-4", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "FP1 Hydraulic Motor (11kW)", brand: "TECH TOP", flc: "19.96 A", frequency: "50 Hz", power: "11 kW", voltage: "415 V", frameSize: "TECR 160M-4", rpm: "1450 RPM", ambientTemp: "40°C" },
      { description: "FP2 Hydraulic Motor (30kW)", brand: "TECH TOP", flc: "51.98 A", frequency: "50 Hz", power: "30 kW", voltage: "415 V", frameSize: "T3CR 200LI-4", rpm: "1760 RPM", ambientTemp: "40°C" },
      { description: "FP2 Hydraulic Motor (11kW)", brand: "TECH TOP", flc: "18.82 A", frequency: "50 Hz", power: "11 kW", voltage: "415 V", frameSize: "TECR 160M-4", rpm: "1740 RPM", ambientTemp: "40°C" },
      { description: "Filter Press Sump Pump", brand: "TECO", flc: "13.4 A", frequency: "50 Hz", power: "7.5 kW", voltage: "415 V", frameSize: "D132M", rpm: "1465 RPM", ambientTemp: "40°C" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // GENERATORS WEEKLY (shared template — Andy Dam, Juno, Lab, Portable)
  // ══════════════════════════════════════════════════════════════════

  "Nobles Natural Sump Generator Weekly Inspection": {
    sections: [
      { equipmentName: "Visual Running Checks", tasks: [
        { task: "Check all gauges" },
        { task: "Check Engine Protection Relay, record fault history, Engine Hours etc.", hasInput: true, inputLabel: "Engine Hours:" },
        { task: "Walk around Unit - Visually Inspect/Listen for Damage/Defects" },
        { task: "Open all doors - Visually Inspect/Listen for Damage/Defects i.e Excessive vibration, loose/rattling components or panels, leaking exhaust/Turbo etc." },
        { task: "Check Engine Guards are in place and compliant" },
        { task: "Push Emergency Stop Button to Shut Unit Down" },
        { task: "Check Exhaust Flap closes" },
      ]},
      { equipmentName: "Fire Extinguisher", tasks: [{ task: "Check fire extinguisher charged and mounted securely" }]},
      { equipmentName: "Electrical Offline", tasks: [
        { task: "Check battery Isolator is Operational & Lockable" }, { task: "Check battery & battery Cabling" },
        { task: "Check battery terminals are tight and corrosion free" }, { task: "Check condition of all battery, starter and alternator cables" },
        { task: "Check wiring harnesses are securely mounted and undamaged" }, { task: "Check battery electrolyte level and that batteries are mounted securely" },
        { task: "Check Engine and Generator Mounts" }, { task: "Check Generator Cabling - look for signs of damage, chaffing, secured etc." },
        { task: "Check Generator covers and guards are all in place" }, { task: "Check Main Switch/ Circuit Breaker is Operational and Lockable" },
        { task: "Check Main Switch/ Circuit Breaker is Labelled" },
      ]},
      { equipmentName: "General", tasks: [
        { task: "Check all engine hoses, pipes and clamps for damage" }, { task: "Check engine alternator and fan v-belt adjustment" },
        { task: "Check Engine alternator mounted securely" }, { task: "Check for engine oil leaks" },
        { task: "Check fuel hoses mounted securely, replace any chafed or worn hoses" }, { task: "Check/drain Fuel Filters" },
        { task: "Check all radiator hoses, clamps and coolant lines for deterioration or damage" }, { task: "Check radiator for damage, blockage and leaks" },
      ]},
      { equipmentName: "Service Items", tasks: [
        { task: "Check outer air filter and clean if necessary" }, { task: "Check/Top up Coolant level" },
        { task: "Check/Top up Engine Oil level" }, { task: "Prestart Check, Close all doors & Restart" }, { task: "Clean Pre-filter" },
      ]},
      { equipmentName: "Restart Unit - Electrical (Online)", tasks: [
        { task: "Check all gauges" }, { task: "Check Engine Protection Relay" }, { task: "Check operation of all emergency stop switches (if equipped)" },
      ]},
    ],
  },

  "Juno Generator Weekly Inspection": {
    sections: [
      { equipmentName: "Visual Running Checks", tasks: [
        { task: "Check all gauges" },
        { task: "Check Engine Protection Relay, record fault history, Engine Hours etc.", hasInput: true, inputLabel: "Engine Hours:" },
        { task: "Walk around Unit - Visually Inspect/Listen for Damage/Defects" },
        { task: "Open all doors - Visually Inspect/Listen for Damage/Defects i.e Excessive vibration, loose/rattling components or panels, leaking exhaust/Turbo etc." },
        { task: "Check Engine Guards are in place and compliant" },
        { task: "Push Emergency Stop Button to Shut Unit Down" },
        { task: "Check Exhaust Flap closes" },
      ]},
      { equipmentName: "Fire Extinguisher", tasks: [{ task: "Check fire extinguisher charged and mounted securely" }]},
      { equipmentName: "Electrical Offline", tasks: [
        { task: "Check battery Isolator is Operational & Lockable" }, { task: "Check battery & battery Cabling" },
        { task: "Check battery terminals are tight and corrosion free" }, { task: "Check condition of all battery, starter and alternator cables" },
        { task: "Check wiring harnesses are securely mounted and undamaged" }, { task: "Check battery electrolyte level and that batteries are mounted securely" },
        { task: "Check Engine and Generator Mounts" }, { task: "Check Generator Cabling - look for signs of damage, chaffing, secured etc." },
        { task: "Check Generator covers and guards are all in place" }, { task: "Check Main Switch/ Circuit Breaker is Operational and Lockable" },
        { task: "Check Main Switch/ Circuit Breaker is Labelled" },
      ]},
      { equipmentName: "General", tasks: [
        { task: "Check all engine hoses, pipes and clamps for damage" }, { task: "Check engine alternator and fan v-belt adjustment" },
        { task: "Check Engine alternator mounted securely" }, { task: "Check for engine oil leaks" },
        { task: "Check fuel hoses mounted securely, replace any chafed or worn hoses" }, { task: "Check/drain Fuel Filters" },
        { task: "Check all radiator hoses, clamps and coolant lines for deterioration or damage" }, { task: "Check radiator for damage, blockage and leaks" },
      ]},
      { equipmentName: "Service Items", tasks: [
        { task: "Check outer air filter and clean if necessary" }, { task: "Check/Top up Coolant level" },
        { task: "Check/Top up Engine Oil level" }, { task: "Prestart Check, Close all doors & Restart" }, { task: "Clean Pre-filter" },
      ]},
      { equipmentName: "Restart Unit - Electrical (Online)", tasks: [
        { task: "Check all gauges" }, { task: "Check Engine Protection Relay" }, { task: "Check operation of all emergency stop switches (if equipped)" },
      ]},
    ],
  },

  "Lab Generator Weekly Inspection": {
    sections: [
      { equipmentName: "Visual Running Checks", tasks: [
        { task: "Check all gauges" },
        { task: "Check Engine Protection Relay, record fault history, Engine Hours etc.", hasInput: true, inputLabel: "Engine Hours:" },
        { task: "Walk around Unit - Visually Inspect/Listen for Damage/Defects" },
        { task: "Open all doors - Visually Inspect/Listen for Damage/Defects i.e Excessive vibration, loose/rattling components or panels, leaking exhaust/Turbo etc." },
        { task: "Check Engine Guards are in place and compliant" },
        { task: "Push Emergency Stop Button to Shut Unit Down" },
        { task: "Check Exhaust Flap closes" },
      ]},
      { equipmentName: "Fire Extinguisher", tasks: [{ task: "Check fire extinguisher charged and mounted securely" }]},
      { equipmentName: "Electrical Offline", tasks: [
        { task: "Check battery Isolator is Operational & Lockable" }, { task: "Check battery & battery Cabling" },
        { task: "Check battery terminals are tight and corrosion free" }, { task: "Check condition of all battery, starter and alternator cables" },
        { task: "Check wiring harnesses are securely mounted and undamaged" }, { task: "Check battery electrolyte level and that batteries are mounted securely" },
        { task: "Check Engine and Generator Mounts" }, { task: "Check Generator Cabling - look for signs of damage, chaffing, secured etc." },
        { task: "Check Generator covers and guards are all in place" }, { task: "Check Main Switch/ Circuit Breaker is Operational and Lockable" },
        { task: "Check Main Switch/ Circuit Breaker is Labelled" },
      ]},
      { equipmentName: "General", tasks: [
        { task: "Check all engine hoses, pipes and clamps for damage" }, { task: "Check engine alternator and fan v-belt adjustment" },
        { task: "Check Engine alternator mounted securely" }, { task: "Check for engine oil leaks" },
        { task: "Check fuel hoses mounted securely, replace any chafed or worn hoses" }, { task: "Check/drain Fuel Filters" },
        { task: "Check all radiator hoses, clamps and coolant lines for deterioration or damage" }, { task: "Check radiator for damage, blockage and leaks" },
      ]},
      { equipmentName: "Service Items", tasks: [
        { task: "Check outer air filter and clean if necessary" }, { task: "Check/Top up Coolant level" },
        { task: "Check/Top up Engine Oil level" }, { task: "Prestart Check, Close all doors & Restart" }, { task: "Clean Pre-filter" },
      ]},
      { equipmentName: "Restart Unit - Electrical (Online)", tasks: [
        { task: "Check all gauges" }, { task: "Check Engine Protection Relay" }, { task: "Check operation of all emergency stop switches (if equipped)" },
      ]},
    ],
  },

  "Portable Generators Weekly Inspection": {
    sections: [
      { equipmentName: "Visual Running Checks", tasks: [
        { task: "Check all gauges" },
        { task: "Check Engine Protection Relay, record fault history, Engine Hours etc.", hasInput: true, inputLabel: "Engine Hours:" },
        { task: "Walk around Unit - Visually Inspect/Listen for Damage/Defects" },
        { task: "Open all doors - Visually Inspect/Listen for Damage/Defects i.e Excessive vibration, loose/rattling components or panels, leaking exhaust/Turbo etc." },
        { task: "Check Engine Guards are in place and compliant" },
        { task: "Push Emergency Stop Button to Shut Unit Down" },
        { task: "Check Exhaust Flap closes" },
      ]},
      { equipmentName: "Fire Extinguisher", tasks: [{ task: "Check fire extinguisher charged and mounted securely" }]},
      { equipmentName: "Electrical Offline", tasks: [
        { task: "Check battery Isolator is Operational & Lockable" }, { task: "Check battery & battery Cabling" },
        { task: "Check battery terminals are tight and corrosion free" }, { task: "Check condition of all battery, starter and alternator cables" },
        { task: "Check wiring harnesses are securely mounted and undamaged" }, { task: "Check battery electrolyte level and that batteries are mounted securely" },
        { task: "Check Engine and Generator Mounts" }, { task: "Check Generator Cabling - look for signs of damage, chaffing, secured etc." },
        { task: "Check Generator covers and guards are all in place" }, { task: "Check Main Switch/ Circuit Breaker is Operational and Lockable" },
        { task: "Check Main Switch/ Circuit Breaker is Labelled" },
      ]},
      { equipmentName: "General", tasks: [
        { task: "Check all engine hoses, pipes and clamps for damage" }, { task: "Check engine alternator and fan v-belt adjustment" },
        { task: "Check Engine alternator mounted securely" }, { task: "Check for engine oil leaks" },
        { task: "Check fuel hoses mounted securely, replace any chafed or worn hoses" }, { task: "Check/drain Fuel Filters" },
        { task: "Check all radiator hoses, clamps and coolant lines for deterioration or damage" }, { task: "Check radiator for damage, blockage and leaks" },
      ]},
      { equipmentName: "Service Items", tasks: [
        { task: "Check outer air filter and clean if necessary" }, { task: "Check/Top up Coolant level" },
        { task: "Check/Top up Engine Oil level" }, { task: "Prestart Check, Close all doors & Restart" }, { task: "Clean Pre-filter" },
      ]},
      { equipmentName: "Restart Unit - Electrical (Online)", tasks: [
        { task: "Check all gauges" }, { task: "Check Engine Protection Relay" }, { task: "Check operation of all emergency stop switches (if equipped)" },
      ]},
    ],
  },

  "Power Station Generator Weekly Inspection": {
    sections: [
      { sectionName: "Walk Around Inspection", items: [
        { id: "1", description: "Check for any visible damage to generator housing" },
        { id: "2", description: "Check for oil, fuel, or coolant leaks under the generator" },
        { id: "3", description: "Ensure all warning labels and signage are intact" },
        { id: "4", description: "Check mounting frame or skid for rust or structural damage" },
        { id: "5", description: "Inspect vibration isolators for cracks or wear" },
      ]},
      { sectionName: "Fluids & Levels", items: [
        { id: "6", description: "Engine oil level" }, { id: "7", description: "Coolant level" },
        { id: "8", description: "Fuel level" }, { id: "9", description: "Battery electrolyte level (if applicable)" },
        { id: "10", description: "Radiator overflow bottle level" },
      ]},
      { sectionName: "Engine", items: [
        { id: "11", description: "Inspect for oil, coolant, or fuel leaks" }, { id: "12", description: "Check belts for wear and tension" },
        { id: "13", description: "Inspect engine mounts" }, { id: "14", description: "Inspect air intake hoses and clamps" },
        { id: "15", description: "Check radiator/cooler areas for dust buildup" },
        { id: "16", description: "Check exhaust system for cracks, soot leaks, or loose fittings" },
        { id: "17", description: "Check turbocharger (if equipped) for loose connections or oil leaks" },
        { id: "18", description: "Replace Air Filter" },
      ]},
      { sectionName: "Cooling System", items: [
        { id: "19", description: "Radiator clean and free of debris" }, { id: "20", description: "Radiator fins intact, not bent or blocked" },
        { id: "21", description: "Hoses, clamps, and connections checked for wear or leaks" },
        { id: "22", description: "Fan operation smooth" }, { id: "23", description: "Check for corrosion in cooling system" },
      ]},
      { sectionName: "Fuel System", items: [
        { id: "24", description: "Fuel tank, lines, and filters inspected for leaks or damage" },
        { id: "25", description: "Drain water separators (if fitted)" },
        { id: "26", description: "Inspect fuel injection pump and connections" },
        { id: "27", description: "Verify fuel cap seal integrity" },
      ]},
      { sectionName: "Lubrication System", items: [
        { id: "28", description: "Inspect oil filters" }, { id: "29", description: "Inspect oil cooler and lines for leaks" },
        { id: "30", description: "Check for correct oil pressure during operation" },
      ]},
      { sectionName: "Electrical System", items: [
        { id: "31", description: "Battery terminals clean and secure" }, { id: "32", description: "Check battery charge and condition" },
        { id: "33", description: "Inspect starter and alternator connections" },
        { id: "34", description: "Inspect terminal connections and insulation" },
      ]},
      { sectionName: "Exhaust System", items: [
        { id: "35", description: "Inspect exhaust piping and muffler for leaks" },
        { id: "36", description: "Check mounting brackets and supports" },
        { id: "37", description: "Inspect for excessive soot buildup" },
      ]},
      { sectionName: "Safety Equipment", items: [
        { id: "38", description: "Battery Isolator Installed and Lockable" },
        { id: "39", description: "Fire extinguisher present and charged" },
        { id: "40", description: "Spill kit available" }, { id: "41", description: "Grounding connections secure" },
        { id: "42", description: "Check for loose panels, covers, and guards" },
      ]},
      { sectionName: "Operational Checks", items: [
        { id: "43", description: "Start generator and verify smooth operation" },
        { id: "44", description: "Observe for unusual noises or vibrations" },
        { id: "45", description: "Monitor gauges: oil pressure, coolant temperature, voltage, frequency" },
        { id: "46", description: "Shutdown and verify no alarms or leaks" },
      ]},
    ],
  },

  "Crusher Fuel Farm Generator Weekly Electrical Inspection": [
    { id: 1, task: "Visual Inspection: Check for any faults, warning lights or abnormal indicators" },
    { id: 2, task: "Inspect all Wiring and Connections" },
    { id: 3, task: "Inspect all Circuit Breakers and Fuses" },
    { id: 4, task: "Inspect Batteries and Connections/Isolator" },
    { id: 5, task: "Check cleanliness of Control Panel and Internal compartments" },
    { id: 6, task: "Start Motor and Check Operation" },
    { id: 7, task: "Check Voltage and Frequency, Test/Measure Voltage of Battery to see if Alternator is charging correctly or Regulator is failing" },
  ],

  // ══════════════════════════════════════════════════════════════════
  // OPS / MOBILE EQUIPMENT WEEKLY (remaining)
  // ══════════════════════════════════════════════════════════════════

  "EWP Weekly Inspection": {
    sections: [
      { sectionName: "Safety", items: [
        { id: "1", description: "Load chart / operating manual on machine" }, { id: "2", description: "Fire extinguisher charged & accessible" },
        { id: "3", description: "First-aid kit checked" }, { id: "4", description: "Compliance plates legible" },
        { id: "5", description: "Fall arrest anchor points condition" }, { id: "6", description: "Battery isolator functioning & labelled" },
        { id: "7", description: "Starter isolator functioning & labelled" }, { id: "8", description: "Flashing beacon / rotating amber light functioning" },
        { id: "9", description: "Horn functioning" }, { id: "10", description: "Emergency stop switches operational" },
        { id: "11", description: "Reverse alarm functioning" },
      ]},
      { sectionName: "Hydraulic System", items: [
        { id: "12", description: "Hydraulic oil level" }, { id: "13", description: "Hoses free from abrasion, leaks" },
        { id: "14", description: "Cylinders free from leaks/damage" }, { id: "15", description: "Lift/boom/scissor functions smooth" },
        { id: "16", description: "Pump noise normal" }, { id: "17", description: "Auxiliary hydraulics" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "18", description: "Engine oil level" }, { id: "19", description: "Coolant level & condition" },
        { id: "20", description: "Radiator clean, free of blockages" }, { id: "21", description: "Belts and Pulleys condition & tension" },
        { id: "22", description: "Fuel filter / water separator drained" }, { id: "23", description: "Air filters (primary and secondary)" },
        { id: "24", description: "No oil, coolant, or fuel leaks" }, { id: "25", description: "Fuel level" },
      ]},
      { sectionName: "Electrical System", items: [
        { id: "26", description: "Battery condition & mounting" }, { id: "27", description: "Terminals clean, no corrosion" },
        { id: "28", description: "Display screens and indicators functional" }, { id: "29", description: "Control panel buttons/switches operational" },
        { id: "30", description: "Wiring secured, no exposed wires" },
      ]},
      { sectionName: "Drive Train", items: [
        { id: "31", description: "Tyres/wheels condition" }, { id: "32", description: "Tyre pressure (if pneumatic)" },
        { id: "33", description: "Wheel nuts tight" }, { id: "34", description: "Axles and hubs leak-free" },
        { id: "35", description: "Brakes and parking brake work correctly" }, { id: "36", description: "All lubrication points serviced" },
      ]},
      { sectionName: "Platform", items: [
        { id: "37", description: "Guardrails secure & undamaged" }, { id: "38", description: "Entry gate self-closing & latches" },
        { id: "39", description: "Control box secure & functioning" }, { id: "40", description: "Joystick operation smooth" },
        { id: "41", description: "Footswitch/interlock operational" }, { id: "42", description: "Platform capacity label legible" },
        { id: "43", description: "Platform leveling system functional" },
      ]},
      { sectionName: "Boom", items: [
        { id: "44", description: "Boom sections free of cracks/damage" }, { id: "45", description: "Wear pads and rollers condition" },
        { id: "46", description: "Slew bearing, rotation smooth" }, { id: "47", description: "Safety limit switches active" },
        { id: "48", description: "All lubrication points serviced" },
      ]},
    ],
  },

  "Excavator Weekly Inspection": {
    sections: [
      { sectionName: "Walk Around Inspection", items: [
        { id: "1", description: "Inspect machine structure, boom, stick, bucket, and attachments for damage or cracks" },
        { id: "2", description: "Inspect guards, panels, and covers for proper attachment" },
        { id: "3", description: "Check for loose or missing bolts, nuts, or pins" },
        { id: "4", description: "Inspect handrails, steps, and safety decals for condition" },
        { id: "5", description: "Ensure warning labels and signage are intact" },
      ]},
      { sectionName: "Fluids & Levels", items: [
        { id: "6", description: "Engine oil level" }, { id: "7", description: "Coolant level" },
        { id: "8", description: "Fuel level" }, { id: "9", description: "Battery electrolyte level (if applicable)" },
        { id: "10", description: "DEF / AdBlue level (if SCR equipped)" }, { id: "11", description: "Transmission or swing drive oil levels" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "12", description: "Inspect for oil, coolant, or fuel leaks" }, { id: "13", description: "Check belts for wear and tension" },
        { id: "14", description: "Check air filter restriction indicator" }, { id: "15", description: "Change/Clean air filter elements as needed" },
        { id: "16", description: "Inspect air intake hoses and clamps" }, { id: "17", description: "Check radiator/cooler areas for dust buildup" },
        { id: "18", description: "Check turbo and exhaust system for cracks, soot leaks, or loose fittings" },
      ]},
      { sectionName: "Electrical System", items: [
        { id: "19", description: "Battery terminals clean and secure" }, { id: "20", description: "Battery isolator functional and in correct position" },
        { id: "21", description: "Lights and indicators operational" }, { id: "22", description: "Control panel functioning correctly" },
        { id: "23", description: "Wiring secure, no exposed or damaged cables" }, { id: "24", description: "Test warning lights and alarms" },
      ]},
      { sectionName: "Hydraulic System", items: [
        { id: "25", description: "Check hydraulic oil level" }, { id: "26", description: "Inspect hydraulic hoses and fittings for leaks or damage" },
        { id: "27", description: "Check hydraulic cylinders for leaks or scoring" }, { id: "28", description: "Test all hydraulic functions for smooth operation" },
        { id: "29", description: "Inspect hydraulic tank breather/cap" },
      ]},
      { sectionName: "Undercarriage & Tracks", items: [
        { id: "30", description: "Inspect track tension and adjustment" }, { id: "31", description: "Check track pads for wear or damage" },
        { id: "32", description: "Inspect idlers, rollers, and sprockets for wear" }, { id: "33", description: "Check for loose or missing track bolts" },
        { id: "34", description: "Inspect final drive for leaks" },
      ]},
      { sectionName: "Operator Cab / Safety", items: [
        { id: "35", description: "Seat, seatbelt, and controls functioning properly" }, { id: "36", description: "Fire extinguisher present and charged" },
        { id: "37", description: "Horn, backup alarm, and mirrors operational" }, { id: "38", description: "Windows and doors operate correctly" },
        { id: "39", description: "HVAC system functioning" }, { id: "40", description: "Cab interior clean and free of debris" },
      ]},
      { sectionName: "Operational Checks", items: [
        { id: "41", description: "Engine starts smoothly with no unusual noise" },
        { id: "42", description: "Monitor gauges: oil pressure, coolant temperature, hydraulic pressure" },
        { id: "43", description: "Observe for unusual noises, vibrations, or smoke" },
        { id: "44", description: "Test swing function and brakes" }, { id: "45", description: "Test travel functions - forward and reverse" },
        { id: "46", description: "Shutdown normal with no alarms" },
      ]},
      { sectionName: "Auto-Greaser (if equipped)", items: [
        { id: "47", description: "Verify grease levels and automatic greasing system functioning" },
        { id: "48", description: "Check all grease points for lubrication" },
        { id: "49", description: "Inspect grease lines for damage or blockage" },
      ]},
    ],
  },

  "Forklift Weekly Inspection": {
    sections: [
      { sectionName: "Safety", items: [
        { id: "1", description: "Load rating plate legible" }, { id: "2", description: "Fire extinguisher charged and accessible" },
        { id: "3", description: "ROPS/FOPS structure undamaged" }, { id: "4", description: "Seatbelt functioning" },
        { id: "5", description: "Flashing beacon / rotating amber light working" }, { id: "6", description: "Emergency stop switch operational" },
      ]},
      { sectionName: "Hydraulics", items: [
        { id: "7", description: "Hydraulic oil level" }, { id: "8", description: "Lift/tilt/side-shift functions smooth" },
        { id: "9", description: "Hydraulic hoses not leaking or frayed" }, { id: "10", description: "Lift cylinders not leaking" },
        { id: "11", description: "Steering hydraulics functioning normally" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "12", description: "Engine oil level" }, { id: "13", description: "Coolant level & condition" },
        { id: "14", description: "Radiator clean, no debris" }, { id: "15", description: "Belts condition & tension" },
        { id: "16", description: "Fuel filter / water separator" }, { id: "17", description: "Air filter primary & secondary" },
        { id: "18", description: "No oil, fuel, or coolant leaks" },
      ]},
      { sectionName: "Electrical System", items: [
        { id: "19", description: "Lights (work lights, beacon) operating" }, { id: "20", description: "Battery charger/maintainer operating" },
        { id: "21", description: "Control panel displays working" }, { id: "22", description: "Battery terminals secure and clean" },
        { id: "23", description: "Wiring secure, no exposed or damaged cables" },
      ]},
      { sectionName: "Transmission and Driveline", items: [
        { id: "24", description: "Transmission oil level" }, { id: "25", description: "Gear shifting smooth" },
        { id: "26", description: "Reverse alarm operational" }, { id: "27", description: "Gauges & displays working" },
        { id: "28", description: "Battery isolator switch functional" }, { id: "29", description: "Starter isolator functional" },
        { id: "30", description: "All lubrication points serviced" },
      ]},
      { sectionName: "Mast, Carriage and Forks", items: [
        { id: "31", description: "Mast rails straight" }, { id: "32", description: "Mast rollers condition (not seized)" },
        { id: "33", description: "Chains lubricated, equal tension, no cracks" }, { id: "34", description: "Carriage slides smoothly" },
        { id: "35", description: "Forks straight, not bent" }, { id: "36", description: "Locking pins engaged" },
        { id: "37", description: "Fork wear within limits" }, { id: "38", description: "Tilt function smooth" },
      ]},
      { sectionName: "Cab", items: [
        { id: "39", description: "Cab cleanliness" }, { id: "40", description: "Mirrors clean and adjusted" },
        { id: "41", description: "Horn functioning" }, { id: "42", description: "Seat condition and adjustment" },
      ]},
    ],
  },

  "Moxy Weekly Inspection": {
    sections: [
      { sectionName: "Walk Around Inspection", items: [
        { id: "1", description: "Check for body damage, loose panels, cracked welds" },
        { id: "2", description: "Check handrails, steps, and platforms for safety" },
        { id: "3", description: "Check fuel, oil, or coolant leaks under machine" }, { id: "4", description: "Ensure all safety decals are clean and readable" },
      ]},
      { sectionName: "Fluids & Levels", items: [
        { id: "5", description: "Engine oil level" }, { id: "6", description: "Coolant level" },
        { id: "7", description: "Hydraulic oil level" }, { id: "8", description: "Transmission oil level (sight gauge)" },
        { id: "9", description: "Fuel level" }, { id: "10", description: "AdBlue / DEF level (if equipped)" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "11", description: "Inspect for oil, coolant, or fuel leaks" }, { id: "12", description: "Check belts for wear and tension" },
        { id: "13", description: "Replace air filter" }, { id: "14", description: "Inspect air intake hoses and clamps" },
        { id: "15", description: "Check radiator/cooler areas for dust buildup" },
        { id: "16", description: "Inspect radiator and cooler fins for blockage or damage" },
        { id: "17", description: "Verify fan operation is normal" },
      ]},
      { sectionName: "Hydraulic System", items: [
        { id: "18", description: "Check hoses and fittings for leaks or damage" },
        { id: "19", description: "Inspect lift and tilt cylinders for leaks" },
        { id: "20", description: "Inspect hydraulic tank area for leaks" },
        { id: "21", description: "Confirm bucket, lift, and tilt functions operate smoothly" },
      ]},
      { sectionName: "Auto Greaser", items: [
        { id: "22", description: "Grease reservoir level" }, { id: "23", description: "Greaser pump cycles normally" },
        { id: "24", description: "No damaged, leaking, or missing grease lines" },
      ]},
      { sectionName: "Tires", items: [
        { id: "25", description: "Tire pressure visually OK" }, { id: "26", description: "No cuts, cracks, or sidewall damage" },
        { id: "27", description: "No missing or loose wheel nuts" }, { id: "28", description: "Hubs show no signs of overheating or oil leak" },
      ]},
      { sectionName: "Steering", items: [
        { id: "29", description: "Check articulation area for debris buildup" },
        { id: "30", description: "No excessive free play in articulation joint" },
        { id: "31", description: "Steering cylinders not leaking" },
        { id: "32", description: "Oscillation joint functioning normally" },
        { id: "33", description: "Axles free of leaks" },
      ]},
      { sectionName: "Braking", items: [
        { id: "34", description: "Service brakes functioning normally" },
        { id: "35", description: "Parking brake holding correctly" },
        { id: "36", description: "No brake warning indicators on display" },
      ]},
      { sectionName: "Dump Body & Frame Structure", items: [
        { id: "37", description: "Inspect hinge pins, bushes, and grease points" },
        { id: "38", description: "Inspect body floor, sides, and tailgate for cracks or damage" },
        { id: "39", description: "Inspect chassis rails and welds" },
        { id: "40", description: "Check body cylinder mounts" },
        { id: "41", description: "Inspect tailgate operation (if fitted)" },
      ]},
      { sectionName: "Electrical", items: [
        { id: "42", description: "Lights (work lights, indicators, beacon, brake lights) operating" },
        { id: "43", description: "Horn functioning" }, { id: "44", description: "Reverse alarm works" },
        { id: "45", description: "Battery terminals secure and clean" }, { id: "46", description: "No exposed or damaged wiring" },
      ]},
      { sectionName: "Cab", items: [
        { id: "47", description: "Seatbelt in good condition" }, { id: "48", description: "Mirrors and windows clean and intact" },
        { id: "49", description: "HVAC functioning" }, { id: "50", description: "Check cab air filter" },
        { id: "51", description: "Fire extinguisher present and charged" }, { id: "52", description: "First-aid kit" },
        { id: "53", description: "Monitor/display functioning with no active warnings" },
      ]},
      { sectionName: "Operational Checks", items: [
        { id: "54", description: "Engine starts smoothly with no unusual noise" },
        { id: "55", description: "Gauges and warning lights normal" }, { id: "56", description: "Steering responsive" },
        { id: "57", description: "Hydraulics responsive and smooth" },
        { id: "58", description: "Run full dump cycle—smooth and stable" },
        { id: "59", description: "Smooth gear shifting" }, { id: "60", description: "Test brake holding before travel" },
      ]},
    ],
  },

  "Loader Weekly Inspection": {
    sections: [
      { sectionName: "Walk Around Inspection", items: [
        { id: "1", description: "Check for body damage, loose panels, cracked welds" },
        { id: "2", description: "Check handrails, steps, and platforms for safety" },
        { id: "3", description: "Check fuel, oil, or coolant leaks under machine" }, { id: "4", description: "Ensure all safety decals are clean and readable" },
      ]},
      { sectionName: "Fluids & Levels", items: [
        { id: "5", description: "Engine oil level" }, { id: "6", description: "Coolant level" },
        { id: "7", description: "Hydraulic oil level" }, { id: "8", description: "Transmission oil level (sight gauge)" },
        { id: "9", description: "Fuel level" }, { id: "10", description: "AdBlue / DEF level (if equipped)" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "11", description: "Inspect for oil, coolant, or fuel leaks" }, { id: "12", description: "Check belts for wear and tension" },
        { id: "13", description: "Replace air filter" }, { id: "14", description: "Inspect air intake hoses and clamps" },
        { id: "15", description: "Check radiator/cooler areas for dust buildup" },
        { id: "16", description: "Inspect radiator and cooler fins for blockage or damage" },
        { id: "17", description: "Verify fan operation is normal" },
      ]},
      { sectionName: "Hydraulic System", items: [
        { id: "18", description: "Check hoses and fittings for leaks or damage" },
        { id: "19", description: "Inspect lift and tilt cylinders for leaks" },
        { id: "20", description: "Inspect hydraulic tank area for leaks" },
        { id: "21", description: "Confirm bucket, lift, and tilt functions operate smoothly" },
      ]},
      { sectionName: "Auto Greaser", items: [
        { id: "22", description: "Grease reservoir level" }, { id: "23", description: "Greaser pump cycles normally" },
        { id: "24", description: "No damaged, leaking, or missing grease lines" },
      ]},
      { sectionName: "Tires", items: [
        { id: "25", description: "Tire pressure visually OK" }, { id: "26", description: "No cuts, cracks, or sidewall damage" },
        { id: "27", description: "No missing or loose wheel nuts" }, { id: "28", description: "Hubs show no signs of overheating or oil leak" },
      ]},
      { sectionName: "Steering & Articulation Joint", items: [
        { id: "29", description: "Check articulation area for debris buildup" },
        { id: "30", description: "No excessive free play in articulation joint" },
        { id: "31", description: "Steering cylinders not leaking" },
        { id: "32", description: "Oscillation joint functioning normally" },
        { id: "33", description: "Axles free of leaks" },
      ]},
      { sectionName: "Braking", items: [
        { id: "34", description: "Service brakes functioning normally" },
        { id: "35", description: "Parking brake holding correctly" },
        { id: "36", description: "No brake warning indicators on display" },
      ]},
      { sectionName: "Bucket", items: [
        { id: "37", description: "Cutting edges and teeth intact" }, { id: "38", description: "No cracks or damage on bucket" },
        { id: "39", description: "Linkage pins and bushes appear lubricated and secure" },
      ]},
      { sectionName: "Electrical", items: [
        { id: "40", description: "Lights (work lights, indicators, beacon, brake lights) operating" },
        { id: "41", description: "Horn functioning" }, { id: "42", description: "Reverse alarm works" },
        { id: "43", description: "Battery terminals secure and clean" }, { id: "44", description: "No exposed or damaged wiring" },
      ]},
      { sectionName: "Cab", items: [
        { id: "45", description: "Seatbelt in good condition" }, { id: "46", description: "Mirrors and windows clean and intact" },
        { id: "47", description: "HVAC functioning" }, { id: "48", description: "Check cab air filter" },
        { id: "49", description: "Fire extinguisher present and charged" }, { id: "50", description: "First-aid kit" },
        { id: "51", description: "Monitor/display functioning with no active warnings" },
      ]},
      { sectionName: "Operational Checks", items: [
        { id: "52", description: "Engine starts smoothly with no unusual noise" },
        { id: "53", description: "Gauges and warning lights normal" }, { id: "54", description: "Steering responsive" },
        { id: "55", description: "Hydraulics responsive and smooth" }, { id: "56", description: "Smooth gear shifting" },
        { id: "57", description: "Test brake holding before travel" },
      ]},
    ],
  },

  "Service Truck Weekly Inspection": {
    sections: [
      { sectionName: "Safety", items: [
        { id: "1", description: "Flashing beacon/strobe operational" }, { id: "2", description: "Reverse alarm functional" },
        { id: "3", description: "Two-way radio working" }, { id: "4", description: "Fire extinguisher charged and secure" },
        { id: "5", description: "First aid kit stocked" }, { id: "6", description: "Wheel chocks present & serviceable" },
        { id: "7", description: "Emergency triangles present" },
      ]},
      { sectionName: "Tyres", items: [
        { id: "8", description: "Tyre pressure correct" }, { id: "9", description: "Tyre tread & sidewall condition" },
        { id: "10", description: "Rims and wheel nuts secure" }, { id: "11", description: "Tyre condition (cuts, cracks, wear)" },
        { id: "12", description: "Rims – cracks, distortion" }, { id: "13", description: "Wheel nuts tight, no movement" },
        { id: "14", description: "Centre pad & wheel studs condition" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "15", description: "Engine oil level" }, { id: "16", description: "Coolant level & condition" },
        { id: "17", description: "Radiator clean, free of blockages" }, { id: "18", description: "Belts condition & tension" },
        { id: "19", description: "Fuel filter / water separator drained" }, { id: "20", description: "Air filters (primary and secondary)" },
        { id: "21", description: "No oil, coolant, or fuel leaks" },
      ]},
      { sectionName: "Electrical System", items: [
        { id: "22", description: "Battery isolator functioning" }, { id: "23", description: "Battery isolator clearly labelled" },
        { id: "24", description: "Batteries secure & corrosion-free" }, { id: "25", description: "External lights working" },
        { id: "26", description: "Internal lights working" }, { id: "27", description: "Jump Pack Charged" },
      ]},
      { sectionName: "Transmission", items: [
        { id: "28", description: "Transmission oil level" }, { id: "29", description: "Differential/axle oils" },
        { id: "30", description: "Universal joints, drivelines condition" }, { id: "31", description: "Drive performance normal" },
        { id: "32", description: "Grease all grease points" },
      ]},
      { sectionName: "Steering", items: [
        { id: "33", description: "Power steering fluid level" }, { id: "34", description: "Steering joints, tie rods, cylinder leaks" },
        { id: "35", description: "Driveshaft/U-joints secure" }, { id: "36", description: "No abnormal noises" },
        { id: "37", description: "No excessive free play" },
      ]},
      { sectionName: "Auto Greaser", items: [
        { id: "38", description: "Inspection operation of greaser" }, { id: "39", description: "Inspect level" },
        { id: "40", description: "Inspect grease lines and repair if required" },
      ]},
      { sectionName: "Braking", items: [
        { id: "41", description: "Service brakes effective" }, { id: "42", description: "Park brake holding capacity" },
        { id: "43", description: "Brake lines/hoses intact" }, { id: "44", description: "Air leaks" },
        { id: "45", description: "Suspension components safe" },
      ]},
      { sectionName: "Body Work & Structure", items: [{ id: "46", description: "Steps, handrails, grab points secure" }]},
      { sectionName: "Onboard Tools and Equipment", items: [
        { id: "47", description: "Air compressor operational" }, { id: "48", description: "Hoses leak-free" },
        { id: "49", description: "Toolboxes secure" }, { id: "50", description: "Grease system functioning" },
        { id: "51", description: "Fuel system functional" }, { id: "52", description: "Waste oil tank level - If full decant into approved disposal tank" },
        { id: "53", description: "Lubricant levels" },
      ]},
      { sectionName: "Cabin", items: [
        { id: "54", description: "Operator controls smooth/functional" }, { id: "55", description: "Mirrors clean & intact" },
        { id: "56", description: "Windows/windscreen clean and undamaged" }, { id: "57", description: "Wipers & washer operation" },
        { id: "58", description: "Air-conditioning functioning" },
      ]},
    ],
  },

  "Skid Steer Weekly Inspection": {
    sections: [
      { sectionName: "Safety", items: [
        { id: "1", description: "Fire extinguisher charged and accessible" }, { id: "2", description: "First-aid kit stocked (if fitted)" },
        { id: "3", description: "ROPS/FOPS structure undamaged" }, { id: "4", description: "Seatbelt condition & function" },
        { id: "5", description: "Pre-start book completed daily" },
      ]},
      { sectionName: "Hydraulic System", items: [
        { id: "6", description: "Hydraulic oil level" }, { id: "7", description: "Hydraulic hoses (wear, abrasion, leaks)" },
        { id: "8", description: "Pump noise, temperature, smooth operation" }, { id: "9", description: "Cylinders (leaks, rod damage)" },
        { id: "10", description: "Auxiliary hydraulic couplers – leaks & dust caps intact" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "11", description: "Engine oil level" }, { id: "12", description: "Coolant level & condition" },
        { id: "13", description: "Radiator clean, no blockages" }, { id: "14", description: "Belts condition & tension" },
        { id: "15", description: "Air filter (primary & secondary)" }, { id: "16", description: "Fuel filter & water trap" },
        { id: "17", description: "Check for oil, coolant, or fuel leaks" }, { id: "18", description: "Exhaust condition and mounting" },
      ]},
      { sectionName: "Electrical System", items: [
        { id: "19", description: "Battery condition (secure, clean terminals)" }, { id: "20", description: "Alternator charging correctly (no warnings)" },
        { id: "21", description: "Wiring harness secure; no exposed wires" }, { id: "22", description: "All machine lights functioning" },
        { id: "23", description: "Reverse alarm, horn functioning" }, { id: "24", description: "Operator display & gauges functioning" },
        { id: "25", description: "No active electrical fault codes" }, { id: "26", description: "Battery isolator switch present & functioning" },
        { id: "27", description: "Starter isolator operational" }, { id: "28", description: "Flashing beacon/rotating light operational" },
      ]},
      { sectionName: "Cabin", items: [
        { id: "29", description: "Seat, arm rests, controls secure" }, { id: "30", description: "Joysticks/pedals smooth and responsive" },
        { id: "31", description: "Wipers & washers working" }, { id: "32", description: "Mirrors clean & intact" },
        { id: "33", description: "Cab cleanliness" }, { id: "34", description: "Aircon functioning" },
      ]},
      { sectionName: "Bucket and Attachments", items: [
        { id: "35", description: "Pins & bushings – lubrication & wear" }, { id: "36", description: "Quick coupler operation & locking" },
        { id: "37", description: "Bucket/attachments – cutting edge wear, cracks" }, { id: "38", description: "Auxiliary hydraulics working normally" },
      ]},
    ],
  },

  "Telehandler Weekly Inspection": {
    sections: [
      { sectionName: "Safety", items: [
        { id: "1", description: "Load charts in cab & legible" }, { id: "2", description: "Fire extinguisher charged & accessible" },
        { id: "3", description: "First-aid kit checked" }, { id: "4", description: "ROPS/FOPS integrity" },
        { id: "5", description: "Seatbelt functioning & in good condition" }, { id: "6", description: "Battery isolator functioning & labelled" },
        { id: "7", description: "Starter isolator functioning & labelled" }, { id: "8", description: "Flashing beacon / rotating amber light functioning" },
        { id: "9", description: "Horn functioning" }, { id: "10", description: "Emergency stop switches operational" },
        { id: "11", description: "Reversing Beeper Operational" },
      ]},
      { sectionName: "Hydraulics", items: [
        { id: "12", description: "Hydraulic oil level" }, { id: "13", description: "Hydraulic hoses (cracks, abrasion, leaks)" },
        { id: "14", description: "Pump performance & abnormal noise" }, { id: "15", description: "Lift/tilt/boom functions smooth" },
        { id: "16", description: "Hydraulic cylinders – leaks, rod damage" }, { id: "17", description: "Auxiliary hydraulics functioning correctly" },
        { id: "18", description: "Stabiliser hydraulics" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "19", description: "Engine oil level" }, { id: "20", description: "Coolant level & condition" },
        { id: "21", description: "Radiator clean, free of blockages" }, { id: "22", description: "Belts condition & tension" },
        { id: "23", description: "Fuel filter / water separator drained" }, { id: "24", description: "Air filters (primary and secondary)" },
        { id: "25", description: "No oil, coolant, or fuel leaks" }, { id: "26", description: "Exhaust system secure" },
      ]},
      { sectionName: "Electrical System", items: [
        { id: "27", description: "Battery condition & mounting" }, { id: "28", description: "Terminals clean, no corrosion" },
        { id: "29", description: "Wiring harness secure, no exposed wires" }, { id: "30", description: "Work lights, indicators, hazards operational" },
        { id: "31", description: "Dashboard gauges working" }, { id: "32", description: "Reverse alarm functional" },
        { id: "33", description: "No active electrical fault codes" },
      ]},
      { sectionName: "Transmission", items: [
        { id: "34", description: "Transmission oil level" }, { id: "35", description: "Gear changes smooth" },
        { id: "36", description: "No driveline or differential leaks" }, { id: "37", description: "Parking brake functioning" },
        { id: "38", description: "Service brakes performing correctly" }, { id: "39", description: "Axles free from damage or leaks" },
        { id: "40", description: "Grease all Grease points" },
      ]},
      { sectionName: "Steering", items: [
        { id: "41", description: "Steering response normal" }, { id: "42", description: "Four-wheel steer & crab modes functional" },
        { id: "43", description: "Steering cylinders and hoses intact" }, { id: "44", description: "No excessive free play" },
        { id: "45", description: "Suspension components intact" },
      ]},
      { sectionName: "Auto Greaser", items: [
        { id: "46", description: "Inspection Operation of Greaser" }, { id: "47", description: "Inspect Level" },
        { id: "48", description: "Inspect Grease Lines and repair if Required" },
      ]},
      { sectionName: "Tyres", items: [
        { id: "49", description: "Tyre condition (cuts, cracks, wear)" }, { id: "50", description: "Tyre pressures correct" },
        { id: "51", description: "Rims – cracks, distortion" }, { id: "52", description: "Wheel nuts tight, no movement" },
        { id: "53", description: "Hub oil levels (if applicable)" },
      ]},
      { sectionName: "Boom & Attachments", items: [
        { id: "54", description: "Boom sections straight & undamaged" }, { id: "55", description: "Boom pads/rollers condition" },
        { id: "56", description: "Boom wear pads intact" }, { id: "57", description: "Boom hoses & internal chains/cables in good condition" },
        { id: "58", description: "Carriage locks working" }, { id: "59", description: "Forks straight, not bent or worn" },
        { id: "60", description: "Correct attachment plate engagement" }, { id: "61", description: "Attachment (bucket, jib, man basket, etc.) secure" },
        { id: "62", description: "Quick-hitch locking mechanism functional" },
      ]},
      { sectionName: "Stabilisers", items: [
        { id: "63", description: "Stabilisers extend/retract smoothly" }, { id: "64", description: "Pads present and undamaged" },
        { id: "65", description: "Interlock switches working" },
      ]},
      { sectionName: "Cabin", items: [
        { id: "66", description: "Operator controls smooth/functional" }, { id: "67", description: "Mirrors clean & intact" },
        { id: "68", description: "Windows/windscreen clean and undamaged" }, { id: "69", description: "Wipers & washer operation" },
        { id: "70", description: "Air-conditioning functioning" }, { id: "71", description: "Joysticks free of sticking" },
      ]},
    ],
  },

  "Water Truck Weekly Inspection": {
    sections: [
      { sectionName: "Safety", items: [
        { id: "1", description: "Flashing beacon/strobe operational" }, { id: "2", description: "Reverse alarm functional" },
        { id: "3", description: "Two-way radio working" }, { id: "4", description: "Fire extinguisher charged and secure" },
        { id: "5", description: "First aid kit stocked" }, { id: "6", description: "Wheel chocks present & serviceable" },
        { id: "7", description: "Emergency triangles present" },
      ]},
      { sectionName: "Tyres", items: [
        { id: "8", description: "Tyre pressure correct" }, { id: "9", description: "Tyre tread & sidewall condition" },
        { id: "10", description: "Rims and wheel nuts secure" }, { id: "11", description: "Tyre condition (cuts, cracks, wear)" },
        { id: "12", description: "Rims – cracks, distortion" }, { id: "13", description: "Wheel nuts tight, no movement" },
        { id: "14", description: "Centre pad & wheel studs condition" },
      ]},
      { sectionName: "Engine Compartment", items: [
        { id: "15", description: "Engine oil level" }, { id: "16", description: "Coolant level & condition" },
        { id: "17", description: "Radiator clean, free of blockages" }, { id: "18", description: "Belts condition & tension" },
        { id: "19", description: "Fuel filter / water separator drained" }, { id: "20", description: "Air filters (primary and secondary)" },
        { id: "21", description: "No oil, coolant, or fuel leaks" },
      ]},
      { sectionName: "Electrical System", items: [
        { id: "22", description: "Battery isolator functioning" }, { id: "23", description: "Battery isolator clearly labelled" },
        { id: "24", description: "Batteries secure & corrosion-free" }, { id: "25", description: "All headlights, tail lights, indicators working" },
        { id: "26", description: "Internal lights working" }, { id: "27", description: "Jump pack charged" },
      ]},
      { sectionName: "Transmission", items: [
        { id: "28", description: "Transmission oil level" }, { id: "29", description: "Differential/axle oils" },
        { id: "30", description: "Universal joints, drivelines condition" }, { id: "31", description: "Drive performance normal" },
        { id: "32", description: "Grease all grease points" },
      ]},
      { sectionName: "Steering", items: [
        { id: "33", description: "Power steering fluid level" }, { id: "34", description: "Steering joints, tie rods, cylinder leaks" },
        { id: "35", description: "Driveshaft/U-joints secure" }, { id: "36", description: "No abnormal noises" },
        { id: "37", description: "No excessive free play" },
      ]},
      { sectionName: "Auto Greaser", items: [
        { id: "38", description: "Inspection operation of greaser" }, { id: "39", description: "Inspect level" },
        { id: "40", description: "Inspect grease lines and repair if required" },
      ]},
      { sectionName: "Braking", items: [
        { id: "41", description: "Service brakes effective" }, { id: "42", description: "Park brake holding capacity" },
        { id: "43", description: "Brake lines/hoses intact" }, { id: "44", description: "Air leaks" },
        { id: "45", description: "Suspension components safe" },
      ]},
      { sectionName: "Body Work & Structure", items: [{ id: "46", description: "Steps, handrails, grab points secure" }]},
      { sectionName: "Water Tank and Spray System", items: [
        { id: "47", description: "Tank secure, no cracks or leaks" }, { id: "48", description: "Water pump operational" },
        { id: "49", description: "Spray bars functioning" }, { id: "50", description: "Rear spray nozzles not blocked" },
        { id: "51", description: "Side spray nozzles working" }, { id: "52", description: "Water cannon functioning" },
        { id: "53", description: "Hoses and fittings leak-free" },
      ]},
      { sectionName: "Cabin", items: [
        { id: "54", description: "Operator controls smooth/functional" }, { id: "55", description: "Mirrors clean & intact" },
        { id: "56", description: "Windows/windscreen clean and undamaged" }, { id: "57", description: "Wipers & washer" },
        { id: "58", description: "Air-conditioning functioning" },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // ELECTRICAL — Spare Mill Motor, Cable Test, Full Test, Generator Yearly
  // ══════════════════════════════════════════════════════════════════

  "Spare Mill Motor Inspection Weekly": [
    { id: 1, task: "Check the Heater is Connected and Operational" },
    { id: 2, task: "Rotate Motor 4x Times" },
  ],

  "Cable Test Sheet Yearly": {
    checklistItems: [
      "Earth Lock Ring", "Glands Correct/Tight/Secured", "Cable Label Fitted",
      "Cables Terminated and Secured", "Line Shrouds Fitted", "Bridges Removed",
      "Tools Removed", "Cable Support System OK", "Cable Gland Wrapped in Denso",
    ],
    testColumns: ["R-W", "R-B", "W-B", "R-E", "W-E", "B-E", "R-N", "W-N", "B-N"],
  },

  "Full Test Sheet Yearly": {
    testColumns: [
      "Test Point/Circuit No.", "Conductor Sizes (mm²)", "MCB (Rating & Type)",
      "Active Ω (Rph)", "Earth or Ω (Re)", "Continuity Pass/Fail",
      "Insulation Resistance (MΩ)", "Pass/Fail", "Correct Circuit Connections",
      "Polarity Pass/Fail", "Fault Loop Impedance R (Ω)", "Max Permitted Loop Value R (Ω)",
      "Pass/Fail", "RCD Pass/Fail", "RCD Trip Time (mSec)",
    ],
    testRows: 20,
  },

  "Generator Electrical Test Yearly": {
    sections: [
      { equipmentName: "1. Generator – Dead Tests", tasks: [
        { task: "1. Multifunction Unit type: (1) Separate windings (2) Isolation Transformer fitted (3) Multi-position/multi-contact switch installed" },
        { task: "2. Over current and Short circuit protection provided on generator windings" },
        { task: "3. Neutral of 240V output bonded to earth (MEN)" },
        { task: "4. 30mA Residual Current Device (type II) fitted to all outlets" },
      ]},
      { equipmentName: "5. Insulation Resistance of Windings and Circuits (>1MΩ)", tasks: [
        { task: "a. U-V", hasInput: true, inputLabel: "MΩ @ 1000V" },
        { task: "b. V-W", hasInput: true, inputLabel: "MΩ @ 1000V" },
        { task: "c. W-U", hasInput: true, inputLabel: "MΩ @ 1000V" },
        { task: "d. U-E", hasInput: true, inputLabel: "MΩ @ 500V" },
        { task: "e. V-E", hasInput: true, inputLabel: "MΩ @ 500V" },
        { task: "f. W-E", hasInput: true, inputLabel: "MΩ @ 500V" },
      ]},
      { equipmentName: "6. Continuity Test Between Windings (<1Ω)", tasks: [
        { task: "a. U1-U2", hasInput: true, inputLabel: "Ω" },
        { task: "b. V1-V2", hasInput: true, inputLabel: "Ω" },
        { task: "c. W1-W2", hasInput: true, inputLabel: "Ω" },
      ]},
      { equipmentName: "Visual Checks & Earth Tests", tasks: [
        { task: "7. Frame of Generator bonded to main earth bar (<1Ω)" },
        { task: "8. Earth Terminal on all outlets bonded to main earth bar (<1Ω)" },
        { task: "9. All General-Purpose Outlets individually switched" },
        { task: "10. Flexible equipotential bonding conductor provided" },
        { task: "11. Equipotential conductor fitted with approved G-Clamp or spring-loaded tong" },
        { task: "12. Equipotential bonding conductor connected to unit main earth bar or unit frame" },
        { task: "13. Visual inspection as to condition of all electrical components including wiring" },
        { task: "14. Internal connection and cable glands are tight" },
        { task: "15. Confirm lock out facilities on isolators and breakers are available" },
        { task: "16. Confirm all terminations and busbar in generator DB tight" },
        { task: "17. Confirm all cable and glands in generator DB are secure" },
        { task: "18. Confirm all unused cable entries have been sealed" },
        { task: "19. Confirm that all labelling and identification is complete and correct" },
        { task: "20. Confirm that the generator is clean and free from damage" },
        { task: "21. Bottom of any electrical cubicles are clean of dust" },
      ]},
      { equipmentName: "Generator – Electrical", tasks: [
        { task: "1. Confirm that the fire extinguisher fitted and compliant" },
        { task: "2. Confirm that the Battery isolator is present, and it breaks contact" },
        { task: "3. Confirm that the Start isolator is present, and it breaks contact" },
        { task: "4. Confirm that there is an E-Stop present" },
      ]},
      { equipmentName: "2. Running – Operational Tests", tasks: [
        { task: "1. Correct polarity" },
        { task: "2. Injection test of RCD at idling position" },
        { task: "3. Push Button test of RCD" },
        { task: "4. Emergency Stop: (1) Test E-Stop shunts engine (2) Does E-Stop need to be manually reset (3) Once E-Stop is reset does the Engine restart" },
        { task: "5. Test Tag been placed with 6 Monthly Due Date" },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // RCD TESTING SHEETS (12 per-generator variants)
  // ══════════════════════════════════════════════════════════════════

  "RCD Testing Sheets - Admin Generator 3M": {
    generatorId: "admin", generatorName: "Admin Generator", assetNumber: "GEN-009", area: "ADMIN",
    testType: "push-button", frequency: "3M",
    circuits: [
      { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "16A" },
      { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" },
    ],
  },
  "RCD Testing Sheets - Admin Generator 6M": {
    generatorId: "admin", generatorName: "Admin Generator", assetNumber: "GEN-009", area: "ADMIN",
    testType: "injection", frequency: "6M",
    circuits: [
      { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "16A" },
      { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" },
    ],
  },
  "RCD Testing Sheets - Nobles Natural Sump Generator 3M": {
    generatorId: "nobles-natural-sump", generatorName: "Nobles Natural Sump Generator", assetNumber: "17-GN-011", area: "NOBLES NATURAL SUMP",
    testType: "push-button", frequency: "3M",
    circuits: [
      { description: "GPO", rating: "16A" }, { description: "GPO", rating: "16A" },
      { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" },
    ],
  },
  "RCD Testing Sheets - Nobles Natural Sump Generator 6M": {
    generatorId: "nobles-natural-sump", generatorName: "Nobles Natural Sump Generator", assetNumber: "17-GN-011", area: "NOBLES NATURAL SUMP",
    testType: "injection", frequency: "6M",
    circuits: [
      { description: "15A OUTLET", rating: "16A" }, { description: "15A OUTLET", rating: "16A" },
      { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" },
    ],
  },
  "RCD Testing Sheets - Juno Generator 3M": {
    generatorId: "juno-bore", generatorName: "Juno Generator", assetNumber: "17-GN-016", area: "JUNO BORE",
    testType: "push-button", frequency: "3M",
    circuits: [
      { description: "15A OUTLET", rating: "16A" }, { description: "15A OUTLET", rating: "16A" },
      { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" },
    ],
  },
  "RCD Testing Sheets - Juno Generator 6M": {
    generatorId: "juno-bore", generatorName: "Juno Generator", assetNumber: "17-GN-016", area: "JUNO BORE",
    testType: "injection", frequency: "6M",
    circuits: [
      { description: "15A OUTLET", rating: "16A" }, { description: "15A OUTLET", rating: "16A" },
      { description: "3 PHASE OUTLET", rating: "32A" }, { description: "3 PHASE OUTLET", rating: "32A" },
    ],
  },
  "RCD Testing Sheets - Lab Generator 3M": {
    generatorId: "lab", generatorName: "Lab Generator", assetNumber: "GEN-012", area: "LAB",
    testType: "push-button", frequency: "3M",
    circuits: [
      { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "16A" },
      { description: "3 PHASE GPO", rating: "32A" }, { description: "3 PHASE GPO", rating: "32A" },
    ],
  },
  "RCD Testing Sheets - Lab Generator 6M": {
    generatorId: "lab", generatorName: "Lab Generator", assetNumber: "GEN-012", area: "LAB",
    testType: "injection", frequency: "6M",
    circuits: [
      { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "16A" },
      { description: "3 PHASE GPO", rating: "32A" }, { description: "3 PHASE GPO", rating: "32A" },
    ],
  },
  "RCD Testing Sheets - Crusher Fuel Farm Generator 3M": {
    generatorId: "crusher-fuel-farm", generatorName: "Crusher Fuel Farm Generator", assetNumber: "GEN-013", area: "CRUSHER FUEL FARM",
    testType: "push-button", frequency: "3M",
    circuits: [
      { description: "3 PHASE GPO", rating: "25A" }, { description: "15A GPO", rating: "16A" },
      { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "20A" },
    ],
  },
  "RCD Testing Sheets - Crusher Fuel Farm Generator 6M": {
    generatorId: "crusher-fuel-farm", generatorName: "Crusher Fuel Farm Generator", assetNumber: "GEN-013", area: "CRUSHER FUEL FARM",
    testType: "injection", frequency: "6M",
    circuits: [
      { description: "3 PHASE GPO", rating: "32A" }, { description: "15A GPO", rating: "16A" },
      { description: "15A GPO", rating: "16A" }, { description: "15A GPO", rating: "20A" },
    ],
  },
  "RCD Testing Sheets - Crusher Workshop Generator 3M": {
    generatorId: "crusher-workshop", generatorName: "Crusher Workshop Generator", assetNumber: "GEN-014", area: "CRUSHER WORKSHOP",
    testType: "push-button", frequency: "3M",
    circuits: [{ description: "RCD", rating: "32A" }],
  },
  "RCD Testing Sheets - Crusher Workshop Generator 6M": {
    generatorId: "crusher-workshop", generatorName: "Crusher Workshop Generator", assetNumber: "GEN-014", area: "CRUSHER WORKSHOP",
    testType: "injection", frequency: "6M",
    circuits: [{ description: "RCD", rating: "32A" }],
  },

  // ══════════════════════════════════════════════════════════════════
  // MOTOR INSPECTIONS YEARLY (remaining areas)
  // ══════════════════════════════════════════════════════════════════

  "Statutory Motor Inspection - Gold Room": {
    stationaryChecks: [
      { item: "Motor", action: "Check name plate is present and matches recorded data. If no data is recorded fill in motor details" },
      { item: "Motor", action: "Check terminal box cover bolts are complete and tight. Check if densyl tape is in adequate condition. Change if necessary." },
      { item: "Motor", action: "Check Motor while running. Note any loud, irregular squealing or rumbling noises or vibrations" },
      { item: "Motor", action: "Check for dust, dirt or rock build up on motor cooling fan or in between cooling fins. Remove excess build up if necessary" },
      { item: "Motor", action: "Check cable glands are tight and shrouds are fitted. Tighten glands if necessary." },
      { item: "Isolator", action: "Check that push or switches are secure and not damaged" },
      { item: "Isolator", action: "Ensure that access to LCS is not obstructed or impaired." },
      { item: "Motor", action: "Ensure fan cowling is secure and free from damage. Ensure there is no obstruction to the flow of air." },
      { item: "Motor", action: "Check cable identification is secure and legible" },
      { item: "Motor", action: "Ensure cables are correctly routed, undamaged and are attached to cable supports. Ensure mechanical protection is secure and in place. Ensure gland is in place" },
      { item: "S/Room", action: "Ensure gland plate is in place and all spare cable entries are plugged." },
    ],
    motors: [
      { description: "Elution Electrowinning Extraction Fan", equipmentNumber: "FA-001", brand: "MONARCH BRG 6202", flc: "0.88 A", frequency: "50 Hz", power: "0.37 kW", voltage: "415 V", frameSize: "MS7112", rpm: "2800 RPM" },
      { description: "Barring Furnace Rotation Motor", equipmentNumber: "FA-001", brand: "MOTOVARIO TS80A4", flc: "2.68 A", frequency: "50 Hz", power: "0.55 kW", voltage: "415 V", rpm: "1410 RPM" },
      { description: "Shaking Table", equipmentNumber: "ST-100", brand: "WEG K23 W22", flc: "6.00 A", frequency: "50 Hz", power: "3.0 kW", voltage: "415 V", frameSize: "L100L", rpm: "1445 RPM", ambientTemp: "40°C" },
      { description: "Gravity Tails Pump", equipmentNumber: "PU-111", brand: "TECO AEMBUCDCV", flc: "2.68 A", frequency: "50 Hz", power: "0.55 kW", voltage: "415 V", frameSize: "D100L", rpm: "1455 RPM", ambientTemp: "40°C" },
    ],
  },

  "Statutory Motor Inspection - Kiln Area": {
    stationaryChecks: [
      { item: "Motor", action: "Check name plate is present and matches recorded data" },
      { item: "Motor", action: "Check terminal box cover bolts are complete and tight" },
      { item: "Motor", action: "Check Motor while running for noises or vibrations" },
      { item: "Motor", action: "Check for dust/dirt build up on cooling fan" },
      { item: "Motor", action: "Check cable glands are tight and shrouds fitted" },
      { item: "Isolator", action: "Check switches are secure and undamaged" },
      { item: "Isolator", action: "Ensure access to LCS not obstructed" },
      { item: "Motor", action: "Ensure fan cowling secure and no obstruction to airflow" },
      { item: "Motor", action: "Check cable identification secure and legible" },
      { item: "Motor", action: "Ensure cables correctly routed and undamaged" },
      { item: "S/Room", action: "Ensure gland plate in place and spare entries plugged" },
    ],
    motors: [
      { description: "Sump Pump", brand: "TECO", flc: "9.3 A", frequency: "50 Hz", power: "5.5 KW", voltage: "415 V", frameSize: "D132S", rpm: "1460 RPM", ambientTemp: "40°C" },
      { description: "Kiln Discharge Pump", brand: "TECO", flc: "6.01 A", frequency: "50 Hz", power: "3 KW", voltage: "415 V", frameSize: "D100L", rpm: "1460 RPM", ambientTemp: "40°C" },
      { description: "Kiln Carbon Feed Pump", brand: "WEG", flc: "2.87 A", frequency: "50 Hz", power: "0.75 KW", voltage: "415 V", rpm: "1440 RPM", ambientTemp: "40°C" },
      { description: "Kiln Drive Motor", brand: "BONFIGLIOLI", frequency: "50 Hz", voltage: "415 V", frameSize: "BN 80 B4" },
    ],
  },

  "Statutory Motor Inspection - Elution": {
    stationaryChecks: [
      { item: "Motor", action: "Check name plate is present and matches recorded data. If no data is recorded fill in motor details" },
      { item: "Motor", action: "Check terminal box cover bolts are complete and tight. Check if densyl tape is in adequate condition. Change if necessary." },
      { item: "Motor", action: "Check Motor while running. Note any loud, irregular squealing or rumbling noises or vibrations" },
      { item: "Motor", action: "Check for dust, dirt or rock build up on motor cooling fan or in between cooling fins. Remove excess build up if necessary" },
      { item: "Motor", action: "Check cable glands are tight and shrouds are fitted. Tighten glands if necessary." },
      { item: "Isolator", action: "Check that push or switches are secure and not damaged" },
      { item: "Isolator", action: "Ensure that access to LCS is not obstructed or impaired." },
      { item: "Motor", action: "Ensure fan cowling is secure and free from damage. Ensure there is no obstruction to the flow of air." },
      { item: "Motor", action: "Check cable identification is secure and legible" },
      { item: "Motor", action: "Ensure cables are correctly routed, undamaged and are attached to cable supports. Ensure mechanical protection is secure and in place. Ensure gland is in place" },
      { item: "S/Room", action: "Ensure gland plate is in place and all spare cable entries are plugged." },
    ],
    motors: [
      { description: "Eluate Pump", equipmentNumber: "PU-001", brand: "GRUND FOSS CRI20-07", flc: "A", frequency: "50 Hz", power: "7.5 kW", voltage: "415 V", rpm: "2919 RPM", ambientTemp: "°C", serialNo: "003" },
      { description: "Caustic Pump", flc: "A", frequency: "50 Hz", power: "kW", voltage: "415 V", ambientTemp: "°C" },
      { description: "Elution Sump Pump", brand: "TECO", flc: "A", frequency: "50 Hz", power: "kW", voltage: "415 V", ambientTemp: "°C" },
    ],
  },

  "Statutory Motor Inspection - Milling Area": {
    stationaryChecks: [
      { item: "Motor", action: "Check name plate is present and matches recorded data" },
      { item: "Motor", action: "Check terminal box cover bolts are complete and tight" },
      { item: "Motor", action: "Check Motor while running for noises or vibrations" },
      { item: "Motor", action: "Check for dust/dirt build up on cooling fan" },
      { item: "Motor", action: "Check cable glands are tight and shrouds fitted" },
      { item: "Isolator", action: "Check switches are secure and undamaged" },
      { item: "Isolator", action: "Ensure access to LCS not obstructed" },
      { item: "Motor", action: "Ensure fan cowling secure and no obstruction to airflow" },
      { item: "Motor", action: "Check cable identification secure and legible" },
      { item: "Motor", action: "Ensure cables correctly routed and undamaged" },
      { item: "S/Room", action: "Ensure gland plate in place and spare entries plugged" },
    ],
    motors: [
      { description: "Mill Feed Conveyor", equipmentNumber: "BC-100", brand: "WEG KTE30 PHEM", flc: "20.2 A", frequency: "50 Hz", power: "11 kW", voltage: "415 V", frameSize: "160M", rpm: "1465 RPM", ambientTemp: "40°C" },
      { description: "Lime Rotary Valve", brand: "WEG KTE 12 W22M", flc: "5.81 A", frequency: "50 Hz", power: "1.5 KW", voltage: "415 V", frameSize: "90L-04", rpm: "1450 RPM", ambientTemp: "40°C" },
      { description: "Transfer Conveyor", equipmentNumber: "FE-101", brand: "SEW-EURODRIVE KA77/T DRE132M4/RS", flc: "11 A", frequency: "50 Hz", power: "5.5 KW", voltage: "415 V", rpm: "1455 RPM" },
      { description: "Reclaim Feeder", frequency: "50 Hz", voltage: "415 V" },
      { description: "Grinding Area Pump", equipmentNumber: "04-PU-120", brand: "WEG KTE 21 W22M", flc: "10.6 A", frequency: "50 Hz", power: "5.5 kW", voltage: "415 V", frameSize: "132S-04", rpm: "1465 RPM", ambientTemp: "40°C" },
      { description: "Cyclone Feed Pump A (Duty)", equipmentNumber: "PU-102A", brand: "WEG KTE 50 W22M", flc: "183 A", frequency: "50 Hz", power: "110 KW", voltage: "415 V", frameSize: "280S/M", rpm: "1485 RPM", ambientTemp: "40°C" },
      { description: "Cyclone Feed Pump B (Standby)", equipmentNumber: "PU-102B", brand: "WEG KTE 50 W22M", flc: "183 A", frequency: "50 Hz", power: "110 KW", voltage: "415 V", frameSize: "280S/M", rpm: "1485 RPM", ambientTemp: "40°C" },
    ],
  },

  "Statutory Motor Inspection - Process Water Pond": {
    stationaryChecks: [
      { item: "Motor", action: "Check name plate is present and matches recorded data" },
      { item: "Motor", action: "Check terminal box cover bolts are complete and tight" },
      { item: "Motor", action: "Check Motor while running for noises or vibrations" },
      { item: "Motor", action: "Check for dust/dirt build up on cooling fan" },
      { item: "Motor", action: "Check cable glands are tight and shrouds fitted" },
      { item: "Isolator", action: "Check switches are secure and undamaged" },
      { item: "Isolator", action: "Ensure access to LCS not obstructed" },
      { item: "Motor", action: "Ensure fan cowling secure and no obstruction to airflow" },
      { item: "Motor", action: "Check cable identification secure and legible" },
      { item: "Motor", action: "Ensure cables correctly routed and undamaged" },
      { item: "S/Room", action: "Ensure gland plate in place and spare entries plugged" },
    ],
    motors: [
      { description: "PWP Pump A", brand: "WEG", flc: "93.4 A", frequency: "50 Hz", power: "55 KW", voltage: "415 V", frameSize: "250 S/M", rpm: "1480 RPM", ambientTemp: "40°C" },
      { description: "PWP Pump B", brand: "WEG", flc: "93.4 A", frequency: "50 Hz", power: "55 KW", voltage: "415 V", frameSize: "250 S/M", rpm: "1480 RPM", ambientTemp: "40°C" },
    ],
  },

  "Statutory Motor Inspection - Services": {
    stationaryChecks: [
      { item: "Motor", action: "Check name plate is present and matches recorded data" },
      { item: "Motor", action: "Check terminal box cover bolts are complete and tight" },
      { item: "Motor", action: "Check Motor while running for noises or vibrations" },
      { item: "Motor", action: "Check for dust/dirt build up on cooling fan" },
      { item: "Motor", action: "Check cable glands are tight and shrouds fitted" },
      { item: "Isolator", action: "Check switches are secure and undamaged" },
      { item: "Isolator", action: "Ensure access to LCS not obstructed" },
      { item: "Motor", action: "Ensure fan cowling secure and no obstruction to airflow" },
      { item: "Motor", action: "Check cable identification secure and legible" },
      { item: "Motor", action: "Ensure cables correctly routed and undamaged" },
      { item: "S/Room", action: "Ensure gland plate in place and spare entries plugged" },
    ],
    motors: [
      { description: "Safety Shower Pump A", equipmentNumber: "PU-205A", brand: "CENTRIPRO", flc: "3.72 A", frequency: "50 Hz", power: "1.1 kW", voltage: "415 V", rpm: "2820 RPM" },
      { description: "Safety Shower Pump B", equipmentNumber: "PU-205B", brand: "LOWARA SM80B14/311 E3", flc: "4.16 A", frequency: "50 Hz", power: "1.1 kW", voltage: "415 V", rpm: "2900 RPM", ambientTemp: "50°C" },
      { description: "Potable Water Pump A (Duty)", equipmentNumber: "PU-033A", brand: "LOWARA PLM112RB14S6/340 E3", flc: "7.61 A", frequency: "50 Hz", power: "4.00 kW", voltage: "415 V", rpm: "2910 RPM", ambientTemp: "50°C" },
      { description: "Potable Water Pump B (Standby)", equipmentNumber: "PU-033B", brand: "LOWARA PLM112RB14S6/240 E3", flc: "7.61 A", frequency: "50 Hz", power: "4.00 kW", voltage: "415 V", rpm: "2910 RPM", ambientTemp: "50°C" },
      { description: "Gland Water Pump A", equipmentNumber: "PU-135A", brand: "LOWARA", flc: "7.61 A", frequency: "50 Hz", power: "4.00 KW", voltage: "415 V", rpm: "2910 RPM", ambientTemp: "50°C" },
      { description: "Gland Water Pump B (Standby)", equipmentNumber: "PU-135B", brand: "LOWARA PLM112RB14S6/340 E3", flc: "7.61 A", frequency: "50 Hz", power: "4.00 KW", voltage: "415 V", rpm: "2910 RPM", ambientTemp: "50°C" },
      { description: "Raw Water Pump A (Duty)", equipmentNumber: "PU-026A", brand: "GRUNDFOSS 85U17524", flc: "21.8 A", frequency: "50 Hz", power: "11.0 KW", voltage: "415 V", rpm: "2940 RPM", ambientTemp: "40°C" },
    ],
  },

  "Statutory Motor Inspection - Tanks": {
    stationaryChecks: [
      { item: "Motor", action: "Check name plate is present and matches recorded data" },
      { item: "Motor", action: "Check terminal box cover bolts are complete and tight" },
      { item: "Motor", action: "Check Motor while running for noises or vibrations" },
      { item: "Motor", action: "Check for dust/dirt build up on cooling fan" },
      { item: "Motor", action: "Check cable glands are tight and shrouds fitted" },
      { item: "Isolator", action: "Check switches are secure and undamaged" },
      { item: "Isolator", action: "Ensure access to LCS not obstructed" },
      { item: "Motor", action: "Ensure fan cowling secure and no obstruction to airflow" },
      { item: "Motor", action: "Check cable identification secure and legible" },
      { item: "Motor", action: "Ensure cables correctly routed and undamaged" },
      { item: "S/Room", action: "Ensure gland plate in place and spare entries plugged" },
    ],
    motors: Array.from({ length: 20 }, (_, i) => ({
      description: `Agitator ${i + 1}`, brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C",
    })),
  },

  "Statutory Motor Inspection - Thickener": {
    stationaryChecks: [
      { item: "Motor", action: "Check name plate is present and matches recorded data" },
      { item: "Motor", action: "Check terminal box cover bolts are complete and tight" },
      { item: "Motor", action: "Check Motor while running for noises or vibrations" },
      { item: "Motor", action: "Check for dust/dirt build up on cooling fan" },
      { item: "Motor", action: "Check cable glands are tight and shrouds fitted" },
      { item: "Isolator", action: "Check switches are secure and undamaged" },
      { item: "Isolator", action: "Ensure access to LCS not obstructed" },
      { item: "Motor", action: "Ensure fan cowling secure and no obstruction to airflow" },
      { item: "Motor", action: "Check cable identification secure and legible" },
      { item: "Motor", action: "Ensure cables correctly routed and undamaged" },
      { item: "S/Room", action: "Ensure gland plate in place and spare entries plugged" },
    ],
    motors: [
      { description: "Thickener Underflow Pump A", equipmentNumber: "Pump A", brand: "Monarch", flc: "125.2 A", frequency: "50 Hz", power: "75 KW", voltage: "415 V", frameSize: "D250M", rpm: "1485 RPM" },
      { description: "Thickener Underflow Pump B", equipmentNumber: "Pump B", brand: "Monarch", flc: "125.2 A", frequency: "50 Hz", power: "75 KW", voltage: "415 V", frameSize: "D250M", rpm: "1485 RPM" },
    ],
  },

  "Air Conditioner Monthly Inspection and Filter Clean": {
    sections: [
      { equipmentName: "AIR CONDITIONER – MONTHLY INSPECTION", tasks: [
        { task: "Clean Air Filter" },
        { task: "Brush and Clean indoor unit housing" },
        { task: "Brush and Clean outdoor unit housing" },
        { task: "Clean Condensate Tray and flush water down drain" },
        { task: "Check electrical connections" },
        { task: "Check pipework insulation" },
        { task: "Check Mounting supports" },
        { task: "Check for any signs of rust" },
      ]},
    ],
  },

  "Weightometer Calibration Monthly BC-100": {
    sections: [
      { equipmentName: "STATIONARY CHECKS – PM INSPECTION", tasks: [
        { task: "Ensure belt & scale are empty and clean. Confirm calibration weights are in the 'UP' position or handles are in the horizontal position" },
        { task: "Visual check the scale – ensure no material affecting readings. Check all rollers for flat spots or material build-up. Clean/replace as required" },
        { task: "Start the conveyor belt and allow a couple of minutes for the belt to settle down" },
        { task: "With belt running, begin Auto Zero procedure: Press and hold 'Auto Zero' button for 5 seconds until MODE WINDOW reads 'auto zero (wait)'. Rate window should read zero on completion" },
      ]},
      { equipmentName: "AUTO SPAN CALIBRATION", tasks: [
        { task: "With conveyor belt running, press and hold AUTO SPAN button for 5 seconds until MODE window displays 'Lower Cal Weight'" },
        { task: "Lower both calibration weights (lift handles up to lower weights)" },
        { task: "Press AUTO SPAN button again to begin span calibration immediately, or wait 30 seconds for automatic start" },
        { task: "MODE WINDOW should read 'auto span (wait)' during calibration" },
        { task: "On completion, RATE WINDOW will show TPH reading. Note rate may bounce due to belt thickness/condition" },
        { task: "When complete, MODE WINDOW will display 'raise cal weight' – raise calibration weights to storage position" },
      ]},
      { equipmentName: "RUNNING SYSTEM CHECKS", tasks: [
        { task: "With calibration weights up (storage position), confirm rate reads zero" },
        { task: "Reset the total by holding RESET button for 5 seconds" },
        { task: "Begin running material on belt – confirm rate and total increase" },
        { task: "Press FUNCTION key to toggle between flow rate (tph) and belt speed (m/min) – confirm both display correctly" },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // ELECTRICAL 12-WEEK — WELDERS VRD TEST
  // ══════════════════════════════════════════════════════════════════

  "Welders VRD Test & Tag Inspection 3-Monthly": {
    sections: [
      { equipmentName: "Operational Tests", tasks: [
        { task: "Check the leads are undamaged" },
        { task: "Check the Work clamp is in good condition" },
        { task: "Check the handpiece is functional and insulation is in good condition" },
        { task: "Test earth continuity (<0.5Ω)" },
        { task: "Insulation Resistance of Primary phase to earth (@500V >1MΩ)" },
        { task: "a. RED - EARTH", hasInput: true, inputLabel: "MΩ @ 500V" },
        { task: "b. WHITE - EARTH", hasInput: true, inputLabel: "MΩ @ 500V" },
        { task: "c. BLUE – EARTH", hasInput: true, inputLabel: "MΩ @ 500V" },
        { task: "Insulation Resistance of Primary phase to Neutral (@250V >1MΩ)" },
        { task: "a. RED - NEUTRAL", hasInput: true, inputLabel: "MΩ @ 250V" },
        { task: "b. WHITE – NEUTRAL", hasInput: true, inputLabel: "MΩ @ 250V" },
        { task: "c. BLUE - NEUTRAL", hasInput: true, inputLabel: "MΩ @ 250V" },
        { task: "Insulation Resistance of secondary to earth (@250V >1MΩ)", hasInput: true, inputLabel: "MΩ @ 250V" },
        { task: "Note: If unit is AC/DC select AC before performing this test" },
        { task: "Insulation Resistance of Primary to secondary (@500V >1MΩ)" },
        { task: "Note: If unit is AC/DC select AC before performing this test" },
        { task: "a. RED – SECONDARY", hasInput: true, inputLabel: "MΩ @ 500V" },
        { task: "b. WHITE – SECONDARY", hasInput: true, inputLabel: "MΩ @ 500V" },
        { task: "c. BLUE - SECONDARY", hasInput: true, inputLabel: "MΩ @ 500V" },
        { task: "Clean welder internal and external as required" },
        { task: "Confirm correct function of welder" },
      ]},
      { equipmentName: "VRD Testing: Internal / External", tasks: [
        { task: "Note: If unit is a MIG welder there is no requirement for a VRD" },
        { task: "Note: If the unit is not fitted with a VRD and the unit is not a MIG, the unit must be placed Out Of Service" },
        { task: "Test Open circuit voltage (Max 35V DC/Peak)", hasInput: true, inputLabel: "V DC" },
        { task: "Carry out VRD Functional Test using Safe-Tac VRD Tester (Series 3) – Voltage stays below limits (OK)" },
        { task: "Fill out and place test tag x 2, One for appliance and one for VRD testing (3 Monthly test intervals)" },
      ]},
    ],
  },
};
