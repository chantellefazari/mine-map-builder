import { Input } from "@/components/ui/input";
import { Cog } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

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

interface StationaryCheck {
  item: string;
  action: string;
}

interface MotorSectionProps {
  motor: MotorData;
  motorNumber: number;
  stationaryChecks: StationaryCheck[];
}

const MotorSection = ({ motor, motorNumber, stationaryChecks }: MotorSectionProps) => (
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

/** Lightweight metadata for each motor-inspection area — actual motor & check data comes from DB */
const areaMetadata = [
  { id: "filter-press", pmName: "Statutory Motor Inspection - Filter Press", title: "Filter Press - Statutory Motor Inspection", subtitle: "& Lubrication", name: "Filter Press" },
  { id: "gold-room", pmName: "Statutory Motor Inspection - Gold Room", title: "Gold Room - Statutory Motor Inspection", name: "Gold Room" },
  { id: "kiln-area", pmName: "Statutory Motor Inspection - Kiln Area", title: "Kiln Area - Statutory Motor Inspection", subtitle: "& Lubrication", name: "Kiln Area" },
  { id: "elution", pmName: "Statutory Motor Inspection - Elution", title: "Elution - Statutory Motor Inspection", subtitle: "& Lubrication", name: "Elution" },
  { id: "milling-area", pmName: "Statutory Motor Inspection - Milling Area", title: "Grinding - Statutory Motor Inspection", name: "Milling Area" },
  { id: "pwp", pmName: "Statutory Motor Inspection - Process Water Pond", title: "Process Water Pond - Statutory Motor Inspection", subtitle: "& Lubrication", name: "Process Water Pond" },
  { id: "services", pmName: "Statutory Motor Inspection - Services", title: "Services - Statutory Motor Inspection", name: "Services" },
  { id: "tanks", pmName: "Statutory Motor Inspection - Tanks", title: "Tanks - Statutory Motor Inspection", subtitle: "& Lubrication", name: "Tanks" },
  { id: "thickener", pmName: "Statutory Motor Inspection - Thickener", title: "Thickener - Statutory Motor Inspection", subtitle: "& Lubrication", name: "Thickener" },
];

interface AreaInspectionSheetProps {
  areaId: string;
}

const AreaInspectionSheet = ({ areaId }: AreaInspectionSheetProps) => {
  const { pms } = usePMasterList();
  const meta = areaMetadata.find((a) => a.id === areaId);
  if (!meta) return null;

  const pm = pms.find((p) => p.pmName === meta.pmName);
  const tasksData = pm?.tasks as any;
  const motors = (tasksData?.motors || []) as MotorData[];
  const stationaryChecks = (tasksData?.stationaryChecks || []) as StationaryCheck[];

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title={meta.title} subtitle={meta.subtitle} />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea={meta.name}
          pmGroup="Electrical"
          pmType="Statutory Inspection"
          frequency="6 Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        {motors.map((motor, index) => (
          <MotorSection key={index} motor={motor} motorNumber={index + 1} stationaryChecks={stationaryChecks} />
        ))}

        <PMSignOffBlock showElecCertNo footerText={`Tennant Creek Mining Operations – ${meta.name} Statutory Motor Inspection Form`} />
      </div>
    </div>
  );
};

interface MotorInspectionsSheetsDocumentProps {
  areaId?: string;
}

export const MotorInspectionsSheetsDocument = ({ areaId }: MotorInspectionsSheetsDocumentProps) => {
  const areasToShow = areaId 
    ? areaMetadata.filter(a => a.id === areaId)
    : areaMetadata;

  return (
    <div className="space-y-8">
      {areasToShow.map((area) => (
        <AreaInspectionSheet key={area.id} areaId={area.id} />
      ))}
    </div>
  );
};
