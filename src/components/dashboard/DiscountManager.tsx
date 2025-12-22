import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Coins, Percent, IndianRupee, Gift, Edit, Trash2, Sparkles, Bed, UtensilsCrossed } from "lucide-react";

interface Discount {
  id: string;
  name: string;
  description: string | null;
  coins_required: number;
  discount_type: string;
  discount_value: number;
  target: string;
  is_active: boolean;
  image_url?: string | null;
}

interface DiscountManagerProps {
  hotelId: string;
  onUpdate: () => void;
}

export function DiscountManager({ hotelId, onUpdate }: DiscountManagerProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { uploadImage, uploading } = useImageUpload({ 
    folder: 'discounts', 
    userId: user?.id || '' 
  });
  
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coinsRequired, setCoinsRequired] = useState("");
  const [discountType, setDiscountType] = useState<string>("flat");
  const [discountValue, setDiscountValue] = useState("");
  const [target, setTarget] = useState<string>("room");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscounts();
  }, [hotelId]);

  const fetchDiscounts = async () => {
    try {
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscounts(data || []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCoinsRequired("");
    setDiscountType("flat");
    setDiscountValue("");
    setTarget("room");
    setImageUrl(null);
    setEditingDiscount(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const discountData = {
      hotel_id: hotelId,
      name,
      description: description || null,
      coins_required: parseInt(coinsRequired),
      discount_type: discountType as "flat" | "percentage" | "free_item",
      discount_value: parseFloat(discountValue),
      target: target as "room" | "food"
    };

    try {
      if (editingDiscount) {
        const { error } = await supabase
          .from('discounts')
          .update(discountData)
          .eq('id', editingDiscount.id);
        
        if (error) throw error;
        toast({ title: "Discount Updated! ✨" });
      } else {
        const { error } = await supabase
          .from('discounts')
          .insert(discountData);
        
        if (error) throw error;
        toast({ title: "Discount Created! 🎉" });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchDiscounts();
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (discount: Discount) => {
    try {
      const { error } = await supabase
        .from('discounts')
        .update({ is_active: !discount.is_active })
        .eq('id', discount.id);

      if (error) throw error;
      fetchDiscounts();
    } catch (error) {
      console.error('Error toggling discount:', error);
    }
  };

  const deleteDiscount = async (discountId: string) => {
    try {
      const { error } = await supabase
        .from('discounts')
        .delete()
        .eq('id', discountId);

      if (error) throw error;
      toast({ title: "Discount Deleted" });
      fetchDiscounts();
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (discount: Discount) => {
    setEditingDiscount(discount);
    setName(discount.name);
    setDescription(discount.description || "");
    setCoinsRequired(discount.coins_required.toString());
    setDiscountType(discount.discount_type);
    setDiscountValue(discount.discount_value.toString());
    setTarget(discount.target);
    setImageUrl(discount.image_url || null);
    setDialogOpen(true);
  };

  const getDiscountDisplay = (discount: Discount) => {
    if (discount.discount_type === 'percentage') {
      return `${discount.discount_value}% off`;
    } else if (discount.discount_type === 'free_item') {
      return 'Free Item';
    }
    return `₹${discount.discount_value} off`;
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
        <h3 className="text-lg font-semibold">Coin Discounts</h3>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4" />
              Add Discount
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-accent" />
                {editingDiscount ? "Edit Discount" : "Create Coin Discount"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Discount Image (Optional)</Label>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  onUpload={uploadImage}
                  uploading={uploading}
                  placeholder="Upload discount banner"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Discount Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Weekend Special"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Get discount on room bookings..."
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Coins Required</Label>
                  <Input
                    type="number"
                    value={coinsRequired}
                    onChange={(e) => setCoinsRequired(e.target.value)}
                    placeholder="500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Applies To</Label>
                  <Select value={target} onValueChange={setTarget}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room">🛏️ Room Booking</SelectItem>
                      <SelectItem value="food">🍽️ Food Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">₹ Flat Off</SelectItem>
                      <SelectItem value="percentage">% Percentage</SelectItem>
                      <SelectItem value="free_item">🎁 Free Item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percentage' ? "20" : "200"}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full gap-2" disabled={uploading}>
                <Sparkles className="w-4 h-4" />
                {editingDiscount ? "Update Discount" : "Create Discount"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {discounts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Coins className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No discounts yet. Create offers for tourists!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {discounts.map((discount) => (
            <Card key={discount.id} className={`group hover:shadow-md transition-shadow overflow-hidden ${!discount.is_active ? 'opacity-60' : ''}`}>
              {discount.image_url && (
                <div className="h-24 overflow-hidden">
                  <img 
                    src={discount.image_url} 
                    alt={discount.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {discount.target === 'room' ? (
                        <Bed className="w-4 h-4 text-secondary" />
                      ) : (
                        <UtensilsCrossed className="w-4 h-4 text-primary" />
                      )}
                      <h4 className="font-semibold text-foreground">{discount.name}</h4>
                    </div>
                    {discount.description && (
                      <p className="text-sm text-muted-foreground">{discount.description}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="gap-1 bg-accent/20 text-accent-foreground">
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
                  
                  <Switch
                    checked={discount.is_active}
                    onCheckedChange={() => toggleActive(discount)}
                  />
                </div>
                
                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(discount)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteDiscount(discount.id)}>
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