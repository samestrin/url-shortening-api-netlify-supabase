const fs = require("fs");

if (fs.existsSync(".env")) {
  require("dotenv").config();
}

const { createClient } = require("@supabase/supabase-js");
const querystring = require("querystring");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const shortid = require("shortid");
const validator = require("validator");

// Configure shortid to generate 7-character IDs
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_"
);
shortid.seed(Math.random().toString(36).slice(2)); // Seed the generator for better randomness

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "POST" && event.path === "/shorten") {
      if (!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "No data in request body" }),
        };
      }

      const params = querystring.parse(event.body);
      const url = params.url;

      if (!url) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "No URL provided" }),
        };
      }

      // URL validation using validator
      if (!validator.isURL(url, { require_protocol: true })) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid URL format" }),
        };
      }

      let shortUrl = await generateShortUrl(url);

      shortUrl = "https://frwrd.ing/" + shortUrl;

      return {
        statusCode: 200,
        body: JSON.stringify({ shortUrl }),
      };
    } else if (event.httpMethod === "GET") {
      console.log("shortUrl", event.path);

      const shortUrl = event.path.replace("/", "");

      const { data, error } = await supabase
        .from("urls")
        .select("long_url")
        .eq("short_url", shortUrl)
        .maybeSingle();

      if (error) {
        throw new Error("Supabase query failed");
      }

      if (!data) {
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
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (err) {
    console.error("Error in function execution", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: err.message,
      }),
    };
  }
};

async function generateShortUrl(longUrl) {
  let shortUrl, data, error;

  // Check if the long URL already exists in the database
  ({ data, error } = await supabase
    .from("urls")
    .select("short_url")
    .eq("long_url", longUrl)
    .maybeSingle());

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
      .maybeSingle();

    if (error) {
      console.error("Error checking for collision:", error);
      throw error;
    }

    // If no data is returned, it means the short URL is unique
    isCollision = !!data;
  }

  ({ data, error } = await supabase
    .from("urls")
    .insert([{ short_url: shortUrl, long_url: longUrl }]));

  if (error) {
    console.error("Error checking for collision:", error);
    throw error;
  }

  return shortUrl;
}
