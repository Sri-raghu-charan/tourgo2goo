import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Star, Clock, QrCode } from "lucide-react";

interface RewardCardProps {
  title: string;
  partner: string;
  description: string;
  pointsCost: number;
  expiresIn: string;
  image: string;
  category: string;
}

export function RewardCard({
  title,
  partner,
  description,
  pointsCost,
  expiresIn,
  image,
  category,
}: RewardCardProps) {
  return (
    <Card variant="interactive" className="overflow-hidden group">
      <div className="relative h-32 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        
        {/* Partner Badge */}
        <Badge variant="outline" className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm">
          {partner}
        </Badge>
        
        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className="text-primary-foreground text-sm font-medium">{category}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-display font-bold text-lg text-foreground line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2 mt-3">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Expires {expiresIn}</span>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-accent" />
            <span className="font-display font-bold text-accent">{pointsCost.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">pts</span>
          </div>
          
          <Button size="sm" variant="teal" className="gap-1.5">
            <QrCode className="w-3.5 h-3.5" />
            Redeem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
