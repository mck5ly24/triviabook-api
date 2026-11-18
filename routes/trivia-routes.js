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

 // Check a user's answer to a trivia question.
router.post('/answer', triviaController.checkAnswer);

module.exports = router;
