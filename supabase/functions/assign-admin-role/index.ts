import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    // Get user from auth.users by email
    const { data: user, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Failed to list users" }), {
        status: 500,
      });
    }

    const targetUser = user.users.find((u) => u.email === email);
    if (!targetUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Assign admin role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert([{ user_id: targetUser.id, role: "admin" }]);

    if (roleError) {
      return new Response(JSON.stringify({ error: roleError.message }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Admin role assigned to ${email}`,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
});
