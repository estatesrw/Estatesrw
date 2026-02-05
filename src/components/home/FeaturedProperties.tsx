import { MapPin, Bed, Bath, Square, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const properties = [
  {
    id: 1,
    title: "Modern Villa with Pool",
    location: "Nyarutarama, Kigali",
    price: 450000,
    priceType: "sale",
    beds: 4,
    baths: 3,
    sqft: 3200,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    featured: true,
  },
  {
    id: 2,
    title: "Luxury Apartment Downtown",
    location: "Kiyovu, Kigali",
    price: 1500,
    priceType: "rent",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    featured: false,
  },
  {
    id: 3,
    title: "Cozy Family Home",
    location: "Kimihurura, Kigali",
    price: 280000,
    priceType: "sale",
    beds: 3,
    baths: 2,
    sqft: 2100,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    featured: false,
  },
  {
    id: 4,
    title: "Executive Office Space",
    location: "Gasabo, Kigali",
    price: 3500,
    priceType: "rent",
    beds: 0,
    baths: 2,
    sqft: 2500,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    featured: true,
  },
  {
    id: 5,
    title: "Hillside Retreat",
    location: "Rebero, Kigali",
    price: 520000,
    priceType: "sale",
    beds: 5,
    baths: 4,
    sqft: 4000,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    featured: false,
  },
  {
    id: 6,
    title: "Studio Apartment",
    location: "Gisozi, Kigali",
    price: 600,
    priceType: "rent",
    beds: 1,
    baths: 1,
    sqft: 500,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    featured: false,
  },
];

const PropertyCard = ({ property }: { property: typeof properties[0] }) => {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            property.priceType === "sale" 
              ? "bg-primary text-primary-foreground" 
              : "bg-accent text-accent-foreground"
          }`}>
            For {property.priceType === "sale" ? "Sale" : "Rent"}
          </span>
          {property.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-foreground text-primary-foreground">
              Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-card transition-all">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin className="w-4 h-4" />
              {property.location}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {property.beds > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {property.beds} Beds
            </div>
          )}
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            {property.baths} Baths
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            {property.sqft.toLocaleString()} sqft
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-foreground">
              ${property.price.toLocaleString()}
            </span>
            {property.priceType === "rent" && (
              <span className="text-muted-foreground">/month</span>
            )}
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

const FeaturedProperties = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Featured Listings
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              Discover Our Best Properties
            </h2>
          </div>
          <Button variant="ghost" className="group self-start md:self-auto">
            View All Properties
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
