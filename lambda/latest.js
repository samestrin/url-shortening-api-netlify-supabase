const headers = require("./headers");
const { supabase } = require("./supabase-client");
const urlBase = process.env.URL_BASE ? process.env.URL_BASE : "";

/**
 * Retrieves the latest shortened URLs from the database and returns them in the response.
 *
 * @param event - The event object containing the request data.
 * @returns A response object with the latest shortened URLs or an error message.
 *
 * @example
 * // Example usage with curl
 * curl https://your-lambda-url/latest
 */
exports.handler = async (event) => {
  try {
    const count = event.queryStringParameters.count || 10;
    const { data: results, error } = await supabase
      .from("urls")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(count);

    if (error) {
      throw new Error("Failed to retrieve latest URLs");
    }

    const modifiedResults = results.map((item) => ({
      ...item,
      short_url: `${urlBase}${item.short_url}`,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(modifiedResults),
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
