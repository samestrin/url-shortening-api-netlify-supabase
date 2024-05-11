require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const shortid = require("shortid");

// Configure shortid to generate 7-character IDs
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_"
);
shortid.seed(Math.random().toString(36).slice(2)); // Seed the generator for better randomness

exports.handler = async (event) => {
  if (event.httpMethod === "POST" && event.path === "/shorten") {
    const { url } = JSON.parse(event.body);
    // Generate a short URL (you can use a library or implement your own logic)
    const shortUrl = generateShortUrl(url);

    // Store the URL in Supabase
    const { data, error } = await supabase
      .from("urls")
      .insert([{ short_url: shortUrl, long_url: url }]);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ shortUrl }),
    };
  }

  // Catch-all route for redirecting to the long URL
  const { data, error } = await supabase
    .from("urls")
    .select("long_url")
    .eq("short_url", event.path.replace("/", ""))
    .single();

  if (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "URL not found" }),
    };
  }

  return {
    statusCode: 301,
    headers: {
      Location: data.long_url,
    },
  };
};

async function generateShortUrl() {
  let shortUrl;
  let isCollision = true;

  while (isCollision) {
    // Generate a unique 7-character short ID using shortid
    shortUrl = shortid.generate().slice(0, 7);

    // Check if the generated short URL already exists in the database
    const { data, error } = await supabase
      .from("urls")
      .select("short_url")
      .eq("short_url", shortUrl)
      .single();

    if (error) {
      console.error("Error checking for collision:", error);
      //throw error;
    }

    // If no data is returned, it means the short URL is unique
    isCollision = !!data;
  }

  return shortUrl;
}
async function generateShortUrl(longUrl) {
  let shortUrl;

  // Check if the long URL already exists in the database
  const { data, error } = await supabase
    .from("urls")
    .select("short_url")
    .eq("long_url", longUrl)
    .single();

  if (error) {
    console.error("Error checking for existing long URL:", error);
    throw error;
  }

  // If a matching long URL is found, return its associated short URL
  if (data && data.short_url) {
    return data.short_url;
  }

  // If no matching long URL found, generate a new short URL
  let isCollision = true;

  while (isCollision) {
    // Generate a unique 7-character short ID using shortid
    shortUrl = shortid.generate().slice(0, 7);

    // Check if the generated short URL already exists in the database
    const { data, error } = await supabase
      .from("urls")
      .select("short_url")
      .eq("short_url", shortUrl)
      .single();

    if (error) {
      console.error("Error checking for collision:", error);
      throw error;
    }

    // If no data is returned, it means the short URL is unique
    isCollision = !!data;
  }

  return shortUrl;
}
