-- ============ ENUMS ============
CREATE TYPE public.unit_status AS ENUM ('available','viewing','reserved','lease_pending','occupied','notice_given','move_out','inspection','maintenance','offline');
CREATE TYPE public.pm_assignment_role AS ENUM ('manager','agent');
CREATE TYPE public.org_member_role AS ENUM ('owner','admin','member');

-- ============ ORGANIZATIONS ============
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  country text NOT NULL DEFAULT 'Rwanda',
  contact_email text,
  contact_phone text,
  logo_url text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  member_role public.org_member_role NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_members TO authenticated;
GRANT ALL ON public.organization_members TO service_role;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- ============ PROPERTIES ============
CREATE TABLE public.pm_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  unit_id_format text NOT NULL DEFAULT '{code}-{building}-{floor}{unit}',
  address text NOT NULL,
  city text NOT NULL DEFAULT 'Kigali',
  country text NOT NULL DEFAULT 'Rwanda',
  description text,
  cover_image text,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pm_properties TO authenticated;
GRANT ALL ON public.pm_properties TO service_role;
ALTER TABLE public.pm_properties ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.property_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.pm_properties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  assignment_role public.pm_assignment_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (property_id, user_id, assignment_role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_assignments TO authenticated;
GRANT ALL ON public.property_assignments TO service_role;
ALTER TABLE public.property_assignments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.pm_properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (property_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.buildings TO authenticated;
GRANT ALL ON public.buildings TO service_role;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.floors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  level integer NOT NULL,
  label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (building_id, level)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.floors TO authenticated;
GRANT ALL ON public.floors TO service_role;
ALTER TABLE public.floors ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.pm_properties(id) ON DELETE CASCADE,
  building_id uuid NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  floor_id uuid NOT NULL REFERENCES public.floors(id) ON DELETE CASCADE,
  unit_code text NOT NULL,
  unit_number text NOT NULL,
  status public.unit_status NOT NULL DEFAULT 'available',
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms integer NOT NULL DEFAULT 1,
  size_sqm numeric,
  monthly_rent numeric NOT NULL DEFAULT 0,
  deposit numeric,
  view_description text,
  parking_spaces integer NOT NULL DEFAULT 0,
  furnished text NOT NULL DEFAULT 'unfurnished',
  features text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (unit_code)
);
CREATE INDEX idx_units_property ON public.units(property_id);
CREATE INDEX idx_units_floor ON public.units(floor_id);
CREATE INDEX idx_units_status ON public.units(property_id, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.units TO authenticated;
GRANT ALL ON public.units TO service_role;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.unit_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.pm_properties(id) ON DELETE CASCADE,
  from_status public.unit_status,
  to_status public.unit_status NOT NULL,
  changed_by uuid,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_unit_status_history_unit ON public.unit_status_history(unit_id, created_at DESC);
GRANT SELECT, INSERT ON public.unit_status_history TO authenticated;
GRANT ALL ON public.unit_status_history TO service_role;
ALTER TABLE public.unit_status_history ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.management_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.pm_properties(id) ON DELETE CASCADE,
  management_fee_percent numeric NOT NULL DEFAULT 7.5,
  agent_commission_percent numeric NOT NULL DEFAULT 0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.management_agreements TO authenticated;
GRANT ALL ON public.management_agreements TO service_role;
ALTER TABLE public.management_agreements ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  property_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============ HELPER FUNCTIONS ============
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id uuid, _org_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.organization_members WHERE user_id = _user_id AND organization_id = _org_id)
$$;

CREATE OR REPLACE FUNCTION public.pm_can_view_property(_user_id uuid, _property_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'admin')
      OR EXISTS (
        SELECT 1 FROM public.pm_properties p
        JOIN public.organization_members m ON m.organization_id = p.organization_id
        WHERE p.id = _property_id AND m.user_id = _user_id)
      OR EXISTS (
        SELECT 1 FROM public.property_assignments a
        WHERE a.property_id = _property_id AND a.user_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.pm_can_manage_property(_user_id uuid, _property_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'admin')
      OR EXISTS (
        SELECT 1 FROM public.pm_properties p
        JOIN public.organization_members m ON m.organization_id = p.organization_id
        WHERE p.id = _property_id AND m.user_id = _user_id AND m.member_role IN ('owner','admin'))
      OR EXISTS (
        SELECT 1 FROM public.property_assignments a
        WHERE a.property_id = _property_id AND a.user_id = _user_id AND a.assignment_role = 'manager')
$$;

CREATE OR REPLACE FUNCTION public.pm_can_view_owner_finances(_user_id uuid, _property_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'admin')
      OR EXISTS (
        SELECT 1 FROM public.pm_properties p
        JOIN public.organization_members m ON m.organization_id = p.organization_id
        WHERE p.id = _property_id AND m.user_id = _user_id)
      OR EXISTS (
        SELECT 1 FROM public.property_assignments a
        WHERE a.property_id = _property_id AND a.user_id = _user_id AND a.assignment_role = 'manager')
$$;

CREATE OR REPLACE FUNCTION public.building_property_id(_building_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT property_id FROM public.buildings WHERE id = _building_id
$$;

CREATE OR REPLACE FUNCTION public.floor_property_id(_floor_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT b.property_id FROM public.floors f JOIN public.buildings b ON b.id = f.building_id WHERE f.id = _floor_id
$$;

-- ============ UNIT CODE GENERATION ============
CREATE OR REPLACE FUNCTION public.generate_unit_code()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_format text; v_code text; v_bcode text; v_level integer; v_pid uuid;
BEGIN
  SELECT b.property_id INTO v_pid FROM public.buildings b WHERE b.id = NEW.building_id;
  NEW.property_id := v_pid;
  SELECT p.unit_id_format, p.code INTO v_format, v_code FROM public.pm_properties p WHERE p.id = v_pid;
  SELECT b.code INTO v_bcode FROM public.buildings b WHERE b.id = NEW.building_id;
  SELECT f.level INTO v_level FROM public.floors f WHERE f.id = NEW.floor_id;

  IF NEW.unit_code IS NULL OR NEW.unit_code = '' THEN
    NEW.unit_code := replace(
      replace(
        replace(
          replace(COALESCE(v_format,'{code}-{building}-{floor}{unit}'), '{code}', v_code),
        '{building}', v_bcode),
      '{floor}', lpad(v_level::text, 2, '0')),
    '{unit}', lpad(NEW.unit_number, 2, '0'));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_units_generate_code BEFORE INSERT ON public.units
FOR EACH ROW EXECUTE FUNCTION public.generate_unit_code();

CREATE OR REPLACE FUNCTION public.track_unit_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.unit_status_history (unit_id, property_id, from_status, to_status, changed_by)
    VALUES (NEW.id, NEW.property_id, OLD.status, NEW.status, auth.uid());
    INSERT INTO public.audit_logs (user_id, property_id, action, entity_type, entity_id, old_value, new_value)
    VALUES (auth.uid(), NEW.property_id, 'unit_status_changed', 'unit', NEW.id,
            jsonb_build_object('status', OLD.status), jsonb_build_object('status', NEW.status));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_units_status_history AFTER UPDATE ON public.units
FOR EACH ROW EXECUTE FUNCTION public.track_unit_status_change();

CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_pm_properties_updated_at BEFORE UPDATE ON public.pm_properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_buildings_updated_at BEFORE UPDATE ON public.buildings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_mgmt_agreements_updated_at BEFORE UPDATE ON public.management_agreements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============ POLICIES ============
CREATE POLICY "orgs_select_members" ON public.organizations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.is_org_member(auth.uid(), id));
CREATE POLICY "orgs_insert_auth" ON public.organizations FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "orgs_update_owner" ON public.organizations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.is_org_member(auth.uid(), id));
CREATE POLICY "orgs_delete_admin" ON public.organizations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "org_members_select" ON public.organization_members FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR user_id = auth.uid() OR public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "org_members_insert" ON public.organization_members FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') OR user_id = auth.uid());
CREATE POLICY "org_members_delete" ON public.organization_members FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "pm_properties_select" ON public.pm_properties FOR SELECT TO authenticated
  USING (public.pm_can_view_property(auth.uid(), id));
CREATE POLICY "pm_properties_insert" ON public.pm_properties FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "pm_properties_update" ON public.pm_properties FOR UPDATE TO authenticated
  USING (public.pm_can_manage_property(auth.uid(), id));
CREATE POLICY "pm_properties_delete" ON public.pm_properties FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "assignments_select" ON public.property_assignments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR user_id = auth.uid() OR public.pm_can_manage_property(auth.uid(), property_id));
CREATE POLICY "assignments_write" ON public.property_assignments FOR ALL TO authenticated
  USING (public.pm_can_manage_property(auth.uid(), property_id))
  WITH CHECK (public.pm_can_manage_property(auth.uid(), property_id));

CREATE POLICY "buildings_select" ON public.buildings FOR SELECT TO authenticated
  USING (public.pm_can_view_property(auth.uid(), property_id));
CREATE POLICY "buildings_write" ON public.buildings FOR ALL TO authenticated
  USING (public.pm_can_manage_property(auth.uid(), property_id))
  WITH CHECK (public.pm_can_manage_property(auth.uid(), property_id));

CREATE POLICY "floors_select" ON public.floors FOR SELECT TO authenticated
  USING (public.pm_can_view_property(auth.uid(), public.building_property_id(building_id)));
CREATE POLICY "floors_write" ON public.floors FOR ALL TO authenticated
  USING (public.pm_can_manage_property(auth.uid(), public.building_property_id(building_id)))
  WITH CHECK (public.pm_can_manage_property(auth.uid(), public.building_property_id(building_id)));

CREATE POLICY "units_select" ON public.units FOR SELECT TO authenticated
  USING (public.pm_can_view_property(auth.uid(), property_id));
CREATE POLICY "units_write" ON public.units FOR ALL TO authenticated
  USING (public.pm_can_manage_property(auth.uid(), property_id))
  WITH CHECK (public.pm_can_manage_property(auth.uid(), COALESCE(property_id, public.building_property_id(building_id))));

CREATE POLICY "unit_history_select" ON public.unit_status_history FOR SELECT TO authenticated
  USING (public.pm_can_view_property(auth.uid(), property_id));
CREATE POLICY "unit_history_insert" ON public.unit_status_history FOR INSERT TO authenticated
  WITH CHECK (public.pm_can_manage_property(auth.uid(), property_id));

CREATE POLICY "mgmt_agreements_select" ON public.management_agreements FOR SELECT TO authenticated
  USING (public.pm_can_view_owner_finances(auth.uid(), property_id));
CREATE POLICY "mgmt_agreements_write" ON public.management_agreements FOR ALL TO authenticated
  USING (public.pm_can_manage_property(auth.uid(), property_id))
  WITH CHECK (public.pm_can_manage_property(auth.uid(), property_id));

CREATE POLICY "audit_logs_select" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR (property_id IS NOT NULL AND public.pm_can_manage_property(auth.uid(), property_id)));
CREATE POLICY "audit_logs_insert" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());