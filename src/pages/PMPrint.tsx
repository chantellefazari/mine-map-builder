import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { PMBaseMasterTemplate } from "@/components/pm-design/PMBaseMasterTemplate";
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
import { MotorInspectionsSheetsDocument } from "@/components/pm-design/MotorInspectionsSheetsDocument";
import { BeltCalibrationPMDocument } from "@/components/pm-design/BeltCalibrationPMDocument";
import { WeldersVRDTestPMDocument } from "@/components/pm-design/WeldersVRDTestPMDocument";
import { LubePMDocument } from "@/components/pm-design/LubePMDocument";

const renderPM = (id: string) => {
  switch (id) {
    case "master": return <PMBaseMasterTemplate />;
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
    case "rcd-testing-admin": return <RCDTestingSheetsDocument locationId="admin" />;
    case "rcd-testing-juno-bore": return <RCDTestingSheetsDocument locationId="juno-bore" />;
    case "rcd-testing-andys-dam": return <RCDTestingSheetsDocument locationId="andys-dam" />;
    case "rcd-testing-lab": return <RCDTestingSheetsDocument locationId="lab" />;
    case "rcd-testing-crusher-fuel-farm": return <RCDTestingSheetsDocument locationId="crusher-fuel-farm" />;
    case "rcd-testing-crusher-workshop": return <RCDTestingSheetsDocument locationId="crusher-workshop" />;
    case "rcd-pb-injection-cip-tanks": return <RCDPushButtonInjectionTestSheetsDocument locationId="cip-tanks" />;
    case "rcd-pb-injection-crib-room": return <RCDPushButtonInjectionTestSheetsDocument locationId="crib-room" />;
    case "rcd-pb-injection-elution": return <RCDPushButtonInjectionTestSheetsDocument locationId="elution-mcc-130" />;
    case "rcd-pb-injection-filter-press": return <RCDPushButtonInjectionTestSheetsDocument locationId="filter-press-mcc-125" />;
    case "rcd-pb-injection-first-aid-room": return <RCDPushButtonInjectionTestSheetsDocument locationId="first-aid-room" />;
    case "rcd-pb-injection-lab": return <RCDPushButtonInjectionTestSheetsDocument locationId="lab" />;
    case "switchboard-52-weekly": return <SwitchboardInspectionPMDocument />;
    case "cable-test-sheet": return <CableTestSheetPMDocument />;
    case "emergency-light-12-weekly": return <EmergencyLightTestPMDocument />;
    case "filter-press-motor-inspection": return <FilterPressMotorInspectionPMDocument />;
    case "full-test-sheet": return <FullTestSheetPMDocument />;
    case "motor-inspections-filter-press": return <MotorInspectionsSheetsDocument areaId="filter-press" />;
    case "motor-inspections-gold-room": return <MotorInspectionsSheetsDocument areaId="gold-room" />;
    case "motor-inspections-kiln-area": return <MotorInspectionsSheetsDocument areaId="kiln-area" />;
    case "motor-inspections-elution": return <MotorInspectionsSheetsDocument areaId="elution" />;
    case "motor-inspections-milling-area": return <MotorInspectionsSheetsDocument areaId="milling-area" />;
    case "motor-inspections-pwp": return <MotorInspectionsSheetsDocument areaId="pwp" />;
    case "motor-inspections-services": return <MotorInspectionsSheetsDocument areaId="services" />;
    case "motor-inspections-tanks": return <MotorInspectionsSheetsDocument areaId="tanks" />;
    case "motor-inspections-thickener": return <MotorInspectionsSheetsDocument areaId="thickener" />;
    case "rcd-3m-testing-admin": return <RCDPushButtonTestingSheetsDocument locationId="admin" />;
    case "rcd-3m-testing-juno-bore": return <RCDPushButtonTestingSheetsDocument locationId="juno-bore" />;
    case "rcd-3m-testing-andys-dam": return <RCDPushButtonTestingSheetsDocument locationId="andys-dam" />;
    case "rcd-3m-testing-lab": return <RCDPushButtonTestingSheetsDocument locationId="lab" />;
    case "rcd-3m-testing-crusher-workshop": return <RCDPushButtonTestingSheetsDocument locationId="crusher-workshop" />;
    case "rcd-3m-testing-crusher-fuel-farm": return <RCDPushButtonTestingSheetsDocument locationId="crusher-fuel-farm" />;
    case "belt-calibration-bc100-monthly": return <BeltCalibrationPMDocument />;
    case "welders-vrd-test-12-weekly": return <WeldersVRDTestPMDocument />;
    default: {
      if (id.startsWith("lube-")) return <LubePMDocument templateId={id} />;
      return null;
    }
  }
};

