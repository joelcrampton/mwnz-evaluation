# MWNZ Evaluation
This is a simple API (middleware) that connects to a static XML API and parses it into a JSON response

## :spiral_notepad: Instructions
### macOS/Linux
1. Open a new terminal
2. Clone this repository: `git clone https://github.com/joelcrampton/mwnz-evaluation.git`
3. Change directory: `cd mwnz-evaluation`
4. Install `nvm`: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
5. Load `nvm` into your current terminal session: `source ~/.nvm/nvm.sh`
6. Install [Node.js](https://nodejs.org/en) v22.18.0: `nvm install 22.18.0`
7. Install dependencies: `npm install`
8. Install dev dependencies: `npm install --save-dev typescript ts-node`
9. Run tests: `npm test`
10. Start the server: `npm start`
11. Open a browser and search for http://localhost:3000/v1/companies/1. The following JSON should appear:
    ```
    {
      "id": 1,
      "name": "MWNZ",
      "description": "..is awesome"
    }
    ```
12. Stop the server: `Ctrl+C`

## :bulb: How did I create it?
1. I have experience working with APIs in Java, but MWNZ uses Node.js and TypeScript. Therefore, I saw this as an opportunity to learn something new. I researched the best approach for this settled on using [Express.js](https://expressjs.com/) as it is a popular web framework for Node.js to build web servers and APIs quickly
2. I wanted some practice, so I found this [YouTube tutorial](https://www.youtube.com/watch?v=-MTSQjw5DrM) to get me started. After this, I had a simple API with a `GET` endpoint that gave a JSON response
    - I also gained a better understanding of what middleware is and the role it plays in APIs. Express.js does not parse JSON in the request body by default, so handle incoming JSON data Express.js uses middleware
    - Middleware runs between receiving the request and sending the response, allowing you to modify or process the request before it reaches your route handler. One common built-in middleware that I used as part of this tutorial is `express.json()`. When used in `app.use( express.json() )`, it automatically parses requests with a `Content-Type: application/json`, and populates the request body with the parsed data. This makes the data directly accessible in route handlers such as `app.get()`
    - In this evaluation, we are developing custom middleware to instead parse XML data in the request body and convert it to a JSON response
3. I refactored the `GET` endpoint from the simple API to return the raw XML for this evalutation
    - Search results pointed me towards `axios`, which is a `npm` package I used to make requests to the external static XML API
    - https://raw.githubusercontent.com/MiddlewareNewZealand/evaluation-instructions/main/xml-api was used as the base URL followed by `/{:id}.xml`. This allowed me to pull out a generic id from the request parameters, connect to the static XML API using `axios` and return the raw XML
    - I also implemented error handling as per the [supplied OpenAPI specification](https://github.com/MiddlewareNewZealand/evaluation-instructions/blob/main/openapi-companies.yaml)
5. But, we needed the response to be in JSON format, not XML. So I searched for `npm` packages that might help me to parse XML into JSON. I found `xml2js` which had a helpful `parseStringPromise()` method to do just that
6. Now, I had completed the task to connect to the static XML API and parse it into a JSON response. But I still needed to test it as per the instructions. After a quick search, `jest` looked like a good `npm` package to use for testing. I implemented it and wrote some tests, but they would not work. At this point all my API logic was in one file. When I imported it into the test file, the Node.js server would start and prevent me from accessing the methods I wanted to test
7. To solve this I split up that file using improved architecture. I had to do this so that the running server was separate from the logic I wanted to test. After some searching for what is standard practice, I landed with the following architecture:
    - `app.ts` creates the Express.js `app` and defines the route (endpoint) to use
    - `server.ts` starts the Node.js server on the Express.js app
    - `routes/companies.ts` the GET route (endpoint)
    - `services/companyService.ts` the service used in the GET route to request the raw XML for a company and parse it into a JSON response
    - `types/index.ts` an interface to define the JSON body for a company. Used as a type in the TypeScript
    - `tests/test.ts` the `jest` tests
8. The simple API was now running and tested! I cleaned up the code, added some documentation and that was that

## :repeat: Things I would do differently
- Everything was implemented using the `feature/api` branch. I should have broken the task down into smaller chunks e.g. `feature/tutorial`, `feature/xml2js` and `feature/test`
