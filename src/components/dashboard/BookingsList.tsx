import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Bed, IndianRupee, Coins, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  coins_used: number;
  discount_applied: number;
  status: string;
  special_requests: string | null;
  created_at: string;
  rooms: { name: string } | null;
  profiles: { full_name: string; phone: string | null } | null;
}

interface BookingsListProps {
  hotelId: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
  completed: "bg-blue-100 text-blue-800 border-blue-300"
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  confirmed: <CheckCircle className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
  completed: <CheckCircle className="w-3 h-3" />
};

export function BookingsList({ hotelId }: BookingsListProps) {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [hotelId]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms (name),
          profiles!bookings_user_id_fkey (full_name, phone)
        `)
        .eq('hotel_id', hotelId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings((data || []) as unknown as Booking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: status as "pending" | "confirmed" | "cancelled" | "completed" })
        .eq('id', bookingId);

      if (error) throw error;
      toast({ title: `Booking ${status}! ✓` });
      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No bookings yet. Share your hotel to get bookings!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Bookings</h3>
      
      <div className="space-y-3">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{booking.profiles?.full_name || 'Guest'}</span>
                    {booking.profiles?.phone && (
                      <span className="text-sm text-muted-foreground">({booking.profiles.phone})</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Bed className="w-4 h-4" />
                      {booking.rooms?.name || 'Room'}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(booking.check_in), 'MMM dd')} - {format(new Date(booking.check_out), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {booking.total_amount}
                    </Badge>
                    {booking.coins_used > 0 && (
                      <Badge variant="outline" className="gap-1 bg-accent/20">
                        <Coins className="w-3 h-3" />
                        {booking.coins_used} coins used
                      </Badge>
                    )}
                    {booking.discount_applied > 0 && (
                      <Badge variant="outline" className="text-green-600">
                        ₹{booking.discount_applied} saved
                      </Badge>
                    )}
                  </div>
                  
                  {booking.special_requests && (
                    <p className="text-sm text-muted-foreground italic">"{booking.special_requests}"</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`gap-1 ${statusColors[booking.status]}`}>
                    {statusIcons[booking.status]}
                    {booking.status}
                  </Badge>
                  
                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(booking.id, 'confirmed')}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(booking.id, 'cancelled')}>
                        Cancel
                      </Button>
                    </div>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(booking.id, 'completed')}>
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
