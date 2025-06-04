import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://mgjzcuvgtszuhdnvmmpr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nanpjdXZndHN6dWhkbnZtbXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjE2MDAsImV4cCI6MjA2NDUzNzYwMH0.F-bbGvfAKZCFrZ_a61dXk0q_6MuA8tcxfndfM67xS94';

export const supabase = createClient(supabaseUrl, supabaseKey);
