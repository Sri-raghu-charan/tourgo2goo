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
import { Plus, UtensilsCrossed, IndianRupee, Edit, Trash2, Sparkles } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image_url: string | null;
  is_available: boolean;
}

interface FoodManagerProps {
  hotelId: string;
  onUpdate: () => void;
}

const categoryEmojis: Record<string, string> = {
  veg: "🥗",
  non_veg: "🍖",
  drinks: "🥤",
  desserts: "🍰"
};

export function FoodManager({ hotelId, onUpdate }: FoodManagerProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("veg");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchItems();
  }, [hotelId]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('category', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching food items:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("veg");
    setPrice("");
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      hotel_id: hotelId,
      name,
      description: description || null,
      category: category as "veg" | "non_veg" | "drinks" | "desserts",
      price: parseFloat(price)
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('food_items')
          .update(itemData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast({ title: "Menu Item Updated! ✨" });
      } else {
        const { error } = await supabase
          .from('food_items')
          .insert(itemData);
        
        if (error) throw error;
        toast({ title: "Menu Item Added! 🍽️" });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchItems();
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (item: FoodItem) => {
    try {
      const { error } = await supabase
        .from('food_items')
        .update({ is_available: !item.is_available })
        .eq('id', item.id);

      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      toast({ title: "Item Deleted" });
      fetchItems();
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (item: FoodItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || "");
    setCategory(item.category);
    setPrice(item.price.toString());
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
        <h3 className="text-lg font-semibold">Food Menu</h3>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Butter Chicken"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Delicious creamy curry..."
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">🥗 Veg</SelectItem>
                      <SelectItem value="non_veg">🍖 Non-Veg</SelectItem>
                      <SelectItem value="drinks">🥤 Drinks</SelectItem>
                      <SelectItem value="desserts">🍰 Desserts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="250"
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full gap-2">
                <Sparkles className="w-4 h-4" />
                {editingItem ? "Update Item" : "Add Item"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No menu items yet. Add your first dish!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{categoryEmojis[item.category]}</span>
                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    )}
                    <Badge variant="secondary" className="gap-1 mt-2">
                      <IndianRupee className="w-3 h-3" />
                      {item.price}
                    </Badge>
                  </div>
                  
                  <Switch
                    checked={item.is_available}
                    onCheckedChange={() => toggleAvailability(item)}
                  />
                </div>
                
                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteItem(item.id)}>
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
