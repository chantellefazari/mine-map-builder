import { useState } from "react";
import { Link } from "react-router-dom";
import { AssetTree as AssetTreeComponent } from "@/components/hierarchy/AssetTree";
import { Legend } from "@/components/hierarchy/Legend";
import { AssetSearch } from "@/components/hierarchy/AssetSearch";
import { FunctionalLocationTable } from "@/components/hierarchy/FunctionalLocationTable";
import { CRUFunctionalLocationTable } from "@/components/hierarchy/CRUFunctionalLocationTable";
import { NamingConvention } from "@/components/hierarchy/NamingConvention";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreePine, TableProperties, ArrowLeft, BookText, Download, FileSpreadsheet, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportAssetTreeCSV } from "@/utils/exportAssetTreeCSV";
import { exportNamingConventionCSV } from "@/utils/exportNamingConventionCSV";
import { exportAssetTreeWorkbook } from "@/utils/exportAssetTreeWorkbook";

const AssetTree = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <span className="text-primary-foreground font-bold text-lg">TC</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">
                  Asset Tree
                </h1>
                <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                  LOCKED
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                TCMG Processing Plant Structure — Single Source of Truth
              </p>
            </div>
            <Button onClick={exportAssetTreeWorkbook} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Download Workbook
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-primary text-sm">i</span>
          </div>
          <div className="text-sm">
            <p className="text-foreground font-medium">
              This asset hierarchy is LOCKED and validated for CMMS/D365 readiness.
            </p>
            <p className="text-muted-foreground mt-1">
              Structure follows: Site → Facility → Area → Sub-Area → Parent Asset → Components. No auto-changes permitted.
            </p>
          </div>
        </div>

        {/* Tabs: Asset Tree, Functional Locations, and Naming Convention */}
        <Tabs defaultValue="hierarchy" className="w-full">
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="hierarchy" className="gap-2 text-xs sm:text-sm">
              <TreePine className="h-4 w-4" />
              <span className="hidden sm:inline">Asset Hierarchy</span>
              <span className="sm:hidden">Hierarchy</span>
            </TabsTrigger>
            <TabsTrigger value="functional-locations" className="gap-2 text-xs sm:text-sm">
              <TableProperties className="h-4 w-4" />
              <span className="hidden sm:inline">PRO Func. Locations</span>
              <span className="sm:hidden">PRO FL</span>
            </TabsTrigger>
            <TabsTrigger value="cru-functional-locations" className="gap-2 text-xs sm:text-sm">
              <HardHat className="h-4 w-4" />
              <span className="hidden sm:inline">CRU Func. Locations</span>
              <span className="sm:hidden">CRU FL</span>
            </TabsTrigger>
            <TabsTrigger value="naming-convention" className="gap-2 text-xs sm:text-sm">
              <BookText className="h-4 w-4" />
              <span className="hidden sm:inline">PRO Naming Conv.</span>
              <span className="sm:hidden">PRO NC</span>
            </TabsTrigger>
            <TabsTrigger value="cru-naming-convention" className="gap-2 text-xs sm:text-sm">
              <BookText className="h-4 w-4" />
              <span className="hidden sm:inline">CRU Naming Conv.</span>
              <span className="sm:hidden">CRU NC</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hierarchy" className="mt-6 space-y-6">
            {/* Legend */}
            <Legend />

            {/* Hierarchy Diagram */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Asset Structure
                  </h2>
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                    Levels 1–7 • Click nodes to expand
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AssetSearch value={searchQuery} onChange={setSearchQuery} />
                  <Button variant="outline" size="sm" onClick={exportAssetTreeCSV} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </div>
              
              <AssetTreeComponent searchQuery={searchQuery} />
            </div>
          </TabsContent>

          <TabsContent value="functional-locations" className="mt-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <FunctionalLocationTable />
            </div>
          </TabsContent>

          <TabsContent value="cru-functional-locations" className="mt-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <CRUFunctionalLocationTable />
            </div>
          </TabsContent>

          <TabsContent value="naming-convention" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={exportNamingConventionCSV} className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
            <NamingConvention />
          </TabsContent>

          <TabsContent value="cru-naming-convention" className="mt-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">CRU Naming Convention</h2>
                <p className="text-sm text-muted-foreground">TCMG Crushing Plant — Equipment Tags & Functional Location Format</p>
              </div>

              {/* FL Format */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 p-4">
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Functional Location Format</h3>
                <code className="text-sm font-mono text-amber-700 dark:text-amber-400">TCMG-CRU-[AREA]-[EQUIPMENT]</code>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">FLs stop at SYSTEM/EQUIPMENT level. Sub-components do NOT receive FL codes.</p>
              </div>

              {/* Area Codes */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">CRU Area Codes</h3>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-muted/50"><th className="text-left p-3 font-semibold">Code</th><th className="text-left p-3 font-semibold">Area Name</th><th className="text-left p-3 font-semibold">Description</th></tr></thead>
                    <tbody>
                      {[
                        { code: "CRU-ROM", name: "ROM & Primary Feed", desc: "Run of Mine wall, primary feeder, feed chutes" },
                        { code: "CRU-PRI", name: "Primary Crushing", desc: "Jaw crusher CR01, forward conveyor CV01" },
                        { code: "CRU-SCR", name: "Screening Section", desc: "Screen feed bin, SC01 vibrating screen, CV04" },
                        { code: "CRU-SEC", name: "Secondary / Tertiary Crushing", desc: "Cone feed bin, CR02 & CR03 cone crushers" },
                        { code: "CRU-STK", name: "Conveying & Stockpiling", desc: "All product conveyors CV02–CV15, radial stackers" },
                        { code: "CRU-CTL", name: "Controls & MCC", desc: "MCC, PLC, HMI, SCADA, operators cabin, earth grid" },
                        { code: "CRU-DUS", name: "Dust Suppression", desc: "Dust pump, spray system, poly pipe, nozzles" },
                      ].map((row, i) => (
                        <tr key={row.code} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                          <td className="p-3 font-mono font-medium text-primary">{row.code}</td>
                          <td className="p-3 font-medium">{row.name}</td>
                          <td className="p-3 text-muted-foreground">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Equipment Prefixes */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">CRU Equipment Prefixes</h3>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-muted/50"><th className="text-left p-3 font-semibold">Prefix</th><th className="text-left p-3 font-semibold">Meaning</th><th className="text-left p-3 font-semibold">Example</th><th className="text-left p-3 font-semibold">Category</th></tr></thead>
                    <tbody>
                      {[
                        { prefix: "CR", meaning: "Crusher", example: "CR01 (Jaw), CR02/CR03 (Cone)", category: "Crushing" },
                        { prefix: "CV", meaning: "Conveyor", example: "CV01–CV15", category: "Conveying" },
                        { prefix: "SC", meaning: "Screen", example: "SC01 – BWC208", category: "Screening" },
                        { prefix: "FDR", meaning: "Feeder / Vibrating Feeder", example: "ROM-FDR01, SCR-FDB01-FDR01", category: "Feed Systems" },
                        { prefix: "FDB", meaning: "Feed Bin", example: "SCR-FDB01, SEC-CFB01", category: "Feed Systems" },
                        { prefix: "MCC", meaning: "Motor Control Centre", example: "CRU-CTL-MCC01", category: "Controls" },
                        { prefix: "PLC", meaning: "Programmable Logic Controller", example: "CRU-CTL-PLC01", category: "Controls" },
                        { prefix: "HMI", meaning: "Human Machine Interface", example: "CRU-CTL-HMI01", category: "Controls" },
                        { prefix: "SCADA", meaning: "SCADA Server & Workstation", example: "CRU-CTL-SCADA01", category: "Controls" },
                        { prefix: "ROM", meaning: "Run of Mine (Wall/Area)", example: "ROM-WALL01", category: "ROM" },
                      ].map((row, i) => (
                        <tr key={row.prefix} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                          <td className="p-3 font-mono font-medium text-primary">{row.prefix}</td>
                          <td className="p-3">{row.meaning}</td>
                          <td className="p-3 font-mono text-xs text-muted-foreground">{row.example}</td>
                          <td className="p-3 text-muted-foreground">{row.category}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Component Suffixes */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">CRU Component Suffixes</h3>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-muted/50"><th className="text-left p-3 font-semibold">Suffix</th><th className="text-left p-3 font-semibold">Meaning</th><th className="text-left p-3 font-semibold">Example</th></tr></thead>
                    <tbody>
                      {[
                        { suffix: "MTR", meaning: "Motor", example: "CR01-MTR01, CV01-MTR01" },
                        { suffix: "GBX", meaning: "Gearbox / Gear Motor", example: "CV02-GBX01" },
                        { suffix: "BLT", meaning: "Conveyor Belt", example: "CV02-BLT01" },
                        { suffix: "HDR", meaning: "Head Drum", example: "CV02-HDR01" },
                        { suffix: "TDR", meaning: "Tail Drum", example: "CV02-TDR01" },
                        { suffix: "IDL", meaning: "Idlers", example: "CV02-IDL01" },
                        { suffix: "SCR", meaning: "Belt Scraper", example: "CV02-SCR01" },
                        { suffix: "LNY", meaning: "Lanyard Safety Switch", example: "CV02-LNY01" },
                        { suffix: "SPD", meaning: "Speed Detection Sensor", example: "CV02-SPD01" },
                        { suffix: "IMP", meaning: "Impact Bed / Impact Rollers", example: "CV01-IMP01" },
                        { suffix: "SKT", meaning: "Skirt Panels / Rock Ledges", example: "CV02-SKT01" },
                        { suffix: "WGH", meaning: "Belt Weigher / Weigh Scale", example: "CV02-WGH01" },
                        { suffix: "MDT", meaning: "Metal Detector", example: "CV07-MDT01" },
                        { suffix: "RAD", meaning: "Radial Drive", example: "CV12-RAD01" },
                        { suffix: "EXC", meaning: "Exciter Unit (Feeder/Screen)", example: "SCR-FDB01-FDR01-EXC01" },
                        { suffix: "VSD", meaning: "Variable Speed Drive", example: "ROM-FDR01-VSD01" },
                        { suffix: "JAW", meaning: "Jaw Assembly", example: "CR01-JAW01" },
                        { suffix: "BDY", meaning: "Crusher Body", example: "CR01-BDY01" },
                        { suffix: "JKS", meaning: "Jackshaft Assembly", example: "CR01-JKS01" },
                        { suffix: "BRG", meaning: "Bearings", example: "CR01-BRG01" },
                        { suffix: "LUB", meaning: "Lube System / Tank", example: "CR02-LUB01" },
                        { suffix: "HYD", meaning: "Hydraulic System / Tank", example: "CR02-HYD01" },
                        { suffix: "CYL", meaning: "Hydraulic Cylinders (tramp release)", example: "CR02-CYL01" },
                        { suffix: "DK", meaning: "Screen Deck", example: "SC01-DK01, SC01-DK02" },
                        { suffix: "LVL", meaning: "Level Sensor", example: "SCR-FDB01-LVL01" },
                        { suffix: "CHT", meaning: "Head Chute / Discharge Chute", example: "CV03-CHT01" },
                        { suffix: "PLT", meaning: "Access Platform", example: "SC01-PLT01" },
                      ].map((row, i) => (
                        <tr key={row.suffix} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                          <td className="p-3 font-mono font-medium text-primary">{row.suffix}</td>
                          <td className="p-3">{row.meaning}</td>
                          <td className="p-3 font-mono text-xs text-muted-foreground">{row.example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Asset Naming Format */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Asset Naming Format</h3>
                <div className="rounded-lg border border-border p-4 bg-muted/20 space-y-2">
                  <code className="block text-sm font-mono">[Asset Tag] – [Equipment Type] – [Description]</code>
                  <div className="text-xs text-muted-foreground space-y-1 pt-2">
                    <p>• <code className="font-mono">CR01 – Jaw Crusher – JM120</code></p>
                    <p>• <code className="font-mono">CV02 – Conveyor – Jaw & Cone Discharge</code></p>
                    <p>• <code className="font-mono">SC01 – Screen – BWC208 20x8</code></p>
                    <p>• <code className="font-mono">CR02 – Cone Crusher – CS400</code></p>
                    <p>• <code className="font-mono">CR03 – Cone Crusher – CS3</code></p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                CRU assets are governed separately from Processing Plant (PRO) • All CRU tags are unique • Follow flow: ROM → PRI → SCR → SEC → STK
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AssetTree;
