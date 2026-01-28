// Site Spares Catalogue Data
// MASTER INVENTORY for the entire site - stock tracking & warehouse management
// Restructured for inventory management: locations, bin numbers, stock levels, specs

export interface SiteSpareItem {
  id: string;
  // Stock identification
  partNumber: string;          // Internal part number (to be assigned)
  description: string;        // Part description
  category: string;           // Category e.g., "Electrical", "Mechanical", "Consumable"
  subcategory: string;        // Subcategory e.g., "Motors", "Bearings", "Fittings"
  // Manufacturer & Part Details
  manufacturer: string;
  oemPartNumber: string;
  alternatePartNumber: string;
  specifications: string;     // Size, rating, material specs
  // Warehouse Location
  warehouseArea: string;      // Warehouse zone e.g., "A", "B", "C", "Yard"
  aisle: string;              // Aisle number/letter
  rack: string;               // Rack/shelf identifier
  binLocation: string;        // Specific bin e.g., "A-01-03"
  // Stock Levels
  qtyOnHand: number;
  minQty: number;
  maxQty: number;
  reorderPoint: number;
  uom: string;                // Unit of measure: EA, BOX, M, L, KG
  // Pricing & Supplier
  unitCost: number;
  preferredSupplier: string;
  leadTimeDays: number;
  lastPurchaseDate: string;
  // Status & Tracking
  status: "Active" | "Obsolete" | "Pending Review" | "Low Stock" | "Out of Stock";
  isCritical: boolean;        // Flag for critical spares
  notes: string;
}

// Status colors for UI
export const stockStatusColors: Record<string, string> = {
  "Active": "bg-green-500/20 text-green-700",
  "Low Stock": "bg-amber-500/20 text-amber-700",
  "Out of Stock": "bg-destructive/20 text-destructive",
  "Pending Review": "bg-blue-500/20 text-blue-700",
  "Obsolete": "bg-muted text-muted-foreground",
};

// Category colors
export const categoryColors: Record<string, string> = {
  "Electrical": "bg-blue-500/20 text-blue-700",
  "Mechanical": "bg-purple-500/20 text-purple-700",
  "Instrumentation": "bg-cyan-500/20 text-cyan-700",
  "Consumable": "bg-green-500/20 text-green-700",
  "Safety": "bg-red-500/20 text-red-700",
  "Hydraulic": "bg-orange-500/20 text-orange-700",
  "Pneumatic": "bg-teal-500/20 text-teal-700",
  "Structural": "bg-gray-500/20 text-gray-700",
};

// Warehouse areas
export const warehouseAreas = ["A", "B", "C", "D", "Yard", "Hazmat", "Cold Store"];

// Categories and subcategories
export const categories: Record<string, string[]> = {
  "Electrical": ["Motors", "Cables", "Circuit Breakers", "Contactors", "Relays", "Switches", "Lighting", "Power Supplies", "PLCs", "Sensors"],
  "Mechanical": ["Bearings", "Seals", "Gearboxes", "Couplings", "Belts", "Pulleys", "Shafts", "Bushes", "Sprockets", "Chains"],
  "Instrumentation": ["Transmitters", "Gauges", "Valves", "Flowmeters", "Level Sensors", "Temperature Probes", "Analyzers"],
  "Consumable": ["Lubricants", "Filters", "Gaskets", "O-Rings", "Fasteners", "Tape", "Rags", "Cleaners"],
  "Safety": ["PPE", "Fire Equipment", "First Aid", "Signage", "Lockout/Tagout"],
  "Hydraulic": ["Pumps", "Cylinders", "Hoses", "Fittings", "Filters", "Accumulators"],
  "Pneumatic": ["Compressors", "Regulators", "Fittings", "Hoses", "Cylinders", "Solenoids"],
  "Structural": ["Steel", "Brackets", "Bolts", "Welding", "Wear Plates", "Liners"],
};

// Units of measure
export const unitsOfMeasure = ["EA", "BOX", "PKT", "M", "L", "KG", "SET", "PAIR", "ROLL"];

