import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Users, Flame, Star, Target, MapPin, Zap } from "lucide-react";

const activeChallenges = [
  {
    id: 1,
    title: "Weekend Explorer",
    description: "Visit 5 different locations this weekend",
    progress: 3,
    total: 5,
    points: 500,
    endsIn: "2 days",
    type: "weekly",
    participants: 1234,
  },
  {
    id: 2,
    title: "Foodie Adventure",
    description: "Check in at 3 restaurants",
    progress: 1,
    total: 3,
    points: 300,
    endsIn: "5 days",
    type: "category",
    participants: 856,
  },
  {
    id: 3,
    title: "Nature Lover",
    description: "Visit 4 nature spots",
    progress: 2,
    total: 4,
    points: 400,
    endsIn: "4 days",
    type: "category",
    participants: 1567,
  },
];

const upcomingChallenges = [
  {
    id: 4,
    title: "Cultural Quest",
    description: "Explore 5 cultural landmarks",
    total: 5,
    points: 600,
    startsIn: "3 days",
    type: "special",
  },
  {
    id: 5,
    title: "Adventure Seeker",
    description: "Complete 3 adventure activities",
    total: 3,
    points: 750,
    startsIn: "1 week",
    type: "special",
  },
];

const completedChallenges = [
  {
    id: 6,
    title: "First Steps",
    description: "Visit your first 3 locations",
    points: 150,
    completedAt: "2 days ago",
  },
  {
    id: 7,
    title: "Early Bird",
    description: "Check in before 9 AM",
    points: 100,
    completedAt: "1 week ago",
  },
];

const Challenges = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 md:pt-32 pb-32 md:pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
                  Challenges
                </h1>
                <p className="text-muted-foreground">Complete challenges to earn bonus points</p>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-display font-bold text-2xl text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="font-display font-bold text-2xl text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-coral" />
                <p className="font-display font-bold text-2xl text-foreground">2,450</p>
                <p className="text-xs text-muted-foreground">Points Earned</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Challenges */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-coral" />
              <h2 className="font-display font-bold text-xl text-foreground">Active Challenges</h2>
            </div>
            <div className="space-y-4">
              {activeChallenges.map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-bold text-lg text-foreground">
                            {challenge.title}
                          </h3>
                          <Badge variant={challenge.type === "weekly" ? "streak" : "nature"} className="text-xs">
                            {challenge.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="points" className="mb-1">
                          +{challenge.points} pts
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">
                          {challenge.progress}/{challenge.total}
                        </span>
                      </div>
                      <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {challenge.endsIn} left
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {challenge.participants.toLocaleString()} joined
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-primary">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Upcoming Challenges */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-teal" />
              <h2 className="font-display font-bold text-xl text-foreground">Coming Soon</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {upcomingChallenges.map((challenge) => (
                <Card key={challenge.id} className="border-border/50 bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Starts in {challenge.startsIn}
                      </Badge>
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground mb-1">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="points">+{challenge.points} pts</Badge>
                      <Button size="sm" variant="outline">
                        Remind Me
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Completed Challenges */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-accent" />
              <h2 className="font-display font-bold text-xl text-foreground">Completed</h2>
            </div>
            <div className="space-y-2">
              {completedChallenges.map((challenge) => (
                <Card key={challenge.id} className="border-border/50 bg-muted/30">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-category-nature/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-category-nature" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">
                          {challenge.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{challenge.completedAt}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-category-nature">
                      +{challenge.points} pts
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Challenges;
