import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Crown, Flame, TrendingUp } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  points: number;
  level: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserId?: string;
}

const rankConfig = {
  1: { 
    icon: Crown, 
    gradient: "from-accent via-yellow-400 to-accent",
    bg: "bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20",
    border: "border-accent/40",
    shadow: "shadow-accent/30",
    label: "👑 Champion",
    iconColor: "text-accent"
  },
  2: { 
    icon: Medal, 
    gradient: "from-slate-300 via-slate-200 to-slate-300",
    bg: "bg-gradient-to-r from-slate-200/20 via-slate-100/10 to-slate-200/20",
    border: "border-slate-300/40",
    shadow: "shadow-slate-300/30",
    label: "🥈 Runner-up",
    iconColor: "text-slate-400"
  },
  3: { 
    icon: Award, 
    gradient: "from-orange-400 via-orange-300 to-orange-400",
    bg: "bg-gradient-to-r from-coral/20 via-coral/10 to-coral/20",
    border: "border-coral/40",
    shadow: "shadow-coral/30",
    label: "🥉 Third",
    iconColor: "text-coral"
  },
};

export function Leaderboard({ users, currentUserId }: LeaderboardProps) {
  return (
    <Card variant="gradient" className="overflow-hidden relative">
      {/* Animated confetti-like background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-4 left-4 w-2 h-2 bg-accent rounded-full animate-ping" />
        <div className="absolute top-8 right-8 w-3 h-3 bg-primary rounded-full animate-ping delay-300" />
        <div className="absolute bottom-12 left-8 w-2 h-2 bg-teal rounded-full animate-ping delay-500" />
        <div className="absolute bottom-6 right-4 w-2 h-2 bg-coral rounded-full animate-ping delay-700" />
      </div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3">
          <div className="relative">
            <Trophy className="w-6 h-6 text-accent animate-[wiggle_2s_ease-in-out_infinite]" />
            <div className="absolute -inset-1 bg-accent/20 rounded-full blur-md animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-accent via-primary to-teal bg-clip-text text-transparent font-bold">
            Leaderboard
          </span>
          <Flame className="w-5 h-5 text-primary animate-pulse" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 relative z-10">
        {users.map((user, index) => {
          const isTopThree = user.rank <= 3;
          const config = isTopThree ? rankConfig[user.rank as keyof typeof rankConfig] : null;
          const IconComponent = config?.icon;
          
          return (
            <div
              key={user.rank}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 hover:scale-[1.02] cursor-pointer group relative overflow-hidden ${
                isTopThree
                  ? `${config?.bg} ${config?.border} shadow-lg ${config?.shadow}`
                  : "bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              {/* Rank */}
              <div className="w-12 flex items-center justify-center relative z-10">
                {isTopThree && IconComponent ? (
                  <div className="relative">
                    <IconComponent className={`w-7 h-7 ${config?.iconColor} animate-[float_3s_ease-in-out_infinite]`} />
                    {user.rank === 1 && (
                      <div className="absolute -inset-2 bg-accent/30 rounded-full blur-lg animate-pulse" />
                    )}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-display font-bold text-muted-foreground">{user.rank}</span>
                  </div>
                )}
              </div>
              
              {/* Avatar with level ring */}
              <div className="relative z-10">
                <div className={`absolute -inset-1 rounded-2xl ${
                  isTopThree 
                    ? `bg-gradient-to-r ${config?.gradient} animate-[spin_4s_linear_infinite]` 
                    : 'bg-gradient-to-r from-primary to-teal'
                } opacity-70 blur-sm`} />
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="relative w-12 h-12 rounded-xl object-cover ring-2 ring-card"
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${
                  isTopThree ? 'bg-gradient-to-r from-teal to-primary' : 'bg-teal'
                } text-secondary-foreground text-[10px] font-bold flex items-center justify-center shadow-lg`}>
                  {user.level}
                </div>
              </div>
              
              {/* Username & badge */}
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-2">
                  <p className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
                    {user.username}
                  </p>
                  {isTopThree && (
                    <span className="text-xs opacity-70">{config?.label}</span>
                  )}
                </div>
                {user.rank <= 5 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <TrendingUp className="w-3 h-3 text-teal" />
                    <span>Top explorer</span>
                  </div>
                )}
              </div>
              
              {/* Points with animation */}
              <div className="text-right relative z-10">
                <div className="flex items-center gap-1 justify-end">
                  <p className={`font-display font-bold text-lg ${
                    isTopThree ? config?.iconColor : 'text-primary'
                  } group-hover:scale-110 transition-transform`}>
                    {user.points.toLocaleString()}
                  </p>
                  {user.rank === 1 && (
                    <span className="text-lg animate-bounce">🏆</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 bg-teal rounded-full animate-pulse" />
                  points
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
