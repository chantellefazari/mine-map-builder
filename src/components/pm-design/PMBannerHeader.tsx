import { Input } from "@/components/ui/input";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import aspectLogo from "@/assets/aspect-logo.png";

interface PMBannerHeaderProps {
  title: string;
  subtitle?: string;
}

const getTitleSize = (title: string) => {
  const len = title.length;
  if (len <= 20) return "text-[20px]";
  if (len <= 35) return "text-[17px]";
  if (len <= 50) return "text-[15px]";
  if (len <= 70) return "text-[13px]";
  return "text-[11px]";
};

export const PMBannerHeader = ({ title, subtitle }: PMBannerHeaderProps) => {
  const titleSize = getTitleSize(title);

  return (
    <div className="relative" data-pdf-section>
      <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
      <div className="absolute bottom-0 left-4 h-[60%] flex items-center gap-2 z-10">
        <img src={tennantIcon} alt="Tennant Mines" className="h-12" />
        <img src={aspectLogo} alt="Aspect" className="h-8" />
      </div>
      <div className="absolute bottom-0 left-[22%] right-[14%] h-[60%] flex items-center justify-center z-0">
        <div className="text-center">
          <h1 className={`${titleSize} font-bold tracking-wide text-primary leading-tight line-clamp-2`}>{title}</h1>
          {subtitle && <p className="text-xs mt-0.5 text-primary/80">{subtitle}</p>}
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
