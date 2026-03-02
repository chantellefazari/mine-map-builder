import React from "react";
import { Badge } from "@/components/ui/badge";

export interface ExtractionTag {
  id: string;
  tag_id: string;
  tag_type: string;
  description: string;
  area_clue: string;
  page_number: number;
  confidence: string;
  drawing_number: string;
}

export const ExtractionTable: React.FC<{ tags: ExtractionTag[]; filter: string }> = ({ tags, filter }) => {
  const filtered = filter
    ? tags.filter(t =>
        t.tag_id.toLowerCase().includes(filter.toLowerCase()) ||
        t.description.toLowerCase().includes(filter.toLowerCase()) ||
        t.area_clue.toLowerCase().includes(filter.toLowerCase())
      )
    : tags;

  const grouped = new Map<number, ExtractionTag[]>();
  for (const t of filtered) {
    if (!grouped.has(t.page_number)) grouped.set(t.page_number, []);
    grouped.get(t.page_number)!.push(t);
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-auto">
      {Array.from(grouped.entries()).sort(([a],[b]) => a - b).map(([page, pageTags]) => (
        <div key={page}>
          <h4 className="text-sm font-semibold text-foreground sticky top-0 bg-card py-1 border-b border-border mb-1">
            Page {page} — {pageTags[0]?.drawing_number} <span className="text-muted-foreground font-normal">({pageTags.length} tags)</span>
          </h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left p-1.5 w-20">Type</th>
                <th className="text-left p-1.5 w-28">Tag ID</th>
                <th className="text-left p-1.5">Description</th>
                <th className="text-left p-1.5 w-28">Area Clue</th>
                <th className="text-left p-1.5 w-16">Conf.</th>
              </tr>
            </thead>
            <tbody>
              {pageTags.map(t => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-1.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {t.tag_type}
                    </Badge>
                  </td>
                  <td className="p-1.5 font-mono font-medium text-primary">{t.tag_id}</td>
                  <td className="p-1.5">{t.description}</td>
                  <td className="p-1.5 text-muted-foreground">{t.area_clue}</td>
                  <td className="p-1.5">
                    <span className={`text-[10px] font-medium ${
                      t.confidence === "High" ? "text-green-600" :
                      t.confidence === "Med" ? "text-amber-600" : "text-red-600"
                    }`}>{t.confidence}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};
