import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, MapPin, Trophy, Star, Flame, Settings, ChevronRight, 
  Camera, Award, Clock, Target, TrendingUp, Calendar
} from "lucide-react";

const achievements = [
  { name: "First Steps", description: "Complete your first check-in", earned: true, icon: "🎯" },
  { name: "Explorer", description: "Visit 10 locations", earned: true, icon: "🗺️" },
  { name: "Foodie", description: "Check in at 5 restaurants", earned: true, icon: "🍜" },
  { name: "Nature Lover", description: "Visit 5 nature spots", earned: false, progress: 3, total: 5, icon: "🌿" },
  { name: "Streak Master", description: "Maintain a 30-day streak", earned: false, progress: 12, total: 30, icon: "🔥" },
  { name: "Cultural Guru", description: "Visit 10 cultural sites", earned: false, progress: 4, total: 10, icon: "🏛️" },
];

const recentActivity = [
  { type: "check-in", location: "Crystal Falls", points: 150, time: "2 hours ago" },
  { type: "challenge", name: "Weekend Explorer", points: 500, time: "Yesterday" },
  { type: "check-in", location: "Sunset Bistro", points: 100, time: "2 days ago" },
  { type: "reward", name: "Free Coffee", points: -100, time: "3 days ago" },
  { type: "check-in", location: "Ancient Temple", points: 200, time: "4 days ago" },
];

const Profile = () => {
  const user = {
    name: "Alex Explorer",
    username: "@alexexplorer",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
    level: 5,
    totalPoints: 4750,
    placesVisited: 47,
    currentStreak: 12,
    rank: 156,
    joinedDate: "March 2024",
    pointsToNextLevel: 1250,
    currentLevelPoints: 750,
  };

  const levelProgress = (user.currentLevelPoints / user.pointsToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 md:pt-32 pb-32 md:pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Profile Header */}
          <Card className="mb-6 overflow-hidden border-0 shadow-large">
            <div className="h-24 gradient-primary" />
            <CardContent className="relative pt-0 pb-6 px-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl border-4 border-background overflow-hidden shadow-medium">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-soft hover:scale-105 transition-transform">
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="font-display font-bold text-2xl text-foreground">{user.name}</h1>
                    <Badge variant="level" className="text-xs">Lvl {user.level}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{user.username}</p>
                </div>
                
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
              
              {/* Level Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Level {user.level}</span>
                  <span className="font-semibold text-foreground">
                    {user.currentLevelPoints}/{user.pointsToNextLevel} XP
                  </span>
                </div>
                <Progress value={levelProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {user.pointsToNextLevel - user.currentLevelPoints} XP to reach Level {user.level + 1}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="font-display font-bold text-2xl text-foreground">{user.totalPoints.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-display font-bold text-2xl text-foreground">{user.placesVisited}</p>
                <p className="text-xs text-muted-foreground">Places Visited</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Flame className="w-6 h-6 mx-auto mb-2 text-coral" />
                <p className="font-display font-bold text-2xl text-foreground">{user.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-teal" />
                <p className="font-display font-bold text-2xl text-foreground">#{user.rank}</p>
                <p className="text-xs text-muted-foreground">Global Rank</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-muted/50 p-1">
              <TabsTrigger value="achievements" className="gap-2">
                <Award className="w-4 h-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <Clock className="w-4 h-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="achievements">
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <Card 
                    key={achievement.name} 
                    className={`border-border/50 ${!achievement.earned && "opacity-70"}`}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                        achievement.earned ? "bg-accent/20" : "bg-muted"
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-semibold text-foreground">
                            {achievement.name}
                          </h3>
                          {achievement.earned && (
                            <Badge variant="streak" className="text-xs">Earned</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {!achievement.earned && achievement.progress !== undefined && (
                          <div className="mt-2">
                            <Progress 
                              value={(achievement.progress / achievement.total!) * 100} 
                              className="h-1.5" 
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {achievement.progress}/{achievement.total}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="border-border/50">
                <CardContent className="p-0">
                  {recentActivity.map((activity, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center justify-between p-4 ${
                        i !== recentActivity.length - 1 ? "border-b border-border/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          activity.type === "check-in" ? "bg-primary/10" :
                          activity.type === "challenge" ? "bg-accent/20" :
                          "bg-coral/10"
                        }`}>
                          {activity.type === "check-in" ? (
                            <MapPin className="w-5 h-5 text-primary" />
                          ) : activity.type === "challenge" ? (
                            <Trophy className="w-5 h-5 text-accent" />
                          ) : (
                            <Star className="w-5 h-5 text-coral" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {activity.type === "check-in" ? `Visited ${activity.location}` :
                             activity.type === "challenge" ? `Completed ${activity.name}` :
                             `Redeemed ${activity.name}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      <Badge variant={activity.points > 0 ? "points" : "outline"}>
                        {activity.points > 0 ? "+" : ""}{activity.points} pts
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-display font-bold text-2xl text-foreground">{user.joinedDate}</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Challenges Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-display font-bold text-2xl text-foreground">12</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Rewards Redeemed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-display font-bold text-2xl text-foreground">8</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      Longest Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-display font-bold text-2xl text-foreground">18 days</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
