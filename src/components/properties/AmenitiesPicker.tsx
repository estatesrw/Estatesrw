import { Label } from "@/components/ui/label";
import {
  Car, Waves, Dumbbell, Shield, Wifi, Wind, Flame,
  WashingMachine, TreePine, Dog, Tv, Droplets
} from "lucide-react";

const AMENITIES = [
  { value: "parking", label: "Parking", icon: Car },
  { value: "pool", label: "Pool", icon: Waves },
  { value: "gym", label: "Gym", icon: Dumbbell },
  { value: "security", label: "Security", icon: Shield },
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "ac", label: "A/C", icon: Wind },
  { value: "heating", label: "Heating", icon: Flame },
  { value: "laundry", label: "Laundry", icon: WashingMachine },
  { value: "garden", label: "Garden", icon: TreePine },
  { value: "pet_friendly", label: "Pet Friendly", icon: Dog },
  { value: "cable_tv", label: "Cable TV", icon: Tv },
  { value: "water", label: "Water Tank", icon: Droplets },
];

interface AmenitiesPickerProps {
  selected: string[];
  onChange: (amenities: string[]) => void;
}

const AmenitiesPicker = ({ selected, onChange }: AmenitiesPickerProps) => {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((a) => a !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="space-y-2">
      <Label>Amenities</Label>
      <div className="grid grid-cols-3 gap-2">
        {AMENITIES.map(({ value, label, icon: Icon }) => {
          const active = selected.includes(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                active
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AmenitiesPicker;
