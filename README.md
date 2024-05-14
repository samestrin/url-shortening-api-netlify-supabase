# url-shortening-api-netlify-supabase

[![Star on GitHub](https://img.shields.io/github/stars/samestrin/url-shortening-api-netlify-supabase?style=social)](https://github.com/samestrin/url-shortening-api-netlify-supabase/stargazers)[![Fork on GitHub](https://img.shields.io/github/forks/samestrin/url-shortening-api-netlify-supabase?style=social)](https://github.com/samestrin/url-shortening-api-netlify-supabase/network/members)[![Watch on GitHub](https://img.shields.io/github/watchers/samestrin/url-shortening-api-netlify-supabase?style=social)](https://github.com/samestrin/url-shortening-api-netlify-supabase/watchers)

![Version 0.0.1](https://img.shields.io/badge/Version-0.0.1-blue)[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)[![Built with Node.js](https://img.shields.io/badge/Built%20with-Node.js-green)](https://nodejs.org/)

**This has been depreciated. Please use [url-shortening-api-netlify-edge-superbase](https://github.com/samestrin/url-shortening-api-netlify-edge-supabase) instead.**

**url-shortening-api-netlify-supabase** is a URL shortener service. It is a serverless application that provides URL shortening and retrieval functionalities. Utilizing Netlify and Supabase, a cloud-based database, the application offers an efficient and scalable solution for creating short URLs that redirect to the original, longer URLs.

### **Features**

- **URL Shortening**: Convert long URLs into short, manageable links that are easier to share.
- **URL Validation**: Ensures that only valid URLs with proper protocols are processed.
- **Automatic URL Deduplication**: Checks the database to avoid storing duplicate entries for the same URL.
- **High Performance**: Leveraging the cloud database's capabilities for high-speed data retrieval and storage.
- **Error Handling**: Robust error handling mechanisms to provide clear feedback on the nature of issues encountered.

### **Dependencies**

- **Node.js**: The runtime environment for the serverless function.
- **Supabase**: A cloud-hosted database that stores URL mappings.
- **Dotenv**: A module for loading environment variables from a `.env` file.
- **Nanoid**: Generates short, unique identifiers for URLs.
- **Validator**: Validates URLs to ensure they include the required protocol.
- **Querystring**: For parsing the body of POST requests.

## **Installing Node.js**

Before installing, ensure you have Node.js and npm (Node Package Manager) installed on your system. You can download and install Node.js from [Node.js official website](https://nodejs.org/).

## **Installing url-shortening-api-netlify-supabase**

To install and use url-shortening-api-netlify-supabase, follow these steps:

1. Clone the Repository: Begin by cloning the repository containing the url-shortening-api-netlify-supabase to your local machine.

```bash
git clone https://github.com/samestrin/url-shortening-api-netlify-supabase/
```

2. Install Dependencies:

```bash
npm install dotenv @supabase/supabase-js shortid validator querystring
```

3. Install Development Dependencies:

```bash
npm install --save-dev netlify-lambda
```

4. Build Lambda: Build your serverless functions using the `netlify-lambda` package. This will include all the Node.js dependencies.

```bash
npm run build:lambda
```

## **Supabase Setup**

1. Setup Your Supabase Database: Create a new project with a `urls` table for storage. Detailed directions are available [here](SUPABASE.md).

## **Deploy and Test**

1. Deploy: Deploy to Netlify.

2. Configure Environment Variables: Create a `.env` file in the project root and define `SUPABASE_URL` and `SUPABASE_ANON_KEY` with your Supabase project credentials. Optionally set `URL_BASE` to your hostname (example: https://frwrd.ing/).

3. Test: Visit /count to see the number of URLs stored in your database.

## Endpoints

### Shorten URL

**Endpoint:** `/shorten` **Method:** POST

Shorten a long URL and return the shortened URL.

- `url`: The URL to be shortened.

#### **Example Usage**

Use a tool like Postman or curl to make a request:

```bash
curl -X POST \
  https://localhost/shorten \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'url=https://www.google.com'
```

The server responds with:

```bash
{"shortUrl":"lqywv6P"}
```

### Forward URL

**Endpoint:** `/[shortId]` **Method:** GET

Based on shortened URL, e.g. `/lqywv6P` HTTP 301 forward to a long url.

This endpoint is accessed by navigating directly to the shortened URL.

#### **Example Usage**

Use curl to make a request:

```bash
curl http://localhost/[shortId]
```

### Retrieve Latest Shortened Links

**Endpoint:** `/latest` **Method:** GET

Retrieve the latest URLs shortened.

This endpoint is accessed by navigating directly to /latest.

#### **Example Usage**

Use curl to make a request:

```bash
curl http://localhost/latest
```

### Retrieve Count

**Endpoint:** `/count` **Method:** GET

Retrieve the number of URLs shortened.

This endpoint is accessed by navigating directly to /count.

#### **Example Usage**

Use curl to make a request:

```bash
curl http://localhost/count
```

## CORS

The server responds with appropriate CORS headers such as Access-Control-Allow-Origin.

## Error Handling

The API handles errors gracefully and returns appropriate error responses:

- **400 Bad Request**: Invalid request parameters.
- **404 Not Found**: Resource not found.
- **405 Method Not Allowed**: Invalid request method (not GET or POST).
- **500 Internal Server Error**: Unexpected server error.

## Contribute

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes or improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Share

[![Twitter](https://img.shields.io/badge/X-Tweet-blue)](https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20project!&url=https://github.com/samestrin/url-shortening-api-netlify-supabase) [![Facebook](https://img.shields.io/badge/Facebook-Share-blue)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/samestrin/url-shortening-api-netlify-supabase) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Share-blue)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/samestrin/url-shortening-api-netlify-supabase)