const PMPrint = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    document.title = `PM Print — ${id}`;
  }, [id]);

  const pmDocument = id ? renderPM(id) : null;

  if (!pmDocument) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-foreground">PM template not found</p>
          <Link to="/pm-design" className="text-primary underline text-sm">
            ← Back to PM Design
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pm-print-page">
      {/* On-screen toolbar — hidden when printing */}
      <div className="pm-print-toolbar print:hidden">
        <Link to="/pm-design" className="text-sm text-primary hover:underline">
          ← Back to PM Design
        </Link>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Print / Save PDF
        </button>
      </div>

      {/* PM document — this is the only thing that prints */}
      <div className="pm-print-content">
        {pmDocument}
      </div>

      <style>{`
        .pm-print-page {
          background: hsl(var(--muted));
          min-height: 100vh;
        }
        .pm-print-toolbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: hsl(var(--background));
          border-bottom: 1px solid hsl(var(--border));
        }
        .pm-print-content {
          max-width: 210mm;
          margin: 32px auto;
          padding: 10mm;
          background: white;
          border: 1px solid #000;
          box-shadow: 0 4px 24px -6px rgba(0,0,0,0.12);
          box-sizing: border-box;
        }

        /* Ensure all tables have clear grid borders on screen */
        .pm-print-content table {
          border-collapse: collapse !important;
          width: 100%;
        }
        .pm-print-content table th,
        .pm-print-content table td {
          border: 2px solid #000 !important;
          vertical-align: top;
        }
        .pm-print-content tr {
          border: none !important;
        }

        /* Grid-based metadata cells — add visible borders */
        .pm-print-content .grid.grid-cols-2 > div {
          border: 2px solid #000;
        }
        .pm-print-content .grid.grid-cols-\\[120px_1fr\\] > div {
          border: 2px solid #000;
        }

        /* Lube PM template — constrain table to container */
        .pm-print-content .lube-pm-template {
          max-width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }
        .pm-print-content .lube-pm-template table {
          table-layout: fixed !important;
          width: 100% !important;
          max-width: 100% !important;
          border-collapse: collapse !important;
          box-sizing: border-box;
        }
        .pm-print-content .lube-pm-template th,
        .pm-print-content .lube-pm-template td {
          overflow-wrap: break-word;
          word-wrap: break-word;
          overflow: hidden;
        }

        @media print {
          html, body {
            width: 210mm;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .pm-print-page {
            background: white;
          }
          .pm-print-toolbar {
            display: none !important;
          }
          .pm-print-content {
            max-width: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
            box-sizing: border-box;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          /* Tables: natural flow across pages */
          table {
            page-break-inside: auto;
            border-collapse: collapse !important;
            width: 100%;
          }
          table, th, td {
            border: 2px solid #000 !important;
          }
          tr {
            border: none !important;
          }
          th, td {
            padding: 3px 6px !important;
          }

          /* Rows should not split */
          tr {
            break-inside: avoid;
            page-break-inside: avoid;
            page-break-after: auto;
          }

          /* Repeat table headers on every page */
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }

          /* Keep sign-off / approval blocks together */
          [data-pdf-keep-together],
          .no-split {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          /* Keep the outer PM border container flowing naturally */
          .pm-print-content .border-2 {
            border: 2px solid #000 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PMPrint;
