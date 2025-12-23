import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  MapPin, 
  Hotel, 
  Bed, 
  UtensilsCrossed, 
  Coins, 
  IndianRupee,
  Star,
  Sparkles,
  Calendar as CalendarIcon,
  Percent,
  Gift
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { Navigation } from "@/components/Navigation";

interface HotelData {
  id: string;
  name: string;
  description: string | null;
  location: string;
  category: string;
  images: string[];
  is_verified: boolean;
  base_coin_deduction: number;
}

interface Room {
  id: string;
  name: string;
  description: string | null;
  price_per_night: number;
  available_rooms: number;
  is_available: boolean;
  images: string[] | null;
}

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  is_available: boolean;
  image_url: string | null;
}

interface Discount {
  id: string;
  name: string;
  description: string | null;
  coins_required: number;
  discount_type: string;
  discount_value: number;
  target: string;
}

const categoryEmojis: Record<string, string> = {
  veg: "🥗",
  non_veg: "🍖",
  drinks: "🥤",
  desserts: "🍰"
};

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [specialRequests, setSpecialRequests] = useState("");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchHotelData();
    }
  }, [id]);

  const fetchHotelData = async () => {
    try {
      const [hotelRes, roomsRes, foodRes, discountsRes] = await Promise.all([
        supabase.from('hotels').select('*').eq('id', id).single(),
        supabase.from('rooms').select('*').eq('hotel_id', id).eq('is_available', true),
        supabase.from('food_items').select('*').eq('hotel_id', id).eq('is_available', true),
        supabase.from('discounts').select('*').eq('hotel_id', id).eq('is_active', true)
      ]);

      if (hotelRes.data) setHotel(hotelRes.data as HotelData);
      setRooms(roomsRes.data || []);
      setFoodItems(foodRes.data || []);
      setDiscounts(discountsRes.data || []);
    } catch (error) {
      console.error('Error fetching hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedRoom || !checkIn || !checkOut) return 0;
    const nights = differenceInDays(checkOut, checkIn);
    if (nights <= 0) return 0;
    
    let total = selectedRoom.price_per_night * nights;
    
    if (selectedDiscount && selectedDiscount.target === 'room') {
      if (selectedDiscount.discount_type === 'flat') {
        total -= selectedDiscount.discount_value;
      } else if (selectedDiscount.discount_type === 'percentage') {
        total -= (total * selectedDiscount.discount_value / 100);
      }
    }
    
    return Math.max(0, total);
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a room",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!selectedRoom || !checkIn || !checkOut || !hotel) return;

    const nights = differenceInDays(checkOut, checkIn);
    if (nights <= 0) {
      toast({
        title: "Invalid Dates",
        description: "Check-out must be after check-in",
        variant: "destructive",
      });
      return;
    }

    // Calculate total coins needed (base + discount)
    const baseCoinDeduction = hotel.base_coin_deduction || 0;
    const discountCoins = selectedDiscount?.coins_required || 0;
    const totalCoinsNeeded = baseCoinDeduction + discountCoins;
    const userCoins = profile?.total_coins || 0;
    
    if (totalCoinsNeeded > 0 && userCoins < totalCoinsNeeded) {
      toast({
        title: "Not Enough Coins",
        description: `You need ${totalCoinsNeeded} coins (${baseCoinDeduction} base + ${discountCoins} for discount). You have ${userCoins}.`,
        variant: "destructive",
      });
      return;
    }

    setBookingLoading(true);

    try {
      const totalAmount = calculateTotal();
      const discountApplied = selectedDiscount 
        ? (selectedRoom.price_per_night * nights) - totalAmount 
        : 0;

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          hotel_id: hotel.id,
          room_id: selectedRoom.id,
          check_in: format(checkIn, 'yyyy-MM-dd'),
          check_out: format(checkOut, 'yyyy-MM-dd'),
          total_amount: totalAmount,
          coins_used: totalCoinsNeeded,
          discount_applied: discountApplied,
          special_requests: specialRequests || null
        });

      if (bookingError) throw bookingError;

      // Deduct coins (base + discount)
      if (totalCoinsNeeded > 0) {
        const { error: coinsError } = await supabase
          .from('profiles')
          .update({ total_coins: userCoins - totalCoinsNeeded })
          .eq('user_id', user.id);

        if (coinsError) console.error('Error deducting coins:', coinsError);

        // Record transaction for base coins
        if (baseCoinDeduction > 0) {
          await supabase
            .from('coin_transactions')
            .insert({
              user_id: user.id,
              amount: -baseCoinDeduction,
              transaction_type: 'booking_fee',
              description: `Base booking fee at ${hotel.name}`
            });
        }

        // Record transaction for discount coins
        if (selectedDiscount && discountCoins > 0) {
          await supabase
            .from('coin_transactions')
            .insert({
              user_id: user.id,
              amount: -discountCoins,
              transaction_type: 'redemption',
              description: `Redeemed for ${selectedDiscount.name} at ${hotel.name}`
            });
        }
      }

      toast({
        title: "Booking Confirmed! 🎉",
        description: `Your stay at ${hotel.name} is booked!`,
      });

      setBookingDialogOpen(false);
      navigate('/profile');
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const getDiscountDisplay = (discount: Discount) => {
    if (discount.discount_type === 'percentage') return `${discount.discount_value}% off`;
    if (discount.discount_type === 'free_item') return 'Free Item';
    return `₹${discount.discount_value} off`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Hotel className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Hotel not found</h2>
          <Button onClick={() => navigate('/hotels')} className="mt-4">
            Back to Hotels
          </Button>
        </div>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    budget: "💰 Budget",
    premium: "⭐ Premium",
    resort: "🏝️ Resort"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-24">
      {/* Header */}
      <div className="relative h-56 bg-gradient-to-br from-secondary to-teal-light">
        {hotel.images?.[0] && (
          <img 
            src={hotel.images[0]} 
            alt={hotel.name}
            className="w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm"
          onClick={() => navigate('/hotels')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-card/90">
              {categoryLabels[hotel.category]}
            </Badge>
            {hotel.is_verified && (
              <Badge className="bg-green-500 text-white">✓ Verified</Badge>
            )}
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">{hotel.name}</h1>
          <p className="flex items-center gap-1 text-muted-foreground mt-1">
            <MapPin className="w-4 h-4" />
            {hotel.location}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {hotel.description && (
          <p className="text-muted-foreground mb-6">{hotel.description}</p>
        )}

        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="rooms" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bed className="w-4 h-4" />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="food" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UtensilsCrossed className="w-4 h-4" />
              Food
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Coins className="w-4 h-4" />
              Offers
            </TabsTrigger>
          </TabsList>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="mt-6 space-y-4">
            {rooms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bed className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No rooms available</p>
              </div>
            ) : (
              rooms.map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow overflow-hidden">
                  {room.images?.[0] && (
                    <div className="h-32 w-full">
                      <img 
                        src={room.images[0]} 
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{room.name}</h3>
                        {room.description && (
                          <p className="text-sm text-muted-foreground mt-1">{room.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="gap-1">
                            <IndianRupee className="w-3 h-3" />
                            {room.price_per_night}/night
                          </Badge>
                          <Badge variant="outline">
                            {room.available_rooms} available
                          </Badge>
                        </div>
                      </div>
                      
                      <Dialog open={bookingDialogOpen && selectedRoom?.id === room.id} onOpenChange={setBookingDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="gap-2"
                            onClick={() => {
                              setSelectedRoom(room);
                              setBookingDialogOpen(true);
                            }}
                          >
                            <CalendarIcon className="w-4 h-4" />
                            Book Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Book {room.name}</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            {/* Date Selection with Popovers */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Check-in Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !checkIn && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {checkIn ? format(checkIn, "PPP") : <span>Select date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={checkIn}
                                      onSelect={setCheckIn}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                      className={cn("p-3 pointer-events-auto")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Check-out Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !checkOut && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {checkOut ? format(checkOut, "PPP") : <span>Select date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={checkOut}
                                      onSelect={setCheckOut}
                                      disabled={(date) => !checkIn || date <= checkIn}
                                      initialFocus
                                      className={cn("p-3 pointer-events-auto")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                            
                            {/* Show selected dates summary */}
                            {checkIn && checkOut && (
                              <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg text-sm">
                                <CalendarIcon className="w-4 h-4 text-primary" />
                                <span>{format(checkIn, "MMM dd")} → {format(checkOut, "MMM dd, yyyy")}</span>
                                <Badge variant="secondary">{differenceInDays(checkOut, checkIn)} nights</Badge>
                              </div>
                            )}
                            
                            {/* Base Coin Requirement */}
                            {hotel.base_coin_deduction > 0 && (
                              <div className="p-3 bg-accent/10 rounded-lg border border-accent/30">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2 text-sm font-medium">
                                    <Coins className="w-4 h-4 text-accent-foreground" />
                                    Booking Fee
                                  </span>
                                  <Badge variant="secondary" className="gap-1">
                                    {hotel.base_coin_deduction} coins
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Required coins for booking at this hotel
                                </p>
                              </div>
                            )}

                            {/* Discount Selection */}
                            {discounts.filter(d => d.target === 'room').length > 0 && (
                              <div className="space-y-2">
                                <Label>Apply Coin Discount (optional)</Label>
                                <div className="space-y-2">
                                  {discounts.filter(d => d.target === 'room').map((discount) => (
                                    <Button
                                      key={discount.id}
                                      type="button"
                                      variant={selectedDiscount?.id === discount.id ? "default" : "outline"}
                                      className="w-full justify-between"
                                      onClick={() => setSelectedDiscount(
                                        selectedDiscount?.id === discount.id ? null : discount
                                      )}
                                    >
                                      <span className="flex items-center gap-2">
                                        <Coins className="w-4 h-4" />
                                        {discount.name}
                                      </span>
                                      <span className="text-sm">
                                        +{discount.coins_required} coins = {getDiscountDisplay(discount)}
                                      </span>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Coin Balance */}
                            {profile && (
                              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Your balance:</span>
                                <span className="font-semibold text-accent">{profile.total_coins} coins</span>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <Label>Special Requests (optional)</Label>
                              <Textarea
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                placeholder="Any special requirements..."
                                rows={2}
                              />
                            </div>
                            
                            {/* Price Summary */}
                            {checkIn && checkOut && (
                              <Card className="bg-muted/50">
                                <CardContent className="p-4 space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>{differenceInDays(checkOut, checkIn)} nights × ₹{room.price_per_night}</span>
                                    <span>₹{differenceInDays(checkOut, checkIn) * room.price_per_night}</span>
                                  </div>
                                  {selectedDiscount && (
                                    <div className="flex justify-between text-sm text-green-600">
                                      <span>Discount ({selectedDiscount.name})</span>
                                      <span>-₹{(differenceInDays(checkOut, checkIn) * room.price_per_night) - calculateTotal()}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Total</span>
                                    <span className="text-primary">₹{calculateTotal()}</span>
                                  </div>
                                  {/* Coins to be deducted */}
                                  {(hotel.base_coin_deduction > 0 || selectedDiscount) && (
                                    <div className="flex justify-between text-sm border-t pt-2 text-accent-foreground">
                                      <span className="flex items-center gap-1">
                                        <Coins className="w-3 h-3" />
                                        Coins to deduct
                                      </span>
                                      <span className="font-medium">
                                        {hotel.base_coin_deduction + (selectedDiscount?.coins_required || 0)} coins
                                      </span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                            
                            <Button 
                              className="w-full gap-2" 
                              onClick={handleBooking}
                              disabled={!checkIn || !checkOut || bookingLoading}
                            >
                              {bookingLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground" />
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4" />
                                  Confirm Booking
                                </>
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Food Tab */}
          <TabsContent value="food" className="mt-6">
            {foodItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No menu items available</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {foodItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow overflow-hidden">
                    {item.image_url && (
                      <div className="h-32 w-full">
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{categoryEmojis[item.category]}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          )}
                          <Badge variant="secondary" className="gap-1 mt-2">
                            <IndianRupee className="w-3 h-3" />
                            {item.price}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers" className="mt-6">
            {discounts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Coins className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No coin offers available</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {discounts.map((discount) => (
                  <Card key={discount.id} className="hover:shadow-md transition-shadow border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {discount.target === 'room' ? (
                              <Bed className="w-5 h-5 text-secondary" />
                            ) : (
                              <UtensilsCrossed className="w-5 h-5 text-primary" />
                            )}
                            <h4 className="font-semibold text-foreground">{discount.name}</h4>
                          </div>
                          {discount.description && (
                            <p className="text-sm text-muted-foreground">{discount.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className="bg-accent text-accent-foreground gap-1">
                              <Coins className="w-3 h-3" />
                              {discount.coins_required} coins
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              {discount.discount_type === 'percentage' && <Percent className="w-3 h-3" />}
                              {discount.discount_type === 'flat' && <IndianRupee className="w-3 h-3" />}
                              {discount.discount_type === 'free_item' && <Gift className="w-3 h-3" />}
                              {getDiscountDisplay(discount)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
}
