import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, ChevronRight } from "lucide-react";

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
  nature: "Nature",
  food: "Food",
  culture: "Culture",
  adventure: "Adventure",
  historical: "Historical",
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
    <Card variant="interactive" className="overflow-hidden group">
      <div className="relative h-36 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Category Badge */}
        <Badge variant={category} className="absolute top-3 left-3">
          {categoryLabels[category]}
        </Badge>
        
        {/* Points Badge */}
        <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-xs font-bold font-display shadow-glow flex items-center gap-1">
          <Star className="w-3 h-3" />
          {points} pts
        </div>
        
        {/* Rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Star className="w-3 h-3 text-accent fill-accent" />
          <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{distance}</span>
          </div>
          
          {visitCount !== undefined && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-sm">{visitCount} visits</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-sm text-muted-foreground">Check in to earn</span>
          <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
}
