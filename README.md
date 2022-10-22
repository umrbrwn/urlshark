# urlshark 🦈
A simple URL shortener API built using Nest.js and MongoDB.

## Wiki
It requires Node.js v16, and MongoDB v6
1. Run `yarn` to install the build dependencies in the repo
2. Refer to `.development.env` to grab all the required environment variables
3. `npm start` to launch the API, by default it runs on `http:localhost:3001`

## DEMO
To create a short URL, just provide a test URL and send a POST request
```
curl --location --request POST 'http://localhost:3001/' \
--header 'Content-Type: application/json' \
--data-raw '{
  "url": "https://www.example.com/urlshark"
}'
```

It should return a short URL like this, with 201 HTTP status code
```
{ "shortUrl":"https://example.com/c38D10n3" }
```

Then just open the returned URL and it should redirect you to the original URL, just replace the host name with localhost:3001 on dev environment
```
curl --location --request GET 'http://localhost:3000/c38D10n31'
```

The above will automatically redirect to the original URL, for instance `https://www.example.com/urlshark`