/*
 * Name: Ronald Hester Jr.
 * Date: 11.18.2026
 * CSC 372-01
 *
 * Defines the routes for my Triviabook API.
 */

let express = require('express');
let triviaController = require('../controllers/trivia-controller');

let router = express.Router();

// Get all trivia topics.
router.get('/topics', triviaController.getTopics);

// Get questions from a specific topic.
router.get('/topic/:topic', triviaController.getTopicQuestions);

// Get one random trivia question.
router.get('/random', triviaController.getRandomQuestion);

// Route for checking a trivia answer.
router.post('/answer', triviaController.checkAnswer);

// Route for adding a new trivia question.
router.post('/question/add', triviaController.addQuestion);


module.exports = router;
