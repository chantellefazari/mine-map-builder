import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Complete PM Template Registry
 * Maps every canonical PM to its full UI metadata so the workbook
 * captures everything needed to recreate the templates on another platform.
 */
interface PMTemplateDefinition {
  pmName: string;
  discipline: "Mechanical" | "Electrical" | "Ops";
  frequency: string;
  equipmentType: string;
  // UI-level metadata from the component
  bannerTitle: string;
  bannerSubtitle: string;
  projectSite: string;
  plantArea: string;
  pmGroup: string;
  pmType: string;
  footerText: string;
  hasMobileEquipmentHeader: boolean;
  templateType: "DynamicInspectionTable" | "CustomLayout";
  customLayoutNotes: string;
}

const templateRegistry: PMTemplateDefinition[] = [
  // ── MECHANICAL DAILY ──
  { pmName: "Filter Press Daily Offline Inspection", discipline: "Mechanical", frequency: "Daily", equipmentType: "Filter Press", bannerTitle: "Tenant Creek Filtration Area - Filter Press", bannerSubtitle: "Mechanical Daily Offline Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Filter Press", pmGroup: "Mechanical", pmType: "Offline Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Processing Plant Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "Includes 'Immediate Attention Triggers' supplementary section (hardcoded list)" },
  { pmName: "Filter Press Daily Online Inspection", discipline: "Mechanical", frequency: "Daily", equipmentType: "Filter Press", bannerTitle: "Tenant Creek Filtration Area - Filter Press", bannerSubtitle: "Mechanical Daily Online Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Filter Press", pmGroup: "Mechanical", pmType: "Online Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Processing Plant Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "Includes 'Shutdown Triggers' supplementary section (hardcoded list)" },
  { pmName: "Mill Daily Inspection", discipline: "Mechanical", frequency: "Daily", equipmentType: "Ball Mill", bannerTitle: "Tenant Creek - Daily Mill Inspection", bannerSubtitle: "Mechanical Running PMs - Daily Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Mill", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Processing Plant Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "RO Plant Daily Inspection", discipline: "Mechanical", frequency: "Daily", equipmentType: "RO Plant", bannerTitle: "Tenant Creek - RO Plant Daily Inspection", bannerSubtitle: "Mechanical Running PMs - Daily Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "RO Plant", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Processing Plant Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },

  // ── MECHANICAL WEEKLY ──
  { pmName: "Acid Wash & Elution Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Acid Wash & Elution", bannerTitle: "Tenant Creek Elution Area", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Acid Wash / Elution", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Air & Water Services Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Air & Water Services", bannerTitle: "Tenant Creek Air & Water Services", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Air & Water Services", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Processing Plant Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Bottom of Tanks Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Bottom of Tanks", bannerTitle: "Tenant Creek Leaching Area - Bottom of Tanks", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Bottom of Tanks", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Diesel Farm Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Diesel Farm", bannerTitle: "Tenant Creek - Diesel Farm Check", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Diesel Farm", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Filter Press Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Filter Press", bannerTitle: "Tenant Creek Filtration Area - Filter Press", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Filter Press", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Processing Plant Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Filter Press Compressor (Online) Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Filter Press Compressor", bannerTitle: "Filter Press Compressor – Weekly Online Inspection", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Filter Press", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Processing Plant Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "Includes 'Mechanical Alerts' supplementary section (hardcoded list)" },
  { pmName: "Filter Press Compressor (Offline) Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Filter Press Compressor", bannerTitle: "Filter Press Compressor – Weekly Offline Inspection", bannerSubtitle: "Mechanical Running PMs - Weekly Offline Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Filter Press", pmGroup: "Mechanical", pmType: "Offline Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Processing Plant Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "Includes 'Mechanical Findings' supplementary section (hardcoded list)" },
  { pmName: "Gold Room Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Gold Room", bannerTitle: "Tennant Creek - Gold Room Area", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tennant Creek", plantArea: "Gold Room", pmGroup: "Operations", pmType: "Inspection (Fitter)", footerText: "", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Grease & Oils Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Grease & Oils", bannerTitle: "Tenant Creek Store Area - Grease and Oils", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Store", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Mill Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Ball Mill", bannerTitle: "Tenant Creek - Weekly Mill Inspection", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "CIP Circuit / Tailings", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Processing Plant Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Potable Water Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Potable Water", bannerTitle: "Tenant Creek - Potable Water System", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Potable Water", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Processing Plant Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Reagents Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Reagents", bannerTitle: "Tenant Creek Reagents Area", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Reagents", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Thickener Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Thickener", bannerTitle: "Tenant Creek Leaching Area - Thickener", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Thickener", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Top of Tanks Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Top of Tanks", bannerTitle: "Tenant Creek Leaching Area - Top of Tanks", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Top of Tanks", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },

  // ── MECHANICAL 4-WEEKLY (MONTHLY) ──
  { pmName: "Weightometer Calibration Monthly BC-100", discipline: "Mechanical", frequency: "4 Week", equipmentType: "Belt Weigher", bannerTitle: "Monthly Weightometer Calibration", bannerSubtitle: "Statutory Inspection - BC-100", projectSite: "Tennant Creek", plantArea: "Mill Feed Circuit", pmGroup: "Mechanical", pmType: "Calibration", footerText: "Tennant Creek Mining Operations – Monthly Weightometer Calibration Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "Custom layout with Calibration Reference Data table (Conveyor BC-100, Weight 45.04kg, Target 133.3tph) and As Found/As Left recorded data table" },

  // ── MECHANICAL GENERATORS WEEKLY ──
  { pmName: "Admin Generator Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Admin Generator", bannerTitle: "Tenant Creek - Admin Generator", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Admin Generator", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Admin Generator Weekly Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Nobles Natural Sump Generator Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Nobles Natural Sump Generator", bannerTitle: "Tenant Creek - Nobles Natural Sump Generator", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Nobles Natural Sump Generator", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Nobles Natural Sump Generator Weekly Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Juno Generator Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Juno Generator", bannerTitle: "Tenant Creek - Juno Generator", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Juno Generator", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Juno Generator Weekly Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Lab Generator Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Lab Generator", bannerTitle: "Tenant Creek - Lab Generator", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Lab Generator", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Lab Generator Weekly Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Portable Generators Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Portable Generators", bannerTitle: "Tenant Creek - Portable Generators", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Portable Generators", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Portable Generators Weekly Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Power Station Generator Weekly Inspection", discipline: "Mechanical", frequency: "1 Week", equipmentType: "Power Station Generator", bannerTitle: "Tenant Creek - Power Station Generator", bannerSubtitle: "Mechanical Running PMs - Weekly Inspection (Fitter)", projectSite: "Tenant Creek", plantArea: "Power Station Generator", pmGroup: "Mechanical", pmType: "Inspection (Fitter)", footerText: "Tennant Creek Mining Operations – Power Station Generator Weekly Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },

  // ── OPS / MOBILE EQUIPMENT DAILY ──
  { pmName: "CAT D8 Dozer Daily Inspection", discipline: "Ops", frequency: "Daily", equipmentType: "CAT D8 Dozer", bannerTitle: "CAT D8 Dozer Daily Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Excavator Daily Inspection", discipline: "Ops", frequency: "Daily", equipmentType: "Excavator", bannerTitle: "Excavator Daily Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Lighting Tower Daily Inspection", discipline: "Ops", frequency: "Daily", equipmentType: "Lighting Tower", bannerTitle: "Diesel Lighting Tower Daily Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Moxy Daily Inspection", discipline: "Ops", frequency: "Daily", equipmentType: "Moxy", bannerTitle: "Moxy Daily Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },

  // ── OPS / MOBILE EQUIPMENT WEEKLY ──
  { pmName: "Crane Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Crane", bannerTitle: "Weekly Crane Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "EWP Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "EWP", bannerTitle: "Weekly EWP Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Excavator Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Excavator", bannerTitle: "Excavator Weekly Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Weekly Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Forklift Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Forklift", bannerTitle: "Weekly Forklift Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Loader Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Loader", bannerTitle: "Weekly Loader Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Moxy Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Moxy", bannerTitle: "Weekly Moxy Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Service Truck Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Service Truck", bannerTitle: "Weekly Service Truck Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Skid Steer Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Skid Steer", bannerTitle: "Weekly Skid Steer Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Weekly Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Telehandler Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Telehandler", bannerTitle: "Weekly Telehandler Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Water Truck Weekly Inspection", discipline: "Ops", frequency: "1 Week", equipmentType: "Water Truck", bannerTitle: "Weekly Water Truck Mechanical Inspection", bannerSubtitle: "", projectSite: "Tennant Creek", plantArea: "Mobile Equipment", pmGroup: "Mechanical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Mobile Equipment Inspection Form", hasMobileEquipmentHeader: true, templateType: "DynamicInspectionTable", customLayoutNotes: "" },

  // ── ELECTRICAL WEEKLY ──
  { pmName: "Crusher Fuel Farm Generator Weekly Electrical Inspection", discipline: "Electrical", frequency: "1 Week", equipmentType: "Crusher Fuel Farm Generator", bannerTitle: "Crusher Fuel Farm Generator Electrical Inspection", bannerSubtitle: "Electrical Weekly Inspection", projectSite: "Tennant Creek", plantArea: "Crusher Fuel Farm", pmGroup: "Electrical", pmType: "Inspection (Electrician)", footerText: "Tennant Creek Mining Operations – Crusher Fuel Farm Generator Electrical Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Field MCC Inspections Weekly", discipline: "Electrical", frequency: "1 Week", equipmentType: "Field MCC", bannerTitle: "Field MCC Inspections", bannerSubtitle: "Electrical Weekly Inspection", projectSite: "Tennant Creek", plantArea: "Processing Plant", pmGroup: "Electrical", pmType: "Inspection (Electrician)", footerText: "Tennant Creek Mining Operations – Field MCC Electrical Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "Uses MCC-specific layout with mccSections data shape" },
  { pmName: "Filter Press Electrical Weekly Inspection", discipline: "Electrical", frequency: "1 Week", equipmentType: "Filter Press", bannerTitle: "Tennant Creek Filtration Area – Filter Press", bannerSubtitle: "Weekly Electrical Online Inspection (Electrician)", projectSite: "Tennant Creek", plantArea: "Filter Press", pmGroup: "Electrical", pmType: "Online Visual Inspection", footerText: "Tennant Creek Mining Operations – Filter Press Electrical Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Ice Machine Weekly Inspection", discipline: "Electrical", frequency: "1 Week", equipmentType: "Ice Machine", bannerTitle: "Weekly Ice Machine Inspections", bannerSubtitle: "Electrical Weekly Inspection", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Ice Machine Electrical Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "pH Probe Calibration Weekly", discipline: "Electrical", frequency: "1 Week", equipmentType: "pH Probe", bannerTitle: "pH Probe Calibration", bannerSubtitle: "Electrical Weekly Calibration", projectSite: "Tennant Creek", plantArea: "Processing Plant", pmGroup: "Electrical", pmType: "Calibration", footerText: "Tennant Creek Mining Operations – pH Probe Calibration Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Safety Shower Inspection Weekly", discipline: "Electrical", frequency: "1 Week", equipmentType: "Safety Shower", bannerTitle: "Weekly Safety Shower Inspection", bannerSubtitle: "Electrical Weekly Inspection", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Safety Shower Inspection Form", hasMobileEquipmentHeader: false, templateType: "CustomLayout", customLayoutNotes: "HARDCODED: 3 inspection items (Safety Shower, Eyewash, Light) + 12 locations (Thickener, Lime Silo, Tanks North/South, Elution, Gold Room, Filter Press, Cyanide Up/Down/Outside, Compound Bottom Tanks North, Acid Column). Two separate tables: Inspection Items + Location Checks." },
  { pmName: "Spare Mill Motor Inspection Weekly", discipline: "Electrical", frequency: "1 Week", equipmentType: "Spare Mill Motor", bannerTitle: "Spare Mill Motor Weekly Inspection", bannerSubtitle: "Electrical Weekly Inspection", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Spare Mill Motor Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Visual Zone Checks Weekly", discipline: "Electrical", frequency: "1 Week", equipmentType: "Visual Zone", bannerTitle: "Electrical Weekly Visual Site Inspection", bannerSubtitle: "Electrical Weekly Inspection", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Electrical Visual Zone Checks Form", hasMobileEquipmentHeader: false, templateType: "CustomLayout", customLayoutNotes: "HARDCODED: 4 sections – General Area Checks (16 zones), Lighting Checks (16 zones), Generator Checks (6 generators), Cleans Tasks (3 items). Each section uses Serviceable/Defective/Comments layout." },

  // ── ELECTRICAL 2-WEEKLY ──
  { pmName: "Substation Inspection Fortnightly", discipline: "Electrical", frequency: "2 Week", equipmentType: "Substation", bannerTitle: "Fortnightly Substation Inspection", bannerSubtitle: "Electrical Fortnightly Inspection", projectSite: "Tennant Creek", plantArea: "Substation", pmGroup: "Electrical", pmType: "Inspection (Electrician)", footerText: "Tennant Creek Mining Operations – Substation Inspection Form", hasMobileEquipmentHeader: false, templateType: "CustomLayout", customLayoutNotes: "HARDCODED: 2 sections – Inside Substation (13 checks) + Outside Substation (3 checks). Tasks include fire extinguisher, VESDA system, fire alarm panel, A/C, floor cleaning, door locks, LV rescue kit, ARC Flash signs, isolation tags." },

  // ── ELECTRICAL QUARTERLY (12 WEEK) ──
  { pmName: "Air Conditioner Service Quarterly", discipline: "Electrical", frequency: "12 Week", equipmentType: "Air Conditioner", bannerTitle: "Quarterly Air Conditioner Inspection & Service", bannerSubtitle: "Electrical Quarterly Inspection", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Service", footerText: "Tennant Creek Mining Operations – Air Conditioner Service Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Emergency Light Test Quarterly", discipline: "Electrical", frequency: "12 Week", equipmentType: "Emergency Lighting", bannerTitle: "Quarterly Emergency Light Test", bannerSubtitle: "Electrical Quarterly Inspection", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Test", footerText: "Tennant Creek Mining Operations – Emergency Light Test Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "Also includes a 6-Monthly Test Table section" },
  { pmName: "Pull Wire Checks Quarterly", discipline: "Electrical", frequency: "12 Week", equipmentType: "Pull Wire", bannerTitle: "Quarterly Pull Wire & E-Stop Verification", bannerSubtitle: "Electrical Quarterly Inspection", projectSite: "Tennant Creek", plantArea: "Filter Press / Conveyors", pmGroup: "Electrical", pmType: "Verification", footerText: "Tennant Creek Mining Operations – Pull Wire Checks Form", hasMobileEquipmentHeader: false, templateType: "CustomLayout", customLayoutNotes: "HARDCODED: 5 asset sections – Filter Press 1 (3 checks), Filter Press 2 (3 checks), Extraction Conveyor (2 checks), Transfer Conveyor (2 checks), Reclaim Stacker (2 checks). Each checks Pull Wire Head/Tail End and LCS E-STOP Function." },
  { pmName: "RCD Push-button Test Quarterly", discipline: "Electrical", frequency: "12 Week", equipmentType: "RCD", bannerTitle: "RCD Push-button Test", bannerSubtitle: "Electrical Quarterly Test", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Test", footerText: "Tennant Creek Mining Operations – RCD Push-button Test Form", hasMobileEquipmentHeader: false, templateType: "CustomLayout", customLayoutNotes: "HARDCODED: 21-row circuit test table with columns: Circuit No, RCD Rating (mA), Trip Time (ms), Result (Pass/Fail). Uses generated array." },

  // ── ELECTRICAL 6-MONTHLY (26 WEEK) ──
  { pmName: "RCD Injection Test 6-Monthly", discipline: "Electrical", frequency: "26 Week", equipmentType: "RCD", bannerTitle: "RCD Injection Test", bannerSubtitle: "Electrical 6-Monthly Test", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Test", footerText: "Tennant Creek Mining Operations – RCD Injection Test Form", hasMobileEquipmentHeader: false, templateType: "CustomLayout", customLayoutNotes: "Custom test table layout from DB tasks data" },

  // ── ELECTRICAL YEARLY (52 WEEK) ──
  { pmName: "Generator Electrical Test Yearly", discipline: "Electrical", frequency: "52 Week", equipmentType: "Generator", bannerTitle: "Generator Electrical Test", bannerSubtitle: "Electrical Yearly Test", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Test", footerText: "Tennant Creek Mining Operations – Generator Electrical Test Form", hasMobileEquipmentHeader: false, templateType: "CustomLayout", customLayoutNotes: "HARDCODED: renderTestTable helper with hardcoded table structure for yearly generator electrical tests" },
  { pmName: "Switchboard Inspection Yearly", discipline: "Electrical", frequency: "52 Week", equipmentType: "Switchboard", bannerTitle: "Switchboard Inspection", bannerSubtitle: "Electrical Yearly Inspection", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Inspection", footerText: "Tennant Creek Mining Operations – Switchboard Inspection Form", hasMobileEquipmentHeader: false, templateType: "DynamicInspectionTable", customLayoutNotes: "" },
  { pmName: "Cable Test Sheet Yearly", discipline: "Electrical", frequency: "52 Week", equipmentType: "Cable", bannerTitle: "Cable Test Sheet", bannerSubtitle: "Electrical Yearly Test", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Test", footerText: "Tennant Creek Mining Operations – Cable Test Sheet", hasMobileEquipmentHeader: false, templateType: "CustomLayout", customLayoutNotes: "Custom cable test table layout" },
  { pmName: "Full Test Sheet Yearly", discipline: "Electrical", frequency: "52 Week", equipmentType: "Full Test Sheet", bannerTitle: "Full Test Sheet", bannerSubtitle: "Electrical Yearly Test", projectSite: "Tennant Creek", plantArea: "", pmGroup: "Electrical", pmType: "Test", footerText: "Tennant Creek Mining Operations – Full Test Sheet", hasMobileEquipmentHeader: false, templateType: "CustomLayout", customLayoutNotes: "Custom full electrical test table layout" },

  // ── ELECTRICAL MOTOR INSPECTIONS (6 WEEKLY) ──
  ...["Filter Press", "Gold Room", "Kiln Area", "Elution", "Milling Area", "Process Water Pond", "Services", "Tanks", "Thickener"].map(area => ({
    pmName: `Statutory Motor Inspection - ${area}`,
    discipline: "Electrical" as const,
    frequency: "6 Week",
    equipmentType: "Motor Inspection",
    bannerTitle: `${area} - Statutory Motor Inspection`,
    bannerSubtitle: area === "Filter Press" ? "& Lubrication" : "",
    projectSite: "Tennant Creek",
    plantArea: area,
    pmGroup: "Electrical",
    pmType: "Motor Inspection",
    footerText: `Tennant Creek Mining Operations – ${area} Motor Inspection Form`,
    hasMobileEquipmentHeader: false,
    templateType: "DynamicInspectionTable" as const,
    customLayoutNotes: "Motor-specific layout with motor nameplate data fields (brand, FLC, frequency, power, voltage, frame size, RPM, ambient temp, serial no) + stationary/running checks",
  })),

  // ── RCD TESTING SHEETS (6-MONTHLY) ──
  ...["Admin Generator", "Juno Generator", "Nobles Natural Sump Generator", "Lab Generator", "Crusher Fuel Farm Generator", "Crusher Workshop Generator"].map(loc => ({
    pmName: `RCD Testing Sheets - ${loc} 6M`,
    discipline: "Electrical" as const,
    frequency: "26 Week",
    equipmentType: loc,
    bannerTitle: `RCD Testing Sheet - ${loc}`,
    bannerSubtitle: "6-Monthly RCD Injection Test",
    projectSite: "Tennant Creek",
    plantArea: loc,
    pmGroup: "Electrical",
    pmType: "Test",
    footerText: `Tennant Creek Mining Operations – RCD Testing Sheet - ${loc}`,
    hasMobileEquipmentHeader: false,
    templateType: "CustomLayout" as const,
    customLayoutNotes: "RCD injection test table with circuit rows from DB tasks data",
  })),

  // ── RCD TESTING SHEETS (3-MONTHLY) ──
  ...["Admin Generator", "Juno Bore Pump Generator", "Andys Dam Generator", "Lab Generator", "Crusher Fuel Farm Generator", "Crusher Workshop Generator"].map(loc => ({
    pmName: `RCD Testing Sheets - ${loc} 3M`,
    discipline: "Electrical" as const,
    frequency: "12 Week",
    equipmentType: loc,
    bannerTitle: `RCD Push-button Testing Sheet - ${loc}`,
    bannerSubtitle: "3-Monthly RCD Push-button Test",
    projectSite: "Tennant Creek",
    plantArea: loc,
    pmGroup: "Electrical",
    pmType: "Test",
    footerText: `Tennant Creek Mining Operations – RCD Testing Sheet - ${loc}`,
    hasMobileEquipmentHeader: false,
    templateType: "CustomLayout" as const,
    customLayoutNotes: "RCD push-button test table with circuit rows from DB tasks data",
  })),
];

export const exportPMWorkbook = async () => {
  try {
    toast.info("Generating PM Workbook...");

    // 1. Fetch all PM data from database
    const { data: dbPMs, error } = await supabase
      .from("pm_master_list")
      .select("*")
      .order("discipline", { ascending: true })
      .order("frequency", { ascending: true })
      .order("pm_name", { ascending: true });

    if (error) throw error;

    const wb = XLSX.utils.book_new();

    // ══════════════════════════════════════════
    // SHEET 1: Template Registry (all 77 templates with full UI metadata)
    // ══════════════════════════════════════════
    const registryRows = templateRegistry.map((t, idx) => {
      const dbRecord = dbPMs?.find(r => r.pm_name === t.pmName);
      return {
        "#": idx + 1,
        "PM Name": t.pmName,
        "Discipline": t.discipline,
        "Frequency": t.frequency,
        "Equipment Type": t.equipmentType,
        "Banner Title": t.bannerTitle,
        "Banner Subtitle": t.bannerSubtitle,
        "Project / Site": t.projectSite,
        "Plant Area": t.plantArea,
        "PM Group": t.pmGroup,
        "PM Type": t.pmType,
        "Footer Text": t.footerText,
        "Has Mobile Equipment Header": t.hasMobileEquipmentHeader ? "Yes" : "No",
        "Template Type": t.templateType,
        "Asset Number (DB)": dbRecord?.asset_number || "",
        "Resources (DB)": dbRecord?.resources || "",
        "Status (DB)": dbRecord?.status || "",
        "Custom Layout Notes": t.customLayoutNotes,
      };
    });

    const wsRegistry = XLSX.utils.json_to_sheet(registryRows);
    wsRegistry["!cols"] = [
      { wch: 4 }, { wch: 48 }, { wch: 12 }, { wch: 10 }, { wch: 28 },
      { wch: 55 }, { wch: 50 }, { wch: 16 }, { wch: 25 }, { wch: 14 },
      { wch: 28 }, { wch: 65 }, { wch: 28 }, { wch: 22 },
      { wch: 16 }, { wch: 22 }, { wch: 10 }, { wch: 80 },
    ];
    XLSX.utils.book_append_sheet(wb, wsRegistry, "Template Registry");

    // ══════════════════════════════════════════
    // SHEET 2: Database Records (full pm_master_list dump)
    // ══════════════════════════════════════════
    const dbRows = (dbPMs || []).map((pm, idx) => ({
      "#": idx + 1,
      "PM Name": pm.pm_name,
      "Discipline": pm.discipline,
      "Equipment Type": pm.equipment_type,
      "Frequency": pm.frequency,
      "Duty Type": pm.duty_type,
      "Status": pm.status,
      "Asset Number": pm.asset_number,
      "Resources": pm.resources,
      "Purpose": pm.purpose,
      "Estimated Duration": pm.estimated_duration,
      "Skill Level": pm.skill_level,
      "Isolation Requirements": pm.isolation_requirements,
      "Required Tools": Array.isArray(pm.required_tools) ? pm.required_tools.join("; ") : "",
      "Required PPE": Array.isArray(pm.required_ppe) ? pm.required_ppe.join("; ") : "",
      "Safety Notes": Array.isArray(pm.safety_notes) ? pm.safety_notes.join("; ") : "",
      "Acceptable Criteria": Array.isArray(pm.acceptable_criteria) ? pm.acceptable_criteria.join("; ") : "",
      "Signs of Failure": Array.isArray(pm.signs_of_failure) ? pm.signs_of_failure.join("; ") : "",
      "Lubrication Notes": pm.lubrication_notes,
      "OEM References": pm.oem_references,
      "Tasks (JSON)": JSON.stringify(pm.tasks),
      "Inspection Points (JSON)": JSON.stringify(pm.inspection_points),
    }));

    const wsDB = XLSX.utils.json_to_sheet(dbRows);
    wsDB["!cols"] = [
      { wch: 4 }, { wch: 48 }, { wch: 12 }, { wch: 28 }, { wch: 10 },
      { wch: 10 }, { wch: 8 }, { wch: 14 }, { wch: 22 }, { wch: 40 },
      { wch: 16 }, { wch: 12 }, { wch: 30 }, { wch: 30 }, { wch: 30 },
      { wch: 40 }, { wch: 40 }, { wch: 40 }, { wch: 30 }, { wch: 30 },
      { wch: 80 }, { wch: 80 },
    ];
    XLSX.utils.book_append_sheet(wb, wsDB, "Database Records");

    // ══════════════════════════════════════════
    // SHEET 3: Flattened Tasks (one row per inspection task)
    // ══════════════════════════════════════════
    const taskRows: Record<string, unknown>[] = [];
    let taskCounter = 0;

    for (const pm of (dbPMs || [])) {
      const tasks = pm.tasks as any;
      if (!tasks) continue;

      // Handle different JSONB shapes
      if (Array.isArray(tasks)) {
        // Simple array of tasks
        for (const task of tasks) {
          taskCounter++;
          taskRows.push({
            "#": taskCounter,
            "PM Name": pm.pm_name,
            "Section / Equipment": "",
            "Equipment ID": task.equipmentId || task.id || "",
            "Task": task.task || task.description || task.item || JSON.stringify(task),
            "Has Temperature": task.hasTemp ? "Yes" : "",
            "Has Pressure": task.hasPressure ? "Yes" : "",
            "Recommended Amount": task.recommendedAmount || "",
          });
        }
      } else if (typeof tasks === "object") {
        // Sectioned data
        if (tasks.sections) {
          for (const section of tasks.sections) {
            for (const task of (section.tasks || section.items || [])) {
              taskCounter++;
              taskRows.push({
                "#": taskCounter,
                "PM Name": pm.pm_name,
                "Section / Equipment": section.equipmentName || section.sectionName || section.name || "",
                "Equipment ID": section.equipmentId || task.equipmentId || "",
                "Task": task.task || task.description || task.item || task.name || JSON.stringify(task),
                "Has Temperature": task.hasTemp ? "Yes" : "",
                "Has Pressure": task.hasPressure ? "Yes" : "",
                "Recommended Amount": task.recommendedAmount || "",
              });
            }
          }
        }
        if (tasks.mccSections) {
          for (const mcc of tasks.mccSections) {
            for (const stdTask of (tasks.standardTasks || [])) {
              taskCounter++;
              taskRows.push({
                "#": taskCounter,
                "PM Name": pm.pm_name,
                "Section / Equipment": `${mcc.mccId} - ${mcc.mccName}`,
                "Equipment ID": mcc.mccId || "",
                "Task": typeof stdTask === "string" ? stdTask : (stdTask.task || JSON.stringify(stdTask)),
                "Has Temperature": "",
                "Has Pressure": "",
                "Recommended Amount": "",
              });
            }
          }
        }
        // Handle items at root level
        if (tasks.items && !tasks.sections) {
          for (const item of tasks.items) {
            taskCounter++;
            taskRows.push({
              "#": taskCounter,
              "PM Name": pm.pm_name,
              "Section / Equipment": "",
              "Equipment ID": item.equipmentId || item.id || "",
              "Task": item.task || item.description || item.item || JSON.stringify(item),
              "Has Temperature": item.hasTemp ? "Yes" : "",
              "Has Pressure": item.hasPressure ? "Yes" : "",
              "Recommended Amount": item.recommendedAmount || "",
            });
          }
        }
      }
    }

    if (taskRows.length > 0) {
      const wsTasks = XLSX.utils.json_to_sheet(taskRows);
      wsTasks["!cols"] = [
        { wch: 6 }, { wch: 48 }, { wch: 35 }, { wch: 16 }, { wch: 70 },
        { wch: 14 }, { wch: 14 }, { wch: 20 },
      ];
      XLSX.utils.book_append_sheet(wb, wsTasks, "Flattened Tasks");
    }

    // ══════════════════════════════════════════
    // SHEET 4: Formatting Standards
    // ══════════════════════════════════════════
    const standardsRows = [
      { Parameter: "Page Size", Value: "A4 Portrait (210mm × 297mm)" },
      { Parameter: "Print Margins", Value: "8mm all sides" },
      { Parameter: "Base Font Size", Value: "8px–10px (xs)" },
      { Parameter: "Banner Background", Value: "Dark gradient with gold/amber logo and title text" },
      { Parameter: "Metadata Grid", Value: "4-column grid: Project/Site, PM Group, Asset Number, PM Type, Plant Area, Frequency, Resources, Date" },
      { Parameter: "Inspection Table Columns", Value: "Task (46%), Serviceable (10%), Defective (10%), Comments (34%)" },
      { Parameter: "Serviceable Checkbox", Value: "Green when checked (data-[state=checked]:bg-green-600)" },
      { Parameter: "Defective Checkbox", Value: "Red when checked (data-[state=checked]:bg-red-600)" },
      { Parameter: "Comments Column", Value: "Empty cells with py-4 padding for handwriting on printed forms" },
      { Parameter: "Safety Section", Value: "Standard text: 'Conduct Take 5 and/or JSEA as required. Ensure isolations and/or safeguards are in place. Follow OEM instructions.'" },
      { Parameter: "Safety Warning", Value: "Pink/red background: 'Under no circumstances will personnel place themselves in an unsafe position while carrying out these inspection tasks.'" },
      { Parameter: "Minimum PPE", Value: "Steel cap boots, hard hat, safety glasses. Gloves and hearing protection as required." },
      { Parameter: "Sign-Off Block", Value: "Technician Name, Date, Signature + Supervisor Name, Date, Signature" },
      { Parameter: "Mobile Equipment Header", Value: "4 columns: Make/Model, Serial No, Hours, Next Service Due (used for mobile equipment + generators)" },
      { Parameter: "Section Headers", Value: "bg-primary/10 with icon + bold text" },
      { Parameter: "Equipment ID Badge", Value: "Orange/primary colored badge (e.g., FP-01) before equipment name" },
      { Parameter: "Print CSS Rule", Value: "break-inside: avoid on table rows (tr)" },
      { Parameter: "Print Hide Elements", Value: "Asset search clear button, UI-only controls hidden via 'print-hide' class" },
      { Parameter: "MCC Layout", Value: "Repeating table per MCC (MCC-110 through MCC-130) with shared standardTasks list" },
      { Parameter: "Motor Inspection Layout", Value: "Motor nameplate grid (brand, FLC, power, voltage, frame, RPM) + stationary/running check tables" },
      { Parameter: "Temperature Fields", Value: "Extra column for temperature readings when hasTemp=true" },
      { Parameter: "Pressure Fields", Value: "Extra column for pressure readings when hasPressure=true" },
      { Parameter: "Recommended Amount", Value: "Displayed as guideline text next to task when present" },
    ];

    const wsStandards = XLSX.utils.json_to_sheet(standardsRows);
    wsStandards["!cols"] = [{ wch: 30 }, { wch: 120 }];
    XLSX.utils.book_append_sheet(wb, wsStandards, "Formatting Standards");

    // ══════════════════════════════════════════
    // SHEET 5: Hardcoded Data (templates not fully in DB)
    // ══════════════════════════════════════════
    const hardcodedRows = [
      { "PM Name": "Safety Shower Inspection Weekly", "Section": "Inspection Items", "Item": "Safety Shower" },
      { "PM Name": "Safety Shower Inspection Weekly", "Section": "Inspection Items", "Item": "Eyewash" },
      { "PM Name": "Safety Shower Inspection Weekly", "Section": "Inspection Items", "Item": "Light" },
      ...["Thickener", "Lime Silo", "Tanks North", "Tanks South", "Elution", "Gold Room", "Filter Press", "Cyanide Upstairs", "Cyanide Downstairs", "Cyanide Outside", "Compound Bottom Tanks North", "Acid Column"].map(loc => ({
        "PM Name": "Safety Shower Inspection Weekly", "Section": "Location Checks", "Item": loc,
      })),
      ...["Conveyors", "Ball Mill", "CIP / Tanks", "Filter Press", "Fuel Farm", "Air Compressors", "Lime", "Reagents", "Tail Thickener", "Raw Water", "Process Water", "Admin", "Warehouse", "Control Room", "Workshop", "Laboratory"].map(zone => ({
        "PM Name": "Visual Zone Checks Weekly", "Section": "General Area Checks", "Item": zone,
      })),
      ...["Conveyors", "Ball Mill", "CIP TANKS", "Filter Press", "Process Fuel Farm", "Air Compressors", "Lime", "Reagents", "Tail Thickener", "Raw Water", "Process Water", "Admin/Mining", "Warehouse", "Control Room", "Workshop", "Laboratory"].map(zone => ({
        "PM Name": "Visual Zone Checks Weekly", "Section": "Lighting Checks", "Item": zone,
      })),
      ...["Juno Generator", "Admin Generator", "Andy Dam Generator", "Crusher Generator", "Lab Generator", "Fuel Farm Generator"].map(gen => ({
        "PM Name": "Visual Zone Checks Weekly", "Section": "Generator Checks", "Item": gen,
      })),
      ...["Weekly Workshop Cleans", "Fortnightly Light Vehicle Cleans", "Clean filters in VSD's in MCC"].map(task => ({
        "PM Name": "Visual Zone Checks Weekly", "Section": "Cleans Tasks", "Item": task,
      })),
      ...["Check Fire extinguishers are in position", "Check Fire extinguishers in date", "Check Vesda System is not in alarm", "Check Fire alarm Panel for Faults", "Check lights are all functioning correctly", "Check air conditioner is on", "Check floor is clear from items or materials", "Vacuum floor inside Substation", "Mop Floor", "Ensure door locks function correctly and are locked", "Check LV rescue kit is on hooks and in date", "Check ARC Flash signs are in position and legible", "Check isolation tag holder is full of Tags"].map(task => ({
        "PM Name": "Substation Inspection Fortnightly", "Section": "Inside Substation", "Item": task,
      })),
      ...["Check Fire extinguishers are in position", "Check Fire extinguishers in date", "Check no rubbish or tools around the Substation"].map(task => ({
        "PM Name": "Substation Inspection Fortnightly", "Section": "Outside Substation", "Item": task,
      })),
      ...[
        { section: "Filter Press 1", tasks: ["Verification – Pull Wire Function (Head End)", "Verification – Pull Wire Function (Tail End)", "Verification – LCS E-STOP Function"] },
        { section: "Filter Press 2", tasks: ["Verification – Pull Wire Function (Head End)", "Verification – Pull Wire Function (Tail End)", "Verification – LCS E-STOP Function"] },
        { section: "Extraction Conveyor", tasks: ["Verification – Pull Wire Function (Head End)", "Verification – Pull Wire Function (Tail End)"] },
        { section: "Transfer Conveyor", tasks: ["Verification – Pull Wire Function (Head End)", "Verification – Pull Wire Function (Tail End)"] },
        { section: "Reclaim Stacker", tasks: ["Verification – Pull Wire Function (Head End)", "Verification – Pull Wire Function (Tail End)"] },
      ].flatMap(({ section, tasks }) => tasks.map(task => ({
        "PM Name": "Pull Wire Checks Quarterly", "Section": section, "Item": task,
      }))),
      ...[
        "Motor or bearing temp >95 °C", "Persistent or increasing vibration", "Visible seal or gasket leakage", "Unusual noise from motor, coupling, or pump", "Smoke or burning smell",
      ].map(alert => ({
        "PM Name": "Filter Press Compressor (Online) Weekly Inspection", "Section": "Mechanical Alerts (Supplementary)", "Item": alert,
      })),
      ...[
        "Excessive shaft play", "Bearing roughness during manual rotation", "Visible seal damage or scoring", "Belt cracks, fraying, or misalignment", "Damaged or worn coupling elements",
      ].map(finding => ({
        "PM Name": "Filter Press Compressor (Offline) Weekly Inspection", "Section": "Mechanical Findings (Supplementary)", "Item": finding,
      })),
      ...[
        "Plate cracks or damaged sealing edges", "Cylinder rod scoring or seal failure", "Hydraulic hose bulging or cracking", "Conveyor belt tears >100mm", "Structural cracks on press frame",
      ].map(trigger => ({
        "PM Name": "Filter Press Daily Offline Inspection", "Section": "Immediate Attention Triggers (Supplementary)", "Item": trigger,
      })),
      ...[
        "Bearing temperature >95°C", "Smoke or burning smell", "Hydraulic oil leak >drip rate", "Filter cloth blinding >50% area", "PLC fault alarm active",
      ].map(trigger => ({
        "PM Name": "Filter Press Daily Online Inspection", "Section": "Shutdown Triggers (Supplementary)", "Item": trigger,
      })),
    ];

    const wsHardcoded = XLSX.utils.json_to_sheet(hardcodedRows);
    wsHardcoded["!cols"] = [{ wch: 52 }, { wch: 35 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, wsHardcoded, "Hardcoded Data");

    // ══════════════════════════════════════════
    // SHEET 6: Data Schema Reference
    // ══════════════════════════════════════════
    const schemaRows = [
      { "Table": "pm_master_list", "Column": "id", "Type": "uuid", "Description": "Primary key" },
      { "Table": "pm_master_list", "Column": "pm_name", "Type": "text", "Description": "Unique PM template name (canonical)" },
      { "Table": "pm_master_list", "Column": "discipline", "Type": "text", "Description": "Mechanical | Electrical | Ops" },
      { "Table": "pm_master_list", "Column": "equipment_type", "Type": "text", "Description": "Equipment category this PM applies to" },
      { "Table": "pm_master_list", "Column": "frequency", "Type": "text", "Description": "Daily | 1 Week | 2 Week | 6 Week | 12 Week | 26 Week | 52 Week" },
      { "Table": "pm_master_list", "Column": "duty_type", "Type": "text", "Description": "Both | Online | Offline" },
      { "Table": "pm_master_list", "Column": "status", "Type": "text", "Description": "Draft | Reviewed | Approved" },
      { "Table": "pm_master_list", "Column": "asset_number", "Type": "text", "Description": "Linked asset ID from processing_plant_assets" },
      { "Table": "pm_master_list", "Column": "resources", "Type": "text", "Description": "Labour allocation e.g. '2x MECH (4hrs)'" },
      { "Table": "pm_master_list", "Column": "tasks", "Type": "jsonb", "Description": "JSONB - inspection tasks. Three shapes: (1) Array of {id, task}, (2) {sections: [{equipmentId, equipmentName, tasks: [{task}]}]}, (3) {mccSections: [{mccId, mccName}], standardTasks: [string]}" },
      { "Table": "pm_master_list", "Column": "inspection_points", "Type": "jsonb", "Description": "JSONB array of inspection checkpoint definitions" },
      { "Table": "pm_master_list", "Column": "required_tools", "Type": "text[]", "Description": "Array of required tools" },
      { "Table": "pm_master_list", "Column": "required_ppe", "Type": "text[]", "Description": "Array of required PPE items" },
      { "Table": "pm_master_list", "Column": "safety_notes", "Type": "text[]", "Description": "Array of safety notes/warnings" },
      { "Table": "pm_master_list", "Column": "acceptable_criteria", "Type": "text[]", "Description": "Array of acceptable condition criteria" },
      { "Table": "pm_master_list", "Column": "signs_of_failure", "Type": "text[]", "Description": "Array of failure indicators" },
      { "Table": "pm_master_list", "Column": "isolation_requirements", "Type": "text", "Description": "LOTO/isolation instructions" },
      { "Table": "pm_master_list", "Column": "lubrication_notes", "Type": "text", "Description": "Lubrication specifications" },
      { "Table": "pm_master_list", "Column": "oem_references", "Type": "text", "Description": "OEM manual references" },
      { "Table": "pm_master_list", "Column": "purpose", "Type": "text", "Description": "PM purpose statement" },
      { "Table": "pm_master_list", "Column": "estimated_duration", "Type": "text", "Description": "Estimated time to complete" },
      { "Table": "pm_master_list", "Column": "skill_level", "Type": "text", "Description": "Required competency level" },
    ];

    const wsSchema = XLSX.utils.json_to_sheet(schemaRows);
    wsSchema["!cols"] = [{ wch: 18 }, { wch: 24 }, { wch: 10 }, { wch: 100 }];
    XLSX.utils.book_append_sheet(wb, wsSchema, "Data Schema");

    // Write file
    XLSX.writeFile(wb, "TCMG_PM_Templates_Complete.xlsx");
    toast.success(`PM Workbook exported – ${templateRegistry.length} templates, ${taskRows.length} tasks`);

  } catch (err) {
    console.error("PM Workbook export failed:", err);
    toast.error("Export failed – check console");
  }
};
