const headers = require("./headers");
const { supabase } = require("./supabase-client");

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
