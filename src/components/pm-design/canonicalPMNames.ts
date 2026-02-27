/**
 * Canonical registry of all PM names used across PM Design templates.
 * This is the single source of truth for what should exist in pm_master_list.
 * When adding or removing a PM template, update this list.
 */

export interface CanonicalPM {
  pmName: string;
  discipline: "Mechanical" | "Electrical" | "Ops";
  frequency: string;
  equipmentType: string;
}

export const canonicalPMs: CanonicalPM[] = [
  // ── MECHANICAL DAILY ──
  { pmName: "Filter Press Daily Offline Inspection", discipline: "Mechanical", frequency: "Daily", equipmentType: "Filter Press" },
  { pmName: "Filter Press Daily Online Inspection", discipline: "Mechanical", frequency: "Daily", equipmentType: "Filter Press" },
  { pmName: "Mill Daily Inspection", discipline: "Mechanical", frequency: "Daily", equipmentType: "Ball Mill" },
  { pmName: "RO Plant Daily Inspection", discipline: "Mechanical", frequency: "Daily", equipmentType: "RO Plant" },

  // ── MECHANICAL WEEKLY ──
  { pmName: "Acid Wash & Elution Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Acid Wash & Elution" },
  { pmName: "Air & Water Services Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Air & Water Services" },
  { pmName: "Bottom of Tanks Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Bottom of Tanks" },
  { pmName: "Diesel Farm Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Diesel Farm" },
  { pmName: "Filter Press Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Filter Press" },
  { pmName: "Filter Press Compressor (Online) Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Filter Press Compressor" },
  { pmName: "Filter Press Compressor (Offline) Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Filter Press Compressor" },
  { pmName: "Gold Room Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Gold Room" },
  { pmName: "Grease & Oils Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Grease & Oils" },
  { pmName: "Mill Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Ball Mill" },
  { pmName: "Potable Water Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Potable Water" },
  { pmName: "Reagents Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Reagents" },
  { pmName: "Thickener Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Thickener" },
  { pmName: "Top of Tanks Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Top of Tanks" },

  // ── MECHANICAL 4-WEEKLY (MONTHLY) ──
  { pmName: "Weightometer Calibration Monthly BC-100", discipline: "Electrical", frequency: "4 Week", equipmentType: "Belt Weigher" },
  { pmName: "Air Conditioner Monthly Inspection and Filter Clean", discipline: "Electrical", frequency: "4 Week", equipmentType: "Air Conditioner" },

  // ── MECHANICAL GENERATORS WEEKLY ──
  { pmName: "Admin Generator Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Admin Generator" },
  { pmName: "Andy Dam Generator Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Andy Dam Generator" },
  { pmName: "Juno Generator Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Juno Generator" },
  { pmName: "Lab Generator Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Lab Generator" },
  { pmName: "Portable Generators Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Portable Generators" },
  { pmName: "Power Station Generator Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Power Station Generator" },

  // ── OPS / MOBILE EQUIPMENT DAILY ──
  { pmName: "CAT D8 Dozer Daily Inspection", discipline: "Ops", frequency: "Daily", equipmentType: "CAT D8 Dozer" },
  { pmName: "Excavator Daily Inspection", discipline: "Ops", frequency: "Daily", equipmentType: "Excavator" },
  { pmName: "Lighting Tower Daily Inspection", discipline: "Ops", frequency: "Daily", equipmentType: "Lighting Tower" },
  { pmName: "Loader Daily Inspection", discipline: "Ops", frequency: "Daily", equipmentType: "Loader" },
  { pmName: "Moxy Daily Inspection", discipline: "Ops", frequency: "Daily", equipmentType: "Moxy" },

  // ── OPS / MOBILE EQUIPMENT WEEKLY ──
  { pmName: "Dozer Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Dozer" },
  { pmName: "Crane Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Crane" },
  { pmName: "EWP Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "EWP" },
  { pmName: "Excavator Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Excavator" },
  { pmName: "Forklift Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Forklift" },
  { pmName: "Loader Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Loader" },
  { pmName: "Moxy Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Moxy" },
  { pmName: "Service Truck Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Service Truck" },
  { pmName: "Skid Steer Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Skid Steer" },
  { pmName: "Telehandler Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Telehandler" },
  { pmName: "Water Truck Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Water Truck" },

  // ── ELECTRICAL WEEKLY ──
  { pmName: "Crusher Fuel Farm Generator Weekly Electrical Inspection", discipline: "Electrical", frequency: "1 Week", equipmentType: "Crusher Fuel Farm Generator" },
  { pmName: "Field MCC Inspections Weekly", discipline: "Electrical", frequency: "1 Week", equipmentType: "Field MCC" },
  { pmName: "Filter Press Electrical Weekly Inspection", discipline: "Electrical", frequency: "1 Week", equipmentType: "Filter Press" },
  { pmName: "Ice Machine Weekly Inspection", discipline: "Electrical", frequency: "1 Week", equipmentType: "Ice Machine" },
  { pmName: "pH Probe Calibration Weekly", discipline: "Electrical", frequency: "1 Week", equipmentType: "pH Probe" },
  { pmName: "Safety Shower Inspection Weekly", discipline: "Electrical", frequency: "1 Week", equipmentType: "Safety Shower" },
  { pmName: "Spare Mill Motor Inspection Weekly", discipline: "Electrical", frequency: "1 Week", equipmentType: "Spare Mill Motor" },
  { pmName: "Visual Zone Checks Weekly", discipline: "Electrical", frequency: "1 Week", equipmentType: "Visual Zone" },

  // ── ELECTRICAL 2-WEEKLY ──
  { pmName: "Substation Inspection Fortnightly", discipline: "Electrical", frequency: "2 Week", equipmentType: "Substation" },

  // ── ELECTRICAL QUARTERLY (12 WEEK) ──
  { pmName: "Air Conditioner Service Quarterly", discipline: "Electrical", frequency: "12 Week", equipmentType: "Air Conditioner" },
  { pmName: "Emergency Light Test Quarterly", discipline: "Electrical", frequency: "12 Week", equipmentType: "Emergency Lighting" },
  { pmName: "Pull Wire Checks Quarterly", discipline: "Electrical", frequency: "12 Week", equipmentType: "Pull Wire" },
  { pmName: "RCD Push-button Test Quarterly", discipline: "Electrical", frequency: "12 Week", equipmentType: "RCD" },
  { pmName: "Welders VRD Test & Tag Inspection 3-Monthly", discipline: "Electrical", frequency: "12 Week", equipmentType: "Welders" },

  // ── ELECTRICAL 6-MONTHLY (26 WEEK) ──
  { pmName: "RCD Injection Test 6-Monthly", discipline: "Electrical", frequency: "26 Week", equipmentType: "RCD" },
  { pmName: "RCD Push-button & Injection Test 6-Monthly", discipline: "Electrical", frequency: "26 Week", equipmentType: "RCD" },
  { pmName: "RCD Push-button & Injection Test - CIP Tanks / Titration Hut", discipline: "Electrical", frequency: "26 Week", equipmentType: "RCD" },
  { pmName: "RCD Push-button & Injection Test - Crib Room / SB-002E", discipline: "Electrical", frequency: "26 Week", equipmentType: "RCD" },

  // ── ELECTRICAL YEARLY (52 WEEK) ──
  { pmName: "Generator Electrical Test Yearly", discipline: "Electrical", frequency: "52 Week", equipmentType: "Generator" },
  { pmName: "Switchboard Inspection Yearly", discipline: "Electrical", frequency: "52 Week", equipmentType: "Switchboard" },
  { pmName: "Cable Test Sheet Yearly", discipline: "Electrical", frequency: "52 Week", equipmentType: "Cable" },
  { pmName: "Full Test Sheet Yearly", discipline: "Electrical", frequency: "52 Week", equipmentType: "Full Test Sheet" },

  // ── ELECTRICAL MOTOR INSPECTIONS (YEARLY) ──
  { pmName: "Statutory Motor Inspection - Filter Press", discipline: "Electrical", frequency: "52 Week", equipmentType: "Motor Inspection" },
  { pmName: "Statutory Motor Inspection - Gold Room", discipline: "Electrical", frequency: "52 Week", equipmentType: "Motor Inspection" },
  { pmName: "Statutory Motor Inspection - Kiln Area", discipline: "Electrical", frequency: "52 Week", equipmentType: "Motor Inspection" },
  { pmName: "Statutory Motor Inspection - Elution", discipline: "Electrical", frequency: "52 Week", equipmentType: "Motor Inspection" },
  { pmName: "Statutory Motor Inspection - Milling Area", discipline: "Electrical", frequency: "52 Week", equipmentType: "Motor Inspection" },
  { pmName: "Statutory Motor Inspection - Process Water Pond", discipline: "Electrical", frequency: "52 Week", equipmentType: "Motor Inspection" },
  { pmName: "Statutory Motor Inspection - Services", discipline: "Electrical", frequency: "52 Week", equipmentType: "Motor Inspection" },
  { pmName: "Statutory Motor Inspection - Tanks", discipline: "Electrical", frequency: "52 Week", equipmentType: "Motor Inspection" },
  { pmName: "Statutory Motor Inspection - Thickener", discipline: "Electrical", frequency: "52 Week", equipmentType: "Motor Inspection" },

  // ── RCD TESTING SHEETS (6-MONTHLY) ──
  { pmName: "RCD Testing Sheets - Admin Generator 6M", discipline: "Electrical", frequency: "26 Week", equipmentType: "Admin Generator" },
  { pmName: "RCD Testing Sheets - Juno Bore Pump Generator 6M", discipline: "Electrical", frequency: "26 Week", equipmentType: "Juno Generator" },
  { pmName: "RCD Testing Sheets - Andys Dam Generator 6M", discipline: "Electrical", frequency: "26 Week", equipmentType: "Andy Dam Generator" },
  { pmName: "RCD Testing Sheets - Lab Generator 6M", discipline: "Electrical", frequency: "26 Week", equipmentType: "Lab Generator" },
  { pmName: "RCD Testing Sheets - Crusher Fuel Farm Generator 6M", discipline: "Electrical", frequency: "26 Week", equipmentType: "Crusher Fuel Farm Generator" },
  { pmName: "RCD Testing Sheets - Crusher Workshop Generator 6M", discipline: "Electrical", frequency: "26 Week", equipmentType: "Crusher Workshop Generator" },

  // ── RCD TESTING SHEETS (3-MONTHLY) ──
  { pmName: "RCD Testing Sheets - Admin Generator 3M", discipline: "Electrical", frequency: "12 Week", equipmentType: "Admin Generator" },
  { pmName: "RCD Testing Sheets - Juno Bore Pump Generator 3M", discipline: "Electrical", frequency: "12 Week", equipmentType: "Juno Generator" },
  { pmName: "RCD Testing Sheets - Andys Dam Generator 3M", discipline: "Electrical", frequency: "12 Week", equipmentType: "Andy Dam Generator" },
  { pmName: "RCD Testing Sheets - Lab Generator 3M", discipline: "Electrical", frequency: "12 Week", equipmentType: "Lab Generator" },
  { pmName: "RCD Testing Sheets - Crusher Fuel Farm Generator 3M", discipline: "Electrical", frequency: "12 Week", equipmentType: "Crusher Fuel Farm Generator" },
  { pmName: "RCD Testing Sheets - Crusher Workshop Generator 3M", discipline: "Electrical", frequency: "12 Week", equipmentType: "Crusher Workshop Generator" },
];
