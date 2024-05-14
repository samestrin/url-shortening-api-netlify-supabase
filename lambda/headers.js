/**
 * Sets common headers for CORS and JSON content type in HTTP responses.
 *
 * @type {Object}
 *
 * @example
 * // Usage in response
 * return {
 *   statusCode: 200,
 *   headers,
 *   body: JSON.stringify(data),
 * };
 */

module.exports = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json",
};
