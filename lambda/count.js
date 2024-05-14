const headers = require("./headers");
const { supabase } = require("./supabase-client");

/**
 * Retrieves the count of shortened URLs stored in the database and returns it in the response.
 *
 * @param event - The event object containing the request data.
 * @returns A response object with the count of shortened URLs or an error message.
 *
 * @example
 * // Example usage with curl
 * curl https://your-lambda-url/count
 */
exports.handler = async (event) => {
  try {
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
