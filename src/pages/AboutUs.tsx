import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Building2, Users, Shield, Award } from "lucide-react";
import founderFiston from "@/assets/founder-fiston.png";
import founderJoshua from "@/assets/founder-joshua.png";


const AboutUs = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>About EstatesRW - Rwanda's Trusted Real Estate Platform</title>
      <meta name="description" content="Learn about EstatesRW, Rwanda's premier property management platform connecting landlords, tenants, and service providers across Kigali and beyond." />
      <link rel="canonical" href="https://estatesrw.lovable.app/about-us" />
    </Helmet>
    <Navbar />
    <main className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="font-display text-4xl font-bold text-foreground mb-6">About EstatesRW</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-lg leading-relaxed text-foreground/80">
          EstatesRW is Rwanda's premier digital real estate platform, founded with the mission of making property search, management, and services accessible to everyone in Rwanda. We connect landlords, tenants, and professional service providers through an intuitive, transparent, and secure online marketplace.
        </p>

        <h2 className="font-display text-2xl text-foreground">Our Mission</h2>
        <p className="text-foreground/70">
          To revolutionize Rwanda's real estate industry by providing a trusted, technology-driven platform that simplifies property transactions, enhances transparency, and empowers both property owners and tenants to make informed decisions. We believe that finding a home or managing a property should be straightforward, safe, and efficient.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
          {[
            { icon: Building2, title: "Verified Listings", desc: "Every property on our platform goes through a verification process to ensure accuracy and reliability for our users." },
            { icon: Users, title: "Trusted Community", desc: "We build trust between landlords and tenants through verified profiles, reviews, and transparent communication channels." },
            { icon: Shield, title: "Secure Transactions", desc: "Our platform uses industry-standard security measures to protect your personal data and financial information." },
            { icon: Award, title: "Quality Service", desc: "We partner with vetted service providers to offer professional property maintenance, cleaning, and renovation services." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl bg-card shadow-card">
              <Icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl text-foreground">What We Offer</h2>
        <ul className="text-foreground/70">
          <li><strong className="text-foreground">Property Listings:</strong> Browse hundreds of verified rental properties across Kigali and other major cities in Rwanda, with detailed descriptions, photos, and pricing.</li>
          <li><strong className="text-foreground">Property Management:</strong> Landlords can manage their properties, track applications, handle maintenance requests, and communicate with tenants — all from a single dashboard.</li>
          <li><strong className="text-foreground">Professional Services:</strong> Access a network of trusted service providers for cleaning, plumbing, electrical work, painting, gardening, and more.</li>
          <li><strong className="text-foreground">Secure Messaging:</strong> Communicate directly with landlords, tenants, or service providers through our built-in messaging system.</li>
          <li><strong className="text-foreground">Online Payments:</strong> Track and manage rental payments securely through our platform.</li>
        </ul>

        <h2 className="font-display text-2xl text-foreground">Our Team</h2>
        <p className="text-foreground/70 mb-8">
          EstatesRW is built and operated by a dedicated team of real estate professionals and technology experts based in Kigali, Rwanda.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 not-prose">
          {[
            { name: "Jean-Paul Mugabo", role: "CEO & Founder", bio: "10+ years in Rwanda's real estate market. Passionate about digital transformation of property services.", initials: "JM" },
            { name: "Aline Uwase", role: "Head of Operations", bio: "Expert in property management and tenant relations. Ensures smooth platform operations daily.", initials: "AU" },
            { name: "David Niyonzima", role: "Lead Developer", bio: "Full-stack engineer driving the technology behind EstatesRW's seamless user experience.", initials: "DN" },
            { name: "Grace Mukamana", role: "Client Relations Manager", bio: "Dedicated to helping landlords and tenants find the perfect match through personalized support.", initials: "GM" },
            { name: "Patrick Habimana", role: "Property Consultant", bio: "Certified real estate consultant specializing in Kigali's residential and commercial markets.", initials: "PH" },
            { name: "Diane Ingabire", role: "Marketing Lead", bio: "Crafts the brand story and connects EstatesRW with communities across Rwanda.", initials: "DI" },
          ].map((member) => (
            <div key={member.name} className="bg-card rounded-xl shadow-card p-6 text-center border border-border hover:border-primary/20 hover:shadow-card-hover transition-all group">
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                {member.initials}
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg">{member.name}</h3>
              <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
              <p className="text-muted-foreground text-sm">{member.bio}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl text-foreground">Contact Us</h2>
        <p className="text-foreground/70">
          We're always happy to hear from you. Whether you have questions about our platform, need assistance with your account, or want to explore partnership opportunities, don't hesitate to reach out.
        </p>
        <ul className="text-foreground/70">
          <li><strong className="text-foreground">Email:</strong> <a href="mailto:info@estatesrw.com" className="text-primary hover:underline">info@estatesrw.com</a></li>
          <li><strong className="text-foreground">Phone:</strong> +250 791 915 459</li>
          <li><strong className="text-foreground">Location:</strong> Kigali, Rwanda</li>
        </ul>
      </div>
    </main>
    <Footer />
  </div>
);

export default AboutUs;
