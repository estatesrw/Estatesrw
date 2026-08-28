CREATE TABLE public.leases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.pm_properties(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL,
  tenant_name text NOT NULL,
  tenant_email text,
  tenant_phone text,
  start_date date NOT NULL,
  end_date date,
  monthly_rent numeric NOT NULL DEFAULT 0,
  deposit numeric NOT NULL DEFAULT 0,
  payment_day integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX leases_one_active_per_unit ON public.leases(unit_id) WHERE status = 'active';
CREATE INDEX leases_tenant_idx ON public.leases(tenant_id);
CREATE INDEX leases_property_idx ON public.leases(property_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leases TO authenticated;
GRANT ALL ON public.leases TO service_role;
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.pm_is_tenant_of_property(_user_id uuid, _property_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.leases WHERE tenant_id = _user_id AND property_id = _property_id AND status = 'active')
$$;
REVOKE EXECUTE ON FUNCTION public.pm_is_tenant_of_property(uuid, uuid) FROM anon;

CREATE OR REPLACE FUNCTION public.pm_is_tenant_of_unit(_user_id uuid, _unit_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.leases WHERE tenant_id = _user_id AND unit_id = _unit_id AND status = 'active')
$$;
REVOKE EXECUTE ON FUNCTION public.pm_is_tenant_of_unit(uuid, uuid) FROM anon;

CREATE POLICY leases_select ON public.leases FOR SELECT TO authenticated
  USING (tenant_id = auth.uid() OR public.pm_can_view_property(auth.uid(), property_id));
CREATE POLICY leases_write ON public.leases FOR ALL TO authenticated
  USING (public.pm_can_manage_property(auth.uid(), property_id))
  WITH CHECK (public.pm_can_manage_property(auth.uid(), property_id));

CREATE TRIGGER trg_leases_updated_at BEFORE UPDATE ON public.leases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TABLE public.rent_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lease_id uuid NOT NULL REFERENCES public.leases(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.pm_properties(id) ON DELETE CASCADE,
  unit_id uuid NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL,
  period_start date NOT NULL,
  due_date date NOT NULL,
  amount numeric NOT NULL,
  amount_paid numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'unpaid',
  reference text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX rent_invoices_lease_period ON public.rent_invoices(lease_id, period_start);
CREATE INDEX rent_invoices_property_idx ON public.rent_invoices(property_id);
CREATE INDEX rent_invoices_tenant_idx ON public.rent_invoices(tenant_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rent_invoices TO authenticated;
GRANT ALL ON public.rent_invoices TO service_role;
ALTER TABLE public.rent_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY rent_invoices_select ON public.rent_invoices FOR SELECT TO authenticated
  USING (tenant_id = auth.uid() OR public.pm_can_view_property(auth.uid(), property_id));
CREATE POLICY rent_invoices_write ON public.rent_invoices FOR ALL TO authenticated
  USING (public.pm_can_manage_property(auth.uid(), property_id))
  WITH CHECK (public.pm_can_manage_property(auth.uid(), property_id));

CREATE TRIGGER trg_rent_invoices_updated_at BEFORE UPDATE ON public.rent_invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE POLICY units_select_tenant ON public.units FOR SELECT TO authenticated
  USING (public.pm_is_tenant_of_unit(auth.uid(), id));
CREATE POLICY pm_properties_select_tenant ON public.pm_properties FOR SELECT TO authenticated
  USING (public.pm_is_tenant_of_property(auth.uid(), id));