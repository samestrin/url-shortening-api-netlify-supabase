const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are not set");
}

/**
 * Creates and exports a Supabase client using environment variables for URL and anon key.
 *
 * @throws Will throw an error if the Supabase environment variables are not set.
 */
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