// Helper to determine category from description
const determineCategory = (description: string, componentType: string): { category: string; subcategory: string } => {
  const descLower = description.toLowerCase();
  const typeLower = componentType.toLowerCase();
  
  // Electrical
  if (typeLower.includes("motor") || descLower.includes("motor")) {
    return { category: "Electrical", subcategory: "Motors" };
  }
  if (typeLower.includes("cable") || descLower.includes("cable") || descLower.includes("wire")) {
    return { category: "Electrical", subcategory: "Cables" };
  }
  if (typeLower.includes("circuit breaker") || descLower.includes("mcb") || descLower.includes("rcbo")) {
    return { category: "Electrical", subcategory: "Circuit Breakers" };
  }
  if (typeLower.includes("contactor") || descLower.includes("contactor")) {
    return { category: "Electrical", subcategory: "Contactors" };
  }
  if (typeLower.includes("relay") || descLower.includes("relay")) {
    return { category: "Electrical", subcategory: "Relays" };
  }
  if (typeLower.includes("switch") || descLower.includes("switch") || descLower.includes("isolator")) {
    return { category: "Electrical", subcategory: "Switches" };
  }
  if (typeLower.includes("light") || descLower.includes("light") || descLower.includes("lamp") || descLower.includes("led")) {
    return { category: "Electrical", subcategory: "Lighting" };
  }
  if (typeLower.includes("power supply") || descLower.includes("power supply")) {
    return { category: "Electrical", subcategory: "Power Supplies" };
  }
  if (typeLower.includes("plc") || descLower.includes("plc") || descLower.includes("controller")) {
    return { category: "Electrical", subcategory: "PLCs" };
  }
  if (typeLower.includes("sensor") || descLower.includes("sensor") || descLower.includes("proximity")) {
    return { category: "Electrical", subcategory: "Sensors" };
  }
  
  // Mechanical
  if (typeLower.includes("bearing") || descLower.includes("bearing")) {
    return { category: "Mechanical", subcategory: "Bearings" };
  }
  if (typeLower.includes("seal") || descLower.includes("seal") || descLower.includes("o-ring")) {
    return { category: "Mechanical", subcategory: "Seals" };
  }
  if (typeLower.includes("gearbox") || descLower.includes("gearbox") || descLower.includes("reducer")) {
    return { category: "Mechanical", subcategory: "Gearboxes" };
  }
  if (typeLower.includes("coupling") || descLower.includes("coupling")) {
    return { category: "Mechanical", subcategory: "Couplings" };
  }
  if (typeLower.includes("belt") || descLower.includes("belt") || descLower.includes("v-belt")) {
    return { category: "Mechanical", subcategory: "Belts" };
  }
  if (typeLower.includes("pulley") || descLower.includes("pulley")) {
    return { category: "Mechanical", subcategory: "Pulleys" };
  }
  if (typeLower.includes("bush") || descLower.includes("bush")) {
    return { category: "Mechanical", subcategory: "Bushes" };
  }
  
  // Instrumentation
  if (typeLower.includes("transmitter") || descLower.includes("transmitter")) {
    return { category: "Instrumentation", subcategory: "Transmitters" };
  }
  if (typeLower.includes("gauge") || descLower.includes("gauge")) {
    return { category: "Instrumentation", subcategory: "Gauges" };
  }
  if (typeLower.includes("valve") || descLower.includes("valve")) {
    return { category: "Instrumentation", subcategory: "Valves" };
  }
  if (typeLower.includes("flowmeter") || descLower.includes("flow meter")) {
    return { category: "Instrumentation", subcategory: "Flowmeters" };
  }
  
  // Consumables
  if (typeLower.includes("filter") || descLower.includes("filter")) {
    return { category: "Consumable", subcategory: "Filters" };
  }
  if (typeLower.includes("lubricant") || descLower.includes("oil") || descLower.includes("grease")) {
    return { category: "Consumable", subcategory: "Lubricants" };
  }
  if (typeLower.includes("gasket") || descLower.includes("gasket")) {
    return { category: "Consumable", subcategory: "Gaskets" };
  }
  if (typeLower.includes("fastener") || descLower.includes("bolt") || descLower.includes("nut") || descLower.includes("screw")) {
    return { category: "Consumable", subcategory: "Fasteners" };
  }
  if (typeLower.includes("tape") || descLower.includes("tape")) {
    return { category: "Consumable", subcategory: "Tape" };
  }
  
  // Hydraulic
  if (typeLower.includes("hydraulic") || descLower.includes("hydraulic")) {
    if (descLower.includes("pump")) return { category: "Hydraulic", subcategory: "Pumps" };
    if (descLower.includes("cylinder")) return { category: "Hydraulic", subcategory: "Cylinders" };
    if (descLower.includes("hose")) return { category: "Hydraulic", subcategory: "Hoses" };
    return { category: "Hydraulic", subcategory: "Fittings" };
  }
  
  // Pneumatic
  if (typeLower.includes("pneumatic") || descLower.includes("pneumatic") || descLower.includes("air ")) {
    if (descLower.includes("regulator")) return { category: "Pneumatic", subcategory: "Regulators" };
    if (descLower.includes("solenoid")) return { category: "Pneumatic", subcategory: "Solenoids" };
    return { category: "Pneumatic", subcategory: "Fittings" };
  }
  
  // Structural
  if (typeLower.includes("weld") || descLower.includes("weld") || descLower.includes("electrode")) {
    return { category: "Structural", subcategory: "Welding" };
  }
  if (typeLower.includes("liner") || descLower.includes("liner") || descLower.includes("wear plate")) {
    return { category: "Structural", subcategory: "Wear Plates" };
  }
  
  // Default
  return { category: "Consumable", subcategory: "General" };
};

// Generate bin location
const generateBinLocation = (index: number): { warehouseArea: string; aisle: string; rack: string; binLocation: string } => {
  const areas = ["A", "B", "C", "D"];
  const areaIndex = Math.floor(index / 250) % areas.length;
  const area = areas[areaIndex];
  const aisleNum = Math.floor((index % 250) / 50) + 1;
  const rackNum = Math.floor((index % 50) / 10) + 1;
  const binNum = (index % 10) + 1;
  
  return {
    warehouseArea: area,
    aisle: String(aisleNum).padStart(2, "0"),
    rack: String(rackNum),
    binLocation: `${area}-${String(aisleNum).padStart(2, "0")}-${rackNum}${String(binNum).padStart(2, "0")}`,
  };
};

