import { Input } from "@/components/ui/input";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import aspectLogo from "@/assets/aspect-logo.png";

interface PMBannerHeaderProps {
  title: string;
  subtitle?: string;
}

export const PMBannerHeader = ({ title, subtitle }: PMBannerHeaderProps) => {
  return (
    <div className="relative" data-pdf-section>
      <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
      <div className="absolute bottom-0 left-4 h-[60%] flex items-center gap-3">
        <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
        <img src={aspectLogo} alt="Aspect" className="h-10" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center pl-[160px] pr-[100px]">
        <div className="text-center">
          <h1 className="text-lg font-bold tracking-wide text-primary line-clamp-2">{title}</h1>
          {subtitle && <p className="text-sm mt-1 text-primary/80">{subtitle}</p>}
        </div>
      </div>
      <div className="absolute bottom-1 right-2 h-[40%] flex items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-primary tracking-tight">WO#:</span>
          <Input className="h-6 w-24 text-xs bg-background/90 border-none shadow-none focus-visible:ring-0" placeholder="______" maxLength={6} />
        </div>
      </div>
    </div>
  );
};
