CREATE TABLE public.agent_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 150),
  email text CHECK (email IS NULL OR char_length(email) <= 255),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  interest text NOT NULL DEFAULT 'rent' CHECK (interest IN ('rent','buy','sell','manage')),
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  budget numeric NOT NULL DEFAULT 0 CHECK (budget >= 0),
  stage text NOT NULL DEFAULT 'new' CHECK (stage IN ('new','contacted','viewing','negotiating','won','lost')),
  notes text CHECK (notes IS NULL OR char_length(notes) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_leads TO authenticated;
GRANT ALL ON public.agent_leads TO service_role;
ALTER TABLE public.agent_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agents manage own leads" ON public.agent_leads FOR ALL TO authenticated
  USING (agent_id = auth.uid() AND public.has_role(auth.uid(),'agent'))
  WITH CHECK (agent_id = auth.uid() AND public.has_role(auth.uid(),'agent'));
CREATE POLICY "Admins manage all leads" ON public.agent_leads FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER agent_leads_updated_at BEFORE UPDATE ON public.agent_leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE INDEX agent_leads_agent_idx ON public.agent_leads(agent_id);

CREATE TABLE public.agent_marketing_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL,
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 300),
  channel text NOT NULL DEFAULT 'other' CHECK (channel IN ('facebook','instagram','whatsapp','google','print','event','other')),
  amount numeric NOT NULL CHECK (amount > 0),
  spent_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_marketing_costs TO authenticated;
GRANT ALL ON public.agent_marketing_costs TO service_role;
ALTER TABLE public.agent_marketing_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agents manage own marketing costs" ON public.agent_marketing_costs FOR ALL TO authenticated
  USING (agent_id = auth.uid() AND public.has_role(auth.uid(),'agent'))
  WITH CHECK (agent_id = auth.uid() AND public.has_role(auth.uid(),'agent'));
CREATE POLICY "Admins manage all marketing costs" ON public.agent_marketing_costs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX agent_marketing_agent_idx ON public.agent_marketing_costs(agent_id);