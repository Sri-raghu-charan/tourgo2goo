import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute bottom-40 -left-20 w-60 h-60 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-accent/10 blur-2xl" />
      </div>
      
      <div className="relative z-10 text-center max-w-md">
        {/* Animated Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute -inset-4 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="relative w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-large animate-bounce-soft">
            <Compass className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="font-display font-black text-7xl text-gradient-primary mb-4">404</h1>
        <h2 className="font-display font-bold text-2xl text-foreground mb-3">
          Oops! You've wandered off the map
        </h2>
        <p className="text-muted-foreground mb-8">
          The destination you're looking for doesn't exist or has been moved. Let's get you back on track!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" variant="hero" className="gap-2" asChild>
            <a href="/">
              <Home className="w-5 h-5" />
              Return Home
            </a>
          </Button>
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <a href="/">
              <MapPin className="w-5 h-5" />
              Explore Map
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
