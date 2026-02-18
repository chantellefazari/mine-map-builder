import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  areaCodes,
  equipmentPrefixes,
  componentSuffixes,
  instrumentationSuffixes,
  specialPatterns,
} from "./namingConventionData";

// Unique categories for badges
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Feed Systems": "bg-orange-100 text-orange-800",
    "Milling": "bg-purple-100 text-purple-800",
    "Utilities": "bg-blue-100 text-blue-800",
    "Material Handling": "bg-amber-100 text-amber-800",
    "Classification": "bg-cyan-100 text-cyan-800",
    "Filtration": "bg-teal-100 text-teal-800",
    "Power Generation": "bg-yellow-100 text-yellow-800",
    "Screening": "bg-lime-100 text-lime-800",
    "Gravity": "bg-emerald-100 text-emerald-800",
    "Tailings": "bg-stone-100 text-stone-800",
    "Pumps": "bg-sky-100 text-sky-800",
    "Tanks": "bg-indigo-100 text-indigo-800",
    "Water": "bg-blue-100 text-blue-800",
    "Reagents": "bg-rose-100 text-rose-800",
    "Electrical": "bg-violet-100 text-violet-800",
    "Agitation": "bg-fuchsia-100 text-fuchsia-800",
    "Gold Room": "bg-yellow-100 text-yellow-800",
    "Carbon Regen": "bg-gray-100 text-gray-800",
    "Buildings": "bg-slate-100 text-slate-800",
    "Infrastructure": "bg-zinc-100 text-zinc-800",
    "Support": "bg-neutral-100 text-neutral-800",
    "Rotating": "bg-red-100 text-red-800",
    "Valves": "bg-pink-100 text-pink-800",
    "Vessels": "bg-indigo-100 text-indigo-800",
    "Piping": "bg-cyan-100 text-cyan-800",
    "Engines": "bg-orange-100 text-orange-800",
    "Thermal": "bg-red-100 text-red-800",
    "Ventilation": "bg-sky-100 text-sky-800",
    "Hydraulics": "bg-amber-100 text-amber-800",
    "Lifting": "bg-stone-100 text-stone-800",
    "Safety": "bg-red-100 text-red-800",
    "Switches": "bg-violet-100 text-violet-800",
    "Instrumentation": "bg-emerald-100 text-emerald-800",
    "Fuel": "bg-orange-100 text-orange-800",
    "Transfer": "bg-teal-100 text-teal-800",
  };
  return colors[category] || "bg-muted text-muted-foreground";
};

export const NamingConvention: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Asset Numbering Logic</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            The TCMG asset numbering system follows a structured format designed for CMMS/D365 integration. 
            Each asset number encodes the equipment type, location, and relationship to parent systems.
          </p>
          <p className="font-medium text-foreground">
            Format: <code className="bg-muted px-2 py-0.5 rounded font-mono">[PREFIX][NUMBER]-[SUFFIX][NUMBER]</code>
          </p>
          <p>
            Example: <code className="bg-muted px-2 py-0.5 rounded font-mono">BM001-MTR001</code> = Ball Mill 001 – Motor 001
          </p>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="areas" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="instruments">Instruments</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        {/* Area Codes */}
        <TabsContent value="areas" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Area Codes (Level 3)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Code</TableHead>
                    <TableHead className="w-48">Meaning</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areaCodes.map((area) => (
                    <TableRow key={area.code}>
                      <TableCell className="font-mono font-bold text-primary">{area.code}</TableCell>
                      <TableCell className="font-medium">{area.meaning}</TableCell>
                      <TableCell className="text-muted-foreground">{area.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Prefixes */}
        <TabsContent value="equipment" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Equipment Type Prefixes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Prefix</TableHead>
                    <TableHead className="w-56">Meaning</TableHead>
                    <TableHead className="w-48">Example</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentPrefixes.map((item) => (
                    <TableRow key={item.prefix}>
                      <TableCell className="font-mono font-bold text-primary">{item.prefix}</TableCell>
                      <TableCell className="font-medium">{item.meaning}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">{item.example}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Component Suffixes */}
        <TabsContent value="components" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Component Suffixes (After Hyphen)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Suffix</TableHead>
                    <TableHead className="w-56">Meaning</TableHead>
                    <TableHead className="w-48">Example</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {componentSuffixes.map((item) => (
                    <TableRow key={item.suffix}>
                      <TableCell className="font-mono font-bold text-primary">{item.suffix}</TableCell>
                      <TableCell className="font-medium">{item.meaning}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">{item.example}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instrumentation Suffixes */}
        <TabsContent value="instruments" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Instrumentation Suffixes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Suffix</TableHead>
                    <TableHead className="w-56">Meaning</TableHead>
                    <TableHead className="w-48">Example</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instrumentationSuffixes.map((item) => (
                    <TableRow key={item.suffix}>
                      <TableCell className="font-mono font-bold text-primary">{item.suffix}</TableCell>
                      <TableCell className="font-medium">{item.meaning}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">{item.example}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Special Patterns */}
        <TabsContent value="patterns" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Special Naming Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Pattern</TableHead>
                    <TableHead className="w-64">Meaning</TableHead>
                    <TableHead>Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specialPatterns.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono font-bold text-primary">{item.pattern}</TableCell>
                      <TableCell className="font-medium">{item.meaning}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">{item.example}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
