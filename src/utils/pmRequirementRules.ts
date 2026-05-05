/**
 * PM Requirement Rule Library
 * Recommends inspection regimes per equipment class × criticality.
 *
 * Frequencies: Daily, Weekly, 2W, 4W, 12W, 26W, 52W
 * Each frequency has a duty (Online | Offline) and an "enabled" flag.
 *
 * Criticality: A (HIGH) | B (MED) | C (LOW)
 */

export type Freq = "Daily" | "Weekly" | "2W" | "4W" | "12W" | "26W" | "52W";
export type Duty = "Online" | "Offline";

export const ALL_FREQS: Freq[] = ["Daily", "Weekly", "2W", "4W", "12W", "26W", "52W"];

export interface RegimeEntry {
  enabled: boolean;
  duty: Duty;
}
export type Regime = Record<Freq, RegimeEntry>;

export type EquipmentClass =
  | "Ball Mill" | "SAG Mill" | "Crusher" | "Screen" | "Cyclone" | "Thickener"
  | "Flotation Cell" | "Pump" | "Motor" | "Gearbox" | "Conveyor" | "Feeder"
  | "Chute" | "Fan" | "Blower" | "Compressor" | "Lube System"
  | "HV Switchgear" | "LV Panel" | "Transformer" | "Mobile Plant" | "Other";

export const EQUIPMENT_CLASSES: EquipmentClass[] = [
  "Ball Mill","SAG Mill","Crusher","Screen","Cyclone","Thickener","Flotation Cell",
  "Pump","Motor","Gearbox","Conveyor","Feeder","Chute","Fan","Blower","Compressor",
  "Lube System","HV Switchgear","LV Panel","Transformer","Mobile Plant","Other"
];

/** Auto-classify from asset name + parent label */
export function classifyAsset(name: string, parent = ""): EquipmentClass {
  const t = `${name} ${parent}`.toLowerCase();
  if (/sag\s*mill/.test(t)) return "SAG Mill";
  if (/ball\s*mill|\bmill\b/.test(t)) return "Ball Mill";
  if (/crusher|\bjaw\b|\bcone\b|gyratory|hpgr/.test(t)) return "Crusher";
  if (/screen|trommel|scalper/.test(t)) return "Screen";
  if (/cyclone|hydrocyclone/.test(t)) return "Cyclone";
  if (/thickener|clarifier/.test(t)) return "Thickener";
  if (/flotation|float\s*cell/.test(t)) return "Flotation Cell";
  if (/conveyor|belt\b|stacker|reclaimer/.test(t)) return "Conveyor";
  if (/feeder|apron|vibrating feeder/.test(t)) return "Feeder";
  if (/chute|launder|hopper/.test(t)) return "Chute";
  if (/gearbox|reducer|drive unit/.test(t)) return "Gearbox";
  if (/lube|lubrication|oil\s*system/.test(t)) return "Lube System";
  if (/compressor/.test(t)) return "Compressor";
  if (/blower/.test(t)) return "Blower";
  if (/\bfan\b/.test(t)) return "Fan";
  if (/pump/.test(t)) return "Pump";
  if (/transformer|\btx\b/.test(t)) return "Transformer";
  if (/hv\b|high\s*voltage|switchgear|11kv|22kv|33kv/.test(t)) return "HV Switchgear";
  if (/\blv\b|low\s*voltage|mcc\b|panel|switchboard/.test(t)) return "LV Panel";
  if (/motor/.test(t)) return "Motor";
  if (/excavator|loader|truck|dozer|grader|forklift|telehandler|mobile/.test(t)) return "Mobile Plant";
  return "Other";
}

const off = (enabled: boolean): RegimeEntry => ({ enabled, duty: "Offline" });
const on  = (enabled: boolean): RegimeEntry => ({ enabled, duty: "Online" });
const empty = (): Regime => ({
  Daily: on(false), Weekly: on(false), "2W": on(false),
  "4W": on(false), "12W": off(false), "26W": off(false), "52W": off(false),
});

/**
 * Recommendation matrix.
 * Logic: HIGH-criticality assets get the full ladder; MED skips dailies & long
 * outages; LOW gets a minimal regime. Online inspections stay Online; deep
 * strip-downs are Offline / Shutdown.
 */
