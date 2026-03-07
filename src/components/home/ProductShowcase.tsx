import { BarChart3, CalendarCheck, Building2, Shield, Users, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BarChart3,
    title: "Admin Dashboard",
    description: "Complete platform control with real-time analytics, user management, and financial oversight.",
  },
  {
    icon: Building2,
    title: "Vendor PMS",
    description: "Manage properties, rooms, pricing, and availability with a simplified property management system.",
  },
  {
    icon: CalendarCheck,
    title: "Booking Calendar",
    description: "Color-coded availability calendar with real-time booking status, check-ins, and check-outs.",
  },
  {
    icon: Shield,
    title: "Payment Gatekeeper",
    description: "Admin-controlled payment verification ensures every booking is confirmed before vendor payout.",
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "Track guest history, manage reviews, and maintain communication throughout the booking lifecycle.",
  },
  {
    icon: DollarSign,
    title: "Commission Engine",
    description: "Automated commission calculation with per-vendor rates, payout tracking, and financial reports.",
  },
];

const ProductShowcase = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Platform Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Built For Professional Property Management
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete multi-vendor booking and property management platform with
            admin-controlled payment verification and automated commission tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Admin Dashboard Mockup */}
        <div className="mt-20 space-y-6">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">Platform Dashboards</h3>
            <p className="text-muted-foreground mt-2">Real screens from the EstatesRW management system</p>
          </div>

          {/* Admin Dashboard Preview */}
          <div className="bg-card rounded-2xl border border-border shadow-elevated overflow-hidden">
            <div className="bg-primary px-6 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
              </div>
              <span className="text-xs text-primary-foreground/60 ml-2 font-medium">EstatesRW — Admin Dashboard</span>
            </div>
            <div className="p-6 bg-background">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Properties", value: "1,247", color: "bg-primary/10 text-primary" },
                  { label: "Active Bookings", value: "384", color: "bg-success/10 text-success" },
                  { label: "Pending Approval", value: "23", color: "bg-warning/10 text-warning" },
                  { label: "Monthly Revenue", value: "$48,920", color: "bg-primary/10 text-primary" },
                ].map(s => (
                  <div key={s.label} className="p-4 rounded-xl bg-card border border-border shadow-soft">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-bold text-foreground mt-1 font-sans">{s.value}</p>
                    <div className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${s.color}`}>Live</div>
                  </div>
                ))}
              </div>
              {/* Mini bar chart mockup */}
              <div className="flex items-end gap-1 h-20 px-4">
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary/40" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between px-4 mt-1">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                  <span key={m} className="text-[8px] text-muted-foreground font-medium">{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Two-column: PMS + Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vendor PMS Mockup */}
            <div className="bg-card rounded-2xl border border-border shadow-elevated overflow-hidden">
              <div className="bg-primary px-6 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                </div>
                <span className="text-xs text-primary-foreground/60 ml-2 font-medium">Vendor PMS — Properties</span>
              </div>
              <div className="p-5 bg-background space-y-3">
                {[
                  { name: "Kigali Serena Hotel", rooms: 48, occ: "87%", status: "Active" },
                  { name: "Ubumwe Grande", rooms: 32, occ: "72%", status: "Active" },
                  { name: "The Retreat", rooms: 12, occ: "95%", status: "Active" },
                ].map(p => (
                  <div key={p.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">{p.rooms} rooms · {p.occ} occupancy</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">{p.status}</span>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-primary text-primary-foreground text-center">
                    <p className="text-lg font-bold font-sans">$12,450</p>
                    <p className="text-[10px] font-medium text-primary-foreground/70">Net Earnings</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-border text-center">
                    <p className="text-lg font-bold text-foreground font-sans">92</p>
                    <p className="text-[10px] font-medium text-muted-foreground">Total Rooms</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-border text-center">
                    <p className="text-lg font-bold text-foreground font-sans">84%</p>
                    <p className="text-[10px] font-medium text-muted-foreground">Avg Occupancy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Mockup */}
            <div className="bg-card rounded-2xl border border-border shadow-elevated overflow-hidden">
              <div className="bg-primary px-6 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                  <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                </div>
                <span className="text-xs text-primary-foreground/60 ml-2 font-medium">Booking Calendar — March 2026</span>
              </div>
              <div className="p-5 bg-background">
                <div className="flex gap-3 mb-4">
                  {[
                    { label: "Available", cls: "bg-success/20 border-success/30" },
                    { label: "Booked", cls: "bg-destructive/20 border-destructive/30" },
                    { label: "Pending", cls: "bg-warning/20 border-warning/30" },
                    { label: "Blocked", cls: "bg-muted border-border" },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded border ${l.cls}`} />
                      <span className="text-[10px] text-muted-foreground font-medium">{l.label}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const statuses = [
                      "bg-success/20 border-success/30 text-success",
                      "bg-destructive/20 border-destructive/30 text-destructive",
                      "bg-warning/20 border-warning/30 text-warning",
                      "bg-success/20 border-success/30 text-success",
                      "bg-success/20 border-success/30 text-success",
                      "bg-destructive/20 border-destructive/30 text-destructive",
                      "bg-muted border-border text-muted-foreground",
                    ];
                    return (
                      <div key={i} className={`aspect-square rounded-md border flex items-center justify-center text-[10px] font-medium ${statuses[i % 7]}`}>
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Guest Dashboard Mockup */}
          <div className="bg-card rounded-2xl border border-border shadow-elevated overflow-hidden">
            <div className="bg-primary px-6 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
              </div>
              <span className="text-xs text-primary-foreground/60 ml-2 font-medium">Guest Dashboard — My Bookings</span>
            </div>
            <div className="p-6 bg-background">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Active Stays", value: "2", icon: "🏨" },
                  { label: "Saved Properties", value: "8", icon: "❤️" },
                  { label: "Total Spent", value: "$3,240", icon: "💳" },
                  { label: "Reviews Given", value: "5", icon: "⭐" },
                ].map(s => (
                  <div key={s.label} className="p-4 rounded-xl bg-card border border-border shadow-soft">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{s.icon}</span>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    </div>
                    <p className="text-xl font-bold text-foreground font-sans">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { ref: "BK-A2F3C1D9", hotel: "Kigali Marriott", dates: "Mar 10-14", status: "Confirmed", amount: "$840" },
                  { ref: "BK-E7B4F0A2", hotel: "Radisson Blu", dates: "Mar 22-25", status: "Pending", amount: "$560" },
                ].map(b => (
                  <div key={b.ref} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{b.hotel}</p>
                      <p className="text-[11px] text-muted-foreground">{b.ref} · {b.dates}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm text-foreground font-sans">{b.amount}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${b.status === "Confirmed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Flow */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">How Bookings Work</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-2">
              Secure, Admin-Verified Booking Flow
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Guest Books", desc: "Guest selects property, room type, and dates — submits booking request." },
              { step: "2", title: "Payment Received", desc: "Payment is submitted and held for admin verification." },
              { step: "3", title: "Admin Approves", desc: "Admin reviews and verifies payment, then approves the booking." },
              { step: "4", title: "Vendor Confirmed", desc: "Vendor sees confirmed booking. Commission is auto-calculated." },
            ].map((s, i) => (
              <div key={s.step} className="relative bg-card rounded-2xl p-6 border border-border shadow-card text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mb-3 font-sans">
                  {s.step}
                </div>
                <h4 className="font-semibold text-foreground mb-1">{s.title}</h4>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 z-10">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button size="lg" onClick={() => window.location.href = '/auth'}>
            Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
