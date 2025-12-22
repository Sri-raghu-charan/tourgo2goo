import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Bed, IndianRupee, Edit, Trash2, Sparkles } from "lucide-react";

interface Room {
  id: string;
  name: string;
  description: string | null;
  price_per_night: number;
  total_rooms: number;
  available_rooms: number;
  is_available: boolean;
}

interface RoomManagerProps {
  hotelId: string;
  onUpdate: () => void;
}

export function RoomManager({ hotelId, onUpdate }: RoomManagerProps) {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [totalRooms, setTotalRooms] = useState("1");
  const [availableRooms, setAvailableRooms] = useState("1");

  useEffect(() => {
    fetchRooms();
  }, [hotelId]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPricePerNight("");
    setTotalRooms("1");
    setAvailableRooms("1");
    setEditingRoom(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const roomData = {
      hotel_id: hotelId,
      name,
      description: description || null,
      price_per_night: parseFloat(pricePerNight),
      total_rooms: parseInt(totalRooms),
      available_rooms: parseInt(availableRooms)
    };

    try {
      if (editingRoom) {
        const { error } = await supabase
          .from('rooms')
          .update(roomData)
          .eq('id', editingRoom.id);
        
        if (error) throw error;
        toast({ title: "Room Updated! ✨" });
      } else {
        const { error } = await supabase
          .from('rooms')
          .insert(roomData);
        
        if (error) throw error;
        toast({ title: "Room Added! 🛏️" });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchRooms();
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (room: Room) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ is_available: !room.is_available })
        .eq('id', room.id);

      if (error) throw error;
      fetchRooms();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;
      toast({ title: "Room Deleted" });
      fetchRooms();
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setName(room.name);
    setDescription(room.description || "");
    setPricePerNight(room.price_per_night.toString());
    setTotalRooms(room.total_rooms.toString());
    setAvailableRooms(room.available_rooms.toString());
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Manage Rooms</h3>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-primary" />
                {editingRoom ? "Edit Room" : "Add New Room"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Room Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Deluxe Suite"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Room amenities and features..."
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Price/Night (₹)</Label>
                  <Input
                    type="number"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    placeholder="2000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Rooms</Label>
                  <Input
                    type="number"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Available</Label>
                  <Input
                    type="number"
                    value={availableRooms}
                    onChange={(e) => setAvailableRooms(e.target.value)}
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full gap-2">
                <Sparkles className="w-4 h-4" />
                {editingRoom ? "Update Room" : "Add Room"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {rooms.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Bed className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No rooms added yet. Add your first room!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rooms.map((room) => (
            <Card key={room.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">{room.name}</h4>
                    {room.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="gap-1">
                        <IndianRupee className="w-3 h-3" />
                        {room.price_per_night}/night
                      </Badge>
                      <Badge variant="outline">
                        {room.available_rooms}/{room.total_rooms} available
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={room.is_available}
                      onCheckedChange={() => toggleAvailability(room)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(room)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteRoom(room.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
