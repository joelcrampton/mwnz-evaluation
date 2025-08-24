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
1. I have experience working with APIs in Java, but MWNZ uses Node.js and TypeScript. Therefore, I saw this as an opportunity to learn something new. I researched the best approach for this and settled on using [Express.js](https://expressjs.com/) as it is a popular web framework for Node.js to build web servers and APIs quickly
2. I wanted some practice, so I found this [YouTube tutorial](https://www.youtube.com/watch?v=-MTSQjw5DrM) to get me started. After this, I had a basic API with a `GET` endpoint that gave a JSON response (commit [`70c204c`](https://github.com/joelcrampton/mwnz-evaluation/commit/70c204c06c6e908b082e00857d371c766afaaaad))
    - I also gained a better understanding of what middleware is and the role it plays in APIs. Express.js does not parse JSON in the request body by default, so handle incoming JSON data Express.js uses middleware
    - Middleware runs between receiving the request and sending the response, allowing you to modify or process the request before it reaches your route handler. One common built-in middleware that I used as part of this tutorial is `express.json()`. When used in `app.use( express.json() )`, it automatically parses requests with a `Content-Type: application/json`, and populates the request body with the parsed data. This makes the data directly accessible in route handlers such as `app.get()`
    - In this evaluation, we are developing custom middleware to instead parse XML data in the request body and convert it to a JSON response
3. I refactored the `GET` endpoint from the basic API to return the raw XML for this evalutation (commit [`1a29fdf`](https://github.com/joelcrampton/mwnz-evaluation/commit/1a29fdf85052676998225d304c27253ec3c27581))
    - Search results pointed me towards `axios`, which is a library I used to make requests to the external static XML API
    - `https://raw.githubusercontent.com/MiddlewareNewZealand/evaluation-instructions/main/xml-api` was used as the base URL followed by `/{:id}.xml`. This allowed me to pull out a generic `id` from the request parameters, connect to the static XML API using `axios` and return the raw XML
    - I implemented error handling for a `404` status as per the [supplied OpenAPI specification](https://github.com/MiddlewareNewZealand/evaluation-instructions/blob/main/openapi-companies.yaml) as well as a default `500` status for internal server errors which tends to be standard practice
4. But, we needed the response to be in JSON format, not XML. So I searched for libraries that might help me to parse XML into JSON. I found `xml2js` which had a helpful `parseStringPromise()` method to do just that (commit [`610dac5`](https://github.com/joelcrampton/mwnz-evaluation/commit/610dac530f4c3221b2219006d4f713b545e66977))
5. Now, I had completed the task to connect to the static XML API and parse it into a JSON response. But I still needed to test it as per the instructions. After a quick search, `jest` looked like a good library to use for testing. I implemented it and wrote some tests, but they would not work. At this point all my API logic was in one file. My guess is that when I imported it into the test file, the Node.js server would start and prevent me from accessing the methods I wanted to test (commit [`bf766ab`](https://github.com/joelcrampton/mwnz-evaluation/commit/bf766abe36b5f4f1172cd50d98ce002cc81f5995))
6. To solve this I split up that file using improved architecture. I had to do this so that the running server was separate from the logic I wanted to test. After some searching for what is standard practice, I landed with the following architecture (commit [`2463922`](https://github.com/joelcrampton/mwnz-evaluation/commit/24639227fb8dabc8ccc19a4194a32f8f55859501))
    - `app.ts` creates the Express.js `app` and defines the route (endpoint) to use
    - `server.ts` starts the Node.js server on the Express.js app
    - `routes/companies.ts` the `GET` route (endpoint)
    - `services/companyService.ts` the service used in the `GET` route to request the raw XML for a company and parse it into a JSON response
    - `types/index.ts` an interface to define the JSON body for a company. Used as a type in the TypeScript
    - `tests/test.ts` the `jest` tests
7. The simple API was now running and tested! I cleaned up the code, added some documentation and that was that

## :thought_balloon: Considerations for deploying to a production environment
- In `package.json` I defined a `start` script to use the compiled JavaScript code in `dist/`. This makes execution faster
- For deploying to production, the bits of experience I have is with AWS using ECS. I would:
    - Create a Docker image of my API code
    - Push the image to ECR
    - Use a CloudFormation template to define an ECS Cluster and an ECS Task definition for the container
    - Deploy the CloudFormation template

## :repeat: Things I would do differently
- Everything was implemented using the `feature/api` branch. I should have broken the task down into smaller chunks e.g. `feature/tutorial`, `feature/xml2js` and `feature/test`
