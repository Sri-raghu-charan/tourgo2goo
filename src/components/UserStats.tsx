import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Target, Map, Gift, Medal } from "lucide-react";

interface UserStatsProps {
  username: string;
  avatar: string;
  level: number;
  totalPoints: number;
  placesVisited: number;
  currentStreak: number;
  rank: number;
}

const levelTitles = [
  "Explorer Rookie",
  "Trail Blazer",
  "Wanderer",
  "Adventurer",
  "Pathfinder",
  "Globe Trotter",
  "World Champion",
];

export function UserStats({
  username,
  avatar,
  level,
  totalPoints,
  placesVisited,
  currentStreak,
  rank,
}: UserStatsProps) {
  const levelProgress = (totalPoints % 1000) / 10; // Progress to next level
  const levelTitle = levelTitles[Math.min(level - 1, levelTitles.length - 1)];

  return (
    <Card variant="gradient" className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary shadow-medium">
                <img src={avatar} alt={username} className="w-full h-full object-cover" />
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-glow-primary">
                {level}
              </div>
            </div>
            
            <div>
              <h2 className="font-display font-bold text-xl text-foreground">{username}</h2>
              <Badge variant="level" className="mt-1">{levelTitle}</Badge>
            </div>
          </div>
          
          {/* Rank */}
          <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-xl">
            <Medal className="w-5 h-5 text-accent" />
            <span className="font-display font-bold text-accent">#{rank}</span>
          </div>
        </div>
        
        {/* Level Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Level {level}</span>
            <span className="text-primary font-semibold">{levelProgress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-3">
          {/* Total Points */}
          <div className="bg-accent/10 rounded-xl p-3 text-center">
            <Trophy className="w-6 h-6 text-accent mx-auto mb-1" />
            <p className="font-display font-bold text-xl text-foreground">{totalPoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
          
          {/* Places Visited */}
          <div className="bg-secondary/20 rounded-xl p-3 text-center">
            <Map className="w-6 h-6 text-secondary mx-auto mb-1" />
            <p className="font-display font-bold text-xl text-foreground">{placesVisited}</p>
            <p className="text-xs text-muted-foreground">Places</p>
          </div>
          
          {/* Current Streak */}
          <div className="bg-primary/10 rounded-xl p-3 text-center">
            <Flame className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="font-display font-bold text-xl text-foreground">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
