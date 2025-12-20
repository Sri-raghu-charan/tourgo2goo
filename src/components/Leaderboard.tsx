import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

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

const rankIcons = {
  1: <Trophy className="w-5 h-5 text-accent" />,
  2: <Medal className="w-5 h-5 text-muted-foreground" />,
  3: <Award className="w-5 h-5 text-coral" />,
};

const rankStyles = {
  1: "bg-accent/15 border-accent/30",
  2: "bg-muted/50 border-muted-foreground/20",
  3: "bg-coral/15 border-coral/30",
};

export function Leaderboard({ users, currentUserId }: LeaderboardProps) {
  return (
    <Card variant="gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {users.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
              user.rank <= 3
                ? rankStyles[user.rank as keyof typeof rankStyles]
                : "bg-card border-border hover:border-primary/30"
            }`}
          >
            {/* Rank */}
            <div className="w-8 flex items-center justify-center">
              {user.rank <= 3 ? (
                rankIcons[user.rank as keyof typeof rankIcons]
              ) : (
                <span className="font-display font-bold text-muted-foreground">{user.rank}</span>
              )}
            </div>
            
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
                {user.level}
              </div>
            </div>
            
            {/* Username */}
            <div className="flex-1">
              <p className="font-display font-semibold text-foreground">{user.username}</p>
            </div>
            
            {/* Points */}
            <div className="text-right">
              <p className="font-display font-bold text-primary">{user.points.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
