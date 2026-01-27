import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { 
  AlertTriangle, 
  Shield, 
  HardHat,
  FileText,
  Zap,
  AlertCircle,
  Lock,
  Cog,
  Wrench
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

interface Hazard {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface MotorData {
  description: string;
  equipmentNumber?: string;
  brand?: string;
  flc?: string;
  frequency?: string;
  power?: string;
  voltage?: string;
  frameSize?: string;
  rpm?: string;
  ambientTemp?: string;
  serialNo?: string;
}

interface AreaData {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  motors: MotorData[];
}

const hazardsList: Hazard[] = [
  { id: "electrical", icon: <Zap className="w-4 h-4" />, label: "Electrical" },
  { id: "mechanical", icon: <Cog className="w-4 h-4" />, label: "Mechanical" },
  { id: "lockout", icon: <Lock className="w-4 h-4" />, label: "LOTO" },
];

const stationaryChecks = [
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
];

const areaData: AreaData[] = [
  {
    id: "filter-press",
    name: "Filter Press",
    title: "Filter Press - Statutory Motor Inspection",
    subtitle: "& Lubrication",
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
    ]
  },
  {
    id: "gold-room",
    name: "Gold Room",
    title: "Gold Room - Statutory Motor Inspection",
    motors: [
      { description: "Elution Electrowinning Extraction Fan", equipmentNumber: "FA-001", brand: "MONARCH BRG 6202", flc: "0.88 A", frequency: "50 Hz", power: "0.37 kW", voltage: "415 V", frameSize: "MS7112", rpm: "2800 RPM" },
      { description: "Barring Furnace Rotation Motor", equipmentNumber: "FA-001", brand: "MOTOVARIO TS80A4", flc: "2.68 A", frequency: "50 Hz", power: "0.55 kW", voltage: "415 V", rpm: "1410 RPM" },
      { description: "Shaking Table", equipmentNumber: "ST-100", brand: "WEG K23 W22", flc: "6.00 A", frequency: "50 Hz", power: "3.0 kW", voltage: "415 V", frameSize: "L100L", rpm: "1445 RPM", ambientTemp: "40°C" },
      { description: "Gravity Tails Pump", equipmentNumber: "PU-111", brand: "TECO AEMBUCDCV", flc: "2.68 A", frequency: "50 Hz", power: "0.55 kW", voltage: "415 V", frameSize: "D100L", rpm: "1455 RPM", ambientTemp: "40°C", serialNo: "P3179079002" },
    ]
  },
  {
    id: "kiln-area",
    name: "Kiln Area",
    title: "Kiln Area - Statutory Motor Inspection",
    subtitle: "& Lubrication",
    motors: [
      { description: "Sump Pump", brand: "TECO", flc: "9.3 A", frequency: "50 Hz", power: "5.5 KW", voltage: "415 V", frameSize: "D132S", rpm: "1460 RPM", ambientTemp: "40°C" },
      { description: "Kiln Discharge Pump", brand: "TECO", flc: "6.01 A", frequency: "50 Hz", power: "3 KW", voltage: "415 V", frameSize: "D100L", rpm: "1460 RPM", ambientTemp: "40°C" },
      { description: "Kiln Carbon Feed Pump", brand: "WEG", flc: "2.87 A", frequency: "50 Hz", power: "0.75 KW", voltage: "415 V", rpm: "1440 RPM", ambientTemp: "40°C" },
      { description: "Kiln Drive Motor", brand: "BONFIGLIOLI", frequency: "50 Hz", voltage: "415 V", frameSize: "BN 80 B4" },
    ]
  },
  {
    id: "elution",
    name: "Elution",
    title: "Elution - Statutory Motor Inspection",
    subtitle: "& Lubrication",
    motors: [
      { description: "Elution Pump 1" },
      { description: "Elution Pump 2" },
      { description: "Elution Heater Motor" },
      { description: "Elution Feed Pump" },
    ]
  },
  {
    id: "milling-area",
    name: "Milling Area",
    title: "Grinding - Statutory Motor Inspection",
    motors: [
      { description: "Mill Feed Conveyor", equipmentNumber: "BC-100", brand: "WEG KTE30 PHEM", flc: "20.2 A", frequency: "50 Hz", power: "11 kW", voltage: "415 V", frameSize: "160M", rpm: "1465 RPM", ambientTemp: "40°C" },
      { description: "Lime Rotary Valve", brand: "WEG KTE 12 W22M", flc: "5.81 A", frequency: "50 Hz", power: "1.5 KW", voltage: "415 V", frameSize: "90L-04", rpm: "1450 RPM", ambientTemp: "40°C" },
      { description: "Transfer Conveyor", equipmentNumber: "FE-101", brand: "SEW-EURODRIVE KA77/T DRE132M4/RS", flc: "11 A", frequency: "50 Hz", power: "5.5 KW", voltage: "415 V", rpm: "1455 RPM" },
      { description: "Reclaim Feeder", frequency: "50 Hz", voltage: "415 V" },
      { description: "Grinding Area Pump", equipmentNumber: "04-PU-120", brand: "WEG KTE 21 W22M", flc: "10.6 A", frequency: "50 Hz", power: "5.5 kW", voltage: "415 V", frameSize: "132S-04", rpm: "1465 RPM", ambientTemp: "40°C" },
      { description: "Cyclone Feed Pump A (Duty)", equipmentNumber: "PU-102A", brand: "WEG KTE 50 W22M", flc: "183 A", frequency: "50 Hz", power: "110 KW", voltage: "415 V", frameSize: "280S/M", rpm: "1485 RPM", ambientTemp: "40°C" },
      { description: "Cyclone Feed Pump B (Standby)", equipmentNumber: "PU-102B", brand: "WEG KTE 50 W22M", flc: "183 A", frequency: "50 Hz", power: "110 KW", voltage: "415 V", frameSize: "280S/M", rpm: "1485 RPM", ambientTemp: "40°C" },
    ]
  },
  {
    id: "pwp",
    name: "Process Water Pond",
    title: "Process Water Pond - Statutory Motor Inspection",
    subtitle: "& Lubrication",
    motors: [
      { description: "PWP Pump A", brand: "WEG", flc: "93.4 A", frequency: "50 Hz", power: "55 KW", voltage: "415 V", frameSize: "250 S/M", rpm: "1480 RPM", ambientTemp: "40°C" },
      { description: "PWP Pump B", brand: "WEG", flc: "93.4 A", frequency: "50 Hz", power: "55 KW", voltage: "415 V", frameSize: "250 S/M", rpm: "1480 RPM", ambientTemp: "40°C" },
    ]
  },
  {
    id: "services",
    name: "Services",
    title: "Services - Statutory Motor Inspection",
    motors: [
      { description: "Safety Shower Pump A", equipmentNumber: "PU-205A", brand: "CENTRIPRO", flc: "3.72 A", frequency: "50 Hz", power: "1.1 kW", voltage: "415 V", rpm: "2820 RPM" },
      { description: "Safety Shower Pump B", equipmentNumber: "PU-205B", brand: "LOWARA SM80B14/311 E3", flc: "4.16 A", frequency: "50 Hz", power: "1.1 kW", voltage: "415 V", rpm: "2900 RPM", ambientTemp: "50°C" },
      { description: "Potable Water Pump A (Duty)", equipmentNumber: "PU-033A", brand: "LOWARA PLM112RB14S6/340 E3", flc: "7.61 A", frequency: "50 Hz", power: "4.00 kW", voltage: "415 V", rpm: "2910 RPM", ambientTemp: "50°C" },
      { description: "Potable Water Pump B (Standby)", equipmentNumber: "PU-033B", brand: "LOWARA PLM112RB14S6/240 E3", flc: "7.61 A", frequency: "50 Hz", power: "4.00 kW", voltage: "415 V", rpm: "2910 RPM", ambientTemp: "50°C" },
      { description: "Gland Water Pump A", equipmentNumber: "PU-135A", brand: "LOWARA", flc: "7.61 A", frequency: "50 Hz", power: "4.00 KW", voltage: "415 V", rpm: "2910 RPM", ambientTemp: "50°C" },
      { description: "Gland Water Pump B (Standby)", equipmentNumber: "PU-135B", brand: "LOWARA PLM112RB14S6/340 E3", flc: "7.61 A", frequency: "50 Hz", power: "4.00 KW", voltage: "415 V", rpm: "2910 RPM", ambientTemp: "50°C" },
      { description: "Raw Water Pump A (Duty)", equipmentNumber: "PU-026A", brand: "GRUNDFOSS 85U17524", flc: "21.8 A", frequency: "50 Hz", power: "11.0 KW", voltage: "415 V", rpm: "2940 RPM", ambientTemp: "40°C" },
    ]
  },
  {
    id: "tanks",
    name: "Tanks",
    title: "Tanks - Statutory Motor Inspection",
    subtitle: "& Lubrication",
    motors: [
      { description: "Agitator 1", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 2", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 3", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 4", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 5", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 6", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 7", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 8", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 9", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 10", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 11", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 12", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 13", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 14", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 15", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 16", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 17", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 18", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 19", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
      { description: "Agitator 20", brand: "WEG", flc: "38 A", frequency: "50 Hz", power: "22 KW", voltage: "415 V", frameSize: "180L", rpm: "1470 RPM", ambientTemp: "40°C" },
    ]
  },
];

interface MotorSectionProps {
  motor: MotorData;
  motorNumber: number;
}

const MotorSection = ({ motor, motorNumber }: MotorSectionProps) => (
  <div className="border-b border-border">
    <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
      <Cog className="w-5 h-5 text-primary" />
      MOTOR {motorNumber} - {motor.description}
    </div>
    
    {/* Motor Details Grid */}
    <div className="grid grid-cols-2 text-xs border-b border-border">
      <div className="border-r border-border">
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Equipment Description:</div>
          <div className="px-2 py-1.5">{motor.description || <Input className="h-6 text-xs" />}</div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Brand/Model:</div>
          <div className="px-2 py-1.5">{motor.brand || <Input className="h-6 text-xs" />}</div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Rated Frequency:</div>
          <div className="px-2 py-1.5">{motor.frequency || <Input className="h-6 text-xs" placeholder="50 Hz" />}</div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Rated Voltage:</div>
          <div className="px-2 py-1.5">{motor.voltage || <Input className="h-6 text-xs" placeholder="415 V" />}</div>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Speeds RPM:</div>
          <div className="px-2 py-1.5">{motor.rpm || <Input className="h-6 text-xs" />}</div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Equipment Number:</div>
          <div className="px-2 py-1.5">{motor.equipmentNumber || <Input className="h-6 text-xs" />}</div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Rated FLC:</div>
          <div className="px-2 py-1.5">{motor.flc || <Input className="h-6 text-xs" />}</div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Rated Power:</div>
          <div className="px-2 py-1.5">{motor.power || <Input className="h-6 text-xs" />}</div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Frame Size:</div>
          <div className="px-2 py-1.5">{motor.frameSize || <Input className="h-6 text-xs" />}</div>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Ambient Temp Rating:</div>
          <div className="px-2 py-1.5">{motor.ambientTemp || <Input className="h-6 text-xs" />}</div>
        </div>
      </div>
    </div>

    {/* Serial Number */}
    <div className="grid grid-cols-[140px_1fr] text-xs border-b border-border">
      <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Serial No:</div>
      <div className="px-2 py-1.5">{motor.serialNo || <Input className="h-6 text-xs" />}</div>
    </div>

    {/* Stationary Checks Table */}
    <div className="bg-muted px-3 py-1.5 font-semibold text-xs border-b border-border">STATIONARY CHECKS – PM INSPECTION</div>
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-muted/50">
          <th className="border border-border px-2 py-1.5 text-left font-semibold w-[15%]">Item</th>
          <th className="border border-border px-2 py-1.5 text-left font-semibold w-[60%]">Action/Steps</th>
          <th className="border border-border px-2 py-1.5 text-left font-semibold w-[25%]">Results and Comments</th>
        </tr>
      </thead>
      <tbody>
        {stationaryChecks.map((check, index) => (
          <tr key={index} className="hover:bg-muted/30">
            <td className="border border-border px-2 py-1.5">{check.item}</td>
            <td className="border border-border px-2 py-1.5 text-xs">{check.action}</td>
            <td className="border border-border px-1 py-1">
              <Input className="h-6 text-xs border-0 bg-transparent" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface AreaInspectionSheetProps {
  area: AreaData;
  selectedHazards: string[];
  toggleHazard: (id: string) => void;
}

const AreaInspectionSheet = ({ area, selectedHazards, toggleHazard }: AreaInspectionSheetProps) => (
  <div className="bg-background min-h-full">
    <div className="border-2 border-border">
      {/* Banner with Title Overlay */}
      <div className="relative">
        <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
        <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
          <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-wide text-primary">{area.title}</h1>
            {area.subtitle && <p className="text-base mt-1 text-primary/80">{area.subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Header Information Grid */}
      <div className="grid grid-cols-2 border-b border-border text-xs">
        <div className="border-r border-border">
          <div className="grid grid-cols-[120px_1fr] border-b border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Start Date:</div>
            <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
          </div>
          <div className="grid grid-cols-[120px_1fr]">
            <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Finish Date:</div>
            <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-[120px_1fr] border-b border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Personnel:</div>
            <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
          </div>
          <div className="grid grid-cols-[120px_1fr]">
            <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
            <div className="px-2 py-1.5">Electrical</div>
          </div>
        </div>
      </div>

      {/* Safety Section */}
      <div className="border-b border-border">
        <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
          <Shield className="w-5 h-5 text-destructive" />
          <span className="text-destructive font-bold">SAFETY PRECAUTIONS</span>
        </div>
        <div className="px-4 py-4 bg-destructive/5">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>Conduct <span className="font-bold text-destructive">Take 5</span> and/or <span className="font-bold text-destructive">JSEA</span> as required.</span>
            </li>
            <li className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Ensure isolations and/or 'live testing' safeguards are in place before commencing.</span>
            </li>
            <li className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Follow OEM instructions and site procedures as required.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Hazard Identification */}
      <div className="border-b border-border">
        <div className="bg-amber-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span className="text-amber-700 font-bold">HAZARD IDENTIFICATION</span>
          <span className="text-xs text-muted-foreground ml-2">(Select all that apply)</span>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {hazardsList.map((hazard) => (
              <Toggle
                key={hazard.id}
                pressed={selectedHazards.includes(hazard.id)}
                onPressedChange={() => toggleHazard(hazard.id)}
                className="data-[state=on]:bg-amber-500 data-[state=on]:text-white border border-border px-3 py-2 gap-2"
                aria-label={`Toggle ${hazard.label} hazard`}
              >
                {hazard.icon}
                <span className="text-sm font-medium">{hazard.label}</span>
              </Toggle>
            ))}
          </div>
        </div>
      </div>

      {/* Tools and PPE Section */}
      <div className="border-b border-border grid md:grid-cols-2">
        <div className="border-r border-border">
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            SPECIAL TOOLING REQUIRED
          </div>
          <div className="p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <Checkbox className="h-4 w-4" defaultChecked />
                <span>Standard Electrical Tool Kit</span>
              </li>
              <li className="flex items-center gap-3">
                <Checkbox className="h-4 w-4" defaultChecked />
                <span>Grease Gun</span>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <HardHat className="w-4 h-4 text-primary" />
            REQUIRED PPE
          </div>
          <div className="p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <Checkbox className="h-4 w-4" defaultChecked />
                <span>Steel Cap Boots</span>
              </li>
              <li className="flex items-center gap-3">
                <Checkbox className="h-4 w-4" defaultChecked />
                <span>Safety Glasses</span>
              </li>
              <li className="flex items-center gap-3">
                <Checkbox className="h-4 w-4" defaultChecked />
                <span>Gloves</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Motor Sections */}
      {area.motors.map((motor, index) => (
        <MotorSection key={index} motor={motor} motorNumber={index + 1} />
      ))}

      {/* Sign Off Section */}
      <div className="border-t border-border">
        <div className="grid grid-cols-3 text-xs">
          <div className="grid grid-cols-[100px_1fr] border-r border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Inspected By:</div>
            <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
          </div>
          <div className="grid grid-cols-[100px_1fr] border-r border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Elect. Cert No:</div>
            <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
          </div>
          <div className="grid grid-cols-[60px_1fr]">
            <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
            <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface MotorInspectionsSheetsDocumentProps {
  areaId?: string;
}

export const MotorInspectionsSheetsDocument = ({ areaId }: MotorInspectionsSheetsDocumentProps) => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["electrical", "mechanical"]);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazards(prev => 
      prev.includes(hazardId) 
        ? prev.filter(id => id !== hazardId)
        : [...prev, hazardId]
    );
  };

  // Filter to specific area if provided
  const areasToShow = areaId 
    ? areaData.filter(area => area.id === areaId)
    : areaData;

  return (
    <div className="space-y-8">
      {areasToShow.map((area) => (
        <AreaInspectionSheet 
          key={area.id}
          area={area} 
          selectedHazards={selectedHazards}
          toggleHazard={toggleHazard}
        />
      ))}
    </div>
  );
};
