import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Clock, Trophy, ChevronRight, Flame, Zap, Star, Sparkles } from "lucide-react";

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

const typeConfig = {
  daily: { 
    bg: "bg-gradient-to-r from-teal/20 to-teal/5", 
    border: "border-teal/30",
    text: "text-teal", 
    label: "🔥 Daily",
    icon: Flame,
    glow: "shadow-teal/20"
  },
  weekly: { 
    bg: "bg-gradient-to-r from-primary/20 to-primary/5", 
    border: "border-primary/30",
    text: "text-primary", 
    label: "⚡ Weekly",
    icon: Zap,
    glow: "shadow-primary/20"
  },
  special: { 
    bg: "bg-gradient-to-r from-accent/20 to-accent/5", 
    border: "border-accent/30",
    text: "text-accent", 
    label: "✨ Special",
    icon: Star,
    glow: "shadow-accent/20"
  },
};

export function ChallengesPreview() {
  return (
    <Card variant="gradient" className="overflow-hidden relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between relative z-10">
        <CardTitle className="flex items-center gap-2">
          <div className="relative">
            <Target className="w-6 h-6 text-primary" />
            <Sparkles className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-ping" />
          </div>
          <span className="bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
            Active Challenges
          </span>
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 group">
          View All
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {challenges.map((challenge, index) => {
          const config = typeConfig[challenge.type];
          const IconComponent = config.icon;
          const progressPercent = (challenge.progress / challenge.total) * 100;
          
          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-2xl ${config.bg} border ${config.border} hover:shadow-lg ${config.glow} transition-all duration-500 cursor-pointer group relative overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text} flex items-center gap-1`}>
                      <IconComponent className="w-3 h-3 animate-pulse" />
                      {config.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-card/50 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      {challenge.timeLeft}
                    </div>
                  </div>
                  <h4 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    {challenge.title}
                    {progressPercent >= 50 && (
                      <span className="text-xs bg-teal/20 text-teal px-1.5 py-0.5 rounded-full animate-bounce">
                        Almost there!
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                </div>
                
                <div className="flex flex-col items-center gap-1 bg-accent/20 px-3 py-2 rounded-xl border border-accent/30 group-hover:scale-110 transition-transform">
                  <Trophy className="w-5 h-5 text-accent animate-[wiggle_2s_ease-in-out_infinite]" />
                  <span className="font-display font-bold text-accent text-lg">{challenge.reward}</span>
                  <span className="text-[10px] text-accent/70">pts</span>
                </div>
              </div>
              
              <div className="mt-4 relative z-10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Progress
                    {progressPercent > 0 && (
                      <span className="text-xs">🎯</span>
                    )}
                  </span>
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <span className="text-primary">{challenge.progress}</span>
                    <span className="text-muted-foreground">/</span>
                    <span>{challenge.total}</span>
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={progressPercent} 
                    className="h-3 bg-card/50"
                  />
                  {/* Progress milestones */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
