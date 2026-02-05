import { Search, FileCheck, Key, Home, Users, ClipboardList, Wallet, CheckCircle } from "lucide-react";
import { useState } from "react";

const HowItWorks = () => {
  const [activeRole, setActiveRole] = useState<"tenant" | "landlord">("tenant");

  const tenantSteps = [
    {
      icon: Search,
      title: "Search Properties",
      description: "Browse thousands of verified listings with detailed filters for location, price, and amenities.",
    },
    {
      icon: FileCheck,
      title: "Apply Online",
      description: "Submit your application with documents securely. Track your application status in real-time.",
    },
    {
      icon: Wallet,
      title: "Pay Securely",
      description: "Make secure payments for deposits and rent through our trusted payment platform.",
    },
    {
      icon: Key,
      title: "Move In",
      description: "Sign your digital lease and get the keys to your new home. It's that simple!",
    },
  ];

  const landlordSteps = [
    {
      icon: Home,
      title: "List Your Property",
      description: "Create a stunning listing with photos, amenities, and pricing in just minutes.",
    },
    {
      icon: Users,
      title: "Receive Applications",
      description: "Get verified tenant applications directly. Review credentials and select the best fit.",
    },
    {
      icon: ClipboardList,
      title: "Manage Leases",
      description: "Generate digital leases, track payments, and handle maintenance requests effortlessly.",
    },
    {
      icon: CheckCircle,
      title: "Earn Rent",
      description: "Receive rent payments automatically. Track all transactions in your dashboard.",
    },
  ];

  const steps = activeRole === "tenant" ? tenantSteps : landlordSteps;

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Simple Steps to Your Goal
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're looking for a new home or managing properties, our platform makes it easy.
          </p>

          {/* Role Toggle */}
          <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-xl mt-8">
            {["tenant", "landlord"].map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role as typeof activeRole)}
                className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all ${
                  activeRole === role
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                I'm a {role}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all group"
            >
              {/* Step Number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center shadow-card">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <step.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
              </div>

              <h3 className="font-semibold text-lg text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
