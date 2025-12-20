import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, ChevronRight, Sparkles } from "lucide-react";

interface LocationCardProps {
  name: string;
  category: "nature" | "food" | "culture" | "adventure" | "historical";
  distance: string;
  points: number;
  image: string;
  rating: number;
  visitCount?: number;
}

const categoryLabels = {
  nature: "🌿 Nature",
  food: "🍜 Food",
  culture: "🎭 Culture",
  adventure: "🏔️ Adventure",
  historical: "🏛️ Historical",
};

const categoryEmojis = {
  nature: "🌿",
  food: "🍜",
  culture: "🎭",
  adventure: "🏔️",
  historical: "🏛️",
};

export function LocationCard({
  name,
  category,
  distance,
  points,
  image,
  rating,
  visitCount,
}: LocationCardProps) {
  return (
    <Card variant="interactive" className="overflow-hidden group relative">
      {/* Animated border glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/20 via-teal/20 to-accent/20 blur-xl -z-10" />
      
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        
        {/* Floating category badge with bounce */}
        <Badge 
          variant={category} 
          className="absolute top-3 left-3 animate-[float_3s_ease-in-out_infinite] shadow-lg"
        >
          {categoryLabels[category]}
        </Badge>
        
        {/* Points Badge with pulse */}
        <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-bold font-display shadow-glow flex items-center gap-1.5 group-hover:animate-bounce-subtle">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          +{points} pts
        </div>
        
        {/* Rating with stars animation */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-card/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-lg">
          <Star className="w-4 h-4 text-accent fill-accent animate-[wiggle_2s_ease-in-out_infinite]" />
          <span className="text-sm font-bold">{rating.toFixed(1)}</span>
        </div>
        
        {/* Category emoji floating */}
        <div className="absolute bottom-3 left-3 text-2xl animate-[float_4s_ease-in-out_infinite]">
          {categoryEmojis[category]}
        </div>
      </div>
      
      <CardContent className="p-4 relative">
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        
        <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 relative z-10">
          {name}
        </h3>
        
        <div className="flex items-center justify-between mt-2 relative z-10">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">{distance}</span>
          </div>
          
          {visitCount !== undefined && (
            <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{visitCount} visits</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50 relative z-10">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse" />
            Check in to earn
          </span>
          <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all duration-300">
            <span className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Go</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
