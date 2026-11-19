/*
 * Name: Ronald Hester Jr.
 * Date: 11.18.2026
 * CSC 372-01
 *
 * Starts the Express server and connects
 * the routes for my Triviabook API.
 */

let express = require('express');
require('dotenv').config();

let triviaRoutes = require('./routes/trivia-routes');

let app = express();
let port = process.env.PORT || 3000;

// Allow the server to read JSON request bodies.
app.use(express.json());

// Serve the frontend files.
app.use(express.static("public"));

// Connect the trivia routes to the server.
app.use('/triviabook', triviaRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to my Triviabook API!');
});

// Start the server.
app.listen(port, () => {
  console.log(`Triviabook API running on port ${port}`);
});
