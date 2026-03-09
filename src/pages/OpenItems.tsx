import { PageNavDropdown } from "@/components/PageNavDropdown";
import { OpenItemsList } from "@/components/open-items/OpenItemsList";

const OpenItems = () => {
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
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Open Items / Decisions / Notes
              </h1>
              <p className="text-muted-foreground text-sm">
                Track unconfirmed details, missing data, and items needing site confirmation
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <OpenItemsList />
      </main>
    </div>
  );
};

export default OpenItems;
