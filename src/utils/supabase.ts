import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Always use in the backend
const Supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

// Always use in the frontend
const PublicSupabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ""
);

export { Supabase, PublicSupabase };
