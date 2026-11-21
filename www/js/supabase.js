// Supabase Project Credentials
const SUPABASE_URL = "https://imlzebymurgxmgfdptza.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_paFU-Hh0U8K30YRdrXFgvQ_9tgOQ1mt";

// Initialize Supabase Client
window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("Supabase connected successfully!");