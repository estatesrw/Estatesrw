import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { PmProperty } from "@/hooks/usePmProperties";

interface Props {
  properties: PmProperty[];
  propertyId: string | null;
  onChange: (id: string) => void;
}

const PropertySwitcher = ({ properties, propertyId, onChange }: Props) => (
  <Select value={propertyId ?? undefined} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-[300px] rounded-full">
      <span className="flex items-center gap-2 min-w-0">
        <Building2 className="w-4 h-4 text-primary shrink-0" />
        <SelectValue placeholder="Select a property" />
      </span>
    </SelectTrigger>
    <SelectContent>
      {properties.map((p) => (
        <SelectItem key={p.id} value={p.id}>
          {p.name} · {p.code}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default PropertySwitcher;
