import { useState } from "react";
import { MapPin, Trophy, Gift, User, Search, Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { icon: <MapPin className="w-5 h-5" />, label: "Explore", active: true },
    { icon: <Trophy className="w-5 h-5" />, label: "Challenges" },
    { icon: <Gift className="w-5 h-5" />, label: "Rewards" },
    { icon: <User className="w-5 h-5" />, label: "Profile" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <div className="bg-card/80 backdrop-blur-lg rounded-2xl shadow-medium px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-gradient-primary">TourGo</span>
            </div>

            {/* Nav Items */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-sm transition-all duration-300",
                    item.active
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <Button variant="glass" size="icon">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="glass" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  3
                </span>
              </Button>
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary cursor-pointer hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-card/95 backdrop-blur-lg border-t border-border px-2 py-2 safe-area-pb">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300",
                  item.active
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    item.active && "bg-primary/10"
                  )}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-display font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-card/80 backdrop-blur-lg px-4 py-3 flex items-center justify-between safe-area-pt">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-gradient-primary">TourGo</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="glass" size="icon" className="h-9 w-9">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="glass" size="icon" className="h-9 w-9 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
