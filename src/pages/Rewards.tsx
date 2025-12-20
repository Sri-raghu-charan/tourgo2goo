import { Navigation } from "@/components/Navigation";
import { RewardCard } from "@/components/RewardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Star, Clock, History, Sparkles, Coins } from "lucide-react";

const availableRewards = [
  {
    title: "20% Off Spa Treatment",
    partner: "Serenity Spa",
    description: "Relax and unwind with a complimentary spa session",
    pointsCost: 500,
    expiresIn: "7 days",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=200&fit=crop",
    category: "Wellness",
  },
  {
    title: "Free Coffee & Pastry",
    partner: "Mountain Café",
    description: "Enjoy a hot brew with a fresh pastry",
    pointsCost: 150,
    expiresIn: "3 days",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop",
    category: "Food & Drink",
  },
  {
    title: "Hotel Stay Discount",
    partner: "Grand Resort",
    description: "Get 30% off your next hotel booking",
    pointsCost: 2000,
    expiresIn: "14 days",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop",
    category: "Accommodation",
  },
  {
    title: "Adventure Tour Pass",
    partner: "Thrill Seekers",
    description: "Free entry to any adventure activity",
    pointsCost: 1200,
    expiresIn: "10 days",
    image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=200&fit=crop",
    category: "Experiences",
  },
  {
    title: "Museum Entry",
    partner: "Heritage Museum",
    description: "Free admission for two people",
    pointsCost: 300,
    expiresIn: "21 days",
    image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=200&fit=crop",
    category: "Culture",
  },
  {
    title: "Fine Dining Experience",
    partner: "Ocean View Restaurant",
    description: "Complimentary dessert with any main course",
    pointsCost: 400,
    expiresIn: "5 days",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop",
    category: "Food & Drink",
  },
];

const redeemedRewards = [
  {
    title: "Free Coffee",
    partner: "Corner Café",
    redeemedAt: "2 days ago",
    points: 100,
    status: "used",
  },
  {
    title: "10% Restaurant Discount",
    partner: "Local Bites",
    redeemedAt: "1 week ago",
    points: 200,
    status: "used",
  },
  {
    title: "Spa Voucher",
    partner: "Zen Wellness",
    redeemedAt: "Today",
    points: 500,
    status: "active",
    expiresIn: "5 days",
  },
];

const Rewards = () => {
  const userPoints = 4750;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 md:pt-32 pb-32 md:pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-coral flex items-center justify-center">
                <Gift className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
                  Rewards
                </h1>
                <p className="text-muted-foreground">Redeem your points for exclusive offers</p>
              </div>
            </div>
          </div>

          {/* Points Balance Card */}
          <Card className="mb-8 overflow-hidden border-0 shadow-large">
            <div className="gradient-primary p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium mb-1">Your Balance</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-black text-4xl text-primary-foreground">
                      {userPoints.toLocaleString()}
                    </span>
                    <span className="text-primary-foreground/80 font-medium">points</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  <Coins className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 hover:bg-primary-foreground/30">
                  <Star className="w-3 h-3 mr-1" />
                  Level 5
                </Badge>
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 hover:bg-primary-foreground/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  250 pts to next reward
                </Badge>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-muted/50 p-1">
              <TabsTrigger value="available" className="gap-2">
                <Gift className="w-4 h-4" />
                Available
              </TabsTrigger>
              <TabsTrigger value="redeemed" className="gap-2">
                <History className="w-4 h-4" />
                My Rewards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available">
              {/* Filter Pills */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {["All", "Food & Drink", "Wellness", "Experiences", "Accommodation", "Culture"].map((cat, i) => (
                  <button
                    key={cat}
                    className={`px-4 py-2 rounded-xl font-display font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                      i === 0
                        ? "gradient-primary text-primary-foreground shadow-soft"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableRewards.map((reward) => (
                  <RewardCard key={reward.title} {...reward} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="redeemed">
              <div className="space-y-4">
                {redeemedRewards.map((reward, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          reward.status === "active" 
                            ? "bg-category-nature/20" 
                            : "bg-muted"
                        }`}>
                          <Gift className={`w-6 h-6 ${
                            reward.status === "active" 
                              ? "text-category-nature" 
                              : "text-muted-foreground"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-foreground">
                            {reward.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{reward.partner}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {reward.status === "active" ? (
                              <span className="flex items-center gap-1 text-category-nature">
                                <Clock className="w-3 h-3" />
                                Expires in {reward.expiresIn}
                              </span>
                            ) : (
                              `Redeemed ${reward.redeemedAt}`
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={reward.status === "active" ? "streak" : "outline"}>
                          {reward.status === "active" ? "Active" : "Used"}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">-{reward.points} pts</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Rewards;
