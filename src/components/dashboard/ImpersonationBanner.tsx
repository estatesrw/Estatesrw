import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { EyeOff, ShieldAlert, Loader2 } from "lucide-react";
import {
  clearImpersonation,
  readImpersonation,
  type ImpersonationState,
} from "@/lib/impersonation";

/** Persistent banner shown while an admin is viewing the app as a demo account. */
const ImpersonationBanner = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState<ImpersonationState | null>(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const sync = () => setState(readImpersonation());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("estatesrw:impersonation", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("estatesrw:impersonation", sync);
    };
  }, [user?.id]);

  // Only show while the active session actually is the impersonated account.
  const active = !!state && !!user?.email && user.email.toLowerCase() === state.email.toLowerCase();

  useEffect(() => {
    if (state && user && !active) clearImpersonation();
  }, [state, user, active]);

  if (!active || !state) return null;

  const exit = async () => {
    setExiting(true);
    const returnPath = state.returnPath || "/dashboard";
    clearImpersonation();
    await signOut();
    navigate(`/auth?next=${encodeURIComponent(returnPath)}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-3xl flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 backdrop-blur-xl px-4 py-3 shadow-card">
        <span className="w-9 h-9 shrink-0 rounded-full bg-destructive/15 flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-destructive" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            Viewing as another user — {state.label}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {state.email} · this is not your admin account. Actions you take are saved as this user.
          </p>
        </div>
        <Button
          size="sm"
          variant="destructive"
          className="rounded-full shrink-0"
          onClick={exit}
          disabled={exiting}
        >
          {exiting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <EyeOff className="w-4 h-4 mr-2" />}
          Exit impersonation
        </Button>
      </div>
    </div>
  );
};

export default ImpersonationBanner;
