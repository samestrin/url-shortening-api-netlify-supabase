const headers = require("./headers");
const { supabase } = require("./supabase-client");

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
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
