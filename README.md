# Triviabook API

**Ronald Hester Jr.**  
CSC 372-01   
November 18, 2026

## About My Project

For this project, I built a REST API called Triviabook using Node.js, Express, and PostgreSQL. The API allows users to retrieve trivia topics, get questions based on a topic, and check whether their answers are correct.

I used Neon to host my PostgreSQL database and EchoAPI to test my endpoints.

## Technologies Used

- Node.js and Express — Backend server and API routes
- PostgreSQL — Stores trivia topics, questions, and answers
- Neon — Cloud database hosting
- dotenv — Manages environment variables
- EchoAPI — Tests API requests and responses

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/triviabook/topics` | Gets all available trivia topics |
| GET | `/triviabook/topics/:topic` | Gets questions for a specific topic |
| GET | `/triviabook/random` | Returns one random trivia question |
| POST | `/triviabook/answer` | Checks whether a submitted answer is correct |

## Live Application

My Triviabook API is deployed on Render.

Live API:
https://triviabook-api.onrender.com/triviabook/topics

GitHub Repository:
https://github.com/mck5ly24/triviabook-api

### Filtering Questions

The topic endpoint supports optional query parameters:

- `difficulty` — Filters questions by easy, medium, or hard
- `limit` — Limits how many questions are returned

Example:

`GET /triviabook/topics/science?difficulty=easy&limit=2`

### Checking an Answer

Send a POST request to `/triviabook/answer` with a JSON body:

```json
{
  "id": 1,
  "guess": "Mars"
}
```

Example response:

```json
{
  "correct": true,
  "answer": "Mars"
}
```

## How to Run My Project

1. Clone the repository.
2. Open the project folder in VS Code.
3. Run `npm install` to install the dependencies.
4. Create a `.env` file with your own Neon PostgreSQL connection string:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=3000
```

5. Set up the `topics` and `questions` tables in your PostgreSQL database and add trivia questions.
6. Start the server using `node server.js`.
7. Test the API at `http://localhost:3000/triviabook/topics`.

## Project Structure

I organized my project using a model-controller-route structure.

- **models/** — Contains the SQL queries used to retrieve trivia data.
- **controllers/** — Handles requests, validates inputs, and sends responses.
- **routes/** — Defines the API endpoints.
- **db/** — Handles the PostgreSQL database connection.
- **server.js** — Starts the Express application.

## Testing

I tested my API using my browser and EchoAPI. I checked that the endpoints returned the correct data and handled invalid requests properly.

Some tests included retrieving science questions, filtering by difficulty, limiting results, submitting correct and incorrect answers, and checking error responses for missing or invalid question IDs.
