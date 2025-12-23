import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Coins, Save } from "lucide-react";

interface Hotel {
  id: string;
  base_coin_deduction: number;
}

interface CoinSettingsCardProps {
  hotel: Hotel;
  onUpdate: () => void;
}

export function CoinSettingsCard({ hotel, onUpdate }: CoinSettingsCardProps) {
  const { toast } = useToast();
  const [baseCoinDeduction, setBaseCoinDeduction] = useState(hotel.base_coin_deduction || 0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('hotels')
        .update({ base_coin_deduction: baseCoinDeduction })
        .eq('id', hotel.id);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Base coin deduction updated successfully",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Coins className="w-5 h-5 text-accent-foreground" />
          Coin Settings
        </CardTitle>
        <CardDescription>
          Configure how many coins are deducted from users for each booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-2">
            <Label htmlFor="base-coins">Base Coin Deduction (per booking)</Label>
            <Input
              id="base-coins"
              type="number"
              min="0"
              value={baseCoinDeduction}
              onChange={(e) => setBaseCoinDeduction(parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving || baseCoinDeduction === hotel.base_coin_deduction}
            className="gap-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          This amount will be deducted from users in addition to any discount offers they apply.
        </p>
      </CardContent>
    </Card>
  );
}