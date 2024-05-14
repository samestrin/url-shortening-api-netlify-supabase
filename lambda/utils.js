const { supabase } = require("./supabase-client");
const crypto = require("crypto");

/**
 * Generates a short URL for a given long URL. Checks if the long URL already has a short URL and returns it if found.
 * Otherwise, generates a new unique short URL, avoiding collisions, and stores it in the database.
 *
 * @param longUrl - The original long URL to be shortened.
 * @returns The generated short URL.
 * @throws Will throw an error if there is an issue with Supabase queries.
 *
 * @example
 * // Generates a short URL for 'https://example.com'
 * generateShortUrl('https://example.com');
 */
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

/**
 * Generates a 7-character unique identifier using a UUID.
 *
 * @returns A short UUID string.
 * @throws Will log an error if UUID generation fails.
 *
 * @example
 * // Generates a short UUID
 * generateUuidShort();
 */
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
