import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Hotel, 
  Bed, 
  UtensilsCrossed, 
  Coins, 
  LogOut,
  Building2,
  Calendar,
  MapPin
} from "lucide-react";
import { HotelForm } from "@/components/dashboard/HotelForm";
import { RoomManager } from "@/components/dashboard/RoomManager";
import { FoodManager } from "@/components/dashboard/FoodManager";
import { DiscountManager } from "@/components/dashboard/DiscountManager";
import { BookingsList } from "@/components/dashboard/BookingsList";
import { CoinSettingsCard } from "@/components/dashboard/CoinSettingsCard";

interface Hotel {
  id: string;
  name: string;
  description: string | null;
  location: string;
  category: string;
  images: string[];
  is_verified: boolean;
  is_active: boolean;
  base_coin_deduction: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, role, loading, signOut } = useAuth();
  const { toast } = useToast();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRooms: 0,
    totalFoodItems: 0,
    activeDiscounts: 0
  });

  useEffect(() => {
    if (!loading && (!user || role !== 'hotel_owner')) {
      navigate('/auth');
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchHotel();
    }
  }, [user]);

  const fetchHotel = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('owner_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setHotel(data as Hotel);
        fetchStats(data.id);
      }
    } catch (error) {
      console.error('Error fetching hotel:', error);
    } finally {
      setHotelLoading(false);
    }
  };

  const fetchStats = async (hotelId: string) => {
    try {
      const [roomsRes, foodRes, discountsRes, bookingsRes] = await Promise.all([
        supabase.from('rooms').select('id', { count: 'exact' }).eq('hotel_id', hotelId),
        supabase.from('food_items').select('id', { count: 'exact' }).eq('hotel_id', hotelId),
        supabase.from('discounts').select('id', { count: 'exact' }).eq('hotel_id', hotelId).eq('is_active', true),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('hotel_id', hotelId)
      ]);

      setStats({
        totalRooms: roomsRes.count || 0,
        totalFoodItems: foodRes.count || 0,
        activeDiscounts: discountsRes.count || 0,
        totalBookings: bookingsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading || hotelLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center shadow-lg">
              <Hotel className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">Hotel Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, {profile?.full_name}</p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {!hotel ? (
          /* No Hotel - Show Setup */
          <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
            <CardContent className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center animate-bounce-soft">
                <Building2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">Set Up Your Hotel</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start by adding your hotel details. Once set up, you can manage rooms, food menu, and coin discounts.
              </p>
              <HotelForm onSuccess={fetchHotel} />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalBookings}</p>
                    <p className="text-sm text-muted-foreground">Bookings</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Bed className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalRooms}</p>
                    <p className="text-sm text-muted-foreground">Rooms</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalFoodItems}</p>
                    <p className="text-sm text-muted-foreground">Menu Items</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple/10 to-purple/5 border-purple/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple/20 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-purple" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.activeDiscounts}</p>
                    <p className="text-sm text-muted-foreground">Discounts</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hotel Info Card */}
            <Card className="overflow-hidden">
              <div className="relative h-40 bg-gradient-to-r from-secondary to-teal-light">
                {hotel.images?.[0] && (
                  <img 
                    src={hotel.images[0]} 
                    alt={hotel.name}
                    className="w-full h-full object-cover opacity-50"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={hotel.is_verified ? "default" : "secondary"}>
                      {hotel.is_verified ? "✓ Verified" : "Pending Verification"}
                    </Badge>
                    <Badge variant="outline" className="bg-card/80">
                      {hotel.category}
                    </Badge>
                    {hotel.base_coin_deduction > 0 && (
                      <Badge variant="secondary" className="bg-accent/80 gap-1">
                        <Coins className="w-3 h-3" />
                        {hotel.base_coin_deduction} coins/booking
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">{hotel.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hotel.location}
                  </p>
                </div>
              </div>
            </Card>

            {/* Coin Settings Card */}
            <CoinSettingsCard hotel={hotel} onUpdate={fetchHotel} />

            {/* Management Tabs */}
            <Tabs defaultValue="rooms" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="rooms" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Bed className="w-4 h-4" />
                  <span className="hidden sm:inline">Rooms</span>
                </TabsTrigger>
                <TabsTrigger value="food" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <UtensilsCrossed className="w-4 h-4" />
                  <span className="hidden sm:inline">Food</span>
                </TabsTrigger>
                <TabsTrigger value="discounts" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Coins className="w-4 h-4" />
                  <span className="hidden sm:inline">Discounts</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Bookings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="rooms" className="mt-6">
                <RoomManager hotelId={hotel.id} onUpdate={() => fetchStats(hotel.id)} />
              </TabsContent>

              <TabsContent value="food" className="mt-6">
                <FoodManager hotelId={hotel.id} onUpdate={() => fetchStats(hotel.id)} />
              </TabsContent>

              <TabsContent value="discounts" className="mt-6">
                <DiscountManager hotelId={hotel.id} onUpdate={() => fetchStats(hotel.id)} />
              </TabsContent>

              <TabsContent value="bookings" className="mt-6">
                <BookingsList hotelId={hotel.id} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}
