const querystring = require("querystring");
const validator = require("validator");
const headers = require("./headers");
const { generateShortUrl } = require("./utils");
const urlBase = process.env.URL_BASE ? process.env.URL_BASE : "";

exports.handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "No data in request body" }),
      };
    }

    // Parse the body as URL-encoded string
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

    let shortUrl = await generateShortUrl(url);
    shortUrl = urlBase + shortUrl;

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
