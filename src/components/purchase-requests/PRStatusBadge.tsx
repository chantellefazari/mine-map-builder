import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  "Submitted to Admin": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Admin Review": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  "Sent for Approval": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "PO Generated": "bg-primary/10 text-primary",
};

export const PRStatusBadge = ({ status }: { status: string }) => (
  <Badge className={statusStyles[status] ?? "bg-muted text-muted-foreground"}>
    {status}
  </Badge>
);
