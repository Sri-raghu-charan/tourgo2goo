import { MapPin, Navigation, Star, Trophy, Zap } from "lucide-react";

interface MapMarker {
  id: string;
  x: number;
  y: number;
  category: "nature" | "food" | "culture" | "adventure" | "historical";
  name: string;
  points: number;
  visited?: boolean;
}

const markers: MapMarker[] = [
  { id: "1", x: 20, y: 30, category: "nature", name: "Crystal Falls", points: 150, visited: true },
  { id: "2", x: 45, y: 25, category: "food", name: "Sunset Bistro", points: 100 },
  { id: "3", x: 70, y: 40, category: "culture", name: "Ancient Temple", points: 200 },
  { id: "4", x: 30, y: 60, category: "adventure", name: "Sky Bridge", points: 250 },
  { id: "5", x: 60, y: 55, category: "historical", name: "Old Lighthouse", points: 175 },
  { id: "6", x: 85, y: 30, category: "nature", name: "Hidden Beach", points: 300 },
  { id: "7", x: 15, y: 70, category: "food", name: "Mountain Café", points: 125 },
  { id: "8", x: 50, y: 75, category: "adventure", name: "Valley Trek", points: 225 },
];

const categoryColors = {
  nature: "bg-category-nature",
  food: "bg-category-food",
  culture: "bg-category-culture",
  adventure: "bg-category-adventure",
  historical: "bg-category-historical",
};

const categoryIcons = {
  nature: "🌿",
  food: "🍜",
  culture: "🏛️",
  adventure: "🏔️",
  historical: "🏰",
};

export function InteractiveMap() {
  return (
    <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-large">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-light/20 via-background to-coral-light/20" />
      
      {/* Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-teal/10 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-coral/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
      
      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M 20% 30% Q 35% 35%, 45% 25% T 70% 40%"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeDasharray="8 4"
          className="animate-pulse"
        />
      </svg>
      
      {/* Map Markers */}
      {markers.map((marker, index) => (
        <div
          key={marker.id}
          className="absolute group cursor-pointer"
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
            transform: "translate(-50%, -50%)",
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {/* Marker Pin */}
          <div
            className={`relative animate-marker-bounce`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Pulse Ring */}
            <div
              className={`absolute -inset-3 rounded-full ${categoryColors[marker.category]} opacity-20 animate-ping`}
              style={{ animationDuration: "2s" }}
            />
            
            {/* Marker Body */}
            <div
              className={`relative w-10 h-10 rounded-full ${categoryColors[marker.category]} shadow-medium flex items-center justify-center text-lg transform group-hover:scale-125 transition-transform duration-300`}
            >
              {marker.visited ? (
                <Star className="w-5 h-5 text-primary-foreground fill-current" />
              ) : (
                <span>{categoryIcons[marker.category]}</span>
              )}
            </div>
            
            {/* Visited Check */}
            {marker.visited && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center shadow-glow">
                <Zap className="w-3 h-3 text-accent-foreground" />
              </div>
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
            <div className="bg-card rounded-xl shadow-large p-3 min-w-[140px]">
              <p className="font-display font-bold text-sm text-foreground">{marker.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Trophy className="w-3 h-3 text-accent" />
                <span className="text-xs font-semibold text-accent">{marker.points} pts</span>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-card rotate-45 shadow-lg" />
            </div>
          </div>
        </div>
      ))}
      
      {/* Current Location */}
      <div
        className="absolute"
        style={{ left: "40%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute -inset-2 rounded-full bg-primary/30 animate-pulse" />
          <div className="w-6 h-6 rounded-full gradient-primary shadow-glow-primary flex items-center justify-center">
            <Navigation className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-xl p-3 shadow-soft">
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryIcons).map(([category, icon]) => (
            <div key={category} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${categoryColors[category as keyof typeof categoryColors]}`} />
              <span className="text-xs text-muted-foreground capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 rounded-xl bg-card shadow-soft flex items-center justify-center text-foreground hover:bg-muted transition-colors font-display font-bold">
          +
        </button>
        <button className="w-10 h-10 rounded-xl bg-card shadow-soft flex items-center justify-center text-foreground hover:bg-muted transition-colors font-display font-bold">
          −
        </button>
      </div>
    </div>
  );
}
