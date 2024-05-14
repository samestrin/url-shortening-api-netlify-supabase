const querystring = require("querystring");
const validator = require("validator");
const headers = require("./headers");
const { generateShortUrl } = require("./utils");
const { supabase } = require("./supabase-client");

const urlBase = process.env.URL_BASE ? process.env.URL_BASE : "";

/**
 * Handles the shortening of a long URL by generating a short URL and returning it in the response.
 * Validates the URL format and checks if the URL already exists in the database.
 *
 * @param event - The event object containing the request data.
 * @returns A response object with the short URL or an error message.
 *
 * @example
 * // Example usage with curl
 * curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'url=https://example.com' https://your-lambda-url/shorten
 */
exports.handler = async (event) => {
  try {
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

    if (!validator.isURL(url, { require_protocol: true })) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid URL format" }),
      };
    }

    let shortUrl = urlBase + (await generateShortUrl(url));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ shortUrl }),
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
