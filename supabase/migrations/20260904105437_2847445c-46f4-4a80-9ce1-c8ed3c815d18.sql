CREATE OR REPLACE FUNCTION public.sync_contract_signature_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_required uuid[];
  v_signed integer;
BEGIN
  SELECT ARRAY(SELECT DISTINCT x FROM unnest(ARRAY[c.tenant_id, c.landlord_id, c.created_by]) AS x WHERE x IS NOT NULL)
  INTO v_required
  FROM public.contracts c WHERE c.id = NEW.contract_id;

  SELECT COUNT(DISTINCT s.user_id) INTO v_signed
  FROM public.contract_signatures s
  WHERE s.contract_id = NEW.contract_id AND s.user_id = ANY(v_required);

  UPDATE public.contracts
  SET status = CASE WHEN v_signed >= COALESCE(array_length(v_required, 1), 0) THEN 'signed' ELSE 'awaiting_signatures' END
  WHERE id = NEW.contract_id AND status <> 'void';

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_contract_signature_status
AFTER INSERT ON public.contract_signatures
FOR EACH ROW EXECUTE FUNCTION public.sync_contract_signature_status();