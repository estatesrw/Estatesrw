-- 1. Lock down trigger-only SECURITY DEFINER functions (triggers run as table owner, so app roles never need EXECUTE)
REVOKE EXECUTE ON FUNCTION public.generate_unit_code() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.track_unit_status_change() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.calculate_booking_financials() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM anon, authenticated, public;

-- Authorization helpers are used inside RLS policies, so authenticated users must keep EXECUTE,
-- but anonymous visitors never need them.
REVOKE EXECUTE ON FUNCTION public.building_property_id(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.floor_property_id(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_vendor_id(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_vendor_owner(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.pm_can_manage_property(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.pm_can_view_property(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.pm_can_view_owner_finances(uuid, uuid) FROM anon;

-- 2. Demo data
DO $$
DECLARE
  v_admin uuid := '04bfef0d-5fc3-437e-b1a3-7ac4391864b2';
  v_org uuid;
  v_prop uuid;
  v_bld uuid;
  v_floor uuid;
  p record;
  b record;
  lvl int;
  u int;
  v_status unit_status;
  v_beds int;
BEGIN
  INSERT INTO public.organizations (name, slug, country, contact_email, contact_phone, created_by)
  VALUES ('EstatesRW Management', 'estatesrw-management', 'Rwanda', 'info@estatesrw.com', '+250 788 000 000', v_admin)
  RETURNING id INTO v_org;

  INSERT INTO public.organization_members (organization_id, user_id, member_role)
  VALUES (v_org, v_admin, 'owner');

  FOR p IN
    SELECT * FROM (VALUES
      ('Harrington Golf Residence', 'HR', 'KG 13 Ave, Nyarutarama', 'Kigali', '{code}-{building}-{floor}{unit}', ARRAY['A','B','C'], 4, 6),
      ('Nyarutarama Heights', 'NH', 'KG 9 Ave, Nyarutarama', 'Kigali', '{code}-{building}-{floor}{unit}', ARRAY['A','B'], 3, 5),
      ('Kacyiru Business Suites', 'KBS', 'KG 7 Ave, Kacyiru', 'Kigali', '{code}-{building}-{floor}{unit}', ARRAY['A'], 3, 4)
    ) AS t(name, code, address, city, fmt, buildings, floors, units_per_floor)
  LOOP
    INSERT INTO public.pm_properties (organization_id, name, code, unit_id_format, address, city, country, description, currency, status)
    VALUES (v_org, p.name, p.code, p.fmt, p.address, p.city, 'Rwanda', p.name || ' — managed by EstatesRW.', 'RWF', 'active')
    RETURNING id INTO v_prop;

    INSERT INTO public.management_agreements (property_id, management_fee_percent, agent_commission_percent, start_date, status)
    VALUES (v_prop, 10, 5, current_date - 90, 'active');

    INSERT INTO public.property_assignments (property_id, user_id, assignment_role)
    VALUES (v_prop, v_admin, 'manager');

    FOR i IN 1..array_length(p.buildings, 1) LOOP
      INSERT INTO public.buildings (property_id, name, code, display_order)
      VALUES (v_prop, 'Block ' || p.buildings[i], p.buildings[i], i)
      RETURNING id INTO v_bld;

      FOR lvl IN 1..p.floors LOOP
        INSERT INTO public.floors (building_id, level, label)
        VALUES (v_bld, lvl, 'Floor ' || lvl)
        RETURNING id INTO v_floor;

        FOR u IN 1..p.units_per_floor LOOP
          v_status := (ARRAY['occupied','occupied','available','reserved','maintenance','notice_given','viewing','occupied']::unit_status[])[1 + ((lvl * 3 + u * 5 + i) % 8)];
          v_beds := 1 + ((u + lvl) % 4);
          INSERT INTO public.units (property_id, building_id, floor_id, unit_number, status, bedrooms, bathrooms, size_sqm, monthly_rent, deposit, view_description, parking_spaces, furnished)
          VALUES (v_prop, v_bld, v_floor, u::text, v_status, v_beds, greatest(1, v_beds - 1), 45 + v_beds * 28, 350000 + v_beds * 250000, 350000 + v_beds * 250000,
                  CASE WHEN u % 2 = 0 THEN 'Golf course view' ELSE 'City view' END,
                  CASE WHEN v_beds > 2 THEN 2 ELSE 1 END,
                  CASE WHEN u % 3 = 0 THEN 'furnished' ELSE 'unfurnished' END);
        END LOOP;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;