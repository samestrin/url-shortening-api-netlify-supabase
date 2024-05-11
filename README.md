# url-shortening-api-netlify-supabase

**url-shortening-api-netlify-supabase** is a URL shortener service. It is a serverless application designed to provide both URL shortening and retrieval functionalities. Utilizing Netlify Functions and cloud-based database (Supabase), the application offers an efficient and scalable solution for creating short URLs that redirect to the original, longer URLs.

### **Features**

- **URL Shortening**: Convert long URLs into short, manageable links that are easier to share.
- **URL Validation**: Ensures that only valid URLs with proper protocols are processed.
- **Automatic URL Deduplication**: Checks the database to avoid storing duplicate entries for the same URL.
- **High Performance**: Leveraging the cloud database's capabilities for high-speed data retrieval and storage.
- **Error Handling**: Robust error handling mechanisms to provide clear feedback on the nature of issues encountered.

### **Dependencies**

- **Node.js**: The runtime environment for the serverless function.
- **Supabase**: A cloud-hosted database that stores URL mappings.
- **Dotenv**: A module for loading environment variables from a `**.env**` file.
- **Shortid**: Generates short, unique identifiers for URLs.
- **Validator**: Validates URLs to ensure they include the required protocol.
- **Querystring**: For parsing the body of POST requests.

### **Installation Instructions**

1.  **Set Up Node.js**: Ensure that Node.js is installed on your system.
2.  **Clone the Repository**: Download the project's code from its repository.
3.  **Install Dependencies**:

```bash
npm install dotenv @supabase/supabase-js shortid validator querystring
```

4. **Install Development Dependencies**:

```bash
npm install --save-dev netlify-lambda
```

5.  **Configure Environment Variables**: Create a `**.env**` file in the project root and define `**SUPABASE_URL**` and `**SUPABASE_ANON_KEY**` with your Supabase project credentials. Optionally set `**URL_BASE**` to your hostname (example: `https://frwrd.ing/`).

6.  **Build Lambda**: Build your serverless functions using the `netlify-lambda` package. This will include all the Node.js dependencies.

```bash
npm run build:lambda
```

7.  **Deploy**: Deploy to Netlify.

## Endpoints

### Shorten URL

**Endpoint:** `/shorten` **Method:** POST

Shorten a long URL and return the shortened URL.

- `url`: The URL to be shortened.

````bash
curl -X POST \
  https://localhost/shorten \
  -H 'Content-Type: application/json' \
  -d '{
  "url": "https://www.google.com"
}```

The server responsds with:

```bash
{"shortUrl":"https://frwrd.ing/lqywv6P"}
````

### Retrieve URL

**Endpoint:** `/[shortId]` **Method:** GET

Retrieve the original URL from a shortened URL.

This endpoint is accessed by navigating directly to the shortened URL.

## Error Handling

The API handles errors gracefully and returns appropriate error responses:

- **400 Bad Request**: Invalid request parameters.
- **404 Not Found**: Resource not found.
- **405 Method Not Allowed**: Invalid request method (not GET or POST).
- **500 Internal Server Error**: Unexpected server error.
