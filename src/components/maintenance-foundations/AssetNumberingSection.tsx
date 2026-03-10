import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, CheckCircle2, Info, AlertTriangle, Lock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const AssetNumberingSection = () => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Hash className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Functional Location Codes</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tennant Creek Gold Mine (TCMG) — Site-Specific Standards
              </p>
            </div>
          </div>
          <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Defined & Stable
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current FL Format */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Current FL Code Format</h4>
          <div className="inline-block bg-background border border-border rounded-lg px-4 py-3">
            <code className="text-lg font-mono font-bold text-primary">TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]</code>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
            {[
              { code: "TCMG", meaning: "Tennant Creek Gold Mine" },
              { code: "PP", meaning: "Process Plant" },
              { code: "AREA", meaning: "Major plant area" },
              { code: "SUBAREA", meaning: "Logical sub-area" },
              { code: "SYSTEM", meaning: "Parent Asset / System" },
            ].map((item) => (
              <div key={item.code} className="bg-background border border-border rounded-md p-2 text-center">
                <div className="font-mono font-bold text-primary">{item.code}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.meaning}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-2">Purpose of Functional Location Codes</h4>
              <p className="text-sm text-muted-foreground mb-3">
                FL codes define where assets physically and functionally exist within the plant. They answer: <strong>"Where in the plant does this equipment belong?"</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {["Asset hierarchy", "Maintenance planning", "Work history", "PM alignment", "D365 integration"].map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hierarchy Diagram */}
        <div className="bg-muted/30 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Functional Location Hierarchy</h4>
          <div className="font-mono text-sm bg-background border border-border rounded-lg p-4 overflow-x-auto">
            <div className="text-foreground">Site</div>
            <div className="text-muted-foreground ml-4">└── Process Plant</div>
            <div className="text-muted-foreground ml-8">└── Area</div>
            <div className="text-muted-foreground ml-12">└── Sub-Area</div>
            <div className="text-primary font-bold ml-16">└── System (Parent Asset) ← FL stops here</div>
            <div className="text-muted-foreground/60 ml-20">└── Assets (inherit parent FL)</div>
            <div className="text-muted-foreground/40 ml-24">└── Components (inherit parent FL)</div>
          </div>
        </div>

        {/* Key Rules */}
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { rule: "FLs Stop at System Level", desc: "Assets and components do NOT receive their own FL codes", icon: Lock },
            { rule: "Inheritance Model", desc: "Assets & components inherit the FL of their parent system", icon: ArrowRight },
            { rule: "No Levels Skipped", desc: "Hierarchy must be followed exactly — no shortcuts", icon: CheckCircle2 },
            { rule: "Immutable Once Assigned", desc: "FL codes are never renamed, reused, or changed", icon: Lock },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2 bg-background rounded-md p-3 border border-border">
              <item.icon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{item.rule}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Sections Accordion */}
        <Accordion type="multiple" className="w-full space-y-2">
          {/* Area & Sub-Area Rules */}
          <AccordionItem value="areas" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Area & Sub-Area Definition Rules
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Areas</h5>
                  <p className="text-xs text-muted-foreground">Major process or infrastructure groupings</p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "SITE — Site Infrastructure",
                      "UTL — Utilities & Power",
                      "COM — Comminution / Process",
                      "REC — Gold Recovery",
                      "TAIL — Tailings",
                      "SUP — Support Services",
                    ].map((area) => (
                      <Badge key={area} variant="outline" className="text-xs font-mono">{area}</Badge>
                    ))}
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                    <li>• Strictly limited to 6 approved Main Area codes</li>
                    <li>• One Area can contain multiple Sub-Areas</li>
                    <li>• Area codes are immutable once assigned</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Sub-Areas</h5>
                  <p className="text-xs text-muted-foreground">Distinct functional groupings within an Area</p>
                  <div className="text-xs space-y-1">
                    <div><span className="font-medium">COM →</span> Ball Mill Circuit, Classification, CIP, Elution</div>
                    <div><span className="font-medium">UTL →</span> Potable Water, Compressed Air, Power Generation</div>
                    <div><span className="font-medium">REC →</span> Gold Room, Gravity Circuit, Electrowinning</div>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                    <li>• Must be clearly defined and non-overlapping</li>
                    <li>• Contain Systems, not equipment directly</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* System Level */}
          <AccordionItem value="system" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              System Level (Parent Asset)
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                The System is the <strong>lowest level</strong> that receives a Functional Location code. A System represents a complete functional unit, a maintainable process boundary, and the parent asset for all child equipment.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Reclaim Feeder", "Mill Feed Conveyor", "Primary Ball Mill", "CIP Tank 01", "Electrowinning Cell", "Main Substation", "Power Station Generator PGEN01"].map((sys) => (
                  <div key={sys} className="bg-muted/50 rounded-md px-2 py-1.5 text-xs text-center">{sys}</div>
                ))}
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Each System has one and only one FL code</li>
                <li>• Systems must align to P&IDs and process flow</li>
                <li>• Systems must be stable even if components change</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Inheritance Example */}
          <AccordionItem value="inheritance" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Asset & Component Inheritance
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Assets and components do NOT receive new FL codes. They inherit the FL code of their parent System.
              </p>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="font-mono text-sm font-bold text-primary mb-3">TCMG-PP-GRND-GRIND-BM01</div>
                <p className="text-xs text-muted-foreground mb-2">All of the following inherit this FL:</p>
                <div className="flex flex-wrap gap-1">
                  {["Ball mill motor", "Gear reducer", "Lubrication pumps", "Guards", "Sensors", "Couplings"].map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Immutability */}
          <AccordionItem value="immutability" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Immutability Rules
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-sm">FL codes are immutable once assigned</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• FL codes are <strong>never renamed</strong></li>
                  <li>• FL codes are <strong>never reused</strong></li>
                  <li>• Equipment changes do <strong>not</strong> trigger FL changes</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                If equipment is replaced: the FL stays the same, only asset/component records are updated. This preserves maintenance history, failure data, and long-term reporting integrity.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* When New FL Can Be Created */}
          <AccordionItem value="new-fl" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              When New FLs Can Be Created
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Allowed
                  </h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• A new system boundary is introduced</li>
                    <li>• A new process line or major modification is installed</li>
                    <li>• Approved changes to P&IDs define a new system</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Not Allowed
                  </h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Component replacement</li>
                    <li>• Equipment upgrades</li>
                    <li>• Temporary equipment</li>
                    <li>• Maintenance workarounds</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Governance */}
          <AccordionItem value="governance" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Governance & Control
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Functional Location creation follows this standard</li>
                <li>• All new FLs must align to the approved hierarchy</li>
                <li>• Temporary or unknown systems are flagged and reviewed</li>
              </ul>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  <strong>FL Standards take precedence over:</strong> Asset naming preferences, OEM terminology, Historical site naming habits
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Relationship to Other Systems */}
          <AccordionItem value="relationship" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Relationship to Asset & Parts Numbering
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <div className="font-medium text-sm text-purple-600">FL Codes</div>
                  <div className="text-xs text-muted-foreground mt-1">Define <strong>WHERE</strong></div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="font-medium text-sm text-blue-600">Asset Numbers</div>
                  <div className="text-xs text-muted-foreground mt-1">Define <strong>WHAT</strong></div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="font-medium text-sm text-green-600">Parts Numbers</div>
                  <div className="text-xs text-muted-foreground mt-1">Define <strong>STOCKED</strong></div>
                </div>
              </div>
              <div className="font-mono text-sm text-center text-muted-foreground">
                FL → Asset → Component → Part
              </div>
              <p className="text-xs text-muted-foreground text-center">
                All three systems are independent but linked
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
