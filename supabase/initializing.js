import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mgjzcuvgtszuhdnvmmpr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nanpjdXZndHN6dWhkbnZtbXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjE2MDAsImV4cCI6MjA2NDUzNzYwMH0.F-bbGvfAKZCFrZ_a61dXk0q_6MuA8tcxfndfM67xS94";

export const supabase = createClient(supabaseUrl, supabaseKey, {
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
});
