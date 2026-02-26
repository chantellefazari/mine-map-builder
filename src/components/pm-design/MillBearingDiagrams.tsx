/**
 * Bearing Numbering System & Vibration Measurements reference diagrams
 * for the Mill Daily PM Document. Built as SVG for clean print output.
 */

const BearingNumberingDiagram = () => (
  <div className="space-y-2">
    <h3 className="text-sm font-bold text-center border border-border bg-muted px-2 py-1">
      Bearing Numbering System
    </h3>
    <svg viewBox="0 0 700 200" className="w-full max-w-[640px] mx-auto" aria-label="Bearing numbering system diagram">
      {/* Pinion */}
      <rect x="60" y="60" width="120" height="60" fill="#999" stroke="#000" strokeWidth="1.5" />
      <text x="120" y="95" textAnchor="middle" fontSize="13" fontWeight="bold">Pinion</text>
      {/* Pinion bearings */}
      <Bearing cx={40} cy={90} label="1" />
      <Bearing cx={200} cy={90} label="9" />
      {/* Pinion labels */}
      <text x="40" y="155" textAnchor="middle" fontSize="9">Left</text>
      <text x="40" y="165" textAnchor="middle" fontSize="9">Position</text>
      <text x="40" y="175" textAnchor="middle" fontSize="9">50mm</text>
      <text x="120" y="155" textAnchor="middle" fontSize="9">Centre</text>
      <text x="120" y="165" textAnchor="middle" fontSize="9">Position</text>
      <text x="200" y="155" textAnchor="middle" fontSize="9">Right</text>
      <text x="200" y="165" textAnchor="middle" fontSize="9">Position</text>

      {/* Shaft line pinion to gearbox */}
      <line x1="200" y1="90" x2="310" y2="90" stroke="#000" strokeWidth="2" />

      {/* Gear Box */}
      <rect x="310" y="40" width="140" height="100" fill="#aaa" stroke="#000" strokeWidth="1.5" />
      <text x="380" y="95" textAnchor="middle" fontSize="13" fontWeight="bold">Gear Box</text>
      {/* Gearbox bearings */}
      <Bearing cx={320} cy={50} label="8" />
      <Bearing cx={440} cy={50} label="7" />
      <Bearing cx={320} cy={130} label="6" />
      <Bearing cx={440} cy={130} label="5" />
      <Bearing cx={380} cy={140} label="4" />

      {/* Note */}
      <text x="530" y="45" fontSize="9" fontStyle="italic">Intermediate</text>
      <text x="530" y="57" fontSize="9" fontStyle="italic">Bearings not</text>
      <text x="530" y="69" fontSize="9" fontStyle="italic">present on Mills</text>

      {/* Shaft line gearbox to motor */}
      <line x1="450" y1="90" x2="560" y2="90" stroke="#000" strokeWidth="2" />

      {/* Motor */}
      <rect x="560" y="60" width="100" height="60" fill="#ddd" stroke="#000" strokeWidth="1.5" rx="2" />
      <text x="610" y="95" textAnchor="middle" fontSize="13" fontWeight="bold">Motor</text>
      {/* Motor bearings */}
      <Bearing cx={550} cy={90} label="3" />
      <Bearing cx={610} cy={55} label="2" />
      <Bearing cx={670} cy={90} label="1" />
    </svg>
  </div>
);

const VibrationMeasurementsDiagram = () => (
  <div className="space-y-2">
    <h3 className="text-sm font-bold text-center">Vibration Measurements</h3>
    <div className="flex gap-12 justify-center items-start">
      {/* Left column: numbered lines 1-10 */}
      <div className="flex flex-col gap-1 text-xs pt-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i + 1} className="flex items-center gap-1">
            <span className="text-red-600 font-bold w-4 text-right">{i + 1}.</span>
            <span className="border-b border-border w-20 inline-block">&nbsp;</span>
          </div>
        ))}
      </div>

      {/* Right column: schematic layout */}
      <div className="relative" style={{ width: 340, height: 220 }}>
        {/* Non Drive Pinion */}
        <SchematicBox x={0} y={0} w={65} h={35} label="Non Drive" label2="Pinion" num={6} />
        {/* Drive Pinion */}
        <SchematicBox x={80} y={0} w={65} h={35} label="Drive" label2="Pinion" num={5} />
        {/* Gearbox */}
        <SchematicBox x={170} y={0} w={70} h={55} label="Gearbox" num={3} numBottom={4} />
        {/* Motor */}
        <SchematicBox x={265} y={0} w={70} h={35} label="Motor" num={2} numRight={1} />
        {/* Mill */}
        <SchematicBox x={155} y={100} w={110} h={80} label="Mill" numTL={8} numTR={7} numBL={10} numBR={9} />
      </div>
    </div>
  </div>
);

/** Small bearing marker (bowtie shape) with a number label */
function Bearing({ cx, cy, label }: { cx: number; cy: number; label: string }) {
  return (
    <g>
      <polygon
        points={`${cx - 8},${cy - 10} ${cx + 8},${cy - 10} ${cx},${cy} ${cx + 8},${cy + 10} ${cx - 8},${cy + 10} ${cx},${cy}`}
        fill="white"
        stroke="#000"
        strokeWidth="1"
      />
      <text x={cx} y={cy - 14} textAnchor="middle" fontSize="10" fontWeight="bold" fill="red">
        {label}
      </text>
    </g>
  );
}

/** Simple labeled box for vibration schematic */
function SchematicBox({
  x, y, w, h, label, label2, num, numBottom, numRight, numTL, numTR, numBL, numBR,
}: {
  x: number; y: number; w: number; h: number;
  label: string; label2?: string;
  num?: number; numBottom?: number; numRight?: number;
  numTL?: number; numTR?: number; numBL?: number; numBR?: number;
}) {
  return (
    <>
      <div
        className="absolute border-2 border-foreground flex flex-col items-center justify-center text-xs font-semibold"
        style={{ left: x, top: y, width: w, height: h }}
      >
        <span>{label}</span>
        {label2 && <span>{label2}</span>}
      </div>
      {num !== undefined && (
        <span className="absolute text-[11px] font-bold text-red-600" style={{ left: x + w / 2 - 4, top: y - 16 }}>{num}</span>
      )}
      {numBottom !== undefined && (
        <span className="absolute text-[11px] font-bold text-red-600" style={{ left: x + w / 2 - 4, top: y + h + 2 }}>{numBottom}</span>
      )}
      {numRight !== undefined && (
        <span className="absolute text-[11px] font-bold text-red-600" style={{ left: x + w + 4, top: y + h / 2 - 8 }}>{numRight}</span>
      )}
      {numTL !== undefined && (
        <span className="absolute text-[11px] font-bold text-red-600" style={{ left: x - 12, top: y - 4 }}>{numTL}</span>
      )}
      {numTR !== undefined && (
        <span className="absolute text-[11px] font-bold text-red-600" style={{ left: x + w + 2, top: y - 4 }}>{numTR}</span>
      )}
      {numBL !== undefined && (
        <span className="absolute text-[11px] font-bold text-red-600" style={{ left: x - 14, top: y + h - 10 }}>{numBL}</span>
      )}
      {numBR !== undefined && (
        <span className="absolute text-[11px] font-bold text-red-600" style={{ left: x + w + 2, top: y + h - 10 }}>{numBR}</span>
      )}
    </>
  );
}

export const MillBearingDiagrams = () => (
  <div className="p-4 space-y-6">
    <BearingNumberingDiagram />
    <VibrationMeasurementsDiagram />
  </div>
);
