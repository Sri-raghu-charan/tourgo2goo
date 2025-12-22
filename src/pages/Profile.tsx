import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useToast } from "@/hooks/use-toast";
import { MyBookings } from "@/components/MyBookings";
import { 
  User, MapPin, Trophy, Star, Flame, Settings, LogOut, LogIn,
  Camera, Award, Clock, Target, TrendingUp, Calendar, Coins, Hotel, Sparkles,
  Utensils, Bed, Building, Loader2, CalendarCheck
} from "lucide-react";

interface HotelData {
  id: string;
  name: string;
  description: string | null;
  location: string;
  images: string[];
  category: string | null;
  rooms: { id: string; name: string; price_per_night: number; description: string | null }[];
  food_items: { id: string; name: string; price: number; category: string; description: string | null }[];
}

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
  const navigate = useNavigate();
  const { user, profile, role, loading, signOut } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload({ 
    folder: 'avatars', 
    userId: user?.id || '' 
  });
  
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        // Fetch active hotels with their rooms and food items
        const { data: hotelsData, error: hotelsError } = await supabase
          .from('hotels')
          .select('id, name, description, location, images, category')
          .eq('is_active', true);

        if (hotelsError) throw hotelsError;

        // For each hotel, fetch rooms and food items
        const hotelsWithDetails = await Promise.all(
          (hotelsData || []).map(async (hotel) => {
            const [roomsRes, foodRes] = await Promise.all([
              supabase
                .from('rooms')
                .select('id, name, price_per_night, description')
                .eq('hotel_id', hotel.id)
                .eq('is_available', true),
              supabase
                .from('food_items')
                .select('id, name, price, category, description')
                .eq('hotel_id', hotel.id)
                .eq('is_available', true)
            ]);

            return {
              ...hotel,
              rooms: roomsRes.data || [],
              food_items: foodRes.data || []
            };
          })
        );

        setHotels(hotelsWithDetails);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoadingHotels(false);
      }
    };

    fetchHotels();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const url = await uploadImage(file);
    if (url) {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setAvatarUrl(url);
        toast({ title: "Profile picture updated!" });
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not logged in - show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 md:pt-32 pb-32 md:pb-16 px-4">
          <div className="container mx-auto max-w-md">
            <Card className="text-center border-primary/20">
              <CardContent className="py-12 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center animate-bounce-soft">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-display font-bold text-foreground">Welcome to TourGo!</h2>
                  <p className="text-muted-foreground">Login to track your adventures, earn coins, and unlock rewards</p>
                </div>
                <div className="space-y-3">
                  <Button 
                    className="w-full gap-2 gradient-primary hover:opacity-90" 
                    size="lg"
                    onClick={() => navigate('/auth')}
                  >
                    <LogIn className="w-5 h-5" />
                    Login / Sign Up
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Hotel owner? <button onClick={() => navigate('/auth')} className="text-secondary font-semibold hover:underline">Register your hotel</button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Logged in user data
  const userData = {
    name: profile?.full_name || "Explorer",
    avatar: avatarUrl || profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
    level: Math.floor((profile?.total_coins || 0) / 1000) + 1,
    totalPoints: profile?.total_coins || 0,
    placesVisited: 47,
    currentStreak: 12,
    rank: 156,
    joinedDate: "2024",
    pointsToNextLevel: 1000,
    currentLevelPoints: (profile?.total_coins || 0) % 1000,
  };

  const levelProgress = (userData.currentLevelPoints / userData.pointsToNextLevel) * 100;

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
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <button 
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-soft hover:scale-105 transition-transform disabled:opacity-50"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-primary-foreground" />
                    )}
                  </button>
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="font-display font-bold text-2xl text-foreground">{userData.name}</h1>
                    <Badge variant="level" className="text-xs">Lvl {userData.level}</Badge>
                    {role === 'hotel_owner' && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Hotel className="w-3 h-3" />
                        Hotel Owner
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
                
                <div className="flex gap-2">
                  {role === 'hotel_owner' && (
                    <Button variant="secondary" size="sm" className="gap-2" onClick={() => navigate('/dashboard')}>
                      <Hotel className="w-4 h-4" />
                      Dashboard
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="gap-2" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
              
              {/* Level Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Level {userData.level}</span>
                  <span className="font-semibold text-foreground">
                    {userData.currentLevelPoints}/{userData.pointsToNextLevel} XP
                  </span>
                </div>
                <Progress value={levelProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {userData.pointsToNextLevel - userData.currentLevelPoints} XP to reach Level {userData.level + 1}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Coin Wallet */}
          <Card className="mb-6 bg-gradient-to-r from-accent/20 to-sunny-light/20 border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/30 flex items-center justify-center animate-pulse-glow">
                    <Coins className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Coin Balance</p>
                    <p className="text-3xl font-display font-bold text-foreground">{userData.totalPoints.toLocaleString()}</p>
                  </div>
                </div>
                <Button className="gap-2" onClick={() => navigate('/hotels')}>
                  <Sparkles className="w-4 h-4" />
                  Redeem
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="font-display font-bold text-2xl text-foreground">{userData.totalPoints.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Coins</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-display font-bold text-2xl text-foreground">{userData.placesVisited}</p>
                <p className="text-xs text-muted-foreground">Places Visited</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Flame className="w-6 h-6 mx-auto mb-2 text-coral" />
                <p className="font-display font-bold text-2xl text-foreground">{userData.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-teal" />
                <p className="font-display font-bold text-2xl text-foreground">#{userData.rank}</p>
                <p className="text-xs text-muted-foreground">Global Rank</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-muted/50 p-1 flex-wrap">
              <TabsTrigger value="bookings" className="gap-2">
                <CalendarCheck className="w-4 h-4" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="hotels" className="gap-2">
                <Building className="w-4 h-4" />
                Hotels
              </TabsTrigger>
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

            <TabsContent value="bookings">
              <MyBookings userId={user.id} />
            </TabsContent>

            <TabsContent value="hotels">
              {loadingHotels ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : hotels.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="py-12 text-center">
                    <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No hotels available yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {hotels.map((hotel) => (
                    <Card key={hotel.id} className="border-border/50 overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                              <Hotel className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{hotel.name}</CardTitle>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {hotel.location}
                              </p>
                            </div>
                          </div>
                          {hotel.category && (
                            <Badge variant="secondary" className="capitalize">{hotel.category}</Badge>
                          )}
                        </div>
                        {hotel.description && (
                          <p className="text-sm text-muted-foreground mt-2">{hotel.description}</p>
                        )}
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        {/* Rooms Section */}
                        {hotel.rooms.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2 mb-3">
                              <Bed className="w-4 h-4 text-primary" />
                              Available Rooms ({hotel.rooms.length})
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {hotel.rooms.map((room) => (
                                <div key={room.id} className="p-3 rounded-lg bg-muted/50 border border-border/30">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground">{room.name}</span>
                                    <Badge variant="points">${room.price_per_night}/night</Badge>
                                  </div>
                                  {room.description && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{room.description}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Food Items Section */}
                        {hotel.food_items.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2 mb-3">
                              <Utensils className="w-4 h-4 text-secondary" />
                              Menu Items ({hotel.food_items.length})
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {hotel.food_items.map((item) => (
                                <div key={item.id} className="p-3 rounded-lg bg-muted/50 border border-border/30">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-foreground">{item.name}</span>
                                      <Badge variant="outline" className="text-xs capitalize">{item.category}</Badge>
                                    </div>
                                    <Badge variant="streak">${item.price}</Badge>
                                  </div>
                                  {item.description && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {hotel.rooms.length === 0 && hotel.food_items.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No rooms or menu items added yet
                          </p>
                        )}

                        <Button 
                          className="w-full mt-2" 
                          variant="outline"
                          onClick={() => navigate(`/hotels/${hotel.id}`)}
                        >
                          View Hotel Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

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
                    <p className="font-display font-bold text-2xl text-foreground">{userData.joinedDate}</p>
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
