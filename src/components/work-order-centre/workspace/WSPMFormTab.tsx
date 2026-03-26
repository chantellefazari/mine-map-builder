import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Printer, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { pmNameToViewId } from "@/components/pm-design/pmNameToViewId";

// Lazy imports for all PM documents
import { FilterPressDailyOfflinePMDocument } from "@/components/pm-design/FilterPressDailyOfflinePMDocument";
import { FilterPressDailyOnlinePMDocument } from "@/components/pm-design/FilterPressDailyOnlinePMDocument";
import { MillDailyPMDocument } from "@/components/pm-design/MillDailyPMDocument";
import { ROPlantPMDocument } from "@/components/pm-design/ROPlantPMDocument";
import { AcidElutionPMDocument } from "@/components/pm-design/AcidElutionPMDocument";
import { AirWaterServicesPMDocument } from "@/components/pm-design/AirWaterServicesPMDocument";
import { BottomOfTanksPMDocument } from "@/components/pm-design/BottomOfTanksPMDocument";
import { DieselFarmPMDocument } from "@/components/pm-design/DieselFarmPMDocument";
import { FilterPressWeeklyPMDocument } from "@/components/pm-design/FilterPressWeeklyPMDocument";
import { FilterPressCompressorPMDocument } from "@/components/pm-design/FilterPressCompressorPMDocument";
import { FilterPressCompressorOfflinePMDocument } from "@/components/pm-design/FilterPressCompressorOfflinePMDocument";
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
import { PowerStationGeneratorWeeklyPMDocument } from "@/components/pm-design/PowerStationGeneratorWeeklyPMDocument";
import { ForkliftWeeklyPMDocument } from "@/components/pm-design/ForkliftWeeklyPMDocument";
import { EWPWeeklyPMDocument } from "@/components/pm-design/EWPWeeklyPMDocument";
import { CraneWeeklyPMDocument } from "@/components/pm-design/CraneWeeklyPMDocument";
import { WaterTruckWeeklyPMDocument } from "@/components/pm-design/WaterTruckWeeklyPMDocument";
import { LoaderWeeklyPMDocument } from "@/components/pm-design/LoaderWeeklyPMDocument";
import { LoaderDailyPMDocument } from "@/components/pm-design/LoaderDailyPMDocument";
import { ExcavatorDailyPMDocument } from "@/components/pm-design/ExcavatorDailyPMDocument";
import { ExcavatorWeeklyPMDocument } from "@/components/pm-design/ExcavatorWeeklyPMDocument";
import { MoxyDailyPMDocument } from "@/components/pm-design/MoxyDailyPMDocument";
import { MoxyWeeklyPMDocument } from "@/components/pm-design/MoxyWeeklyPMDocument";
import { DozerDailyPMDocument } from "@/components/pm-design/DozerDailyPMDocument";
import { DozerWeeklyPMDocument } from "@/components/pm-design/DozerWeeklyPMDocument";
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
import { CrusherFuelFarmGeneratorElectricalPMDocument } from "@/components/pm-design/CrusherFuelFarmGeneratorElectricalPMDocument";
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
import { BeltCalibrationPMDocument } from "@/components/pm-design/BeltCalibrationPMDocument";
import { WeldersVRDTestPMDocument } from "@/components/pm-design/WeldersVRDTestPMDocument";
import { LubePMDocument } from "@/components/pm-design/LubePMDocument";

interface Props {
  wo: WorkOrder;
}

