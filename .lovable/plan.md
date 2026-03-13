

## Plan

### 1. Add Service Request / Consultation Form to Services Page (`src/pages/Services.tsx`)

Insert a new section before the CTA section with a consultation request form containing:
- **Fields**: Full Name, Email, Phone, Service Category (dropdown matching the existing `coreServices` + additional), Message/Details
- **Styling**: Card-based form matching the page's design language (rounded-2xl, shadow-card, primary accents)
- **Behavior**: Uses `useState` for form state. On submit, inserts into a new `consultation_requests` database table. Shows a toast on success/error.
- **No auth required** -- visitors can submit without logging in.

**Database migration needed**: Create a `consultation_requests` table with columns: `id`, `name`, `email`, `phone`, `service_type`, `message`, `created_at`, `status` (default 'pending'). RLS: allow anonymous inserts, admin-only select/update/delete.

### 2. Add Team Member Profiles to About Us Page (`src/pages/AboutUs.tsx`)

Replace the current plain text "Our Team" paragraph with a visual grid of team member cards:
- **Data**: Hardcoded array of 4-6 team members with name, role, bio, and placeholder avatar images (using `ui.avatars.com` or initials via the Avatar component)
- **Card design**: Photo/avatar at top, name, title, short bio. Styled consistently with the existing value cards on the page (rounded-xl, bg-card, shadow-card)
- **Grid**: 2 columns on mobile, 3-4 on desktop

### Files to modify:
- `src/pages/Services.tsx` -- add consultation form section
- `src/pages/AboutUs.tsx` -- add team profiles grid

### Database:
- New migration: `consultation_requests` table with public INSERT RLS policy and admin-only management policies

