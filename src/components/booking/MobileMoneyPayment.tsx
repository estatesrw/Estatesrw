import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Smartphone, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MobileMoneyPaymentProps {
  bookingId: string;
  amount: number;
  onSuccess?: () => void;
}

const MobileMoneyPayment = ({ bookingId, amount, onSuccess }: MobileMoneyPaymentProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("mtn");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);

    // Simulate MoMo payment - in production this would call an actual API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update booking payment status
    const { error } = await supabase
      .from("accommodation_bookings")
      .update({
        payment_status: "paid",
        payment_method: `${provider}_mobile_money`,
      })
      .eq("id", bookingId);

    if (error) {
      toast({ title: "Payment failed", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
      toast({ title: t("booking.paymentSuccess"), description: t("booking.paymentPending") });
      onSuccess?.();
    }
    setLoading(false);
  };

  if (success) {
    return (
      <Card className="shadow-card border-success/20">
        <CardContent className="p-8 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">{t("booking.paymentSuccess")}</h3>
          <p className="text-muted-foreground text-sm">{t("booking.paymentPending")}</p>
          <p className="text-xs text-muted-foreground">Transaction will be verified by admin.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" />
          {t("booking.payWithMomo")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{t("booking.totalPrice")}</p>
            <p className="text-2xl font-bold text-foreground font-sans">{amount.toLocaleString()} RWF</p>
          </div>

          <div className="space-y-2">
            <Label>Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                <SelectItem value="airtel">Airtel Money</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("booking.enterPhone")}</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+250 78x xxx xxx"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("booking.processing") : `${t("booking.payNow")} - ${amount.toLocaleString()} RWF`}
          </Button>

          <p className="text-[11px] text-muted-foreground text-center">
            You will receive a USSD prompt on your phone to confirm the payment.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default MobileMoneyPayment;