/** Extract PM name from work order problem_description field (format: "PM: <name> (<frequency>)") */
function extractPMName(desc: string): string | null {
  const match = desc.match(/^PM:\s*(.+?)\s*\(/);
  return match ? match[1].trim() : null;
}

function renderPMDocument(viewId: string): React.ReactNode {
  switch (viewId) {
    case "filter-press-daily-offline": return <FilterPressDailyOfflinePMDocument />;
    case "filter-press-daily-online": return <FilterPressDailyOnlinePMDocument />;
    case "mill-daily": return <MillDailyPMDocument />;
    case "ro-plant-daily": return <ROPlantPMDocument />;
    case "acid-elution-weekly": return <AcidElutionPMDocument />;
    case "air-water-services-weekly": return <AirWaterServicesPMDocument />;
    case "bottom-of-tanks-weekly": return <BottomOfTanksPMDocument />;
    case "diesel-farm-weekly": return <DieselFarmPMDocument />;
    case "filter-press-weekly": return <FilterPressWeeklyPMDocument />;
    case "filter-press-compressor-weekly": return <FilterPressCompressorPMDocument />;
    case "filter-press-compressor-offline-weekly": return <FilterPressCompressorOfflinePMDocument />;
    case "gold-room-weekly": return <GoldRoomPMDocument />;
    case "grease-oils-weekly": return <GreaseOilsPMDocument />;
    case "mill-weekly": return <MillWeeklyPMDocument />;
    case "potable-water-weekly": return <PotableWaterPMDocument />;
    case "reagents-weekly": return <ReagentsPMDocument />;
    case "thickener-weekly": return <ThickenerPMDocument />;
    case "top-of-tanks-weekly": return <TopOfTanksPMDocument />;
    case "admin-generator-weekly": return <AdminGeneratorPMDocument />;
    case "nobles-natural-sump-generator-weekly": return <AndyDamGeneratorPMDocument />;
    case "juno-generator-weekly": return <JunoGeneratorPMDocument />;
    case "lab-generator-weekly": return <LabGeneratorPMDocument />;
    case "portable-generators-weekly": return <PortableGeneratorsPMDocument />;
    case "power-station-generator-weekly": return <PowerStationGeneratorWeeklyPMDocument />;
    case "forklift-weekly": return <ForkliftWeeklyPMDocument />;
    case "ewp-weekly": return <EWPWeeklyPMDocument />;
    case "crane-weekly": return <CraneWeeklyPMDocument />;
    case "water-truck-weekly": return <WaterTruckWeeklyPMDocument />;
    case "loader-weekly": return <LoaderWeeklyPMDocument />;
    case "loader-daily": return <LoaderDailyPMDocument />;
    case "telehandler-weekly": return <TelehandlerWeeklyPMDocument />;
    case "dozer-daily": return <DozerDailyPMDocument />;
    case "dozer-weekly": return <DozerWeeklyPMDocument />;
    case "excavator-daily": return <ExcavatorDailyPMDocument />;
    case "excavator-weekly": return <ExcavatorWeeklyPMDocument />;
    case "moxy-daily": return <MoxyDailyPMDocument />;
    case "moxy-weekly": return <MoxyWeeklyPMDocument />;
    case "lighting-tower-daily": return <LightingTowerDailyPMDocument />;
    case "service-truck-weekly": return <ServiceTruckWeeklyPMDocument />;
    case "skid-steer-weekly": return <SkidSteerWeeklyPMDocument />;
    case "field-mcc-inspections-weekly": return <FieldMCCInspectionsPMDocument />;
    case "filter-press-electrical-weekly": return <FilterPressElectricalPMDocument />;
    case "ice-machine-weekly": return <IceMachineInspectionPMDocument />;
    case "ph-probe-calibration-weekly": return <PHProbeCalibrationPMDocument />;
    case "safety-shower-weekly": return <SafetyShowerInspectionPMDocument />;
    case "spare-mill-motor-weekly": return <SpareMillMotorInspectionPMDocument />;
    case "visual-zone-checks-weekly": return <VisualZoneChecksPMDocument />;
    case "crusher-fuel-farm-generator-electrical-weekly": return <CrusherFuelFarmGeneratorElectricalPMDocument />;
    case "substation-2-weekly": return <SubstationInspectionPMDocument />;
    case "ac-inspection-12-weekly": return <ACInspectionPMDocument />;
    case "ac-inspection-4-weekly": return <ACInspectionMonthlyPMDocument />;
    case "generator-yearly-test": return <GeneratorYearlyTestPMDocument />;
    case "pull-wire-checks-12-weekly": return <PullWireChecksPMDocument />;
    case "rcd-pushbutton-12-weekly": return <RCDPushButtonTestPMDocument />;
    case "rcd-injection-24-weekly": return <RCDInjectionTestPMDocument />;
    case "switchboard-52-weekly": return <SwitchboardInspectionPMDocument />;
    case "cable-test-sheet": return <CableTestSheetPMDocument />;
    case "emergency-light-12-weekly": return <EmergencyLightTestPMDocument />;
    case "filter-press-motor-inspection": return <FilterPressMotorInspectionPMDocument />;
    case "full-test-sheet": return <FullTestSheetPMDocument />;
    case "belt-calibration-bc100-monthly": return <BeltCalibrationPMDocument />;
    case "welders-vrd-test-12-weekly": return <WeldersVRDTestPMDocument />;
    default:
      if (viewId.startsWith("lube-")) return <LubePMDocument templateId={viewId} />;
      return null;
  }
}

export function WSPMFormTab({ wo }: Props) {
  const navigate = useNavigate();

  const pmName = useMemo(() => extractPMName(wo.problem_description || ""), [wo.problem_description]);
  const viewId = pmName ? pmNameToViewId[pmName] : null;

  if (!pmName || !viewId) {
    return (
      <div className="border border-dashed border-border rounded-lg p-8 text-center space-y-2">
        <FileText className="w-8 h-8 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground">
          No PM template linked to this work order.
        </p>
        <p className="text-xs text-muted-foreground">
          Create a work order from a PM template to see the full inspection form here.
        </p>
      </div>
    );
  }

  const handlePrint = () => {
    navigate(`/pm-print/${viewId}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">PM Inspection Form</h2>
          <p className="text-xs text-muted-foreground">{pmName}</p>
        </div>
        <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2 text-xs">
          <Printer className="w-3.5 h-3.5" />
          Print
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="transform origin-top-left scale-[0.85] w-[117.6%]">
          {renderPMDocument(viewId)}
        </div>
      </div>
    </div>
  );
}
