import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Repeat, Loader2, Building2, Shield, UserPlus, Home } from "lucide-react";
import { toast } from "sonner";

const DEMO_PASSWORD = "Demo1234!";

const DEMO_ACCOUNTS = [
  { label: "Landlord / Owner", email: "landlord.demo@estatesrw.com", icon: Building2, hint: "Owner view: portfolio & finances" },
  { label: "Property Manager", email: "manager.demo@estatesrw.com", icon: Shield, hint: "Manager view: units, leases, rent" },
  { label: "Referral Agent", email: "agent.demo@estatesrw.com", icon: UserPlus, hint: "Agent view: referrals & commissions" },
  { label: "Tenant", email: "tenant.demo@estatesrw.com", icon: Home, hint: "Tenant view: my home & invoices" },
];

/** Admin-only helper: sign in as a seeded demo account to review its dashboard. */
const DemoUserSwitcher = () => {
  const { roles, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  if (!roles.includes("admin")) return null;

  const switchTo = async (email: string, label: string) => {
    setPending(email);
    try {
      await signOut();
      const { error } = await signIn(email, DEMO_PASSWORD);
      if (error) throw error;
      toast.success(`Now viewing as ${label}`, { description: "Sign out to return to your admin account." });
      setOpen(false);
      navigate("/dashboard");
    } catch (e: any) {
      toast.error(e?.message || "Could not switch to this demo account");
    } finally {
      setPending(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 px-3 py-2 rounded-full text-[13px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all w-full">
          <Repeat className="w-4 h-4" />
          Switch user
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display">Switch user</DialogTitle>
          <DialogDescription>
            Sign in as one of the seeded demo accounts to review its dashboard. Your admin session ends — sign back in with your admin email to return.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.email}
              disabled={!!pending}
              onClick={() => switchTo(a.email, a.label)}
              className="w-full flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left hover:bg-secondary transition-colors disabled:opacity-60"
            >
              <span className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {pending === a.email
                  ? <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  : <a.icon className="w-4 h-4 text-primary" />}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">{a.label}</span>
                <span className="block text-xs text-muted-foreground truncate">{a.hint}</span>
              </span>
            </button>
          ))}
        </div>
        <Button variant="ghost" className="rounded-full" onClick={() => setOpen(false)} disabled={!!pending}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DemoUserSwitcher;
