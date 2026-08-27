export const UNIT_STATUSES = [
  "available",
  "viewing",
  "reserved",
  "lease_pending",
  "occupied",
  "notice_given",
  "move_out",
  "inspection",
  "maintenance",
  "offline",
] as const;

export type UnitStatus = (typeof UNIT_STATUSES)[number];

export const STATUS_LABELS: Record<UnitStatus, string> = {
  available: "Available",
  viewing: "Viewing",
  reserved: "Reserved",
  lease_pending: "Lease Pending",
  occupied: "Occupied",
  notice_given: "Notice Given",
  move_out: "Move Out",
  inspection: "Inspection",
  maintenance: "Maintenance",
  offline: "Offline",
};

/** CSS custom property carrying the status hue, consumed by .unit-card / .status-chip */
export const statusStyle = (status: string) =>
  ({ ["--status-color" as string]: `var(--status-${status}, var(--status-offline))` }) as React.CSSProperties;

export const OCCUPIED_STATUSES: UnitStatus[] = ["occupied", "notice_given", "move_out"];

export const formatMoney = (value: number, currency = "RWF") =>
  `${currency} ${Math.round(value).toLocaleString()}`;
