import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Wrench, Zap, AlertTriangle, CheckCircle2, Clock, FileDown } from "lucide-react";
import { usePMasterList } from "@/hooks/usePMData";
import { PrintShutdownPMModal } from "./PrintShutdownPMModal";

// ── Types ───────────────────────────────────────────────────
interface ShutdownPM {
  name: string;
  frequency: string;
  type: "PM";
  discipline: "MS" | "ES";
  estimatedHours: number;
  tcAssetMatch?: string;
  tcPidTag?: string;
}

interface ShutdownArea {
  area: string;
  mechanical: ShutdownPM[];
  electrical: ShutdownPM[];
}

// ── Ore Handling Data ───────────────────────────────────────
const oreHandlingMech: ShutdownPM[] = [
  { name: "6W OFF-LINE MECH BC-100 INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "MFCV01 - Mill Feed Conveyor", tcPidTag: "04-BC-100" },
  { name: "6W OFF-LINE MECH ORE HANDLING AREA CHUTE INSPECTIONS", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "TRCV01-CH01, MFCV01-CH02, MFCV01-CH01, BM01-LDCH", tcPidTag: "04-CH-100/101/102/010" },
  { name: "6W OFF-LINE MECH ORE HANDLING FEEDER INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "RCFD01 - Reclaim Feeder", tcPidTag: "04-FE-100" },
  { name: "6W OFF-LINE MECH LIME SILO INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "MLA01-SILO01 - Lime Storage Silo", tcPidTag: "04-TK-100" },
  { name: "12W OFF-LINE MECH BC-100 INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "MFCV01 - Mill Feed Conveyor", tcPidTag: "04-BC-100" },
  { name: "12W OFF-LINE MECH ORE HANDLING AREA CHUTE INSPECTIONS", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "TRCV01-CH01, MFCV01-CH02, MFCV01-CH01, BM01-LDCH", tcPidTag: "04-CH-100/101/102/010" },
  { name: "12W OFF-LINE MECH LIME SILO INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 2, tcAssetMatch: "MLA01-SILO01 - Lime Storage Silo", tcPidTag: "04-TK-100" },
  { name: "12W OFF-LINE ORE HANDLING OIL SAMPLES", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "Gearboxes on RCFD01, MFCV01, TRCV01", tcPidTag: "" },
];

const oreHandlingElec: ShutdownPM[] = [
  { name: "12W OFF-LINE ORE HANDLING LANYARD INSPECTIONS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "Feed / Reclaim area safety lanyards", tcPidTag: "" },
  { name: "12W OFF-LINE ORE HANDLING AREA E-STOP CHECKS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "E-stops on RCFD01, TRCV01, MFCV01", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT ORE HANDLING AREA RCD PUSH BUTTON TEST", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "RCD protection in Feed / Reclaim area", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT BC-100 WEIGHT-O-METER CALIBRATION", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 6, tcAssetMatch: "MLA01-WTM01 - Weightometer", tcPidTag: "04-WE-506" },
  { name: "26W OFF-LINE ELECT ORE HANDLING MOTOR CHECKS", frequency: "26W", type: "PM", discipline: "ES", estimatedHours: 12, tcAssetMatch: "Motors on RCFD01, TRCV01, MFCV01", tcPidTag: "" },
  { name: "52W OFF-LINE ELECT ORE HANDLING TOUCH POTENTIAL EARTHING TEST", frequency: "52W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "Earthing infrastructure in Feed / Reclaim area", tcPidTag: "" },
];

// ── Grinding Data ───────────────────────────────────────────
const grindingMech: ShutdownPM[] = [
  { name: "6W OFF-LINE MECH GRINDING CYCLONE FEED PUMP DISCHARGE PIPES/VALVES", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 0.5, tcAssetMatch: "CFP01 discharge pipework (CLA01-PIPE02)", tcPidTag: "" },
  { name: "6W OFF-LINE MECH GRINDING CYCLONE INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 0.5, tcAssetMatch: "CYC01-CLU01, CYC01-CYA/B/C - Primary Cyclones", tcPidTag: "04-CY-100" },
  { name: "6W OFF-LINE MECH GRINDING BALL MILL INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 2, tcAssetMatch: "BM01 - Primary Ball Mill", tcPidTag: "04-ML-100" },
  { name: "12W OFF-LINE MECH GRINDING CYCLONE INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 0.5, tcAssetMatch: "CYC01-CLU01, CYC01-CYA/B/C - Primary Cyclones", tcPidTag: "04-CY-100" },
  { name: "12W OFF-LINE MECH GRINDING BALL MILL INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "BM01 - Primary Ball Mill", tcPidTag: "04-ML-100" },
  { name: "12W OFF-LINE MECH GRINDING BALL MILL FEED CHUTE INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "BM01-LDCH - Primary Ball Mill Loading Chute", tcPidTag: "04-CH-010" },
  { name: "12W OFF-LINE MECH GRINDING BALL MILL INSPECT-REPLACE FEED END LIP SEAL", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 12, tcAssetMatch: "BM01 - Primary Ball Mill", tcPidTag: "04-ML-100" },
  { name: "12W OFF-LINE MECH GRINDING BALL MILL LUBRICATION UNIT SERVICE/INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "MLUB01 - Primary Ball Mill Lube System", tcPidTag: "04-LS-100" },
  { name: "12W OFF-LINE MECH GRINDING BALL MILL GIRTH GEAR LUBRICATION UNIT INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "MLUB02 - Girth Gear Lube System", tcPidTag: "04-LS-101" },
  { name: "12W OFF-LINE MECH GRINDING BALL MILL GIRTH GEAR INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 12, tcAssetMatch: "BM01 - Primary Ball Mill girth gear", tcPidTag: "04-ML-100" },
  { name: "12W OFF-LINE MECH GRINDING BALL MILL PINION INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 12, tcAssetMatch: "BM01 - Primary Ball Mill pinion", tcPidTag: "04-ML-100" },
  { name: "12W OFF-LINE MECH GRINDING BALL MILL DRIVE ALIGNMENT/INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 12, tcAssetMatch: "BM01-GBX01 - Gear Reducer / drive train", tcPidTag: "04-GR-100" },
  { name: "12W OFF-LINE MECH GRINDING BALL MILL INTERNAL SCAN OF MILL", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "BM01 - Primary Ball Mill (liner wear scan)", tcPidTag: "04-ML-100" },
  { name: "12W OFF-LINE MECH GRINDING BALL MILL TROMMEL INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "BM01 - Primary Ball Mill trommel screen", tcPidTag: "04-ML-100" },
  { name: "12W OFF-LINE MECH GRINDING BALL MILL SPRAY BAR INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "BM01 - Primary Ball Mill spray bars", tcPidTag: "04-ML-100" },
  { name: "12W OFF-LINE MECH GRINDING MILL DISCHARGE HOPPER INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "CFP01-HP01 - Primary Mill Discharge Hopper", tcPidTag: "04-PB-100" },
  { name: "12W OFF-LINE MECH GRINDING CYCLONE FEED PUMP DISCHARGE PIPES/VALVES INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 0.5, tcAssetMatch: "CFP01 discharge pipework (CLA01-PIPE02)", tcPidTag: "" },
  { name: "12W OFF-LINE MECH GRINDING BOILER BOX INSPECTIONS", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 2, tcAssetMatch: "BM01-FBB - Primary Mill Feed Boiler Box", tcPidTag: "04-PB-105" },
  { name: "12W OFF-LINE MECH GRINDING AREA OIL SAMPLES", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "BM01-GBX01, MLUB01, MLUB02 gearboxes & lube systems", tcPidTag: "" },
];

const grindingPumps: ShutdownPM[] = [
  { name: "6W OFF-LINE MECH GRINDING CYCLONE FEED PUMP 1 WET END INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "CFP01-PA01 - Primary Cyclone Feed Pump (Duty)", tcPidTag: "04-PU-102A" },
  { name: "6W OFF-LINE MECH GRINDING CYCLONE FEED PUMP 2 WET END INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "CFP01-PB01 - Primary Cyclone Feed Pump (Standby)", tcPidTag: "04-PU-102B" },
  { name: "12W OFF-LINE MECH GRINDING CYCLONE FEED PUMP 1 WET END INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "CFP01-PA01 - Primary Cyclone Feed Pump (Duty)", tcPidTag: "04-PU-102A" },
  { name: "12W OFF-LINE MECH GRINDING CYCLONE FEED PUMP 2 WET END INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "CFP01-PB01 - Primary Cyclone Feed Pump (Standby)", tcPidTag: "04-PU-102B" },
];

const grindingElec: ShutdownPM[] = [
  { name: "6W ON-LINE ELECT GRINDING MILL PNEUMATIC VALVE INSPECTION AND TEST", frequency: "6W", type: "PM", discipline: "ES", estimatedHours: 1, tcAssetMatch: "CFP01-TTV01 - TechTaylor Valve & mill pneumatic valves", tcPidTag: "04-XV-" },
  { name: "12W OFF-LINE GRINDING AREA E-STOP CHECKS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "E-stops on BM01, CFP01, conveyors", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT GRINDING AREA RCD PUSH BUTTON TEST", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "RCD protection in Grinding area", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT GRINDING MILL VSD INSPECTIONS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 3, tcAssetMatch: "BM01 VSD (electrical sub-component of Primary Ball Mill)", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT GRINDING RCD PUSH BUTTON TEST MILL MCC", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 3, tcAssetMatch: "Mill MCC (electrical infrastructure – Grinding area)", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT GRINDING MILL MCC VESDA TEST", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 3, tcAssetMatch: "Mill MCC VESDA (electrical infrastructure – Grinding area)", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT GRINDING HV MCC BALL MILL INSPECTION", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 3, tcAssetMatch: "HV MCC (electrical infrastructure – BM01 supply)", tcPidTag: "" },
  { name: "26W OFF-LINE ELECT GRINDING DENSITY GAUGE CALIBRATION", frequency: "26W", type: "PM", discipline: "ES", estimatedHours: 6, tcAssetMatch: "Density gauges on cyclone feed / mill circuit", tcPidTag: "" },
  { name: "26W OFF-LINE GRINDING AREA MOTOR CHECKS", frequency: "26W", type: "PM", discipline: "ES", estimatedHours: 12, tcAssetMatch: "Motors on BM01, CFP01-PA01/PB01, MLUB pumps", tcPidTag: "" },
  { name: "26W OFF-LINE ELECT GRINDING AREA BUCKET TEST", frequency: "26W", type: "PM", discipline: "ES", estimatedHours: 10, tcAssetMatch: "Grinding area electrical bucket testing", tcPidTag: "" },
  { name: "52W OFF-LINE ELECT GRINDING MILL MCC INJECTION TEST", frequency: "52W", type: "PM", discipline: "ES", estimatedHours: 4, tcAssetMatch: "Mill MCC injection testing", tcPidTag: "" },
  { name: "52W OFF-LINE ELECT GRINDING HV MCC BALL MILL INJECTION TEST", frequency: "52W", type: "PM", discipline: "ES", estimatedHours: 4, tcAssetMatch: "HV MCC for BM01 injection testing", tcPidTag: "" },
  { name: "52W OFF-LINE ELECT GRINDING TOUCH POTENTIAL EARTHING TEST", frequency: "52W", type: "PM", discipline: "ES", estimatedHours: 12, tcAssetMatch: "Earthing infrastructure in Grinding area", tcPidTag: "" },
  { name: "52W OFF-LINE GRINDING TRANSFORMER OIL TEST", frequency: "52W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "Grinding area transformer oil sampling", tcPidTag: "" },
];

// ── Leaching Data ───────────────────────────────────────────
const leachingMech: ShutdownPM[] = [
  { name: "12W OFF-LINE MECH LEACHING AGI INSPECTIONS", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "CIP Agitators (CIP area)", tcPidTag: "" },
  { name: "12W OFF-LINE MECH LEACHING AREA OIL SAMPLES", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "CIP area gearboxes & lube systems", tcPidTag: "" },
  { name: "12W OFF-LINE MECH LEACHING AREA BARREN CARBON SCREEN INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 2, tcAssetMatch: "Barren carbon screen (CIP area)", tcPidTag: "" },
  { name: "12W OFF-LINE MECH LEACHING AREA TRANSFER PUMPS INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "CIP area transfer pumps", tcPidTag: "" },
  { name: "12W OFF-LINE MECH LEACHING AREA INTER TANK SCREEN INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "Inter-tank screens (CIP area)", tcPidTag: "" },
  { name: "12W OFF-LINE TANK INTERNAL TANK INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 10, tcAssetMatch: "CIP/Leach tank internals", tcPidTag: "" },
];

const leachingElec: ShutdownPM[] = [
  { name: "12W OFF-LINE ELECT LEACHING AREA E-STOP CHECKS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "E-stops in CIP/Leaching area", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT LEACHING AREA RCD PUSH BUTTON TEST", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "RCD protection in CIP/Leaching area", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT LEACHING AREA INSTRUMENT INSPECTION", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 6, tcAssetMatch: "Instrumentation in CIP/Leaching area", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT LEACHING AREA ELECTRICAL INSPECTIONS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "Electrical infrastructure in CIP/Leaching area", tcPidTag: "" },
  { name: "26W OFF-LINE ELECT LEACHING AREA MOTOR CHECKS", frequency: "26W", type: "PM", discipline: "ES", estimatedHours: 12, tcAssetMatch: "Motors in CIP/Leaching area", tcPidTag: "" },
];

// ── Thickening Data ─────────────────────────────────────────
const thickeningMech: ShutdownPM[] = [
  { name: "12W OFF-LINE THICKENER INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "THK01 - Tails Thickener" },
  { name: "12W OFF-LINE TRASH SCREEN INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 2, tcAssetMatch: "THK01 trash screen (Thickening area)" },
  { name: "12W OFF-LINE THICKENER AREA OIL SAMPLES", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "THYD01 hydraulic system, TUFP01 pump gearboxes" },
  { name: "12W OFF-LINE THICKENER DRIVE INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "THYD01 - Thickener Hydraulic System (drive)" },
  { name: "6W OFF-LINE MECH THICKENER UNDERFLOW PUMP 1 INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "TUFP01-PMP01 - Thickener Underflow Pump (Duty)" },
  { name: "6W OFF-LINE MECH THICKENER UNDERFLOW PUMP 2 INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "TUFP01-PMP02 - Thickener Underflow Pump (Standby)" },
  { name: "12W OFF-LINE MECH THICKENER UNDERFLOW PUMP 1 INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "TUFP01-PMP01 - Thickener Underflow Pump (Duty)" },
  { name: "12W OFF-LINE MECH THICKENER UNDERFLOW PUMP 2 INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "TUFP01-PMP02 - Thickener Underflow Pump (Standby)" },
];

const thickeningElec: ShutdownPM[] = [
  { name: "12W OFF-LINE THICKENING AREA E-STOP CHECKS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "E-stops in Thickening area" },
  { name: "12W OFF-LINE ELECT THICKENING AREA RCD PUSH BUTTON TEST", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "RCD protection in Thickening area" },
  { name: "12W OFF-LINE ELECT THICKENER AREA ELECTRICAL INSPECTIONS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "Electrical infrastructure in Thickening area" },
  { name: "26W OFF-LINE ELECT THICKENING AREA MOTOR CHECKS", frequency: "26W", type: "PM", discipline: "ES", estimatedHours: 12, tcAssetMatch: "Motors on THYD01-MTR01, TUFP01 pumps" },
];

// ── Tailings Data ───────────────────────────────────────────
const tailingsMech: ShutdownPM[] = [
  { name: "6W OFF-LINE MECH TAILS PUMP 1 WET END INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "ADS01-PMP03 - CIP Tailings Pump (Duty)" },
  { name: "6W OFF-LINE MECH TAILS PUMP 2 WET END INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "ADS01-PMP02 - CIP Tailings Pump (Standby)" },
  { name: "12W OFF-LINE MECH TAILS PUMP 1 WET END INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "ADS01-PMP03 - CIP Tailings Pump (Duty)" },
  { name: "12W OFF-LINE MECH TAILS PUMP 2 WET END INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "ADS01-PMP02 - CIP Tailings Pump (Standby)" },
  { name: "6W OFF-LINE MECH FILTER FEED TANK PUMP 1 WET END INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "FP01-PMP01 - Filter 1 Feed Pump" },
  { name: "6W OFF-LINE MECH FILTER FEED TANK PUMP 2 WET END INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "FP02-PMP01 - Filter 2 Feed Pump" },
  { name: "6W OFF-LINE MECH FILTER FEED TANKPUMP 1 WET END INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 5, tcAssetMatch: "FP01-PMP01 - Filter 1 Feed Pump" },
  { name: "6W OFF-LINE MECH FILTER FEED TANK PUMP 2 WET END INSPECTION (12W)", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "FP02-PMP01 - Filter 2 Feed Pump" },
];

const tailingsElec: ShutdownPM[] = [
  { name: "12W OFF-LINE TAILS AREA E-STOP CHECKS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "E-stops in Tailings / Filter area" },
  { name: "12W OFF-LINE ELECT TAILS AREA RCD PUSH BUTTON TEST", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "RCD protection in Tailings / Filter area" },
  { name: "12W OFF-LINE ELECT TAILS AREA ELECTRICAL INSPECTIONS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "Electrical infrastructure in Tailings / Filter area" },
  { name: "26W OFF-LINE ELECT TAILS AREA MOTOR CHECKS", frequency: "26W", type: "PM", discipline: "ES", estimatedHours: 12, tcAssetMatch: "Motors on ADS01-PMP02/03, FP01-PMP01, FP02-PMP01" },
];

// ── Gold Room / Elution Data ────────────────────────────────
const goldRoomMech: ShutdownPM[] = [
  { name: "12W OFF-LINE MECH KILN INSPECTIONS", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 2, tcAssetMatch: "GR01-KLN01 - Kiln" },
  { name: "12W OFF-LINE MECH KILN OIL SAMPLES", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "GR01-KLN01 - Kiln gearbox" },
  { name: "12W OFF-LINE MECH KILN LUBE", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "GR01-KLN01 - Kiln lubrication" },
];

const goldRoomElec: ShutdownPM[] = [
  { name: "12W OFF-LINE ELECT ELECTROWINNING CELLS INSPECTION", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "EWCL01 - Electrowinning Cell" },
  { name: "12W OFF-LINE ELECT KILN INSPECTION", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "GR01-KLN01 - Kiln (electrical)" },
  { name: "12W OFF-LINE ELECT ELUTION AREA E-STOP CHECKS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "E-stops in Elution / Gold Room area" },
  { name: "12W OFF-LINE ELECT ELUTION AREA RCD PUSH BUTTON TEST", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "RCD protection in Elution / Gold Room area" },
  { name: "12W OFF-LINE ELECT ELUTION AREA INSTRUMENT INSPECTION", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 6, tcAssetMatch: "Instrumentation in Elution area (ELU01, AW01)" },
  { name: "12W OFF-LINE ELECT ELUTION AREA ELECTRICAL INSPECTIONS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "Electrical infrastructure in Elution / Gold Room area" },
  { name: "26W OFF-LINE ELECT ELUTION AREA MOTOR CHECKS", frequency: "26W", type: "PM", discipline: "ES", estimatedHours: 12, tcAssetMatch: "Motors in Elution / Gold Room area" },
];

// ── Reagents Data ───────────────────────────────────────────
const reagentsMech: ShutdownPM[] = [
  { name: "52W OFF-LINE INTERNAL INSPECTION OF TANKS", frequency: "52W", type: "PM", discipline: "MS", estimatedHours: 4, tcAssetMatch: "CN01-MXT01, CN01-ST01, DSL01-TK01 - Reagent area tanks" },
];

const reagentsElec: ShutdownPM[] = [];

// ── Water Data ──────────────────────────────────────────────
const waterMech: ShutdownPM[] = [
  { name: "52W STAT ON-LINE MECH FIRE WATER DIESEL PUMP INSPECTION", frequency: "4W", type: "PM", discipline: "MS", estimatedHours: 0.5, tcAssetMatch: "MCC-FP - Fire Pump 45kW (diesel driven)" },
  { name: "52W OFF-LINE DIESEL POTABLE WATER PUMP STAT INSPECTION", frequency: "52W", type: "PM", discipline: "MS", estimatedHours: 12, tcAssetMatch: "PW01 - Potable Water system pumps" },
];

const waterElec: ShutdownPM[] = [];

// ── All areas registry (add new areas here) ─────────────────
const SHUTDOWN_AREAS: ShutdownArea[] = [
  { area: "Ore Handling (Feed / Reclaim)", mechanical: oreHandlingMech, electrical: oreHandlingElec },
  { area: "Grinding (Comminution)", mechanical: [...grindingMech, ...grindingPumps], electrical: grindingElec },
  { area: "Leaching (CIP)", mechanical: leachingMech, electrical: leachingElec },
  { area: "Thickening", mechanical: thickeningMech, electrical: thickeningElec },
  { area: "Tailings / Filtering", mechanical: tailingsMech, electrical: tailingsElec },
  { area: "Gold Room / Elution", mechanical: goldRoomMech, electrical: goldRoomElec },
  { area: "Reagents", mechanical: reagentsMech, electrical: reagentsElec },
  { area: "Water", mechanical: waterMech, electrical: waterElec },
];

// ── Helpers ─────────────────────────────────────────────────
const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const FreqBadge = ({ freq }: { freq: string }) => {
  const color = freq === "6W" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
    : freq === "12W" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    : freq === "26W" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{freq}</span>;
};

// ── Component ───────────────────────────────────────────────
export const ShutdownPMRequirementsSection = () => {
  const { pms } = usePMasterList();
  const [openAreas, setOpenAreas] = useState<Set<string>>(new Set(SHUTDOWN_AREAS.map(a => a.area)));
  const [printOpen, setPrintOpen] = useState(false);

  const toggleArea = (area: string) => {
    setOpenAreas(prev => {
      const next = new Set(prev);
      next.has(area) ? next.delete(area) : next.add(area);
      return next;
    });
  };

  // Check which shutdown PMs already exist in the PM master list
  const existingPMs = useMemo(() => {
    const set = new Set<string>();
    pms.forEach(p => set.add(normalise(p.pmName)));
    return set;
  }, [pms]);

  const checkExists = (name: string) => {
    const norm = normalise(name);
    return pms.some(p => normalise(p.pmName).includes(norm) || norm.includes(normalise(p.pmName)));
  };

  // Summary stats
  const stats = useMemo(() => {
    let total = 0, covered = 0, totalHours = 0;
    SHUTDOWN_AREAS.forEach(area => {
      const all = [...area.mechanical, ...area.electrical];
      total += all.length;
      all.forEach(pm => {
        totalHours += pm.estimatedHours;
        if (checkExists(pm.name)) covered++;
      });
    });
    return { total, covered, outstanding: total - covered, totalHours };
  }, [pms]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Shutdown PM Requirements - Required Offline Inspections
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Offline/shutdown PMs that require the plant to be de-energised. These are cross-referenced against the Tennant Creek P&ID source of truth.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Required</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{stats.covered}</div>
              <div className="text-xs text-muted-foreground">Already Exist</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.outstanding}</div>
              <div className="text-xs text-muted-foreground">Outstanding</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.totalHours}h</div>
              <div className="text-xs text-muted-foreground">Est. Total Hours</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Area sections */}
      {SHUTDOWN_AREAS.map(area => {
        const isOpen = openAreas.has(area.area);
        const allPMs = [...area.mechanical, ...area.electrical];
        const areaCovered = allPMs.filter(pm => checkExists(pm.name)).length;
        const areaHours = allPMs.reduce((s, pm) => s + pm.estimatedHours, 0);

        return (
          <Card key={area.area}>
            <Collapsible open={isOpen} onOpenChange={() => toggleArea(area.area)}>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <CardTitle className="text-base">{area.area}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{allPMs.length} PMs</Badge>
                      <Badge variant="outline" className="text-xs">{areaHours}h est.</Badge>
                      <Badge className={areaCovered === allPMs.length ? "bg-emerald-600 text-xs" : "bg-amber-600 text-xs"}>
                        {areaCovered}/{allPMs.length} covered
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {/* Mechanical */}
                  {area.mechanical.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="w-4 h-4 text-blue-600" />
                        <h4 className="font-semibold text-sm">Mechanical</h4>
                        <Badge variant="outline" className="text-[10px]">{area.mechanical.length} items</Badge>
                      </div>
                      <PMTable items={area.mechanical} checkExists={checkExists} />
                    </div>
                  )}

                  {/* Electrical */}
                  {area.electrical.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <h4 className="font-semibold text-sm">Electrical</h4>
                        <Badge variant="outline" className="text-[10px]">{area.electrical.length} items</Badge>
                      </div>
                      <PMTable items={area.electrical} checkExists={checkExists} />
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}

      {/* Placeholder for future areas */}
      {SHUTDOWN_AREAS.length < 2 && (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">More areas coming</p>
            <p className="text-xs">Additional shutdown PM areas (Milling, CIP, Elution, Tailings, etc.) will be added as data is provided.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ── Table sub-component ─────────────────────────────────────
const PMTable = ({ items, checkExists }: { items: ShutdownPM[]; checkExists: (name: string) => boolean }) => (
  <div className="border rounded-lg overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="text-[10px] font-bold w-8">Status</TableHead>
          <TableHead className="text-[10px] font-bold">PM Name</TableHead>
          <TableHead className="text-[10px] font-bold w-14">Freq</TableHead>
          <TableHead className="text-[10px] font-bold w-16">Disc.</TableHead>
          <TableHead className="text-[10px] font-bold w-12">Hours</TableHead>
          <TableHead className="text-[10px] font-bold">TC Asset Match</TableHead>
          <TableHead className="text-[10px] font-bold w-28">P&ID Tag</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((pm, i) => {
          const exists = checkExists(pm.name);
          return (
            <TableRow key={i} className={exists ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""}>
              <TableCell className="text-center">
                {exists 
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                  : <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mx-auto" />
                }
              </TableCell>
              <TableCell className="text-[11px] font-medium">{pm.name}</TableCell>
              <TableCell><FreqBadge freq={pm.frequency} /></TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px]">
                  {pm.discipline === "MS" ? "Mech" : "Elec"}
                </Badge>
              </TableCell>
              <TableCell className="text-[11px] text-center font-mono">{pm.estimatedHours}</TableCell>
              <TableCell className="text-[10px] text-muted-foreground">{pm.tcAssetMatch}</TableCell>
              <TableCell className="text-[10px] font-mono text-blue-600 dark:text-blue-400">{pm.tcPidTag || "—"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);
