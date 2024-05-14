const headers = require("./headers");
const { supabase } = require("./supabase-client");

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
