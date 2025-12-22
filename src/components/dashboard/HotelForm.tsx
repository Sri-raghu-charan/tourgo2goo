import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Building2, MapPin, FileText, Sparkles } from "lucide-react";

interface HotelFormProps {
  onSuccess: () => void;
}

export function HotelForm({ onSuccess }: HotelFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("budget");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('hotels')
        .insert({
          owner_id: user.id,
          name,
          location,
          description,
          category: category as "budget" | "premium" | "resort"
        });

      if (error) throw error;

      toast({
        title: "Hotel Created! 🎉",
        description: "Your hotel has been added successfully",
      });
      
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4" />
          Add Your Hotel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Add Hotel Details
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotel-name" className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              Hotel Name
            </Label>
            <Input
              id="hotel-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Grand Palace Hotel"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hotel-location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Location
            </Label>
            <Input
              id="hotel-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Mumbai, Maharashtra"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hotel-description" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Description
            </Label>
            <Textarea
              id="hotel-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your hotel..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">💰 Budget</SelectItem>
                <SelectItem value="premium">⭐ Premium</SelectItem>
                <SelectItem value="resort">🏝️ Resort</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Create Hotel
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
