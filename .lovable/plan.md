# EstatesRW Property Management OS — Migration Plan

## Audit of what exists today

- React 18 + Vite + Tailwind + shadcn, React Router, Lovable Cloud backend with auth already working.
- Roles already exist as a proper `user_roles` table + `has_role()` security-definer function: `tenant, landlord, service_provider, admin, vendor, agent`. Role assignment happens server-side on signup.
- Existing dashboard: one shell (`DashboardLayout`) plus ~21 flat pages (properties, bookings, applications, payments, maintenance, messages, vendor PMS, agent referrals, admin tools).
- Existing data is **flat**: `properties` → `room_types` (used as units) → `accommodation_bookings`. No buildings, floors, unit IDs, leases, or organizations.
- Public marketing site (home, about, services, blog, legal, AdSense compliance) is separate and stays untouched.

Conclusion: authentication, roles, storage, and the public site are reusable. The property hierarchy, long-term leasing, and role-scoped dashboards must be built new alongside the existing short-stay/vendor system rather than replacing it.

## Approach

Build the management platform as a new namespace (`/manage/*`) with its own SaaS shell, while `/dashboard/*` keeps working for the existing marketplace/vendor features. Nothing existing is deleted. New relational schema, new role-scoped dashboards, real persistence — no mock UI.

## Phase 1 (this first block of work)

Foundation + the signature feature.

1. **Schema**: `organizations`, `organization_members`, `properties_pm` (management properties with `unit_id_prefix`, management agreement fee %), `buildings`, `floors`, `units`, `unit_status_history`, `property_assignments` (manager/agent authorization). Full RLS: tenant sees only their unit, manager only assigned properties, owner only owned properties, agent only authorized marketing data, admin everything — all enforced by security-definer helper functions, not client filters.
2. **Unit ID system**: configurable per-property format (`HR-A-0503`), generated server-side, unique, globally searchable.
3. **App shell**: `/manage` layout — persistent left sidebar, top bar with global search / notifications / profile, property switcher, role-driven navigation, mobile drawer.
4. **Visual occupancy map**: floor-by-floor rounded unit cards with status color + text label (Occupied / Available / Reserved / Maintenance / Notice / Offline), filters by building, floor, bedrooms, price, status; click opens a unit detail panel with tenant, lease, rent, payment and request summary plus action buttons. Virtualized/paged so 1000+ units stay smooth.
5. **Unit lifecycle**: status transitions persist and write to `unit_status_history` with actor + timestamp.
6. **Demo data**: Harrington Golf Residence (KG 13 Ave, Kigali) plus 2 more properties, multiple buildings/floors, 50+ units across 2/3/4-bed types with mixed statuses — inserted as ordinary data, no Harrington-specific code.
7. **Design system**: off-white surfaces, dark text, EstatesRW green accent, subtle borders, soft shadows, rounded cards — via semantic tokens. Skeleton loaders, friendly errors, empty states with CTAs from the start.

## Later phases (confirmed scope, built after Phase 1 lands)

- **Phase 2**: Tenant, Owner, Manager, Admin dashboards + KPI card system + command center + activity feed.
- **Phase 3**: Leases, payments/rent collection, ticketing system with attachments and activity history, documents with permissioned access, notifications, messaging.
- **Phase 4**: Agent portal, lead pipeline, commissions, management fees, marketing campaigns/expenses.
- **Phase 5**: Reports (occupancy, collection, owner monthly report, PDF/CSV export), analytics, audit log review.

## Technical notes

- All money and fee percentages read from `management_agreements` / property settings — nothing hardcoded.
- Business rule "one active lease per unit" enforced by a partial unique index plus a validation trigger.
- Integrations (mobile money, WhatsApp, email, e-sign, KYC) get thin service interfaces only — no fake implementations.
- Every new public table gets explicit GRANTs alongside RLS.
- Audit logging added as a shared trigger helper in Phase 1 so later modules inherit it.

## Ask

This is a multi-turn build. I'll start with Phase 1 exactly as above, then continue phase by phase in following turns.
