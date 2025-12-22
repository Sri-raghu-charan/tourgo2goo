import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Bed, Clock, Coins, CreditCard, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface BookingWithDetails {
  id: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  coins_used: number | null;
  discount_applied: number | null;
  status: string | null;
  special_requests: string | null;
  created_at: string | null;
  hotel_name: string;
  hotel_location: string;
  room_name: string;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  pending: { color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400", icon: <Clock className="w-3 h-3" /> },
  confirmed: { color: "bg-green-500/20 text-green-700 dark:text-green-400", icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { color: "bg-red-500/20 text-red-700 dark:text-red-400", icon: <XCircle className="w-3 h-3" /> },
  completed: { color: "bg-blue-500/20 text-blue-700 dark:text-blue-400", icon: <CheckCircle className="w-3 h-3" /> },
};

export const MyBookings = ({ userId }: { userId: string }) => {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Fetch user's bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;

        if (!bookingsData || bookingsData.length === 0) {
          setBookings([]);
          return;
        }

        // Get unique hotel and room IDs
        const hotelIds = [...new Set(bookingsData.map(b => b.hotel_id))];
        const roomIds = [...new Set(bookingsData.map(b => b.room_id).filter(Boolean))];

        // Fetch hotel and room details
        const [hotelsRes, roomsRes] = await Promise.all([
          supabase.from('hotels').select('id, name, location').in('id', hotelIds),
          roomIds.length > 0 
            ? supabase.from('rooms').select('id, name').in('id', roomIds)
            : Promise.resolve({ data: [] })
        ]);

        const hotelsMap = new Map((hotelsRes.data || []).map(h => [h.id, h]));
        const roomsMap = new Map((roomsRes.data || []).map(r => [r.id, r]));

        // Combine data
        const enrichedBookings: BookingWithDetails[] = bookingsData.map(booking => {
          const hotel = hotelsMap.get(booking.hotel_id);
          const room = booking.room_id ? roomsMap.get(booking.room_id) : null;
          
          return {
            id: booking.id,
            check_in: booking.check_in,
            check_out: booking.check_out,
            total_amount: booking.total_amount,
            coins_used: booking.coins_used,
            discount_applied: booking.discount_applied,
            status: booking.status,
            special_requests: booking.special_requests,
            created_at: booking.created_at,
            hotel_name: hotel?.name || 'Unknown Hotel',
            hotel_location: hotel?.location || 'Unknown Location',
            room_name: room?.name || 'Unknown Room',
          };
        });

        setBookings(enrichedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Listen for realtime updates
    const channel = supabase
      .channel('user-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No bookings yet</p>
          <p className="text-sm text-muted-foreground mt-1">Your hotel bookings will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const status = booking.status || 'pending';
        const config = statusConfig[status] || statusConfig.pending;

        return (
          <Card key={booking.id} className="border-border/50 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{booking.hotel_name}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {booking.hotel_location}
                  </p>
                </div>
                <Badge className={`gap-1 ${config.color}`}>
                  {config.icon}
                  <span className="capitalize">{status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Room Info */}
              <div className="flex items-center gap-2 text-sm">
                <Bed className="w-4 h-4 text-muted-foreground" />
                <span>{booking.room_name}</span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Check-in</p>
                  <p className="font-medium text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(booking.check_in), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Check-out</p>
                  <p className="font-medium text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(booking.check_out), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">₹{Number(booking.total_amount).toLocaleString()}</span>
                  </div>
                  {booking.coins_used && booking.coins_used > 0 && (
                    <div className="flex items-center gap-1 text-sm text-accent">
                      <Coins className="w-4 h-4" />
                      <span>{booking.coins_used} coins used</span>
                    </div>
                  )}
                </div>
                {booking.created_at && (
                  <span className="text-xs text-muted-foreground">
                    Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                  </span>
                )}
              </div>

              {/* Special Requests */}
              {booking.special_requests && (
                <div className="flex items-start gap-2 p-2 bg-muted/30 rounded text-sm">
                  <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{booking.special_requests}</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
