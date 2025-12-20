import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Clock, Trophy, ChevronRight, Flame, MapPin } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  timeLeft: string;
  type: "daily" | "weekly" | "special";
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Weekend Warrior",
    description: "Visit 5 new places this weekend",
    progress: 3,
    total: 5,
    reward: 500,
    timeLeft: "2 days",
    type: "weekly",
  },
  {
    id: "2",
    title: "Foodie Explorer",
    description: "Check in at 3 restaurants today",
    progress: 1,
    total: 3,
    reward: 150,
    timeLeft: "8 hours",
    type: "daily",
  },
  {
    id: "3",
    title: "Hidden Gem Hunter",
    description: "Discover 2 secret locations",
    progress: 0,
    total: 2,
    reward: 1000,
    timeLeft: "5 days",
    type: "special",
  },
];

const typeStyles = {
  daily: { bg: "bg-teal/10", text: "text-teal", label: "Daily" },
  weekly: { bg: "bg-primary/10", text: "text-primary", label: "Weekly" },
  special: { bg: "bg-accent/10", text: "text-accent", label: "Special" },
};

export function ChallengesPreview() {
  return (
    <Card variant="gradient">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Active Challenges
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeStyles[challenge.type].bg} ${typeStyles[challenge.type].text}`}
                  >
                    {typeStyles[challenge.type].label}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {challenge.timeLeft}
                  </div>
                </div>
                <h4 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
                  {challenge.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-0.5">{challenge.description}</p>
              </div>
              
              <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-lg">
                <Trophy className="w-3.5 h-3.5 text-accent" />
                <span className="font-display font-bold text-accent text-sm">{challenge.reward}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-foreground">
                  {challenge.progress}/{challenge.total}
                </span>
              </div>
              <Progress 
                value={(challenge.progress / challenge.total) * 100} 
                className="h-2"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
