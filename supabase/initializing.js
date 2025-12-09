import { createClient } from "@supabase/supabase-js";

// Read from environment variables (create .env.local file!)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please add it to your .env.local file or deployment platform."
  );
}

if (!supabaseKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please add it to your .env.local file or deployment platform."
  );
}

export const supabase = createClient(
  supabaseUrl, 
  supabaseKey, 
  {
    auth: {
      // Automatically refresh the token before it expires
      autoRefreshToken: true,
      // Persist auth session in localStorage
      persistSession: true,
      // Detect auth session changes and update accordingly
      detectSessionInUrl: true,
      // Configure storage
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      // Set flow type to 'pkce' for better security
      flowType: "pkce",
    },
  }
);
