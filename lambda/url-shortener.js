require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const querystring = require("querystring");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const { customAlphabet } = require("nanoid");
const validator = require("validator");

// Configure URL Base
const urlBase = process.env.URL_BASE ? process.env.URL_BASE : "";

// Configure nanoid to generate 7-character IDs
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_",
  7
);

const headers = {
  "Access-Control-Allow-Origin": "*", // Allows all domains
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json",
};

exports.handler = async (event) => {
  try {
    // Handle OPTIONS request for preflight checks (important for CORS)
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers,
        body: "",
      };
    }

    if (event.httpMethod === "POST" && event.path === "/shorten") {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "No data in request body" }),
        };
      }

      const params = querystring.parse(event.body);
      const url = params.url;

      if (!url) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "No URL provided" }),
        };
      }

      // URL validation using validator
      if (!validator.isURL(url, { require_protocol: true })) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Invalid URL format" }),
        };
      }

      let shortUrl = await generateShortUrl(url);
      shortUrl = urlBase + shortUrl;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ shortUrl }),
      };
    } else if (event.httpMethod === "GET") {
      if (event.path === "/count") {
        // New endpoint to get the count of records
        const { data, error, count } = await supabase
          .from("urls")
          .select("id", { count: "exact" });

        if (error) {
          throw new Error("Failed to retrieve count");
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ count }),
        };
      } else if (event.path === "/latest") {
        // New endpoint to get the latest N shortened URLs
        const count = event.queryStringParameters.count || 10;
        const { results, error } = await supabase
          .from("urls")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(count);

        if (error) {
          throw new Error("Failed to retrieve latest URLs");
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(results),
        };
      }

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
          headers,
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
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (err) {
    console.error("Error in function execution", err);
    return {
      statusCode: 500,
      headers,
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
    // Generate a unique 7-character short ID using nanoid
    shortUrl = nanoid();

    // Check if the generated short URL already exists in the database
    ({ data, error } = await supabase
      .from("urls")
      .select("short_url")
      .eq("short_url", shortUrl)
      .maybeSingle());

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
    console.error("Error inserting new URL:", error);
    throw error;
  }

  return shortUrl;
}
