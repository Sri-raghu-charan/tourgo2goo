import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Star, Clock, QrCode, Sparkles, Heart, Zap } from "lucide-react";

interface RewardCardProps {
  title: string;
  partner: string;
  description: string;
  pointsCost: number;
  expiresIn: string;
  image: string;
  category: string;
}

const categoryEmojis: Record<string, string> = {
  "Food & Drink": "🍕",
  "Hotel": "🏨",
  "Experience": "🎢",
  "Shopping": "🛍️",
  "Wellness": "💆",
  "default": "🎁"
};

export function RewardCard({
  title,
  partner,
  description,
  pointsCost,
  expiresIn,
  image,
  category,
}: RewardCardProps) {
  const emoji = categoryEmojis[category] || categoryEmojis.default;
  
  return (
    <Card variant="interactive" className="overflow-hidden group relative">
      {/* Animated glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-teal/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="relative h-36 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        
        {/* Floating sparkles */}
        <div className="absolute top-4 right-4 text-2xl animate-[float_3s_ease-in-out_infinite]">
          {emoji}
        </div>
        
        {/* Partner Badge with glow */}
        <Badge 
          variant="outline" 
          className="absolute top-3 left-3 bg-card/95 backdrop-blur-sm border-primary/30 shadow-lg flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
          {partner}
        </Badge>
        
        {/* Category ribbon */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary/90 to-teal/90 backdrop-blur-sm py-1.5 px-3">
          <span className="text-primary-foreground text-sm font-semibold flex items-center gap-2">
            <Gift className="w-4 h-4" />
            {category}
          </span>
        </div>
        
        {/* Favorite button */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground">
          <Heart className="w-4 h-4" />
        </button>
      </div>
      
      <CardContent className="p-4 relative">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors relative z-10">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 relative z-10">{description}</p>
        
        <div className="flex items-center gap-2 mt-3 relative z-10">
          <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-coral animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">Expires {expiresIn}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50 relative z-10">
          <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-xl border border-accent/20 group-hover:scale-105 transition-transform">
            <Star className="w-5 h-5 text-accent animate-[wiggle_2s_ease-in-out_infinite]" />
            <span className="font-display font-bold text-accent text-lg">{pointsCost.toLocaleString()}</span>
            <span className="text-sm text-accent/70">pts</span>
          </div>
          
          <Button 
            size="sm" 
            variant="teal" 
            className="gap-2 group/btn shadow-lg hover:shadow-teal/30 transition-all hover:scale-105"
          >
            <QrCode className="w-4 h-4 group-hover/btn:animate-pulse" />
            <span>Redeem</span>
            <Zap className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
