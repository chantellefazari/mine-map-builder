import { OpenItemsList } from "@/components/open-items/OpenItemsList";

const OpenItems = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <span className="text-primary-foreground font-bold text-lg">TC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Open Items / Decisions / Notes</h1>
              <p className="text-muted-foreground text-sm">Track unconfirmed details, missing data, and items needing site confirmation</p>
            </div>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <OpenItemsList />
      </main>
    </div>
  );
};

export default OpenItems;
