
-- Create a BEFORE INSERT trigger on accommodation_bookings that calculates
-- financial values server-side from room_types data, ignoring client-submitted values.

CREATE OR REPLACE FUNCTION public.calculate_booking_financials()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_price_per_night numeric;
  v_commission_rate numeric;
  v_calculated_nights integer;
  v_calculated_total numeric;
  v_calculated_commission numeric;
  v_calculated_payout numeric;
BEGIN
  -- Calculate nights from check_in/check_out
  v_calculated_nights := (NEW.check_out - NEW.check_in);
  IF v_calculated_nights < 1 THEN
    RAISE EXCEPTION 'Check-out must be after check-in';
  END IF;

  -- Get price from room_types
  SELECT price_per_night INTO v_price_per_night
  FROM public.room_types
  WHERE id = NEW.room_type_id;

  IF v_price_per_night IS NULL THEN
    RAISE EXCEPTION 'Invalid room type';
  END IF;

  -- Get vendor commission rate
  SELECT commission_rate INTO v_commission_rate
  FROM public.vendors
  WHERE id = NEW.vendor_id;

  IF v_commission_rate IS NULL THEN
    v_commission_rate := 10;
  END IF;

  -- Calculate financial values server-side (override any client values)
  v_calculated_total := v_price_per_night * v_calculated_nights;
  v_calculated_commission := ROUND(v_calculated_total * v_commission_rate / 100, 2);
  v_calculated_payout := v_calculated_total - v_calculated_commission;

  -- Override client-submitted values
  NEW.nights := v_calculated_nights;
  NEW.total_price := v_calculated_total;
  NEW.commission_amount := v_calculated_commission;
  NEW.vendor_payout := v_calculated_payout;

  -- Ensure guests is at least 1
  IF NEW.guests < 1 THEN
    NEW.guests := 1;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_calculate_booking_financials
BEFORE INSERT ON public.accommodation_bookings
FOR EACH ROW
EXECUTE FUNCTION public.calculate_booking_financials();
