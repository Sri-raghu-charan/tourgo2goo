import { MapPin, Trophy, Gift, User, Search, Bell, Hotel, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { SearchSheet } from "./SearchSheet";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { useAuth } from "@/hooks/useAuth";
import tourgoLogo from "@/assets/tourgo-logo.jpeg";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export function Navigation() {
  const location = useLocation();
  const { user, role, profile } = useAuth();

  // Different nav items based on role
  const touristNavItems: NavItem[] = [
    { icon: <MapPin className="w-5 h-5" />, label: "Explore", path: "/explore" },
    { icon: <Hotel className="w-5 h-5" />, label: "Hotels", path: "/hotels" },
    { icon: <Trophy className="w-5 h-5" />, label: "Challenges", path: "/challenges" },
    { icon: <Gift className="w-5 h-5" />, label: "Rewards", path: "/rewards" },
    { icon: <User className="w-5 h-5" />, label: "Profile", path: "/profile" },
  ];

  const hotelOwnerNavItems: NavItem[] = [
    { icon: <Hotel className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <User className="w-5 h-5" />, label: "Profile", path: "/profile" },
  ];

  const navItems = role === 'hotel_owner' ? hotelOwnerNavItems : touristNavItems;

  const isActive = (path: string) => {
    if (path === "/explore") return location.pathname === "/" || location.pathname === "/explore";
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <div className="bg-card/80 backdrop-blur-lg rounded-2xl shadow-medium px-6 py-3 flex items-center justify-between">
            <Link to={role === 'hotel_owner' ? '/dashboard' : '/'} className="flex items-center">
              <img src={tourgoLogo} alt="TourGo" className="h-10 object-contain" />
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-sm transition-all duration-300",
                    isActive(item.path)
                      ? role === 'hotel_owner' 
                        ? "bg-secondary text-secondary-foreground shadow-soft"
                        : "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {role !== 'hotel_owner' && (
                <SearchSheet>
                  <Button variant="glass" size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </SearchSheet>
              )}
              <NotificationsDropdown>
                <Button variant="glass" size="icon" className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                    3
                  </span>
                </Button>
              </NotificationsDropdown>
              {user ? (
                <Link to="/profile" className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary cursor-pointer hover:scale-105 transition-transform">
                  <img
                    src={profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-card/95 backdrop-blur-lg border-t border-border px-2 py-2 safe-area-pb">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300",
                  isActive(item.path) 
                    ? role === 'hotel_owner' ? "text-secondary" : "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300", 
                  isActive(item.path) && (role === 'hotel_owner' ? "bg-secondary/10" : "bg-primary/10")
                )}>
                  {item.icon}
                </div>
                <span className="text-xs font-display font-semibold">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-card/80 backdrop-blur-lg px-4 py-3 flex items-center justify-between safe-area-pt">
          <Link to={role === 'hotel_owner' ? '/dashboard' : '/'} className="flex items-center">
            <img src={tourgoLogo} alt="TourGo" className="h-9 object-contain" />
          </Link>
          
          <div className="flex items-center gap-2">
            {role !== 'hotel_owner' && (
              <SearchSheet>
                <Button variant="glass" size="icon" className="h-9 w-9">
                  <Search className="w-4 h-4" />
                </Button>
              </SearchSheet>
            )}
            <NotificationsDropdown>
              <Button variant="glass" size="icon" className="h-9 w-9 relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  3
                </span>
              </Button>
            </NotificationsDropdown>
            {!user && (
              <Link to="/auth">
                <Button variant="default" size="sm" className="h-9">
                  <LogIn className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