export function recommendRegime(cls: EquipmentClass, crit: "A" | "B" | "C"): Regime {
  const r = empty();
  const HIGH = crit === "A", MED = crit === "B", LOW = crit === "C";

  switch (cls) {
    case "Ball Mill":
    case "SAG Mill":
      r.Daily   = { enabled: HIGH || MED,        duty: "Online" };
      r.Weekly  = { enabled: true,                duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["12W"]  = { enabled: true,                duty: "Offline" };
      r["26W"]  = { enabled: HIGH || MED,        duty: "Offline" };
      r["52W"]  = { enabled: true,                duty: "Offline" };
      break;
    case "Crusher":
      r.Daily   = { enabled: HIGH,                duty: "Online" };
      r.Weekly  = { enabled: true,                duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["12W"]  = { enabled: true,                duty: "Offline" };
      r["52W"]  = { enabled: true,                duty: "Offline" };
      break;
    case "Screen":
    case "Cyclone":
    case "Flotation Cell":
      r.Weekly  = { enabled: true,                duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["12W"]  = { enabled: HIGH || MED,        duty: "Offline" };
      r["52W"]  = { enabled: true,                duty: "Offline" };
      break;
    case "Thickener":
      r.Weekly  = { enabled: true,                duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["26W"]  = { enabled: HIGH || MED,        duty: "Offline" };
      r["52W"]  = { enabled: true,                duty: "Offline" };
      break;
    case "Conveyor":
      r.Daily   = { enabled: HIGH,                duty: "Online" };
      r.Weekly  = { enabled: true,                duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["12W"]  = { enabled: HIGH || MED,        duty: "Offline" };
      r["52W"]  = { enabled: HIGH || MED,        duty: "Offline" };
      break;
    case "Feeder":
    case "Chute":
      r.Weekly  = { enabled: true,                duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["12W"]  = { enabled: HIGH || MED,        duty: "Offline" };
      r["52W"]  = { enabled: HIGH,                duty: "Offline" };
      break;
    case "Pump":
      r.Weekly  = { enabled: HIGH || MED,        duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["12W"]  = { enabled: HIGH || MED,        duty: "Online" };
      r["52W"]  = { enabled: HIGH,                duty: "Offline" };
      break;
    case "Motor":
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["12W"]  = { enabled: true,                duty: "Online" };
      r["52W"]  = { enabled: HIGH || MED,        duty: "Offline" };
      break;
    case "Gearbox":
      r.Weekly  = { enabled: HIGH,                duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["12W"]  = { enabled: true,                duty: "Online" };
      r["52W"]  = { enabled: true,                duty: "Offline" };
      break;
    case "Fan":
    case "Blower":
    case "Compressor":
      r.Weekly  = { enabled: HIGH,                duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["12W"]  = { enabled: true,                duty: "Online" };
      r["52W"]  = { enabled: HIGH || MED,        duty: "Offline" };
      break;
    case "Lube System":
      r.Daily   = { enabled: HIGH,                duty: "Online" };
      r.Weekly  = { enabled: true,                duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["26W"]  = { enabled: true,                duty: "Online" };
      break;
    case "HV Switchgear":
    case "Transformer":
      r["12W"]  = { enabled: true,                duty: "Online" };
      r["26W"]  = { enabled: HIGH || MED,        duty: "Online" };
      r["52W"]  = { enabled: true,                duty: "Offline" };
      break;
    case "LV Panel":
      r["12W"]  = { enabled: HIGH || MED,        duty: "Online" };
      r["52W"]  = { enabled: true,                duty: "Offline" };
      break;
    case "Mobile Plant":
      r.Daily   = { enabled: true,                duty: "Online" }; // pre-start
      r.Weekly  = { enabled: HIGH || MED,        duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" }; // 250hr
      r["12W"]  = { enabled: true,                duty: "Offline" }; // 500hr
      r["52W"]  = { enabled: true,                duty: "Offline" }; // major
      break;
    default:
      r.Weekly  = { enabled: HIGH || MED,        duty: "Online" };
      r["4W"]   = { enabled: true,                duty: "Online" };
      r["52W"]  = { enabled: HIGH || MED,        duty: "Offline" };
  }
  if (LOW) {
    // Soften LOW criticality: disable Daily & 26W if equip-rule turned them on
    r.Daily.enabled = false;
    r["26W"].enabled = false;
  }
  return r;
}

/** Merge: overrides win where defined; otherwise use recommendation. */
export function effectiveRegime(rec: Regime, overrides: Partial<Regime> | null | undefined): Regime {
  const out = { ...rec } as Regime;
  if (!overrides) return out;
  for (const f of ALL_FREQS) {
    if (overrides[f]) out[f] = { ...out[f], ...overrides[f]! };
  }
  return out;
}

export function countEnabled(r: Regime): { total: number; online: number; offline: number } {
  let total = 0, online = 0, offline = 0;
  for (const f of ALL_FREQS) {
    if (r[f].enabled) {
      total++;
      if (r[f].duty === "Online") online++; else offline++;
    }
  }
  return { total, online, offline };
}
