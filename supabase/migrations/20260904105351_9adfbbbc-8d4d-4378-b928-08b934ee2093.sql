CREATE TABLE public.contracts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid NOT NULL REFERENCES public.pm_properties(id) ON DELETE CASCADE,
  unit_id uuid REFERENCES public.units(id) ON DELETE SET NULL,
  lease_id uuid REFERENCES public.leases(id) ON DELETE SET NULL,
  tenant_id uuid,
  landlord_id uuid,
  created_by uuid,
  title text NOT NULL,
  contract_type text NOT NULL DEFAULT 'property_management',
  tenant_name text NOT NULL,
  landlord_name text,
  manager_name text,
  currency text NOT NULL DEFAULT 'RWF',
  monthly_rent numeric NOT NULL DEFAULT 0,
  deposit numeric NOT NULL DEFAULT 0,
  management_fee_percent numeric NOT NULL DEFAULT 0,
  start_date date,
  end_date date,
  content text NOT NULL DEFAULT '',
  input_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contracts TO authenticated;
GRANT ALL ON public.contracts TO service_role;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parties and property team can view contracts"
ON public.contracts FOR SELECT TO authenticated
USING (
  tenant_id = auth.uid()
  OR landlord_id = auth.uid()
  OR created_by = auth.uid()
  OR public.pm_can_view_property(auth.uid(), property_id)
);

CREATE POLICY "Property managers can create contracts"
ON public.contracts FOR INSERT TO authenticated
WITH CHECK (public.pm_can_manage_property(auth.uid(), property_id));

CREATE POLICY "Property managers can update contracts"
ON public.contracts FOR UPDATE TO authenticated
USING (public.pm_can_manage_property(auth.uid(), property_id))
WITH CHECK (public.pm_can_manage_property(auth.uid(), property_id));

CREATE POLICY "Property managers can delete draft contracts"
ON public.contracts FOR DELETE TO authenticated
USING (public.pm_can_manage_property(auth.uid(), property_id) AND status = 'draft');

CREATE TRIGGER trg_contracts_updated_at BEFORE UPDATE ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE FUNCTION public.can_view_contract(_user_id uuid, _contract_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.contracts c
    WHERE c.id = _contract_id
      AND (c.tenant_id = _user_id OR c.landlord_id = _user_id OR c.created_by = _user_id
           OR public.pm_can_view_property(_user_id, c.property_id))
  )
$$;

REVOKE ALL ON FUNCTION public.can_view_contract(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_view_contract(uuid, uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.is_contract_party(_user_id uuid, _contract_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.contracts c
    WHERE c.id = _contract_id
      AND (c.tenant_id = _user_id OR c.landlord_id = _user_id
           OR public.pm_can_manage_property(_user_id, c.property_id))
  )
$$;

REVOKE ALL ON FUNCTION public.is_contract_party(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_contract_party(uuid, uuid) TO authenticated, service_role;

CREATE TABLE public.contract_signatures (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  signer_role text NOT NULL,
  signer_name text NOT NULL,
  typed_signature text NOT NULL,
  signed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (contract_id, user_id)
);

GRANT SELECT, INSERT ON public.contract_signatures TO authenticated;
GRANT ALL ON public.contract_signatures TO service_role;
ALTER TABLE public.contract_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contract viewers can see signatures"
ON public.contract_signatures FOR SELECT TO authenticated
USING (public.can_view_contract(auth.uid(), contract_id));

CREATE POLICY "Parties can sign contracts"
ON public.contract_signatures FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND public.is_contract_party(auth.uid(), contract_id));