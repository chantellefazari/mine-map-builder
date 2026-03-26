/**
 * Maps canonical PM names (from pm_master_list) to the PM Design view IDs
 * used to render the full PM template document.
 */
export const pmNameToViewId: Record<string, string> = {
  // Mechanical Daily
  "Filter Press Daily Offline Inspection": "filter-press-daily-offline",
  "Filter Press Daily Online Inspection": "filter-press-daily-online",
  "Mill Daily Inspection": "mill-daily",
  "RO Plant Daily Inspection": "ro-plant-daily",

  // Mechanical Weekly
  "Acid Wash & Elution Weekly Inspection": "acid-elution-weekly",
  "Air & Water Services Weekly Inspection": "air-water-services-weekly",
  "Bottom of Tanks Weekly Inspection": "bottom-of-tanks-weekly",
  "Diesel Farm Weekly Inspection": "diesel-farm-weekly",
  "Filter Press Weekly Inspection": "filter-press-weekly",
  "Filter Press Compressor (Online) Weekly Inspection": "filter-press-compressor-weekly",
  "Filter Press Compressor (Offline) Weekly Inspection": "filter-press-compressor-offline-weekly",
  "Gold Room Weekly Inspection": "gold-room-weekly",
  "Grease & Oils Weekly Inspection": "grease-oils-weekly",
  "Mill Weekly Inspection": "mill-weekly",
  "Potable Water Weekly Inspection": "potable-water-weekly",
  "Reagents Weekly Inspection": "reagents-weekly",
  "Thickener Weekly Inspection": "thickener-weekly",
  "Top of Tanks Weekly Inspection": "top-of-tanks-weekly",

  // Mechanical Generators Weekly
  "Admin Generator Weekly Inspection": "admin-generator-weekly",
  "Nobles Natural Sump Generator Weekly Inspection": "nobles-natural-sump-generator-weekly",
  "Juno Generator Weekly Inspection": "juno-generator-weekly",
  "Lab Generator Weekly Inspection": "lab-generator-weekly",
  "Portable Generators Weekly Inspection": "portable-generators-weekly",
  "Power Station Generator Weekly Inspection": "power-station-generator-weekly",

  // Mobile Equipment Daily
  "CAT D8 Dozer Daily Inspection": "dozer-daily",
  "Excavator Daily Inspection": "excavator-daily",
  "Lighting Tower Daily Inspection": "lighting-tower-daily",
  "Loader Daily Inspection": "loader-daily",
  "Moxy Daily Inspection": "moxy-daily",

  // Mobile Equipment Weekly
  "Dozer Weekly Inspection": "dozer-weekly",
  "Crane Weekly Inspection": "crane-weekly",
  "EWP Weekly Inspection": "ewp-weekly",
  "Excavator Weekly Inspection": "excavator-weekly",
  "Forklift Weekly Inspection": "forklift-weekly",
  "Loader Weekly Inspection": "loader-weekly",
  "Moxy Weekly Inspection": "moxy-weekly",
  "Service Truck Weekly Inspection": "service-truck-weekly",
  "Skid Steer Weekly Inspection": "skid-steer-weekly",
  "Telehandler Weekly Inspection": "telehandler-weekly",
  "Water Truck Weekly Inspection": "water-truck-weekly",

  // Electrical Weekly
  "Crusher Fuel Farm Generator Weekly Electrical Inspection": "crusher-fuel-farm-generator-electrical-weekly",
  "Field MCC Inspections Weekly": "field-mcc-inspections-weekly",
  "Filter Press Electrical Weekly Inspection": "filter-press-electrical-weekly",
  "Ice Machine Weekly Inspection": "ice-machine-weekly",
  "pH Probe Calibration Weekly": "ph-probe-calibration-weekly",
  "Safety Shower Inspection Weekly": "safety-shower-weekly",
  "Spare Mill Motor Inspection Weekly": "spare-mill-motor-weekly",
  "Visual Zone Checks Weekly": "visual-zone-checks-weekly",

  // Electrical 2-Weekly
  "Substation Inspection Fortnightly": "substation-2-weekly",

  // Electrical 4-Weekly
  "Weightometer Calibration Monthly BC-100": "belt-calibration-bc100-monthly",
  "Air Conditioner Monthly Inspection and Filter Clean": "ac-inspection-4-weekly",

  // Electrical 12-Weekly
  "Air Conditioner 12 Week Service": "ac-inspection-12-weekly",
  "Pull Wire Checks 12 Weekly": "pull-wire-checks-12-weekly",
  "RCD Push-button Test 12 Weekly": "rcd-pushbutton-12-weekly",
  "Emergency Light Test 12 Weekly": "emergency-light-12-weekly",
  "Welders VRD Test and Tag 12 Weekly": "welders-vrd-test-12-weekly",

  // Electrical 26-Weekly
  "RCD Injection Test 24 Weekly": "rcd-injection-24-weekly",

  // Electrical 52-Weekly
  "Generator Electrical Yearly Test": "generator-yearly-test",
  "Switchboard Inspection Yearly": "switchboard-52-weekly",
  "Cable Test Sheet": "cable-test-sheet",
  "Full Test Sheet": "full-test-sheet",
  "Filter Press Motor Inspection": "filter-press-motor-inspection",
};
