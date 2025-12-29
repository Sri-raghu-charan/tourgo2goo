import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import  InteractiveMap  from "@/components/InteractiveMap";
import { UserStats } from "@/components/UserStats";
import { LocationCard } from "@/components/LocationCard";
import { Leaderboard } from "@/components/Leaderboard";
import { RewardCard } from "@/components/RewardCard";
import { ChallengesPreview } from "@/components/ChallengesPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Compass, Sparkles, ChevronRight, Filter, Zap } from "lucide-react";
import heroMap from "@/assets/hero-map.jpg";

// Mock data
const nearbyLocations = [
  {
    name: "Crystal Falls",
    category: "nature" as const,
    distance: "2.3 km",
    points: 150,
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&h=300&fit=crop",
    rating: 4.8,
    visitCount: 1245,
  },
  {
    name: "Sunset Bistro",
    category: "food" as const,
    distance: "0.8 km",
    points: 100,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    rating: 4.6,
    visitCount: 892,
  },
  {
    name: "Ancient Temple",
    category: "culture" as const,
    distance: "5.1 km",
    points: 200,
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop",
    rating: 4.9,
    visitCount: 2341,
  },
  {
    name: "Sky Bridge Adventure",
    category: "adventure" as const,
    distance: "3.7 km",
    points: 250,
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&h=300&fit=crop",
    rating: 4.7,
    visitCount: 567,
  },
  {
    name: "Heritage Museum",
    category: "historical" as const,
    distance: "1.5 km",
    points: 180,
    image: "https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?w=400&h=300&fit=crop",
    rating: 4.5,
    visitCount: 1023,
  },
  {
    name: "Rainforest Trail",
    category: "nature" as const,
    distance: "4.2 km",
    points: 175,
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop",
    rating: 4.7,
    visitCount: 876,
  },
  {
    name: "Street Food Market",
    category: "food" as const,
    distance: "1.1 km",
    points: 120,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    rating: 4.4,
    visitCount: 1567,
  },
  {
    name: "Cliff Diving Point",
    category: "adventure" as const,
    distance: "6.8 km",
    points: 300,
    image: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=400&h=300&fit=crop",
    rating: 4.9,
    visitCount: 432,
  },
];

const leaderboardUsers = [
  { rank: 1, username: "TravelMaster", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", points: 15420, level: 12 },
  { rank: 2, username: "WanderlustSoul", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", points: 13890, level: 11 },
  { rank: 3, username: "ExplorerMax", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", points: 12450, level: 10 },
  { rank: 4, username: "AdventureSeeker", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", points: 11200, level: 9 },
  { rank: 5, username: "GlobeTrotter", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", points: 10100, level: 8 },
];

const rewards = [
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
];

type CategoryType = "all" | "nature" | "food" | "culture" | "adventure" | "historical";

const categories: { name: string; value: CategoryType; emoji: string }[] = [
  { name: "All", value: "all", emoji: "🌍" },
  { name: "Nature", value: "nature", emoji: "🌿" },
  { name: "Food", value: "food", emoji: "🍜" },
  { name: "Culture", value: "culture", emoji: "🎭" },
  { name: "Adventure", value: "adventure", emoji: "🏔️" },
  { name: "Historical", value: "historical", emoji: "🏛️" },
];

const Index = () => {
  const navigate = useNavigate();
  const { role, loading } = useAuth();
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");

  // Redirect hotel owners to their dashboard
  useEffect(() => {
    if (!loading && role === 'hotel_owner') {
      navigate('/dashboard');
    }
  }, [role, loading, navigate]);
  
  const filteredLocations = activeCategory === "all" 
    ? nearbyLocations 
    : nearbyLocations.filter(location => location.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-8 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-coral/10 blur-3xl" />
          <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-teal/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-accent/10 blur-2xl" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <Badge variant="streak" className="mb-4 animate-bounce-soft">
              <Zap className="w-3 h-3 mr-1" />
              Discover & Earn Rewards
            </Badge>
            <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
              Explore the World,{" "}
              <span className="text-gradient-primary">Earn Points</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Visit amazing places, check in with GPS, earn points, and redeem exclusive rewards from local businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="hero" className="gap-2">
                <MapPin className="w-5 h-5" />
                Start Exploring
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Sparkles className="w-5 h-5" />
                View Rewards
              </Button>
            </div>
          </div>
          
          {/* Hero Map Image */}
          <div className="relative max-w-4xl mx-auto mt-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-3xl blur-2xl opacity-50" />
            <div className="relative rounded-3xl overflow-hidden shadow-large border border-border/50">
              <img 
                src={heroMap} 
                alt="TourGo Interactive Map" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-soft flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-category-nature animate-pulse" />
                    <span className="text-sm font-semibold">1,234 places nearby</span>
                  </div>
                  <div className="bg-accent/90 px-4 py-2 rounded-xl shadow-glow flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-bold">Double Points Weekend!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 pb-32 md:pb-16">
        {/* User Stats */}
        <section className="mb-12">
          <UserStats
            username="Alex Explorer"
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
            level={5}
            totalPoints={4750}
            placesVisited={47}
            currentStreak={12}
            rank={156}
          />
        </section>
        
        {/* Interactive Map */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-foreground">Explore Nearby</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <InteractiveMap />
        </section>
        
        {/* Category Pills */}
        <section className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.value
                    ? "gradient-primary text-primary-foreground shadow-soft scale-105"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:scale-105"
                }`}
              >
                <span className="text-lg">{cat.emoji}</span>
                {cat.name}
                {activeCategory === cat.value && (
                  <span className="ml-1 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </section>
        
        {/* Nearby Locations Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-foreground">Places to Visit</h2>
            <Button variant="link" className="gap-1">
              See All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location, index) => (
                <div 
                  key={location.name} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <LocationCard {...location} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <span className="text-4xl mb-4 block">🔍</span>
                <p className="text-muted-foreground font-display">No places found in this category</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Challenges */}
          <ChallengesPreview />
          
          {/* Leaderboard */}
          <Leaderboard users={leaderboardUsers} />
        </div>
        
        {/* Rewards Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Available Rewards
            </h2>
            <Button variant="link" className="gap-1">
              Browse All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <RewardCard key={reward.title} {...reward} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
