import { useState, useCallback, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";
import { FileText, Calendar, ChevronRight, Plus, PanelLeftClose, PanelLeft, Wrench, Zap, Printer, Truck, ClipboardCheck, RefreshCw, Database, Download, Loader2 } from "lucide-react";
import { exportSectionsToPdf } from "@/utils/sectionPdfExport";
import { PDF_EXPORT_OPTS } from "@/utils/pdfExportStandard";

import { supabase } from "@/integrations/supabase/client";
import { seedPMTasks } from "@/utils/seedPMTasks";
import { exportPMWorkbook } from "@/utils/exportPMWorkbook";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { canonicalPMs } from "@/components/pm-design/canonicalPMNames";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { PMBaseMasterTemplate } from "@/components/pm-design/PMBaseMasterTemplate";
import { FilterPressDailyOfflinePMDocument } from "@/components/pm-design/FilterPressDailyOfflinePMDocument";
import { MillDailyPMDocument } from "@/components/pm-design/MillDailyPMDocument";
import { ROPlantPMDocument } from "@/components/pm-design/ROPlantPMDocument";
import { AcidElutionPMDocument } from "@/components/pm-design/AcidElutionPMDocument";
import { AirWaterServicesPMDocument } from "@/components/pm-design/AirWaterServicesPMDocument";
import { BottomOfTanksPMDocument } from "@/components/pm-design/BottomOfTanksPMDocument";
import { DieselFarmPMDocument } from "@/components/pm-design/DieselFarmPMDocument";
import { FilterPressWeeklyPMDocument } from "@/components/pm-design/FilterPressWeeklyPMDocument";
import { GoldRoomPMDocument } from "@/components/pm-design/GoldRoomPMDocument";
import { GreaseOilsPMDocument } from "@/components/pm-design/GreaseOilsPMDocument";
import { MillWeeklyPMDocument } from "@/components/pm-design/MillWeeklyPMDocument";
import { PotableWaterPMDocument } from "@/components/pm-design/PotableWaterPMDocument";
import { ReagentsPMDocument } from "@/components/pm-design/ReagentsPMDocument";
import { ThickenerPMDocument } from "@/components/pm-design/ThickenerPMDocument";
import { TopOfTanksPMDocument } from "@/components/pm-design/TopOfTanksPMDocument";
import { AdminGeneratorPMDocument } from "@/components/pm-design/AdminGeneratorPMDocument";
import { AndyDamGeneratorPMDocument } from "@/components/pm-design/AndyDamGeneratorPMDocument";
import { JunoGeneratorPMDocument } from "@/components/pm-design/JunoGeneratorPMDocument";
import { LabGeneratorPMDocument } from "@/components/pm-design/LabGeneratorPMDocument";
import { PortableGeneratorsPMDocument } from "@/components/pm-design/PortableGeneratorsPMDocument";
import { ForkliftWeeklyPMDocument } from "@/components/pm-design/ForkliftWeeklyPMDocument";
import { EWPWeeklyPMDocument } from "@/components/pm-design/EWPWeeklyPMDocument";
import { CraneWeeklyPMDocument } from "@/components/pm-design/CraneWeeklyPMDocument";
import { WaterTruckWeeklyPMDocument } from "@/components/pm-design/WaterTruckWeeklyPMDocument";
import { LoaderWeeklyPMDocument } from "@/components/pm-design/LoaderWeeklyPMDocument";
import { ExcavatorDailyPMDocument } from "@/components/pm-design/ExcavatorDailyPMDocument";
import { ExcavatorWeeklyPMDocument } from "@/components/pm-design/ExcavatorWeeklyPMDocument";
import { MoxyDailyPMDocument } from "@/components/pm-design/MoxyDailyPMDocument";
import { MoxyWeeklyPMDocument } from "@/components/pm-design/MoxyWeeklyPMDocument";
import { DozerDailyPMDocument } from "@/components/pm-design/DozerDailyPMDocument";
import { DozerWeeklyPMDocument } from "@/components/pm-design/DozerWeeklyPMDocument";
import { LoaderDailyPMDocument } from "@/components/pm-design/LoaderDailyPMDocument";
import { PowerStationGeneratorWeeklyPMDocument } from "@/components/pm-design/PowerStationGeneratorWeeklyPMDocument";
import { TelehandlerWeeklyPMDocument } from "@/components/pm-design/TelehandlerWeeklyPMDocument";
import { LightingTowerDailyPMDocument } from "@/components/pm-design/LightingTowerDailyPMDocument";
import { ServiceTruckWeeklyPMDocument } from "@/components/pm-design/ServiceTruckWeeklyPMDocument";
import { SkidSteerWeeklyPMDocument } from "@/components/pm-design/SkidSteerWeeklyPMDocument";
import { FieldMCCInspectionsPMDocument } from "@/components/pm-design/FieldMCCInspectionsPMDocument";
import { FilterPressElectricalPMDocument } from "@/components/pm-design/FilterPressElectricalPMDocument";
import { IceMachineInspectionPMDocument } from "@/components/pm-design/IceMachineInspectionPMDocument";
import { PHProbeCalibrationPMDocument } from "@/components/pm-design/PHProbeCalibrationPMDocument";
import { SafetyShowerInspectionPMDocument } from "@/components/pm-design/SafetyShowerInspectionPMDocument";
import { SpareMillMotorInspectionPMDocument } from "@/components/pm-design/SpareMillMotorInspectionPMDocument";
import { VisualZoneChecksPMDocument } from "@/components/pm-design/VisualZoneChecksPMDocument";
import { SubstationInspectionPMDocument } from "@/components/pm-design/SubstationInspectionPMDocument";
import { ACInspectionPMDocument } from "@/components/pm-design/ACInspectionPMDocument";
import { ACInspectionMonthlyPMDocument } from "@/components/pm-design/ACInspectionMonthlyPMDocument";
import { GeneratorYearlyTestPMDocument } from "@/components/pm-design/GeneratorYearlyTestPMDocument";
import { PullWireChecksPMDocument } from "@/components/pm-design/PullWireChecksPMDocument";
import { RCDPushButtonTestPMDocument } from "@/components/pm-design/RCDPushButtonTestPMDocument";
import { RCDInjectionTestPMDocument } from "@/components/pm-design/RCDInjectionTestPMDocument";
import { SwitchboardInspectionPMDocument } from "@/components/pm-design/SwitchboardInspectionPMDocument";
import { CableTestSheetPMDocument } from "@/components/pm-design/CableTestSheetPMDocument";
import { EmergencyLightTestPMDocument } from "@/components/pm-design/EmergencyLightTestPMDocument";
import { FilterPressMotorInspectionPMDocument } from "@/components/pm-design/FilterPressMotorInspectionPMDocument";
import { FullTestSheetPMDocument } from "@/components/pm-design/FullTestSheetPMDocument";
import { RCDTestingSheetsDocument } from "@/components/pm-design/RCDTestingSheetsDocument";
import { RCDPushButtonTestingSheetsDocument } from "@/components/pm-design/RCDPushButtonTestingSheetsDocument";
import { RCDPushButtonInjectionTestSheetsDocument } from "@/components/pm-design/RCDPushButtonInjectionTestSheetsDocument";
import { CrusherFuelFarmGeneratorElectricalPMDocument } from "@/components/pm-design/CrusherFuelFarmGeneratorElectricalPMDocument";
import { FilterPressCompressorPMDocument } from "@/components/pm-design/FilterPressCompressorPMDocument";
import { FilterPressCompressorOfflinePMDocument } from "@/components/pm-design/FilterPressCompressorOfflinePMDocument";
import { FilterPressDailyOnlinePMDocument } from "@/components/pm-design/FilterPressDailyOnlinePMDocument";
import { BeltCalibrationPMDocument } from "@/components/pm-design/BeltCalibrationPMDocument";
import { WeldersVRDTestPMDocument } from "@/components/pm-design/WeldersVRDTestPMDocument";
import { LubePMDocument } from "@/components/pm-design/LubePMDocument";
import { lubePMTemplates } from "@/components/pm-design/lubePMData";

import { MotorInspectionsSheetsDocument } from "@/components/pm-design/MotorInspectionsSheetsDocument";

import { Button } from "@/components/ui/button";

type Discipline = "mechanical" | "electrical" | "mobile-equipment" | "lube";
type FrequencyGroup = "daily" | "1-week" | "2-week" | "4-week" | "6-week" | "12-week" | "26-week" | "52-week";
type ViewType = "master" | "filter-press-daily-offline" | "filter-press-daily-online" | "mill-daily" | "ro-plant-daily" | "acid-elution-weekly" | "air-water-services-weekly" | "bottom-of-tanks-weekly" | "diesel-farm-weekly" | "filter-press-weekly" | "filter-press-compressor-weekly" | "filter-press-compressor-offline-weekly" | "gold-room-weekly" | "grease-oils-weekly" | "mill-weekly" | "potable-water-weekly" | "reagents-weekly" | "thickener-weekly" | "top-of-tanks-weekly" | "admin-generator-weekly" | "nobles-natural-sump-generator-weekly" | "juno-generator-weekly" | "lab-generator-weekly" | "portable-generators-weekly" | "power-station-generator-weekly" | "forklift-weekly" | "ewp-weekly" | "crane-weekly" | "water-truck-weekly" | "loader-weekly" | "loader-daily" | "excavator-daily" | "excavator-weekly" | "moxy-daily" | "moxy-weekly" | "dozer-daily" | "dozer-weekly" | "telehandler-weekly" | "lighting-tower-daily" | "service-truck-weekly" | "skid-steer-weekly" | "field-mcc-inspections-weekly" | "filter-press-electrical-weekly" | "ice-machine-weekly" | "ph-probe-calibration-weekly" | "safety-shower-weekly" | "spare-mill-motor-weekly" | "visual-zone-checks-weekly" | "crusher-fuel-farm-generator-electrical-weekly" | "substation-2-weekly" | "ac-inspection-12-weekly" | "ac-inspection-4-weekly" | "generator-yearly-test" | "pull-wire-checks-12-weekly" | "rcd-pushbutton-12-weekly" | "rcd-injection-24-weekly" | "rcd-testing-admin" | "rcd-testing-juno-bore" | "rcd-testing-andys-dam" | "rcd-testing-lab" | "rcd-testing-crusher-fuel-farm" | "rcd-testing-crusher-workshop" | "rcd-3m-testing-admin" | "rcd-3m-testing-juno-bore" | "rcd-3m-testing-andys-dam" | "rcd-3m-testing-lab" | "rcd-3m-testing-crusher-workshop" | "rcd-3m-testing-crusher-fuel-farm" | "rcd-pb-injection-cip-tanks" | "rcd-pb-injection-crib-room" | "rcd-pb-injection-elution" | "rcd-pb-injection-filter-press" | "rcd-pb-injection-first-aid-room" | "rcd-pb-injection-lab" | "switchboard-52-weekly" | "cable-test-sheet" | "emergency-light-12-weekly" | "filter-press-motor-inspection" | "full-test-sheet" | "motor-inspections-filter-press" | "motor-inspections-gold-room" | "motor-inspections-kiln-area" | "motor-inspections-elution" | "motor-inspections-milling-area" | "motor-inspections-pwp" | "motor-inspections-services" | "motor-inspections-tanks" | "motor-inspections-thickener" | "belt-calibration-bc100-monthly" | "welders-vrd-test-12-weekly" | "lube-ball-mill-monthly" | "lube-conveyors-3monthly" | "lube-agitators-3monthly" | "lube-pumps-3monthly" | "lube-gantry-crane-3monthly" | "lube-thickener-3monthly" | "lube-compressors-6monthly" | "lube-rotary-valve-12monthly" | "lube-monorails-12monthly" | `${Discipline}-${FrequencyGroup}`;

const frequencyGroups = [
  { id: "daily" as FrequencyGroup, label: "DAILY", shortLabel: "D" },
  { id: "1-week" as FrequencyGroup, label: "1 WEEK", shortLabel: "1W" },
  { id: "2-week" as FrequencyGroup, label: "2 WEEK", shortLabel: "2W" },
  { id: "4-week" as FrequencyGroup, label: "4 WEEK", shortLabel: "4W" },
  { id: "6-week" as FrequencyGroup, label: "6 WEEK", shortLabel: "6W" },
  { id: "12-week" as FrequencyGroup, label: "12 WEEK", shortLabel: "12W" },
  { id: "26-week" as FrequencyGroup, label: "26 WEEK", shortLabel: "26W" },
  { id: "52-week" as FrequencyGroup, label: "52 WEEK", shortLabel: "52W" },
];

// Generator PMs grouped together
const generatorPMs = [
  { id: "admin-generator-weekly", name: "Admin Generator" },
  { id: "nobles-natural-sump-generator-weekly", name: "Nobles Natural Sump Generator" },
  { id: "juno-generator-weekly", name: "Juno Generator" },
  { id: "lab-generator-weekly", name: "Lab Generator" },
  { id: "portable-generators-weekly", name: "Portable Generators" },
  { id: "power-station-generator-weekly", name: "Power Station Generator" },
];

// Other equipment PMs (non-generator)
const otherWeeklyPMs = [
  { id: "acid-elution-weekly", name: "Acid Wash & Elution" },
  { id: "air-water-services-weekly", name: "Air & Water Services" },
  { id: "bottom-of-tanks-weekly", name: "Bottom of Tanks" },
  { id: "diesel-farm-weekly", name: "Diesel Farm" },
  { id: "filter-press-weekly", name: "Filter Press" },
  { id: "filter-press-compressor-weekly", name: "Filter Press Compressor (Online)" },
  { id: "filter-press-compressor-offline-weekly", name: "Filter Press Compressor (Offline)" },
  { id: "gold-room-weekly", name: "Gold Room" },
  { id: "grease-oils-weekly", name: "Grease & Oils" },
  { id: "mill-weekly", name: "Mill" },
  { id: "potable-water-weekly", name: "Potable Water" },
  { id: "reagents-weekly", name: "Reagents" },
  { id: "thickener-weekly", name: "Thickener" },
  { id: "top-of-tanks-weekly", name: "Top of Tanks" },
];

// Mobile Equipment Daily PMs
const mobileEquipmentDailyPMs = [
  { id: "dozer-daily", name: "CAT D8 Dozer" },
  { id: "excavator-daily", name: "Excavator" },
  { id: "lighting-tower-daily", name: "Lighting Tower" },
  { id: "loader-daily", name: "Loader" },
  { id: "moxy-daily", name: "Moxy" },
];

// Mobile Equipment Weekly PMs
const mobileEquipmentWeeklyPMs = [
  { id: "crane-weekly", name: "Crane" },
  { id: "dozer-weekly", name: "Dozer" },
  { id: "ewp-weekly", name: "EWP" },
  { id: "excavator-weekly", name: "Excavator" },
  { id: "forklift-weekly", name: "Forklift" },
  { id: "loader-weekly", name: "Loader" },
  { id: "moxy-weekly", name: "Moxy" },
  { id: "service-truck-weekly", name: "Service Truck" },
  { id: "skid-steer-weekly", name: "Skid Steer" },
  { id: "telehandler-weekly", name: "Telehandler" },
  { id: "water-truck-weekly", name: "Water Truck" },
];

const disciplines = [
  { 
    id: "mechanical" as Discipline, 
    label: "Mechanical PMs", 
    icon: Wrench,
    frequencies: {
      daily: { pms: [
        { id: "filter-press-daily-offline", name: "Filter Press Daily Offline Inspection" },
        { id: "filter-press-daily-online", name: "Filter Press Daily Online Inspection" },
        { id: "mill-daily", name: "Mill Daily Inspection" },
        { id: "ro-plant-daily", name: "RO Plant Daily Inspection" }
      ], subgroups: [] },
      "1-week": { 
        pms: [], // Individual PMs moved to subgroups
        subgroups: [
          { id: "generators", label: "Generators", pms: generatorPMs },
          { id: "equipment", label: "Equipment", pms: otherWeeklyPMs },
        ]
      },
    }
  },
  { 
    id: "electrical" as Discipline, 
    label: "Electrical PMs", 
    icon: Zap,
    frequencies: {
      "1-week": { 
        pms: [
          { id: "crusher-fuel-farm-generator-electrical-weekly", name: "Crusher Fuel Farm Generator" },
          { id: "field-mcc-inspections-weekly", name: "Field MCC Inspections" },
          { id: "filter-press-electrical-weekly", name: "Filter Press Electrical (Online)" },
          { id: "ice-machine-weekly", name: "Ice Machine" },
          { id: "ph-probe-calibration-weekly", name: "pH Probe Calibration" },
          { id: "safety-shower-weekly", name: "Safety Shower Inspection" },
          { id: "spare-mill-motor-weekly", name: "Spare Mill Motor Inspection" },
          { id: "visual-zone-checks-weekly", name: "Visual Zone Checks" },
        ],
        subgroups: [] 
      },
      "2-week": { 
        pms: [
          { id: "substation-2-weekly", name: "Substation Inspection" },
        ], 
        subgroups: [] 
      },
      "4-week": {
        pms: [
          { id: "ac-inspection-4-weekly", name: "AC Inspection & Filter Clean" },
          { id: "belt-calibration-bc100-monthly", name: "Weightometer Calibration" },
        ],
        subgroups: []
      },
      "6-week": {
        pms: [],
        subgroups: [
          {
            id: "motor-inspections",
            label: "Statutory Motor Inspections",
            pms: [
              { id: "motor-inspections-filter-press", name: "Filter Press" },
              { id: "motor-inspections-gold-room", name: "Gold Room" },
              { id: "motor-inspections-kiln-area", name: "Kiln Area" },
              { id: "motor-inspections-elution", name: "Elution" },
              { id: "motor-inspections-milling-area", name: "Milling Area" },
              { id: "motor-inspections-pwp", name: "Process Water Pond" },
              { id: "motor-inspections-services", name: "Services" },
              { id: "motor-inspections-tanks", name: "Tanks" },
              { id: "motor-inspections-thickener", name: "Thickener" },
            ]
          },
        ]
      },
      "12-week": { 
        pms: [
          { id: "ac-inspection-12-weekly", name: "Air Conditioner Service" },
          { id: "pull-wire-checks-12-weekly", name: "Pull Wire Checks" },
          { id: "rcd-pushbutton-12-weekly", name: "RCD Push-button Test" },
          { id: "emergency-light-12-weekly", name: "Emergency Light Test" },
          { id: "welders-vrd-test-12-weekly", name: "Welders VRD Test & Tag" },
        ], 
        subgroups: [
          { 
            id: "rcd-3m-testing", 
            label: "3M RCD Testing Sheets", 
            pms: [
              { id: "rcd-3m-testing-admin", name: "Admin Generator" },
              { id: "rcd-3m-testing-juno-bore", name: "Juno Generator" },
              { id: "rcd-3m-testing-andys-dam", name: "Nobles Natural Sump Generator" },
              { id: "rcd-3m-testing-lab", name: "Lab Generator" },
              { id: "rcd-3m-testing-crusher-workshop", name: "Crusher Workshop Generator" },
              { id: "rcd-3m-testing-crusher-fuel-farm", name: "Crusher Fuel Farm Generator" },
            ] 
          },
        ]
      },
      "26-week": { 
        pms: [
          { id: "rcd-injection-24-weekly", name: "RCD Injection Test" },
        ], 
        subgroups: [
          { 
            id: "rcd-testing", 
            label: "RCD Generator Testing Sheets", 
            pms: [
              { id: "rcd-testing-admin", name: "Admin Generator" },
              { id: "rcd-testing-juno-bore", name: "Juno Generator" },
              { id: "rcd-testing-andys-dam", name: "Nobles Natural Sump Generator" },
              { id: "rcd-testing-lab", name: "Lab Generator" },
              { id: "rcd-testing-crusher-fuel-farm", name: "Crusher Fuel Farm Generator" },
              { id: "rcd-testing-crusher-workshop", name: "Crusher Workshop Generator" },
            ] 
          },
          {
            id: "rcd-pb-injection",
            label: "RCD Push-button & Injection Test",
            pms: [
              { id: "rcd-pb-injection-cip-tanks", name: "CIP Tanks / Titration Hut" },
              { id: "rcd-pb-injection-crib-room", name: "Crib Room / SB-002E" },
              { id: "rcd-pb-injection-elution", name: "Elution / MCC-130" },
              { id: "rcd-pb-injection-filter-press", name: "Filter Press / MCC-125" },
              { id: "rcd-pb-injection-first-aid-room", name: "First Aid Room / SB-002G" },
              { id: "rcd-pb-injection-lab", name: "Lab / SB-105A" },
            ]
          },
        ]
      },
      "52-week": { 
        pms: [
          { id: "generator-yearly-test", name: "Generator Electrical Test" },
          { id: "switchboard-52-weekly", name: "Switchboard Inspection" },
          { id: "cable-test-sheet", name: "Cable Test Sheet" },
          { id: "full-test-sheet", name: "Full Test Sheet" },
        ], 
        subgroups: []
      },
    },
    // Standalone groups that appear directly under the discipline (not under a frequency)
    standaloneGroups: []
  },
  { 
    id: "mobile-equipment" as Discipline, 
    label: "Mobile Equipment", 
    icon: Truck,
    frequencies: {
      daily: { pms: mobileEquipmentDailyPMs, subgroups: [] },
      "1-week": { 
        pms: mobileEquipmentWeeklyPMs,
        subgroups: []
      },
    }
  },
  {
    id: "lube" as Discipline,
    label: "Lube PMs",
    icon: RefreshCw,
    frequencies: {
      "4-week": {
        pms: lubePMTemplates.filter((t) => t.frequencyGroup === "4-week").map((t) => ({ id: t.id, name: t.name })),
        subgroups: [],
      },
      "12-week": {
        pms: lubePMTemplates.filter((t) => t.frequencyGroup === "12-week").map((t) => ({ id: t.id, name: t.name })),
        subgroups: [],
      },
      "26-week": {
        pms: lubePMTemplates.filter((t) => t.frequencyGroup === "26-week").map((t) => ({ id: t.id, name: t.name })),
        subgroups: [],
      },
      "52-week": {
        pms: lubePMTemplates.filter((t) => t.frequencyGroup === "52-week").map((t) => ({ id: t.id, name: t.name })),
        subgroups: [],
      },
    },
  },
];

// Helper to calculate PM count for a frequency
const getFrequencyCount = (freqData: { pms: any[]; subgroups: { pms: any[] }[] }) => {
  const directPMs = freqData.pms?.length || 0;
  const subgroupPMs = freqData.subgroups?.reduce((sum, sg) => sum + (sg.pms?.length || 0), 0) || 0;
  return directPMs + subgroupPMs;
};

const PMDesign = () => {
  const [activeView, setActiveView] = useState<ViewType>("filter-press-daily-offline");
  const [expandedDisciplines, setExpandedDisciplines] = useState<Discipline[]>(["mechanical"]);
  const [expandedFrequencies, setExpandedFrequencies] = useState<string[]>(["mechanical-daily", "mechanical-1-week"]);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const pmDocRef = useRef<HTMLDivElement>(null);

  const toggleDiscipline = (disciplineId: Discipline) => {
    setExpandedDisciplines(prev => 
      prev.includes(disciplineId) 
        ? prev.filter(id => id !== disciplineId)
        : [...prev, disciplineId]
    );
  };

  const toggleFrequency = (key: string) => {
    setExpandedFrequencies(prev => 
      prev.includes(key) 
        ? prev.filter(id => id !== key)
        : [...prev, key]
    );
  };

  const getActiveFrequencyLabel = () => {
    if (activeView === "master" || activeView === "mill-daily") return null;
    const parts = activeView.split("-");
    const discipline = parts[0];
    const frequency = parts.slice(1).join("-");
    const freq = frequencyGroups.find(f => f.id === frequency);
    const disc = disciplines.find(d => d.id === discipline);
    return { discipline: disc?.label, frequency: freq?.label };
  };

  const navigate = useNavigate();

  const handlePrint = () => {
    navigate(`/pm-print/${activeView}`);
  };

  const handleDownloadPdf = useCallback(async () => {
    const container = pmDocRef.current;
    if (!container) return;
    setIsDownloading(true);
    try {
      const title = getDocumentTitle().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
      const filename = `TCMG_${title}.pdf`;
      const exportOpts =
        activeView === "ro-plant-daily"
          ? {
              ...PDF_EXPORT_OPTS,
              sectionSelector: "[data-pdf-flow-container], [data-pdf-component='pm-footer-block']",
            }
          : {
              ...PDF_EXPORT_OPTS,
              // Capture the entire PM document as ONE canvas so content flows
              // continuously across pages with row-snapping (no big gaps).
              sectionSelector: ".border-2.border-border",
            };
      await exportSectionsToPdf(container, filename, exportOpts);
      toast.success(`Downloaded ${filename}`);
    } catch (err: any) {
      toast.error("PDF download failed: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  }, [activeView]);

  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedTasks = useCallback(async () => {
    setIsSeeding(true);
    try {
      await seedPMTasks();
    } finally {
      setIsSeeding(false);
    }
  }, []);

  const handleSyncPMs = useCallback(async () => {
    setIsSyncing(true);
    try {
      // 1. Fetch current DB records
      const { data: existing, error: fetchError } = await supabase
        .from("pm_master_list")
        .select("id, pm_name, asset_number, resources");
      if (fetchError) throw fetchError;

      const existingMap = new Map((existing ?? []).map((r: any) => [r.pm_name, r]));
      const canonicalNames = new Set(canonicalPMs.map((c) => c.pmName));

      // 2. Upsert missing PMs (preserve existing asset_number & resources)
      const toInsert = canonicalPMs.filter((c) => !existingMap.has(c.pmName));
      if (toInsert.length > 0) {
        const rows = toInsert.map((c) => ({
          pm_name: c.pmName,
          discipline: c.discipline,
          frequency: c.frequency,
          equipment_type: c.equipmentType,
          asset_number: "",
          resources: "",
        }));
        const { error: insertError } = await supabase.from("pm_master_list").insert(rows as any);
        if (insertError) throw insertError;
      }

      // 3. Delete orphaned records (not in canonical list)
      const toDelete = (existing ?? []).filter((r: any) => !canonicalNames.has(r.pm_name));
      if (toDelete.length > 0) {
        const ids = toDelete.map((r: any) => r.id);
        const { error: deleteError } = await supabase
          .from("pm_master_list")
          .delete()
          .in("id", ids);
        if (deleteError) throw deleteError;
      }

      await queryClient.invalidateQueries({ queryKey: ["pm-master-list"] });
      toast.success(
        `PM Sync Complete: ${toInsert.length} added, ${toDelete.length} removed, ${canonicalPMs.length - toInsert.length} preserved`
      );
    } catch (err: any) {
      toast.error("Sync failed: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [queryClient]);

  const getDocumentTitle = () => {
    switch (activeView) {
      case "master": return "Base PM Template";
      case "filter-press-daily-offline": return "Filter Press Daily Offline Inspection";
      case "filter-press-daily-online": return "Filter Press Daily Online Inspection";
      case "mill-daily": return "Mill Daily Inspection";
      case "ro-plant-daily": return "RO Plant Daily Inspection";
      case "acid-elution-weekly": return "Acid Wash & Elution Weekly Inspection";
      case "air-water-services-weekly": return "Air & Water Services Weekly Inspection";
      case "bottom-of-tanks-weekly": return "Bottom of Tanks Weekly Inspection";
      case "diesel-farm-weekly": return "Diesel Farm Weekly Inspection";
      case "filter-press-weekly": return "Filter Press Weekly Inspection";
      case "filter-press-compressor-weekly": return "Filter Press Compressor Online Inspection";
      case "filter-press-compressor-offline-weekly": return "Filter Press Compressor Offline Inspection";
      case "gold-room-weekly": return "Gold Room Weekly Inspection";
      case "grease-oils-weekly": return "Grease & Oils Weekly Inspection";
      case "mill-weekly": return "Mill Weekly Inspection";
      case "potable-water-weekly": return "Potable Water Weekly Inspection";
      case "reagents-weekly": return "Reagents Weekly Inspection";
      case "thickener-weekly": return "Thickener Weekly Inspection";
      case "top-of-tanks-weekly": return "Top of Tanks Weekly Inspection";
      case "admin-generator-weekly": return "Admin Generator Weekly Inspection";
      case "nobles-natural-sump-generator-weekly": return "Nobles Natural Sump Generator Weekly Inspection";
      case "juno-generator-weekly": return "Juno Generator Weekly Inspection";
      case "lab-generator-weekly": return "Lab Generator Weekly Inspection";
      case "portable-generators-weekly": return "Portable Generators Weekly Inspection";
      case "power-station-generator-weekly": return "Power Station Generator Weekly Inspection";
      case "forklift-weekly": return "Forklift Weekly Inspection";
      case "ewp-weekly": return "EWP Weekly Inspection";
      case "crane-weekly": return "Crane Weekly Inspection";
      case "water-truck-weekly": return "Water Truck Weekly Inspection";
      case "loader-weekly": return "Loader Weekly Inspection";
      case "telehandler-weekly": return "Telehandler Weekly Inspection";
      case "dozer-daily": return "CAT D8 Dozer Daily Inspection";
      case "loader-daily": return "Loader Daily Inspection";
      case "excavator-daily": return "Excavator Daily Inspection";
      case "excavator-weekly": return "Excavator Weekly Inspection";
      case "moxy-daily": return "Moxy Daily Inspection";
      case "moxy-weekly": return "Moxy Weekly Inspection";
      case "lighting-tower-daily": return "Diesel Lighting Tower Daily Inspection";
      case "service-truck-weekly": return "Service Truck Weekly Inspection";
      case "skid-steer-weekly": return "Skid Steer Weekly Inspection";
      case "field-mcc-inspections-weekly": return "Field MCC Inspections Weekly";
      case "filter-press-electrical-weekly": return "Filter Press Electrical Weekly";
      case "ice-machine-weekly": return "Ice Machine Weekly Inspection";
      case "ph-probe-calibration-weekly": return "pH Probe Calibration Weekly";
      case "safety-shower-weekly": return "Safety Shower Inspection Weekly";
      case "spare-mill-motor-weekly": return "Spare Mill Motor Inspection Weekly";
      case "visual-zone-checks-weekly": return "Visual Zone Checks Weekly";
      case "crusher-fuel-farm-generator-electrical-weekly": return "Crusher Fuel Farm Generator Electrical Weekly";
      case "substation-2-weekly": return "Substation Inspection (2 Weekly)";
      case "ac-inspection-12-weekly": return "Air Conditioner Service (12 Week)";
      case "pull-wire-checks-12-weekly": return "Pull Wire Checks (12 Week)";
      case "rcd-pushbutton-12-weekly": return "RCD Push-button Test (12 Week)";
      case "rcd-injection-24-weekly": return "RCD Injection Test (26 Week)";
      case "rcd-testing-admin": return "Admin Generator RCD Test (26 Week)";
      case "rcd-testing-juno-bore": return "Juno Generator RCD Test (26 Week)";
      case "rcd-testing-andys-dam": return "Nobles Natural Sump Generator RCD Test (26 Week)";
      case "rcd-testing-lab": return "Lab Generator RCD Test (26 Week)";
      case "rcd-testing-crusher-fuel-farm": return "Crusher Fuel Farm Generator RCD Test (26 Week)";
      case "rcd-testing-crusher-workshop": return "Crusher Workshop Generator RCD Test (26 Week)";
      case "rcd-pb-injection-cip-tanks": return "CIP Tanks / Titration Hut RCD Test (26 Week)";
      case "rcd-pb-injection-crib-room": return "Crib Room / SB-002E RCD Test (26 Week)";
      case "rcd-pb-injection-elution": return "Elution / MCC-130 RCD Test (26 Week)";
      case "rcd-pb-injection-filter-press": return "Filter Press / MCC-125 RCD Test (26 Week)";
      case "rcd-pb-injection-first-aid-room": return "First Aid Room / SB-002G RCD Test (26 Week)";
      case "rcd-pb-injection-lab": return "Lab / SB-105A RCD Test (26 Week)";
      case "generator-yearly-test": return "Generator Electrical Inspection (52 Week)";
      case "switchboard-52-weekly": return "Switchboard Inspection (52 Week)";
      case "cable-test-sheet": return "Cable Test Sheet";
      case "emergency-light-12-weekly": return "Emergency Light Test (12 Week)";
      case "filter-press-motor-inspection": return "Filter Press Motor Inspection (52 Week)";
      case "full-test-sheet": return "Full Test Sheet";
      case "motor-inspections-filter-press": return "Filter Press Motor Inspection";
      case "motor-inspections-gold-room": return "Gold Room Motor Inspection";
      case "motor-inspections-kiln-area": return "Kiln Area Motor Inspection";
      case "motor-inspections-elution": return "Elution Motor Inspection";
      case "motor-inspections-milling-area": return "Milling Area Motor Inspection";
      case "motor-inspections-pwp": return "Process Water Pond Motor Inspection";
      case "motor-inspections-services": return "Services Motor Inspection";
      case "motor-inspections-tanks": return "Tanks Motor Inspection";
      case "rcd-3m-testing-admin": return "Admin Generator RCD Test (12 Week)";
      case "rcd-3m-testing-juno-bore": return "Juno Generator RCD Test (12 Week)";
      case "rcd-3m-testing-andys-dam": return "Nobles Natural Sump Generator RCD Test (12 Week)";
      case "rcd-3m-testing-lab": return "Lab Generator RCD Test (12 Week)";
      case "rcd-3m-testing-crusher-workshop": return "Crusher Workshop Generator RCD Test (12 Week)";
      case "rcd-3m-testing-crusher-fuel-farm": return "Crusher Fuel Farm Generator RCD Test (12 Week)";
      case "belt-calibration-bc100-monthly": return "Weightometer Calibration (4 Week)";
      case "ac-inspection-4-weekly": return "AC Inspection & Filter Clean (4 Week)";
      default: {
        const lubeTemplate = lubePMTemplates.find((t) => t.id === activeView);
        if (lubeTemplate) return lubeTemplate.title;
        return "PM Document";
      }
    }
  };

  const renderPMDocument = () => {
    switch (activeView) {
      case "master":
        return <PMBaseMasterTemplate />;
      case "filter-press-daily-offline":
        return <FilterPressDailyOfflinePMDocument />;
      case "filter-press-daily-online":
        return <FilterPressDailyOnlinePMDocument />;
      case "mill-daily":
        return <MillDailyPMDocument />;
      case "ro-plant-daily":
        return <ROPlantPMDocument />;
      case "acid-elution-weekly":
        return <AcidElutionPMDocument />;
      case "air-water-services-weekly":
        return <AirWaterServicesPMDocument />;
      case "bottom-of-tanks-weekly":
        return <BottomOfTanksPMDocument />;
      case "diesel-farm-weekly":
        return <DieselFarmPMDocument />;
      case "filter-press-weekly":
        return <FilterPressWeeklyPMDocument />;
      case "filter-press-compressor-weekly":
        return <FilterPressCompressorPMDocument />;
      case "filter-press-compressor-offline-weekly":
        return <FilterPressCompressorOfflinePMDocument />;
      case "gold-room-weekly":
        return <GoldRoomPMDocument />;
      case "grease-oils-weekly":
        return <GreaseOilsPMDocument />;
      case "mill-weekly":
        return <MillWeeklyPMDocument />;
      case "potable-water-weekly":
        return <PotableWaterPMDocument />;
      case "reagents-weekly":
        return <ReagentsPMDocument />;
      case "thickener-weekly":
        return <ThickenerPMDocument />;
      case "top-of-tanks-weekly":
        return <TopOfTanksPMDocument />;
      case "admin-generator-weekly":
        return <AdminGeneratorPMDocument />;
      case "nobles-natural-sump-generator-weekly":
        return <AndyDamGeneratorPMDocument />;
      case "juno-generator-weekly":
        return <JunoGeneratorPMDocument />;
      case "lab-generator-weekly":
        return <LabGeneratorPMDocument />;
      case "portable-generators-weekly":
        return <PortableGeneratorsPMDocument />;
      case "power-station-generator-weekly":
        return <PowerStationGeneratorWeeklyPMDocument />;
      case "forklift-weekly":
        return <ForkliftWeeklyPMDocument />;
      case "ewp-weekly":
        return <EWPWeeklyPMDocument />;
      case "crane-weekly":
        return <CraneWeeklyPMDocument />;
      case "water-truck-weekly":
        return <WaterTruckWeeklyPMDocument />;
      case "loader-weekly":
        return <LoaderWeeklyPMDocument />;
      case "telehandler-weekly":
        return <TelehandlerWeeklyPMDocument />;
      case "dozer-daily":
        return <DozerDailyPMDocument />;
      case "loader-daily":
        return <LoaderDailyPMDocument />;
      case "dozer-weekly":
        return <DozerWeeklyPMDocument />;
      case "excavator-daily":
        return <ExcavatorDailyPMDocument />;
      case "excavator-weekly":
        return <ExcavatorWeeklyPMDocument />;
      case "moxy-daily":
        return <MoxyDailyPMDocument />;
      case "moxy-weekly":
        return <MoxyWeeklyPMDocument />;
      case "lighting-tower-daily":
        return <LightingTowerDailyPMDocument />;
      case "service-truck-weekly":
        return <ServiceTruckWeeklyPMDocument />;
      case "skid-steer-weekly":
        return <SkidSteerWeeklyPMDocument />;
      case "field-mcc-inspections-weekly":
        return <FieldMCCInspectionsPMDocument />;
      case "filter-press-electrical-weekly":
        return <FilterPressElectricalPMDocument />;
      case "ice-machine-weekly":
        return <IceMachineInspectionPMDocument />;
      case "ph-probe-calibration-weekly":
        return <PHProbeCalibrationPMDocument />;
      case "safety-shower-weekly":
        return <SafetyShowerInspectionPMDocument />;
      case "spare-mill-motor-weekly":
        return <SpareMillMotorInspectionPMDocument />;
      case "visual-zone-checks-weekly":
        return <VisualZoneChecksPMDocument />;
      case "crusher-fuel-farm-generator-electrical-weekly":
        return <CrusherFuelFarmGeneratorElectricalPMDocument />;
      case "substation-2-weekly":
        return <SubstationInspectionPMDocument />;
      case "ac-inspection-12-weekly":
        return <ACInspectionPMDocument />;
      case "ac-inspection-4-weekly":
        return <ACInspectionMonthlyPMDocument />;
      case "generator-yearly-test":
        return <GeneratorYearlyTestPMDocument />;
      case "pull-wire-checks-12-weekly":
        return <PullWireChecksPMDocument />;
      case "rcd-pushbutton-12-weekly":
        return <RCDPushButtonTestPMDocument />;
      case "rcd-injection-24-weekly":
        return <RCDInjectionTestPMDocument />;
      case "rcd-testing-admin":
        return <RCDTestingSheetsDocument locationId="admin" />;
      case "rcd-testing-juno-bore":
        return <RCDTestingSheetsDocument locationId="juno-bore" />;
      case "rcd-testing-andys-dam":
        return <RCDTestingSheetsDocument locationId="andys-dam" />;
      case "rcd-testing-lab":
        return <RCDTestingSheetsDocument locationId="lab" />;
      case "rcd-testing-crusher-fuel-farm":
        return <RCDTestingSheetsDocument locationId="crusher-fuel-farm" />;
      case "rcd-testing-crusher-workshop":
        return <RCDTestingSheetsDocument locationId="crusher-workshop" />;
      case "rcd-pb-injection-cip-tanks":
        return <RCDPushButtonInjectionTestSheetsDocument locationId="cip-tanks" />;
      case "rcd-pb-injection-crib-room":
        return <RCDPushButtonInjectionTestSheetsDocument locationId="crib-room" />;
      case "rcd-pb-injection-elution":
        return <RCDPushButtonInjectionTestSheetsDocument locationId="elution-mcc-130" />;
      case "rcd-pb-injection-filter-press":
        return <RCDPushButtonInjectionTestSheetsDocument locationId="filter-press-mcc-125" />;
      case "rcd-pb-injection-first-aid-room":
        return <RCDPushButtonInjectionTestSheetsDocument locationId="first-aid-room" />;
      case "rcd-pb-injection-lab":
        return <RCDPushButtonInjectionTestSheetsDocument locationId="lab" />;
      case "switchboard-52-weekly":
        return <SwitchboardInspectionPMDocument />;
      case "cable-test-sheet":
        return <CableTestSheetPMDocument />;
      case "emergency-light-12-weekly":
        return <EmergencyLightTestPMDocument />;
      case "filter-press-motor-inspection":
        return <FilterPressMotorInspectionPMDocument />;
      case "full-test-sheet":
        return <FullTestSheetPMDocument />;
      case "motor-inspections-filter-press":
        return <MotorInspectionsSheetsDocument areaId="filter-press" />;
      case "motor-inspections-gold-room":
        return <MotorInspectionsSheetsDocument areaId="gold-room" />;
      case "motor-inspections-kiln-area":
        return <MotorInspectionsSheetsDocument areaId="kiln-area" />;
      case "motor-inspections-elution":
        return <MotorInspectionsSheetsDocument areaId="elution" />;
      case "motor-inspections-milling-area":
        return <MotorInspectionsSheetsDocument areaId="milling-area" />;
      case "motor-inspections-pwp":
        return <MotorInspectionsSheetsDocument areaId="pwp" />;
      case "motor-inspections-services":
        return <MotorInspectionsSheetsDocument areaId="services" />;
      case "motor-inspections-tanks":
        return <MotorInspectionsSheetsDocument areaId="tanks" />;
      case "motor-inspections-thickener":
        return <MotorInspectionsSheetsDocument areaId="thickener" />;
      case "rcd-3m-testing-admin":
        return <RCDPushButtonTestingSheetsDocument locationId="admin" />;
      case "rcd-3m-testing-juno-bore":
        return <RCDPushButtonTestingSheetsDocument locationId="juno-bore" />;
      case "rcd-3m-testing-andys-dam":
        return <RCDPushButtonTestingSheetsDocument locationId="andys-dam" />;
      case "rcd-3m-testing-lab":
        return <RCDPushButtonTestingSheetsDocument locationId="lab" />;
      case "rcd-3m-testing-crusher-workshop":
        return <RCDPushButtonTestingSheetsDocument locationId="crusher-workshop" />;
      case "rcd-3m-testing-crusher-fuel-farm":
        return <RCDPushButtonTestingSheetsDocument locationId="crusher-fuel-farm" />;
      case "belt-calibration-bc100-monthly":
        return <BeltCalibrationPMDocument />;
      case "welders-vrd-test-12-weekly":
        return <WeldersVRDTestPMDocument />;
      default: {
        if (activeView.startsWith("lube-")) {
          return <LubePMDocument templateId={activeView} />;
        }
        return null;
      }
    }
  };

  const lubeViewIds = lubePMTemplates.map((t) => t.id);
  const isPMDocument = ["master", "filter-press-daily-offline", "filter-press-daily-online", "mill-daily", "ro-plant-daily", "acid-elution-weekly", "air-water-services-weekly", "bottom-of-tanks-weekly", "diesel-farm-weekly", "filter-press-weekly", "filter-press-compressor-weekly", "filter-press-compressor-offline-weekly", "gold-room-weekly", "grease-oils-weekly", "mill-weekly", "potable-water-weekly", "reagents-weekly", "thickener-weekly", "top-of-tanks-weekly", "admin-generator-weekly", "nobles-natural-sump-generator-weekly", "juno-generator-weekly", "lab-generator-weekly", "portable-generators-weekly", "power-station-generator-weekly", "forklift-weekly", "ewp-weekly", "crane-weekly", "water-truck-weekly", "loader-weekly", "loader-daily", "telehandler-weekly", "dozer-daily", "dozer-weekly", "excavator-daily", "excavator-weekly", "moxy-daily", "moxy-weekly", "lighting-tower-daily", "service-truck-weekly", "skid-steer-weekly", "field-mcc-inspections-weekly", "filter-press-electrical-weekly", "ice-machine-weekly", "ph-probe-calibration-weekly", "safety-shower-weekly", "spare-mill-motor-weekly", "visual-zone-checks-weekly", "crusher-fuel-farm-generator-electrical-weekly", "substation-2-weekly", "ac-inspection-4-weekly", "ac-inspection-12-weekly", "pull-wire-checks-12-weekly", "rcd-pushbutton-12-weekly", "rcd-injection-24-weekly", "rcd-testing-admin", "rcd-testing-juno-bore", "rcd-testing-andys-dam", "rcd-testing-lab", "rcd-testing-crusher-fuel-farm", "rcd-testing-crusher-workshop", "rcd-3m-testing-admin", "rcd-3m-testing-juno-bore", "rcd-3m-testing-andys-dam", "rcd-3m-testing-lab", "rcd-3m-testing-crusher-workshop", "rcd-3m-testing-crusher-fuel-farm", "rcd-pb-injection-cip-tanks", "rcd-pb-injection-crib-room", "rcd-pb-injection-elution", "rcd-pb-injection-filter-press", "rcd-pb-injection-first-aid-room", "rcd-pb-injection-lab", "generator-yearly-test", "switchboard-52-weekly", "cable-test-sheet", "emergency-light-12-weekly", "filter-press-motor-inspection", "full-test-sheet", "motor-inspections-filter-press", "motor-inspections-gold-room", "motor-inspections-kiln-area", "motor-inspections-elution", "motor-inspections-milling-area", "motor-inspections-pwp", "motor-inspections-services", "motor-inspections-tanks", "motor-inspections-thickener", "belt-calibration-bc100-monthly", "welders-vrd-test-12-weekly", ...lubeViewIds].includes(activeView);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PMSidebarContent 
          activeView={activeView} 
          setActiveView={setActiveView}
          expandedDisciplines={expandedDisciplines}
          toggleDiscipline={toggleDiscipline}
          expandedFrequencies={expandedFrequencies}
          toggleFrequency={toggleFrequency}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {isPMDocument ? (
            <div className="p-6 overflow-auto">
              <div className="flex justify-end mb-4">
                <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              </div>
              <div ref={pmDocRef}>
                {renderPMDocument()}
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                {(() => {
                  const labels = getActiveFrequencyLabel();
                  return (
                    <>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {labels?.discipline} - {labels?.frequency}
                      </h2>
                      <p className="text-muted-foreground mb-8">
                        PMs in this frequency group will appear here once created.
                      </p>
                    </>
                  );
                })()}
                
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No PMs Created Yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first PM using the Base PM Template
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    Create PM
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

      </div>
    </SidebarProvider>
  );
};

// Sidebar Component
const PMSidebarContent = ({ 
  activeView, 
  setActiveView, 
  expandedDisciplines,
  toggleDiscipline,
  expandedFrequencies,
  toggleFrequency,
}: { 
  activeView: ViewType; 
  setActiveView: (view: ViewType) => void;
  expandedDisciplines: Discipline[];
  toggleDiscipline: (disciplineId: Discipline) => void;
  expandedFrequencies: string[];
  toggleFrequency: (key: string) => void;
}) => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="w-64 border-r border-border" collapsible="icon">
      <SidebarContent className="pt-4">
        {/* Collapse Toggle */}
        <div className="px-4 mb-2 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Header */}
        {!isCollapsed && (
          <div className="px-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PM</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">PM Design</h1>
                <p className="text-xs text-muted-foreground">Structure & Templates</p>
              </div>
            </div>
          </div>
        )}

        {/* Master Template */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
              Template
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveView("master")}
                  tooltip="Base PM Template"
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-3",
                    activeView === "master" && "bg-primary/10 text-primary border-l-2 border-primary"
                  )}
                >
                  <FileText className="w-4 h-4" />
                  {!isCollapsed && <span className="font-medium">Base PM Template</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Discipline Groups */}
        <SidebarGroup className="mt-4">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
              By Discipline
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <div className="space-y-1 px-2">
              {disciplines.map((discipline) => {
                const DisciplineIcon = discipline.icon;
                const frequencyPMs = Object.values(discipline.frequencies).reduce((sum, f) => sum + getFrequencyCount(f), 0);
                const standalonePMs = (discipline as any).standaloneGroups?.reduce((sum: number, sg: any) => sum + (sg.pms?.length || 0), 0) || 0;
                const totalPMs = frequencyPMs + standalonePMs;
                
                return (
                  <Collapsible
                    key={discipline.id}
                    open={expandedDisciplines.includes(discipline.id)}
                    onOpenChange={() => toggleDiscipline(discipline.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div
                        className={cn(
                          "flex items-center justify-between w-full px-2 py-2.5 rounded-md text-sm transition-colors",
                          "hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <DisciplineIcon className={cn(
                            "w-4 h-4",
                            discipline.id === "mechanical" ? "text-orange-500" : 
                            discipline.id === "electrical" ? "text-blue-500" : 
                            discipline.id === "lube" ? "text-amber-500" : "text-green-500"
                          )} />
                          {!isCollapsed && <span className="font-semibold">{discipline.label}</span>}
                        </div>
                        {!isCollapsed && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {totalPMs}
                            </span>
                            <ChevronRight 
                              className={cn(
                                "w-4 h-4 text-muted-foreground transition-transform",
                                expandedDisciplines.includes(discipline.id) && "rotate-90"
                              )} 
                            />
                          </div>
                        )}
                      </div>
                    </CollapsibleTrigger>
                    {!isCollapsed && (
                      <CollapsibleContent>
                        <div className="ml-4 py-1 space-y-0.5">
                          {frequencyGroups.map((freq) => {
                            const freqKey = `${discipline.id}-${freq.id}`;
                            const freqData = discipline.frequencies[freq.id as keyof typeof discipline.frequencies];
                            
                            // Skip if this frequency doesn't exist for this discipline
                            if (!freqData) return null;
                            
                            const freqCount = getFrequencyCount(freqData);
                            
                            return (
                              <Collapsible
                                key={freqKey}
                                open={expandedFrequencies.includes(freqKey)}
                                onOpenChange={() => toggleFrequency(freqKey)}
                              >
                                <CollapsibleTrigger className="w-full">
                                  <div
                                    className={cn(
                                      "flex items-center justify-between w-full px-2 py-2 rounded-md text-sm transition-colors",
                                      "hover:bg-muted/50",
                                      activeView === freqKey && "bg-primary/10 text-primary"
                                    )}
                                    onClick={(e) => {
                                      if (freqCount === 0) {
                                        e.stopPropagation();
                                        setActiveView(freqKey as ViewType);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                      <span className="text-sm">{freq.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={cn(
                                        "text-xs px-1.5 py-0.5 rounded",
                                        freqCount > 0 
                                          ? "bg-primary/10 text-primary" 
                                          : "bg-muted text-muted-foreground"
                                      )}>
                                        {freqCount}
                                      </span>
                                      {freqCount > 0 && (
                                        <ChevronRight 
                                          className={cn(
                                            "w-3.5 h-3.5 text-muted-foreground transition-transform",
                                            expandedFrequencies.includes(freqKey) && "rotate-90"
                                          )} 
                                        />
                                      )}
                                    </div>
                                  </div>
                                </CollapsibleTrigger>
                                {freqCount > 0 && (
                                  <CollapsibleContent>
                                    <div className="ml-5 py-1 pl-3 border-l border-border space-y-1">
                                      {/* Render direct PMs first */}
                                      {freqData.pms && freqData.pms.length > 0 && freqData.pms.map((pm) => (
                                        <button
                                          key={pm.id}
                                          onClick={() => setActiveView(pm.id as ViewType)}
                                          className={cn(
                                            "text-xs text-left w-full py-1.5 px-2 rounded transition-colors",
                                            activeView === pm.id 
                                              ? "text-primary bg-primary/10" 
                                              : "text-foreground hover:text-primary hover:bg-muted/50"
                                          )}
                                        >
                                          {pm.name}
                                        </button>
                                      ))}
                                      {/* Then render subgroups if they exist */}
                                      {freqData.subgroups && freqData.subgroups.length > 0 && freqData.subgroups.map((subgroup) => (
                                        <Collapsible
                                          key={subgroup.id}
                                          open={expandedFrequencies.includes(`${freqKey}-${subgroup.id}`)}
                                          onOpenChange={() => toggleFrequency(`${freqKey}-${subgroup.id}`)}
                                        >
                                          <CollapsibleTrigger className="w-full">
                                            <div className="flex items-center justify-between w-full px-2 py-1.5 rounded-md text-xs transition-colors hover:bg-muted/50">
                                              <span className="font-medium text-muted-foreground">{subgroup.label}</span>
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                                  {subgroup.pms.length}
                                                </span>
                                                <ChevronRight 
                                                  className={cn(
                                                    "w-3 h-3 text-muted-foreground transition-transform",
                                                    expandedFrequencies.includes(`${freqKey}-${subgroup.id}`) && "rotate-90"
                                                  )} 
                                                />
                                              </div>
                                            </div>
                                          </CollapsibleTrigger>
                                          <CollapsibleContent>
                                            <div className="ml-3 py-1 pl-2 border-l border-border/50 space-y-1">
                                              {subgroup.pms.map((pm) => (
                                                <button
                                                  key={pm.id}
                                                  onClick={() => setActiveView(pm.id as ViewType)}
                                                  className={cn(
                                                    "text-xs text-left w-full py-1.5 px-2 rounded transition-colors",
                                                    activeView === pm.id 
                                                      ? "text-primary bg-primary/10" 
                                                      : "text-foreground hover:text-primary hover:bg-muted/50"
                                                  )}
                                                >
                                                  {pm.name}
                                                </button>
                                              ))}
                                            </div>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      ))}
                                      <button className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 py-1 transition-colors">
                                        <Plus className="w-3 h-3" />
                                        Add PM
                                      </button>
                                    </div>
                                  </CollapsibleContent>
                                )}
                              </Collapsible>
                            );
                          })}
                          
                          {/* Render standalone groups (not under a frequency) */}
                          {(discipline as any).standaloneGroups?.map((standaloneGroup: any) => {
                            const standaloneKey = `${discipline.id}-standalone-${standaloneGroup.id}`;
                            return (
                              <Collapsible
                                key={standaloneKey}
                                open={expandedFrequencies.includes(standaloneKey)}
                                onOpenChange={() => toggleFrequency(standaloneKey)}
                              >
                                <CollapsibleTrigger className="w-full">
                                  <div
                                    className={cn(
                                      "flex items-center justify-between w-full px-2 py-2 rounded-md text-sm transition-colors",
                                      "hover:bg-muted/50"
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                                      <span className="text-sm font-medium">{standaloneGroup.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                        {standaloneGroup.pms.length}
                                      </span>
                                      <ChevronRight 
                                        className={cn(
                                          "w-3.5 h-3.5 text-muted-foreground transition-transform",
                                          expandedFrequencies.includes(standaloneKey) && "rotate-90"
                                        )} 
                                      />
                                    </div>
                                  </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="ml-5 py-1 pl-3 border-l border-border space-y-1">
                                    {standaloneGroup.pms.map((pm: any) => (
                                      <button
                                        key={pm.id}
                                        onClick={() => setActiveView(pm.id as ViewType)}
                                        className={cn(
                                          "text-xs text-left w-full py-1.5 px-2 rounded transition-colors",
                                          activeView === pm.id 
                                            ? "text-primary bg-primary/10" 
                                            : "text-foreground hover:text-primary hover:bg-muted/50"
                                        )}
                                      >
                                        {pm.name}
                                      </button>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                );
              })}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default PMDesign;
