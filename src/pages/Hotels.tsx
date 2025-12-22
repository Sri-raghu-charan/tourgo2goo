import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Hotel, 
  MapPin, 
  Star, 
  Search, 
  Coins, 
  Bed,
  UtensilsCrossed,
  Sparkles,
  Filter
} from "lucide-react";

interface HotelData {
  id: string;
  name: string;
  description: string | null;
  location: string;
  category: string;
  images: string[];
  is_verified: boolean;
}

interface DiscountData {
  id: string;
  coins_required: number;
  discount_type: string;
  discount_value: number;
  target: string;
}

export default function Hotels() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [discounts, setDiscounts] = useState<Record<string, DiscountData[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const { data: hotelsData, error: hotelsError } = await supabase
        .from('hotels')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (hotelsError) throw hotelsError;
      setHotels(hotelsData || []);

      // Fetch discounts for all hotels
      const { data: discountsData, error: discountsError } = await supabase
        .from('discounts')
        .select('*')
        .eq('is_active', true);

      if (discountsError) throw discountsError;

      // Group discounts by hotel
      const discountsByHotel: Record<string, DiscountData[]> = {};
      (discountsData || []).forEach((discount) => {
        if (!discountsByHotel[discount.hotel_id]) {
          discountsByHotel[discount.hotel_id] = [];
        }
        discountsByHotel[discount.hotel_id].push(discount);
      });
      setDiscounts(discountsByHotel);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || hotel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryLabels: Record<string, string> = {
    budget: "💰 Budget",
    premium: "⭐ Premium",
    resort: "🏝️ Resort"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center shadow-lg animate-bounce-soft">
              <Hotel className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">Discover Hotels</h1>
              <p className="text-sm text-muted-foreground">Find the perfect stay</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search hotels or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="shrink-0"
            >
              All
            </Button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(key)}
                className="shrink-0"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Hotels List */}
      <div className="container mx-auto px-4 py-6">
        {filteredHotels.length === 0 ? (
          <div className="text-center py-12">
            <Hotel className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No hotels found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHotels.map((hotel) => {
              const hotelDiscounts = discounts[hotel.id] || [];
              const minCoins = hotelDiscounts.length > 0 
                ? Math.min(...hotelDiscounts.map(d => d.coins_required))
                : null;

              return (
                <Card 
                  key={hotel.id} 
                  className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                >
                  {/* Image */}
                  <div className="relative h-40 bg-gradient-to-br from-secondary/30 to-teal-light/30">
                    {hotel.images?.[0] ? (
                      <img 
                        src={hotel.images[0]} 
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Hotel className="w-12 h-12 text-secondary/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                        {categoryLabels[hotel.category]}
                      </Badge>
                      {hotel.is_verified && (
                        <Badge className="bg-green-500/90 text-white">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    
                    {/* Coin Discount Badge */}
                    {minCoins && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-accent text-accent-foreground gap-1 animate-pulse-glow">
                          <Coins className="w-3 h-3" />
                          From {minCoins} coins
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {hotel.name}
                    </h3>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      {hotel.location}
                    </p>
                    
                    {hotel.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {hotel.description}
                      </p>
                    )}
                    
                    {/* Quick Stats */}
                    <div className="flex items-center gap-3 mt-3">
                      {hotelDiscounts.filter(d => d.target === 'room').length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-secondary">
                          <Bed className="w-4 h-4" />
                          Room Offers
                        </div>
                      )}
                      {hotelDiscounts.filter(d => d.target === 'food').length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <UtensilsCrossed className="w-4 h-4" />
                          Food Offers
                        </div>
                      )}
                    </div>
                    
                    <Button className="w-full mt-4 gap-2 group-hover:gradient-primary transition-all">
                      <Sparkles className="w-4 h-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
