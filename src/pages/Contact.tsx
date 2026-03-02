import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent", description: "Thank you for contacting us. We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact EstatesRW - Get in Touch</title>
        <meta name="description" content="Contact EstatesRW for inquiries about properties, services, partnerships, or support. Reach us by email, phone, or through our contact form." />
        <link rel="canonical" href="https://estatesrw.lovable.app/contact" />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-24 max-w-5xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-4 text-center">Contact Us</h1>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Have a question or need assistance? We'd love to hear from you. Fill out the form below or use our contact details to reach our team directly.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "info@estatesrw.com", href: "mailto:info@estatesrw.com" },
              { icon: Phone, label: "Phone", value: "+250 791 915 459", href: "tel:+250791915459" },
              { icon: MapPin, label: "Office", value: "Kigali, Rwanda", href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 p-5 rounded-xl bg-card shadow-card">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{value}</a>
                  ) : (
                    <p className="text-sm text-muted-foreground">{value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="p-5 rounded-xl bg-card shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-2">Business Hours</h3>
              <p className="text-sm text-muted-foreground">Monday – Friday: 8:00 AM – 6:00 PM</p>
              <p className="text-sm text-muted-foreground">Saturday: 9:00 AM – 1:00 PM</p>
              <p className="text-sm text-muted-foreground">Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 p-6 rounded-xl bg-card shadow-card space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Your full name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email Address</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Subject</label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="How can we help?" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="Tell us more about your inquiry..." />
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto">Send Message</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
