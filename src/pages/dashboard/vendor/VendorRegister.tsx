import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2 } from "lucide-react";

const VendorRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    business_type: "hotel",
    description: "",
    phone: "",
    email: "",
    address: "",
    city: "Kigali",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    // Insert vendor record - auto-approved
    const { error } = await supabase.from("vendors").insert({
      user_id: user.id,
      ...form,
      status: "approved",
    });

    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      // Also add vendor role
      await supabase.from("user_roles").insert({ user_id: user.id, role: "vendor" as any });
      toast({ title: "Registration complete!", description: "Your vendor account is now active. Start adding properties!" });
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <Building2 className="w-12 h-12 mx-auto text-primary" />
        <h2 className="font-display text-2xl font-bold text-foreground">Register as a Vendor</h2>
        <p className="text-muted-foreground">List your accommodation on EstatesRW</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display">Business Information</CardTitle>
          <CardDescription>Tell us about your accommodation business</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name *</Label>
                <Input id="business_name" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} required placeholder="e.g. Kigali Serena Hotel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_type">Business Type *</Label>
                <Select value={form.business_type} onValueChange={(v) => setForm({ ...form, business_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="guesthouse">Guest House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your property..." rows={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+250 xxx xxx xxx" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="info@yourbusiness.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required placeholder="KG 123 St" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kigali">Kigali</SelectItem>
                    <SelectItem value="Musanze">Musanze</SelectItem>
                    <SelectItem value="Rubavu">Rubavu</SelectItem>
                    <SelectItem value="Huye">Huye</SelectItem>
                    <SelectItem value="Rusizi">Rusizi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorRegister;
