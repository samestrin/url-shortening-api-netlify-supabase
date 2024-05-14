const headers = require("./headers");
const { supabase } = require("./supabase-client");

/**
 * Handles the redirection of a short URL to its corresponding long URL.
 * Queries the database for the long URL associated with the provided short URL.
 *
 * @param event - The event object containing the request data.
 * @returns A response object with a 301 redirect to the long URL or an error message.
 *
 * @example
 * // Example usage with curl
 * curl -L https://your-lambda-url/shortUrl
 */
exports.handler = async (event) => {
  try {
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