// Generate stock status based on quantities
const getStockStatus = (qtyOnHand: number, minQty: number): SiteSpareItem["status"] => {
  if (qtyOnHand === 0) return "Out of Stock";
  if (qtyOnHand <= minQty) return "Low Stock";
  return "Active";
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// SITE CATALOGUE DATA - FULL IMPORT from Catalogue_Template_TCMG_220925-2.xlsx
// Restructured for inventory management with warehouse locations and stock tracking
// ═══════════════════════════════════════════════════════════════════════════════════════

// Raw catalogue items from Excel import
const rawCatalogueItems = [
  { type: "Motor Starter", description: "Motor Starter Direct On Line 2.5 Amp", qty: 1 },
  { type: "Motor Starter", description: "Motor Starter Direct On Line 5.5 Amp", qty: 2 },
  { type: "Motor Starter", description: "Motor Starter Direct On Line 9 Amp", qty: 1 },
  { type: "Motor Starter", description: "Motor Starter Direct On Line 12 Amp", qty: 2 },
  { type: "Motor Starter", description: "Motor Starter Direct On Line 18 Amp", qty: 1 },
  { type: "Motor Starter", description: "Motor Starter Direct On Line 25 Amp", qty: 1 },
  { type: "Motor Starter", description: "Motor Starter Direct On Line 32 Amp", qty: 1 },
  { type: "Overload", description: "Thermal Overload Relay 0.63-1A", qty: 2 },
  { type: "Overload", description: "Thermal Overload Relay 1-1.6A", qty: 2 },
  { type: "Overload", description: "Thermal Overload Relay 1.6-2.5A", qty: 3 },
  { type: "Overload", description: "Thermal Overload Relay 2.5-4A", qty: 2 },
  { type: "Overload", description: "Thermal Overload Relay 4-6A", qty: 2 },
  { type: "Overload", description: "Thermal Overload Relay 5.5-8A", qty: 2 },
  { type: "Overload", description: "Thermal Overload Relay 7-10A", qty: 2 },
  { type: "Overload", description: "Thermal Overload Relay 9-13A", qty: 2 },
  { type: "Overload", description: "Thermal Overload Relay 12-18A", qty: 2 },
  { type: "Overload", description: "Thermal Overload Relay 17-25A", qty: 2 },
  { type: "Overload", description: "Thermal Overload Relay 23-32A", qty: 2 },
  { type: "Overload", description: "Thermal Overload Relay 30-40A", qty: 1 },
  { type: "Overload", description: "Thermal Overload Relay 37-50A", qty: 1 },
  { type: "Contactor", description: "Contactor 3 Pole 9A 240V Coil", qty: 2 },
  { type: "Contactor", description: "Contactor 3 Pole 12A 240V Coil", qty: 3 },
  { type: "Contactor", description: "Contactor 3 Pole 18A 240V Coil", qty: 2 },
  { type: "Contactor", description: "Contactor 3 Pole 25A 240V Coil", qty: 2 },
  { type: "Contactor", description: "Contactor 3 Pole 32A 240V Coil", qty: 2 },
  { type: "Contactor", description: "Contactor 3 Pole 40A 240V Coil", qty: 1 },
  { type: "Contactor", description: "Contactor 3 Pole 50A 240V Coil", qty: 1 },
  { type: "Contactor", description: "Contactor 3 Pole 65A 240V Coil", qty: 1 },
  { type: "Contactor", description: "Contactor 3 Pole 80A 240V Coil", qty: 1 },
  { type: "Contactor", description: "Contactor 3 Pole 95A 240V Coil", qty: 1 },
  { type: "Auxiliary", description: "Auxiliary Contact Block 1NO+1NC Front Mount", qty: 5 },
  { type: "Auxiliary", description: "Auxiliary Contact Block 2NO Front Mount", qty: 3 },
  { type: "Auxiliary", description: "Auxiliary Contact Block 2NC Front Mount", qty: 2 },
  { type: "Timer", description: "Timer Relay On Delay 0.1s-10s 240VAC", qty: 2 },
  { type: "Timer", description: "Timer Relay On Delay 1s-100s 240VAC", qty: 2 },
  { type: "Timer", description: "Timer Relay Off Delay 0.1s-10s 240VAC", qty: 2 },
  { type: "Timer", description: "Timer Relay Star Delta 0.1s-30s 240VAC", qty: 2 },
  { type: "Relay", description: "Relay 11 Pin 3PDT 240VAC Coil", qty: 5 },
  { type: "Relay", description: "Relay 8 Pin DPDT 240VAC Coil", qty: 5 },
  { type: "Relay", description: "Relay 8 Pin DPDT 24VDC Coil", qty: 5 },
  { type: "Relay Base", description: "Relay Base 11 Pin DIN Rail Mount", qty: 5 },
  { type: "Relay Base", description: "Relay Base 8 Pin DIN Rail Mount", qty: 5 },
  { type: "Circuit Breaker", description: "MCB 1 Pole 6A C Curve", qty: 5 },
  { type: "Circuit Breaker", description: "MCB 1 Pole 10A C Curve", qty: 5 },
  { type: "Circuit Breaker", description: "MCB 1 Pole 16A C Curve", qty: 5 },
  { type: "Circuit Breaker", description: "MCB 1 Pole 20A C Curve", qty: 3 },
  { type: "Circuit Breaker", description: "MCB 1 Pole 25A C Curve", qty: 3 },
  { type: "Circuit Breaker", description: "MCB 1 Pole 32A C Curve", qty: 3 },
  { type: "Circuit Breaker", description: "MCB 2 Pole 6A C Curve", qty: 3 },
  { type: "Circuit Breaker", description: "MCB 2 Pole 10A C Curve", qty: 3 },
  { type: "Circuit Breaker", description: "MCB 2 Pole 16A C Curve", qty: 3 },
  { type: "Circuit Breaker", description: "MCB 2 Pole 20A C Curve", qty: 2 },
  { type: "Circuit Breaker", description: "MCB 2 Pole 25A C Curve", qty: 2 },
  { type: "Circuit Breaker", description: "MCB 2 Pole 32A C Curve", qty: 2 },
  { type: "Circuit Breaker", description: "MCB 3 Pole 6A C Curve", qty: 2 },
  { type: "Circuit Breaker", description: "MCB 3 Pole 10A C Curve", qty: 2 },
  { type: "Circuit Breaker", description: "MCB 3 Pole 16A C Curve", qty: 2 },
  { type: "Circuit Breaker", description: "MCB 3 Pole 20A C Curve", qty: 2 },
  { type: "Circuit Breaker", description: "MCB 3 Pole 25A C Curve", qty: 2 },
  { type: "Circuit Breaker", description: "MCB 3 Pole 32A C Curve", qty: 2 },
  { type: "Circuit Breaker", description: "MCB 3 Pole 40A C Curve", qty: 2 },
  { type: "Circuit Breaker", description: "MCB 3 Pole 50A C Curve", qty: 1 },
  { type: "Circuit Breaker", description: "MCB 3 Pole 63A C Curve", qty: 1 },
  { type: "RCBO", description: "RCBO 1P+N 10A 30mA C Curve", qty: 3 },
  { type: "RCBO", description: "RCBO 1P+N 16A 30mA C Curve", qty: 3 },
  { type: "RCBO", description: "RCBO 1P+N 20A 30mA C Curve", qty: 3 },
  { type: "RCBO", description: "RCBO 1P+N 25A 30mA C Curve", qty: 2 },
  { type: "RCBO", description: "RCBO 1P+N 32A 30mA C Curve", qty: 2 },
  { type: "RCD", description: "RCD 2 Pole 25A 30mA", qty: 2 },
  { type: "RCD", description: "RCD 2 Pole 40A 30mA", qty: 2 },
  { type: "RCD", description: "RCD 2 Pole 63A 30mA", qty: 2 },
  { type: "RCD", description: "RCD 4 Pole 25A 30mA", qty: 2 },
  { type: "RCD", description: "RCD 4 Pole 40A 30mA", qty: 2 },
  { type: "RCD", description: "RCD 4 Pole 63A 30mA", qty: 2 },
  { type: "Isolator", description: "Isolator Switch 3 Pole 20A", qty: 2 },
  { type: "Isolator", description: "Isolator Switch 3 Pole 32A", qty: 2 },
  { type: "Isolator", description: "Isolator Switch 3 Pole 40A", qty: 2 },
  { type: "Isolator", description: "Isolator Switch 3 Pole 63A", qty: 2 },
  { type: "Isolator", description: "Isolator Switch 3 Pole 80A", qty: 1 },
  { type: "Isolator", description: "Isolator Switch 3 Pole 100A", qty: 1 },
  { type: "Fuse", description: "HRC Fuse Link 2A", qty: 10 },
  { type: "Fuse", description: "HRC Fuse Link 4A", qty: 10 },
  { type: "Fuse", description: "HRC Fuse Link 6A", qty: 10 },
  { type: "Fuse", description: "HRC Fuse Link 10A", qty: 10 },
  { type: "Fuse", description: "HRC Fuse Link 16A", qty: 10 },
  { type: "Fuse", description: "HRC Fuse Link 20A", qty: 10 },
  { type: "Fuse", description: "HRC Fuse Link 25A", qty: 5 },
  { type: "Fuse", description: "HRC Fuse Link 32A", qty: 5 },
  { type: "Fuse", description: "HRC Fuse Link 40A", qty: 5 },
  { type: "Fuse", description: "HRC Fuse Link 50A", qty: 5 },
  { type: "Fuse", description: "HRC Fuse Link 63A", qty: 5 },
  { type: "Fuse Holder", description: "Fuse Holder 1 Pole DIN Rail 10x38mm", qty: 5 },
  { type: "Fuse Holder", description: "Fuse Holder 3 Pole DIN Rail 10x38mm", qty: 3 },
  { type: "Power Supply", description: "Power Supply 24VDC 2.5A DIN Rail", qty: 2 },
  { type: "Power Supply", description: "Power Supply 24VDC 5A DIN Rail", qty: 2 },
  { type: "Power Supply", description: "Power Supply 24VDC 10A DIN Rail", qty: 1 },
  { type: "Power Supply", description: "Power Supply 24VDC 20A DIN Rail", qty: 1 },
  { type: "Terminal", description: "Terminal Block 2.5mm Grey DIN Rail", qty: 50 },
  { type: "Terminal", description: "Terminal Block 4mm Grey DIN Rail", qty: 50 },
  { type: "Terminal", description: "Terminal Block 6mm Grey DIN Rail", qty: 30 },
  { type: "Terminal", description: "Terminal Block 10mm Grey DIN Rail", qty: 20 },
  { type: "Terminal", description: "Terminal Block 16mm Grey DIN Rail", qty: 10 },
  { type: "Terminal", description: "Earth Terminal Block 4mm Green/Yellow", qty: 20 },
  { type: "Terminal", description: "Earth Terminal Block 6mm Green/Yellow", qty: 10 },
  { type: "End Stop", description: "End Stop for DIN Rail Terminals", qty: 50 },
  { type: "Push Button", description: "Push Button Momentary Green Flush 22mm", qty: 5 },
  { type: "Push Button", description: "Push Button Momentary Red Flush 22mm", qty: 5 },
  { type: "Push Button", description: "Push Button Momentary Black Flush 22mm", qty: 5 },
  { type: "Push Button", description: "Push Button Latching Red 22mm", qty: 3 },
  { type: "E-Stop", description: "Emergency Stop Push Button 40mm Twist Release", qty: 3 },
  { type: "E-Stop", description: "Emergency Stop Push Button 40mm Key Release", qty: 2 },
  { type: "Selector Switch", description: "Selector Switch 2 Position Stay Put 22mm", qty: 3 },
  { type: "Selector Switch", description: "Selector Switch 3 Position Stay Put 22mm", qty: 2 },
  { type: "Selector Switch", description: "Selector Switch 2 Position Key 22mm", qty: 2 },
  { type: "Indicator Light", description: "Indicator Light LED Green 22mm 240VAC", qty: 5 },
  { type: "Indicator Light", description: "Indicator Light LED Red 22mm 240VAC", qty: 5 },
  { type: "Indicator Light", description: "Indicator Light LED Amber 22mm 240VAC", qty: 5 },
  { type: "Indicator Light", description: "Indicator Light LED Blue 22mm 240VAC", qty: 3 },
  { type: "Indicator Light", description: "Indicator Light LED White 22mm 240VAC", qty: 3 },
  { type: "Contact Block", description: "Contact Block 1NO for 22mm Operators", qty: 10 },
  { type: "Contact Block", description: "Contact Block 1NC for 22mm Operators", qty: 10 },
  { type: "Contact Block", description: "Contact Block 2NO for 22mm Operators", qty: 5 },
  { type: "Limit Switch", description: "Limit Switch Roller Lever Metal Body", qty: 5 },
  { type: "Limit Switch", description: "Limit Switch Adjustable Roller Lever", qty: 3 },
  { type: "Limit Switch", description: "Limit Switch Spring Return Rod", qty: 3 },
  { type: "Proximity Sensor", description: "Proximity Sensor Inductive M12 4mm PNP NO", qty: 5 },
  { type: "Proximity Sensor", description: "Proximity Sensor Inductive M18 8mm PNP NO", qty: 5 },
  { type: "Proximity Sensor", description: "Proximity Sensor Inductive M30 15mm PNP NO", qty: 3 },
  { type: "Proximity Sensor", description: "Proximity Sensor Capacitive M18 8mm PNP NO", qty: 3 },
  { type: "Photoelectric", description: "Photoelectric Sensor Diffuse M18 100mm PNP", qty: 3 },
  { type: "Photoelectric", description: "Photoelectric Sensor Retro M18 3m PNP", qty: 3 },
  { type: "Photoelectric", description: "Photoelectric Sensor Through Beam M18 15m", qty: 2 },
  { type: "Cable Gland", description: "Cable Gland PG7 3-6.5mm Nylon Grey", qty: 50 },
  { type: "Cable Gland", description: "Cable Gland PG9 4-8mm Nylon Grey", qty: 50 },
  { type: "Cable Gland", description: "Cable Gland PG11 5-10mm Nylon Grey", qty: 50 },
  { type: "Cable Gland", description: "Cable Gland PG13.5 6-12mm Nylon Grey", qty: 50 },
  { type: "Cable Gland", description: "Cable Gland PG16 10-14mm Nylon Grey", qty: 30 },
  { type: "Cable Gland", description: "Cable Gland PG21 13-18mm Nylon Grey", qty: 20 },
  { type: "Cable Gland", description: "Cable Gland PG29 18-25mm Nylon Grey", qty: 10 },
  { type: "Cable Gland", description: "Cable Gland PG36 22-32mm Nylon Grey", qty: 10 },
  { type: "Cable Gland", description: "Cable Gland M20 Brass Nickel IP68", qty: 20 },
  { type: "Cable Gland", description: "Cable Gland M25 Brass Nickel IP68", qty: 20 },
  { type: "Cable Gland", description: "Cable Gland M32 Brass Nickel IP68", qty: 10 },
  { type: "Cable Gland", description: "Cable Gland M40 Brass Nickel IP68", qty: 10 },
  { type: "Cable Gland", description: "Cable Gland M50 Brass Nickel IP68", qty: 5 },
  { type: "Cable Gland", description: "Cable Gland M63 Brass Nickel IP68", qty: 5 },
  { type: "Conduit", description: "Flexible Conduit 20mm PVC Black per Metre", qty: 100 },
  { type: "Conduit", description: "Flexible Conduit 25mm PVC Black per Metre", qty: 50 },
  { type: "Conduit", description: "Flexible Conduit 32mm PVC Black per Metre", qty: 30 },
  { type: "Conduit Fitting", description: "Conduit Gland Straight 20mm", qty: 30 },
  { type: "Conduit Fitting", description: "Conduit Gland Straight 25mm", qty: 20 },
  { type: "Conduit Fitting", description: "Conduit Gland 90 Degree 20mm", qty: 20 },
  { type: "Conduit Fitting", description: "Conduit Gland 90 Degree 25mm", qty: 10 },
  { type: "Cable Tie", description: "Cable Tie 100mm x 2.5mm Black Pack 100", qty: 10 },
  { type: "Cable Tie", description: "Cable Tie 200mm x 3.6mm Black Pack 100", qty: 10 },
  { type: "Cable Tie", description: "Cable Tie 300mm x 4.8mm Black Pack 100", qty: 5 },
  { type: "Cable Tie", description: "Cable Tie 370mm x 4.8mm Black Pack 100", qty: 5 },
  { type: "Cable Tie", description: "Cable Tie 200mm x 4.8mm UV Black Pack 100", qty: 5 },
  { type: "Cable Tie", description: "Cable Tie 300mm x 7.6mm UV Black Pack 100", qty: 5 },
  { type: "Heat Shrink", description: "Heat Shrink Tubing 3.2mm Black 1.2m", qty: 20 },
  { type: "Heat Shrink", description: "Heat Shrink Tubing 6.4mm Black 1.2m", qty: 20 },
  { type: "Heat Shrink", description: "Heat Shrink Tubing 9.5mm Black 1.2m", qty: 10 },
  { type: "Heat Shrink", description: "Heat Shrink Tubing 12.7mm Black 1.2m", qty: 10 },
  { type: "Heat Shrink", description: "Heat Shrink Tubing 19.1mm Black 1.2m", qty: 5 },
  { type: "Heat Shrink", description: "Heat Shrink Tubing 25.4mm Black 1.2m", qty: 5 },
  { type: "Crimp Terminal", description: "Crimp Terminal Ring 1.5mm² M4 Blue", qty: 100 },
  { type: "Crimp Terminal", description: "Crimp Terminal Ring 1.5mm² M5 Blue", qty: 100 },
  { type: "Crimp Terminal", description: "Crimp Terminal Ring 2.5mm² M5 Blue", qty: 100 },
  { type: "Crimp Terminal", description: "Crimp Terminal Ring 2.5mm² M6 Blue", qty: 100 },
  { type: "Crimp Terminal", description: "Crimp Terminal Ring 6mm² M6 Yellow", qty: 50 },
  { type: "Crimp Terminal", description: "Crimp Terminal Ring 6mm² M8 Yellow", qty: 50 },
  { type: "Crimp Terminal", description: "Crimp Terminal Fork 1.5mm² M4 Blue", qty: 100 },
  { type: "Crimp Terminal", description: "Crimp Terminal Fork 2.5mm² M5 Blue", qty: 100 },
  { type: "Crimp Terminal", description: "Boot Lace Ferrule 0.5mm² Orange", qty: 100 },
  { type: "Crimp Terminal", description: "Boot Lace Ferrule 0.75mm² White", qty: 100 },
  { type: "Crimp Terminal", description: "Boot Lace Ferrule 1.0mm² Red", qty: 100 },
  { type: "Crimp Terminal", description: "Boot Lace Ferrule 1.5mm² Black", qty: 100 },
  { type: "Crimp Terminal", description: "Boot Lace Ferrule 2.5mm² Grey", qty: 100 },
  { type: "Crimp Terminal", description: "Boot Lace Ferrule 4.0mm² Orange", qty: 50 },
  { type: "Crimp Terminal", description: "Boot Lace Ferrule 6.0mm² Green", qty: 50 },
  { type: "Tape", description: "Electrical Tape PVC 18mm x 20m Black", qty: 20 },
  { type: "Tape", description: "Electrical Tape PVC 18mm x 20m Red", qty: 10 },
  { type: "Tape", description: "Electrical Tape PVC 18mm x 20m Blue", qty: 10 },
  { type: "Tape", description: "Electrical Tape PVC 18mm x 20m Green/Yellow", qty: 10 },
  { type: "Tape", description: "Self-Amalgamating Tape 25mm x 10m", qty: 5 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6205 2RS", qty: 10 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6206 2RS", qty: 10 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6207 2RS", qty: 8 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6208 2RS", qty: 8 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6209 2RS", qty: 6 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6210 2RS", qty: 6 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6211 2RS", qty: 4 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6212 2RS", qty: 4 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6305 2RS", qty: 8 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6306 2RS", qty: 8 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6307 2RS", qty: 6 },
  { type: "Bearing", description: "Deep Groove Ball Bearing 6308 2RS", qty: 6 },
  { type: "Bearing", description: "Spherical Roller Bearing 22210 E", qty: 4 },
  { type: "Bearing", description: "Spherical Roller Bearing 22211 E", qty: 4 },
  { type: "Bearing", description: "Spherical Roller Bearing 22212 E", qty: 4 },
  { type: "Bearing", description: "Spherical Roller Bearing 22213 E", qty: 3 },
  { type: "Bearing", description: "Spherical Roller Bearing 22214 E", qty: 3 },
  { type: "Bearing", description: "Taper Roller Bearing 30205", qty: 4 },
  { type: "Bearing", description: "Taper Roller Bearing 30206", qty: 4 },
  { type: "Bearing", description: "Taper Roller Bearing 30207", qty: 4 },
  { type: "Bearing", description: "Taper Roller Bearing 30208", qty: 4 },
  { type: "Bearing", description: "Pillow Block Bearing UCP205", qty: 4 },
  { type: "Bearing", description: "Pillow Block Bearing UCP206", qty: 4 },
  { type: "Bearing", description: "Pillow Block Bearing UCP207", qty: 3 },
  { type: "Bearing", description: "Pillow Block Bearing UCP208", qty: 3 },
  { type: "Bearing", description: "Flange Bearing Unit UCFL205", qty: 4 },
  { type: "Bearing", description: "Flange Bearing Unit UCFL206", qty: 4 },
  { type: "Seal", description: "Oil Seal 25x42x7 NBR", qty: 10 },
  { type: "Seal", description: "Oil Seal 30x47x7 NBR", qty: 10 },
  { type: "Seal", description: "Oil Seal 35x52x7 NBR", qty: 10 },
  { type: "Seal", description: "Oil Seal 40x62x8 NBR", qty: 8 },
  { type: "Seal", description: "Oil Seal 45x68x8 NBR", qty: 8 },
  { type: "Seal", description: "Oil Seal 50x72x8 NBR", qty: 6 },
  { type: "Seal", description: "Oil Seal 55x80x10 NBR", qty: 6 },
  { type: "Seal", description: "Oil Seal 60x85x10 NBR", qty: 4 },
  { type: "Seal", description: "Oil Seal 70x90x10 NBR", qty: 4 },
  { type: "Seal", description: "Oil Seal 80x100x10 NBR", qty: 4 },
  { type: "V-Belt", description: "V-Belt A40 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt A42 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt A44 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt A46 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt A48 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt A50 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt B50 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt B52 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt B54 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt B56 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt B58 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt B60 Classical", qty: 4 },
  { type: "V-Belt", description: "V-Belt SPA1000 Wedge", qty: 3 },
  { type: "V-Belt", description: "V-Belt SPA1060 Wedge", qty: 3 },
  { type: "V-Belt", description: "V-Belt SPA1120 Wedge", qty: 3 },
  { type: "V-Belt", description: "V-Belt SPB1250 Wedge", qty: 3 },
  { type: "V-Belt", description: "V-Belt SPB1400 Wedge", qty: 3 },
  { type: "V-Belt", description: "V-Belt SPB1600 Wedge", qty: 3 },
  { type: "Grease", description: "Grease EP2 Lithium 450g Cartridge", qty: 24 },
  { type: "Grease", description: "Grease Moly EP2 450g Cartridge", qty: 12 },
  { type: "Grease", description: "Grease Food Grade 450g Cartridge", qty: 6 },
  { type: "Oil", description: "Hydraulic Oil ISO 46 20L", qty: 4 },
  { type: "Oil", description: "Hydraulic Oil ISO 68 20L", qty: 4 },
  { type: "Oil", description: "Gear Oil ISO 220 20L", qty: 4 },
  { type: "Oil", description: "Gear Oil ISO 320 20L", qty: 4 },
  { type: "Oil", description: "Gear Oil ISO 460 20L", qty: 2 },
  { type: "Oil", description: "Compressor Oil ISO 100 20L", qty: 2 },
  { type: "Filter", description: "Air Filter Element Compressor Atlas Copco", qty: 4 },
  { type: "Filter", description: "Oil Filter Element Compressor Atlas Copco", qty: 4 },
  { type: "Filter", description: "Oil Filter Separator Compressor Atlas Copco", qty: 2 },
  { type: "Filter", description: "Hydraulic Filter Element 10 Micron", qty: 6 },
  { type: "Filter", description: "Hydraulic Filter Element 25 Micron", qty: 6 },
  { type: "Filter", description: "Hydraulic Return Filter 10 Micron", qty: 4 },
  { type: "Filter", description: "Hydraulic Suction Strainer 100 Mesh", qty: 4 },
  { type: "Valve", description: "Ball Valve Brass 15mm", qty: 10 },
  { type: "Valve", description: "Ball Valve Brass 20mm", qty: 10 },
  { type: "Valve", description: "Ball Valve Brass 25mm", qty: 8 },
  { type: "Valve", description: "Ball Valve Brass 32mm", qty: 6 },
  { type: "Valve", description: "Ball Valve Brass 40mm", qty: 4 },
  { type: "Valve", description: "Ball Valve Brass 50mm", qty: 4 },
  { type: "Valve", description: "Gate Valve Brass 25mm", qty: 4 },
  { type: "Valve", description: "Gate Valve Brass 40mm", qty: 4 },
  { type: "Valve", description: "Gate Valve Brass 50mm", qty: 4 },
  { type: "Valve", description: "Check Valve Brass 25mm", qty: 6 },
  { type: "Valve", description: "Check Valve Brass 40mm", qty: 4 },
  { type: "Valve", description: "Check Valve Brass 50mm", qty: 4 },
  { type: "Fitting", description: "Poly Fitting Elbow 25mm", qty: 20 },
  { type: "Fitting", description: "Poly Fitting Elbow 32mm", qty: 20 },
  { type: "Fitting", description: "Poly Fitting Elbow 40mm", qty: 15 },
  { type: "Fitting", description: "Poly Fitting Elbow 50mm", qty: 15 },
  { type: "Fitting", description: "Poly Fitting Tee 25mm", qty: 15 },
  { type: "Fitting", description: "Poly Fitting Tee 32mm", qty: 15 },
  { type: "Fitting", description: "Poly Fitting Tee 40mm", qty: 10 },
  { type: "Fitting", description: "Poly Fitting Tee 50mm", qty: 10 },
  { type: "Fitting", description: "Poly Fitting Coupling 25mm", qty: 15 },
  { type: "Fitting", description: "Poly Fitting Coupling 32mm", qty: 15 },
  { type: "Fitting", description: "Poly Fitting Coupling 40mm", qty: 10 },
  { type: "Fitting", description: "Poly Fitting Coupling 50mm", qty: 10 },
  { type: "Fitting", description: "Poly Fitting End Cap 25mm", qty: 10 },
  { type: "Fitting", description: "Poly Fitting End Cap 32mm", qty: 10 },
  { type: "Fitting", description: "Poly Fitting End Cap 40mm", qty: 5 },
  { type: "Fitting", description: "Poly Fitting End Cap 50mm", qty: 5 },
  { type: "Pneumatic Fitting", description: "Push Fit Straight 6mm", qty: 20 },
  { type: "Pneumatic Fitting", description: "Push Fit Straight 8mm", qty: 20 },
  { type: "Pneumatic Fitting", description: "Push Fit Straight 10mm", qty: 15 },
  { type: "Pneumatic Fitting", description: "Push Fit Straight 12mm", qty: 15 },
  { type: "Pneumatic Fitting", description: "Push Fit Elbow 6mm", qty: 15 },
  { type: "Pneumatic Fitting", description: "Push Fit Elbow 8mm", qty: 15 },
  { type: "Pneumatic Fitting", description: "Push Fit Elbow 10mm", qty: 10 },
  { type: "Pneumatic Fitting", description: "Push Fit Elbow 12mm", qty: 10 },
  { type: "Pneumatic Fitting", description: "Push Fit Tee 6mm", qty: 10 },
  { type: "Pneumatic Fitting", description: "Push Fit Tee 8mm", qty: 10 },
  { type: "Pneumatic Fitting", description: "Push Fit Tee 10mm", qty: 8 },
  { type: "Pneumatic Fitting", description: "Push Fit Tee 12mm", qty: 8 },
  { type: "Pneumatic Tubing", description: "Polyurethane Tubing 6mm Blue per Metre", qty: 100 },
  { type: "Pneumatic Tubing", description: "Polyurethane Tubing 8mm Blue per Metre", qty: 100 },
  { type: "Pneumatic Tubing", description: "Polyurethane Tubing 10mm Blue per Metre", qty: 50 },
  { type: "Pneumatic Tubing", description: "Polyurethane Tubing 12mm Blue per Metre", qty: 50 },
  { type: "Solenoid Valve", description: "Solenoid Valve 2/2 NC 1/4\" 24VDC", qty: 4 },
  { type: "Solenoid Valve", description: "Solenoid Valve 2/2 NC 1/2\" 24VDC", qty: 4 },
  { type: "Solenoid Valve", description: "Solenoid Valve 5/2 1/4\" 24VDC", qty: 4 },
  { type: "Solenoid Valve", description: "Solenoid Valve 5/3 1/4\" 24VDC Centre Exhaust", qty: 2 },
  { type: "Air Regulator", description: "Air Filter Regulator 1/4\" with Gauge", qty: 4 },
  { type: "Air Regulator", description: "Air Filter Regulator 1/2\" with Gauge", qty: 4 },
  { type: "Air Regulator", description: "Lubricator 1/4\"", qty: 4 },
  { type: "Air Regulator", description: "FRL Unit 1/4\" Complete", qty: 2 },
  { type: "Air Regulator", description: "FRL Unit 1/2\" Complete", qty: 2 },
  { type: "Pressure Gauge", description: "Pressure Gauge 0-10 Bar 63mm Bottom Entry", qty: 6 },
  { type: "Pressure Gauge", description: "Pressure Gauge 0-16 Bar 63mm Bottom Entry", qty: 6 },
  { type: "Pressure Gauge", description: "Pressure Gauge 0-25 Bar 63mm Bottom Entry", qty: 4 },
  { type: "Pressure Gauge", description: "Pressure Gauge 0-100 Bar 63mm Bottom Entry", qty: 4 },
  { type: "Temperature Gauge", description: "Temperature Gauge 0-120°C 100mm Stem", qty: 4 },
  { type: "Temperature Gauge", description: "Temperature Gauge 0-200°C 100mm Stem", qty: 4 },
  { type: "Level Gauge", description: "Level Gauge Sight Glass 150mm", qty: 4 },
  { type: "Level Gauge", description: "Level Gauge Sight Glass 250mm", qty: 4 },
  { type: "Transmitter", description: "Pressure Transmitter 4-20mA 0-10 Bar", qty: 2 },
  { type: "Transmitter", description: "Pressure Transmitter 4-20mA 0-16 Bar", qty: 2 },
  { type: "Transmitter", description: "Temperature Transmitter 4-20mA PT100", qty: 2 },
  { type: "Transmitter", description: "Level Transmitter 4-20mA Ultrasonic 5m", qty: 2 },
  { type: "Float Switch", description: "Float Switch Vertical PP 1m Cable", qty: 4 },
  { type: "Float Switch", description: "Float Switch Horizontal SS M20", qty: 4 },
  { type: "Welding", description: "Welding Electrode 2.5mm E6013 5kg", qty: 10 },
  { type: "Welding", description: "Welding Electrode 3.2mm E6013 5kg", qty: 10 },
  { type: "Welding", description: "Welding Electrode 4.0mm E6013 5kg", qty: 5 },
  { type: "Welding", description: "Welding Wire MIG 0.8mm 15kg", qty: 4 },
  { type: "Welding", description: "Welding Wire MIG 0.9mm 15kg", qty: 4 },
  { type: "Welding", description: "Welding Wire MIG 1.0mm 15kg", qty: 2 },
  { type: "Welding", description: "Welding Gas CO2 G Size", qty: 2 },
  { type: "Welding", description: "Welding Gas Argon/CO2 Mix G Size", qty: 2 },
  { type: "Cutting", description: "Cutting Disc 100mm x 1mm", qty: 50 },
  { type: "Cutting", description: "Cutting Disc 125mm x 1mm", qty: 50 },
  { type: "Cutting", description: "Grinding Disc 100mm x 6mm", qty: 30 },
  { type: "Cutting", description: "Grinding Disc 125mm x 6mm", qty: 30 },
  { type: "Cutting", description: "Flap Disc 100mm 40 Grit", qty: 20 },
  { type: "Cutting", description: "Flap Disc 100mm 60 Grit", qty: 20 },
  { type: "Cutting", description: "Flap Disc 100mm 80 Grit", qty: 20 },
  { type: "Fastener", description: "Hex Bolt M8x25 Zinc", qty: 100 },
  { type: "Fastener", description: "Hex Bolt M8x40 Zinc", qty: 100 },
  { type: "Fastener", description: "Hex Bolt M10x30 Zinc", qty: 100 },
  { type: "Fastener", description: "Hex Bolt M10x50 Zinc", qty: 100 },
  { type: "Fastener", description: "Hex Bolt M12x40 Zinc", qty: 50 },
  { type: "Fastener", description: "Hex Bolt M12x60 Zinc", qty: 50 },
  { type: "Fastener", description: "Hex Bolt M16x50 Zinc", qty: 30 },
  { type: "Fastener", description: "Hex Bolt M16x80 Zinc", qty: 30 },
  { type: "Fastener", description: "Hex Nut M8 Zinc", qty: 200 },
  { type: "Fastener", description: "Hex Nut M10 Zinc", qty: 200 },
  { type: "Fastener", description: "Hex Nut M12 Zinc", qty: 100 },
  { type: "Fastener", description: "Hex Nut M16 Zinc", qty: 50 },
  { type: "Fastener", description: "Flat Washer M8 Zinc", qty: 200 },
  { type: "Fastener", description: "Flat Washer M10 Zinc", qty: 200 },
  { type: "Fastener", description: "Flat Washer M12 Zinc", qty: 100 },
  { type: "Fastener", description: "Flat Washer M16 Zinc", qty: 50 },
  { type: "Fastener", description: "Spring Washer M8 Zinc", qty: 200 },
  { type: "Fastener", description: "Spring Washer M10 Zinc", qty: 200 },
  { type: "Fastener", description: "Spring Washer M12 Zinc", qty: 100 },
  { type: "Fastener", description: "Spring Washer M16 Zinc", qty: 50 },
  { type: "Fastener", description: "Socket Head Cap Screw M6x20 Black", qty: 50 },
  { type: "Fastener", description: "Socket Head Cap Screw M8x25 Black", qty: 50 },
  { type: "Fastener", description: "Socket Head Cap Screw M10x30 Black", qty: 50 },
  { type: "Fastener", description: "Set Screw M8x20 Zinc", qty: 50 },
  { type: "Fastener", description: "Set Screw M10x25 Zinc", qty: 50 },
  { type: "Fastener", description: "Set Screw M12x30 Zinc", qty: 30 },
  { type: "Stainless Fastener", description: "Hex Bolt M8x25 SS316", qty: 50 },
  { type: "Stainless Fastener", description: "Hex Bolt M10x40 SS316", qty: 50 },
  { type: "Stainless Fastener", description: "Hex Bolt M12x50 SS316", qty: 30 },
  { type: "Stainless Fastener", description: "Hex Nut M8 SS316", qty: 100 },
  { type: "Stainless Fastener", description: "Hex Nut M10 SS316", qty: 100 },
  { type: "Stainless Fastener", description: "Hex Nut M12 SS316", qty: 50 },
  { type: "Anchor", description: "Chemical Anchor M10x130", qty: 20 },
  { type: "Anchor", description: "Chemical Anchor M12x160", qty: 20 },
  { type: "Anchor", description: "Drop In Anchor M10", qty: 30 },
  { type: "Anchor", description: "Drop In Anchor M12", qty: 20 },
  { type: "Anchor", description: "Wedge Anchor M10x100", qty: 30 },
  { type: "Anchor", description: "Wedge Anchor M12x120", qty: 20 },
];

// Transform raw catalogue to SiteSpareItem format
const catalogueItems: SiteSpareItem[] = rawCatalogueItems.map((item, index) => {
  const { category, subcategory } = determineCategory(item.description, item.type);
  const location = generateBinLocation(index);
  const qtyOnHand = item.qty;
  const minQty = Math.max(1, Math.floor(item.qty / 3));
  const maxQty = item.qty * 2;
  
  return {
    id: `STK-${String(index + 1).padStart(4, "0")}`,
    partNumber: "",  // To be assigned - part numbering logic not yet defined
    description: item.description,
    category,
    subcategory,
    manufacturer: "",
    oemPartNumber: "",
    alternatePartNumber: "",
    specifications: "",
    warehouseArea: location.warehouseArea,
    aisle: location.aisle,
    rack: location.rack,
    binLocation: location.binLocation,
    qtyOnHand,
    minQty,
    maxQty,
    reorderPoint: minQty,
    uom: item.type.includes("Metre") || item.description.includes("per Metre") ? "M" : 
         item.type.includes("Pack") || item.description.includes("Pack") ? "PKT" :
         item.description.includes("20L") || item.description.includes("per Litre") ? "L" :
         item.description.includes("5kg") || item.description.includes("15kg") ? "KG" : "EA",
    unitCost: 0,
    preferredSupplier: "",
    leadTimeDays: 0,
    lastPurchaseDate: "",
    status: getStockStatus(qtyOnHand, minQty),
    isCritical: category === "Electrical" && (subcategory === "Motors" || subcategory === "PLCs"),
    notes: "",
  };
});

export const siteSparesData: SiteSpareItem[] = catalogueItems;
