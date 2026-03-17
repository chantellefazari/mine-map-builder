import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground">
          TCMG Asset & Maintenance Framework
          {isAdmin && <span className="ml-2 text-primary font-semibold">• Admin</span>}
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Use the sidebar to navigate between modules.
        </p>
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          Tennant Creek Gold Mine • Design workspace for CMMS/D365 readiness
        </p>
      </div>
    </div>
  );
};

export default Home;
