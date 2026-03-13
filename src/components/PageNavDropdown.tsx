import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  TreePine, Wrench, Package, ClipboardList, Warehouse, BookOpen,
  ShoppingCart, Building2, CalendarClock, PackageSearch, FileInput,
  Home, ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { title: "Home", icon: Home, href: "/" },
  { title: "Maintenance Foundations", icon: BookOpen, href: "/maintenance-foundations", tabKey: "maintenance-foundations" },
  { title: "Asset Tree", icon: TreePine, href: "/asset-tree", tabKey: "asset-tree" },
  { title: "PM Design", icon: Wrench, href: "/pm-design", tabKey: "pm-design" },
  { title: "Work Orders", icon: ClipboardList, href: "/work-order-templates", tabKey: "work-order-templates" },
  { title: "Work Requests", icon: FileInput, href: "/work-request-templates", tabKey: "work-order-templates" },
  { title: "Suppliers & Procurement", icon: ShoppingCart, href: "/suppliers-procurement", tabKey: "suppliers-procurement" },
  { title: "Stores & Warehouse", icon: Building2, href: "/stores-warehouse-design", tabKey: "stores-warehouse-design" },
  { title: "Site Spares", icon: Warehouse, href: "/site-spares", tabKey: "site-spares" },
  { title: "Planning & Revision", icon: CalendarClock, href: "/planning-revision", tabKey: "planning-revision" },
  { title: "PO Register", icon: PackageSearch, href: "/po-tracker", tabKey: "po-tracker" },
  { title: "Purchase Requests", icon: FileInput, href: "/purchase-requests", tabKey: "purchase-requests" },
];

export const PageNavDropdown = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, allowedTabs } = useAuth();

  const currentItem = NAV_ITEMS.find((item) => item.href === location.pathname) || NAV_ITEMS[0];

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.tabKey) return true; // Home always visible
    if (isAdmin) return true;
    return allowedTabs.includes(item.tabKey);
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg",
            "bg-foreground text-background hover:bg-foreground/90",
            "transition-colors text-sm font-medium",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <currentItem.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{currentItem.title}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 bg-foreground text-background border-foreground/80"
      >
        {visibleItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <div key={item.href}>
              {index === 1 && <DropdownMenuSeparator className="bg-background/20" />}
              <DropdownMenuItem
                onClick={() => navigate(item.href)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md",
                  "text-background/80 hover:text-background hover:bg-background/10",
                  "focus:bg-background/10 focus:text-background",
                  isActive && "bg-background/15 text-background font-semibold"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.title}</span>
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
