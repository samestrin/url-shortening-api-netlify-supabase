# url-shortening-api-netlify-supabase

[![Star on GitHub](https://img.shields.io/github/stars/samestrin/url-shortening-api-netlify-supabase?style=social)](https://github.com/samestrin/url-shortening-api-netlify-supabase/stargazers)[![Fork on GitHub](https://img.shields.io/github/forks/samestrin/url-shortening-api-netlify-supabase?style=social)](https://github.com/samestrin/url-shortening-api-netlify-supabase/network/members)[![Watch on GitHub](https://img.shields.io/github/watchers/samestrin/url-shortening-api-netlify-supabase?style=social)](https://github.com/samestrin/url-shortening-api-netlify-supabase/watchers)

![Version 0.0.1](https://img.shields.io/badge/Version-0.0.1-blue)[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)[![Built with Node.js](https://img.shields.io/badge/Built%20with-Node.js-green)](https://nodejs.org/)

**url-shortening-api-netlify-supabase** is a URL shortener service. It is a serverless application designed to provide both URL shortening and retrieval functionalities. Utilizing Netlify and Supabase, a cloud-based database, the application offers an efficient and scalable solution for creating short URLs that redirect to the original, longer URLs.

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

5.  **Setup Supabase**: Create a new project with a urls table for storage. Detailed directions are available [here](SUPABASE.md).
6.  **Configure Environment Variables**: Create a `.env` file in the project root and define `SUPABASE_URL` and `SUPABASE_ANON_KEY` with your Supabase project credentials. Optionally set `URL_BASE` to your hostname (example: `https://frwrd.ing/`).

7.  **Build Lambda**: Build your serverless functions using the `netlify-lambda` package. This will include all the Node.js dependencies.

```bash
npm run build:lambda
```

7.  **Deploy**: Deploy to Netlify.

## Endpoints

### Shorten URL

**Endpoint:** `/shorten` **Method:** POST

Shorten a long URL and return the shortened URL.

- `url`: The URL to be shortened.

```bash
curl -X POST \
  https://localhost/shorten \
  -H 'Content-Type: application/json' \
  -d '{
  "url": "https://www.google.com"
}
```

The server responds with:

```bash
{"shortUrl":"lqywv6P"}
```

### Retrieve URL

**Endpoint:** `/[shortId]` **Method:** GET

Retrieve the original URL from a shortened URL, e.g. `/lqywv6P`.

This endpoint is accessed by navigating directly to the shortened URL.

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
