import { Input } from "@/components/ui/input";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

interface PMBannerHeaderProps {
  title: string;
  subtitle?: string;
}

export const PMBannerHeader = ({ title, subtitle }: PMBannerHeaderProps) => {
  return (
    <div className="relative">
      <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
      <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
        <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wide text-primary">{title}</h1>
          {subtitle && <p className="text-base mt-1 text-primary/80">{subtitle}</p>}
        </div>
      </div>
      <div className="absolute bottom-1 right-2 h-[40%] flex items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-primary tracking-tight">WO#:</span>
          <Input className="h-6 w-24 text-xs bg-background/90 border-primary/40 focus-visible:ring-primary shadow-sm" placeholder="______" maxLength={6} />
        </div>
      </div>
    </div>
  );
};
