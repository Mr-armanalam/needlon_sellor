import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.SUPABASE_SECRET_KEY || "placeholder-key",
);