import { BedDouble, Bath, Maximize } from "lucide-react";
import { STATUS_LABELS, statusStyle, UnitStatus, formatMoney } from "@/lib/unitStatus";
import { ManagedUnit } from "@/hooks/useUnits";

interface Props {
  unit: ManagedUnit;
  currency: string;
  onClick: () => void;
}

const UnitCard = ({ unit, currency, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    style={statusStyle(unit.status)}
    className="unit-card text-left rounded-2xl border p-3 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <div className="flex items-center justify-between gap-2">
      <span className="font-display text-sm font-semibold text-foreground truncate">{unit.unit_code}</span>
      <span className="w-2 h-2 rounded-full status-dot shrink-0" />
    </div>
    <span className="status-chip mt-1.5">{STATUS_LABELS[unit.status as UnitStatus] ?? unit.status}</span>
    <div className="mt-2 flex items-center gap-2.5 text-[11px] text-muted-foreground">
      <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{unit.bedrooms}</span>
      <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{unit.bathrooms}</span>
      {unit.size_sqm ? <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{unit.size_sqm}m²</span> : null}
    </div>
    <p className="mt-1 text-[11px] font-medium text-foreground/80 truncate">{formatMoney(Number(unit.monthly_rent), currency)}</p>
  </button>
);

export default UnitCard;
