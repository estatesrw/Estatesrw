import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const caller = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await caller.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);
    const userId = claimsData.claims.sub as string;

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json({ error: "Invalid request body" }, 400);

    const propertyId = str(body.property_id, 60);
    if (!propertyId) return json({ error: "A property is required" }, 400);

    const service = createClient(supabaseUrl, supabaseServiceKey);
    const { data: allowed, error: permError } = await service.rpc("pm_can_manage_property", {
      _user_id: userId,
      _property_id: propertyId,
    });
    if (permError) return json({ error: "Could not verify permissions" }, 500);
    if (!allowed) return json({ error: "You do not manage this property" }, 403);

    if (!lovableApiKey) return json({ error: "AI is not configured for this project" }, 500);

    const details = {
      contract_type: str(body.contract_type, 60) || "property_management",
      property_name: str(body.property_name),
      property_address: str(body.property_address, 400),
      unit_code: str(body.unit_code, 60),
      landlord_name: str(body.landlord_name),
      manager_name: str(body.manager_name) || "EstatesRW Management",
      tenant_name: str(body.tenant_name),
      currency: str(body.currency, 10) || "RWF",
      monthly_rent: num(body.monthly_rent),
      deposit: num(body.deposit),
      management_fee_percent: num(body.management_fee_percent),
      payment_received: num(body.payment_received),
      payment_reference: str(body.payment_reference, 120),
      payment_date: str(body.payment_date, 30),
      start_date: str(body.start_date, 30),
      end_date: str(body.end_date, 30),
      jurisdiction: str(body.jurisdiction, 120) || "Republic of Rwanda",
      special_terms: str(body.special_terms, 2000),
    };

    if (!details.tenant_name) return json({ error: "Tenant name is required" }, 400);

    const system = [
      "You are a senior property law drafting assistant for a Rwandan property management company.",
      "Draft complete, professional, ready-to-sign contracts in clear plain English.",
      "Output PLAIN TEXT only: no markdown symbols, no asterisks, no code fences.",
      "Use numbered clauses (1., 1.1) and UPPERCASE section headings.",
      "Always include: parties, property and unit description, term, rent and payment terms,",
      "the payment already received, security deposit, management fee and manager duties,",
      "landlord duties, tenant obligations, maintenance and repairs, utilities, inspection and access,",
      "default and termination, dispute resolution under the stated jurisdiction, notices,",
      "and a SIGNATURES section with blocks for Tenant, Landlord/Owner and Property Manager (name, signature, date).",
      "Never invent facts that were not provided; write 'To be confirmed' where a detail is missing.",
      "End with a short note that the document should be reviewed by a qualified lawyer before execution.",
    ].join(" ");

    const prompt = `Draft a ${details.contract_type.replace(/_/g, " ")} contract using ONLY these details:\n${JSON.stringify(details, null, 2)}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": lovableApiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      const status = aiRes.status;
      let message = "The contract generator failed. Please try again.";
      if (status === 402) message = "AI credits are exhausted. Add credits to keep generating contracts.";
      else if (status === 403) message = "AI access is blocked for this workspace.";
      else if (status === 429) message = "Too many requests right now. Please try again in a moment.";
      console.error("AI gateway error", status, text.slice(0, 500));
      return json({ error: message }, status === 429 || status >= 500 ? status : 400);
    }

    const data = await aiRes.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    if (!content.trim()) return json({ error: "The generator returned an empty document. Try again." }, 502);

    return json({ content, details });
  } catch (error) {
    console.error("generate-contract failed", error);
    return json({ error: "Unexpected error generating the contract" }, 500);
  }
});
