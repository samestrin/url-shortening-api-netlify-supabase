const { supabase } = require("./supabase-client");
const crypto = require("crypto");

async function generateShortUrl(longUrl) {
  let shortUrl, data, error;

  ({ data, error } = await supabase
    .from("urls")
    .select("short_url")
    .eq("long_url", longUrl)
    .maybeSingle());

  if (error) {
    console.error("Error checking for existing long URL:", error);
    throw error;
  }

  if (data && data.short_url) {
    return data.short_url;
  }

  let isCollision = true;

  while (isCollision) {
    shortUrl = generateUuidShort();

    ({ data, error } = await supabase
      .from("urls")
      .select("short_url")
      .eq("short_url", shortUrl)
      .maybeSingle());

    if (error) {
      console.error("Error checking for collision:", error);
      throw error;
    }

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

function generateUuidShort() {
  try {
    let uuid = crypto.randomUUID().substring(0, 7);
    return uuid;
  } catch (error) {
    console.error("Failed to generate UUID:", error);
    return null;
  }
}

module.exports = {
  generateShortUrl,
};
