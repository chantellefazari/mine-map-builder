import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { MechanicalWorkOrderTemplate } from "@/components/work-orders/MechanicalWorkOrderTemplate";

const WOPrint = () => {
  const { woNumber } = useParams<{ woNumber: string }>();

  return (
    <div className="wo-print-page">
      {/* Toolbar - hidden when printing */}
      <div className="wo-print-toolbar print:hidden">
        <Link to="/work-order-centre" className="text-sm text-primary hover:underline">
          ← Back to Work Order Centre
        </Link>
        <Button size="sm" className="gap-2" onClick={() => window.print()}>
          <Printer className="w-4 h-4" /> Print
        </Button>
      </div>

      {/* Template content */}
      <div className="wo-print-content">
        <MechanicalWorkOrderTemplate woNumber={woNumber} />
      </div>

      <style>{`
        .wo-print-page {
          background: hsl(var(--muted));
          min-height: 100vh;
        }
        .wo-print-toolbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: hsl(var(--card));
          border-bottom: 1px solid hsl(var(--border));
        }
        .wo-print-content {
          max-width: 210mm;
          margin: 32px auto;
          padding: 0 16px;
        }

        @media print {
          .wo-print-page {
            background: white;
          }
          .wo-print-toolbar {
            display: none !important;
          }
          .wo-print-content {
            max-width: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default WOPrint;
