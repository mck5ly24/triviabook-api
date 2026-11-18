/*
 * Name: Ronald Hester Jr.
 * Date: 11.18.2026
 * CSC 372-01
 *
 * Handles requests and responses for my
 * Triviabook API.
 */

let triviaModel = require('../models/trivia-model');

/**
 * Gets all trivia topics and sends them as JSON.
 * @param {Object} req - The incoming request.
 * @param {Object} res - The server response.
 * @returns {Promise<void>} Sends the response.
 */
async function getTopics(req, res) {
    try {
        let topics = await triviaModel.getAllTopics();

        res.json(topics);
    } catch (error) {
        console.error('Error getting topics:', error.message);

        res.status(500).json({
            error: 'Could not retrieve trivia topics.'
        });
    }
}


/**
 * Gets questions for a topic with optional filters.
 * @param {Object} req - The incoming request.
 * @param {Object} res - The server response.
 * @returns {Promise<void>} Sends questions or an error.
 */
async function getTopicQuestions(req, res) {
    try {
        let topic = req.params.topic;
        let difficulty = req.query.difficulty || null;
        let limit = null;

        // Check that difficulty is valid.
        if (difficulty &&
            !['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({
                error: 'Difficulty must be easy, medium, or hard.'
            });
        }

        // Check that limit is a positive whole number.
        if (req.query.limit !== undefined) {
            let limitText = req.query.limit;

            if (typeof limitText !== 'string' ||
                !/^[1-9]\d*$/.test(limitText) ||
                !Number.isSafeInteger(Number(limitText))) {
                return res.status(400).json({
                    error: 'Limit must be a positive whole number.'
                });
            }

            limit = Number(limitText);
        }

        // Check whether the topic exists.
        let topics = await triviaModel.getAllTopics();
        let topicExists = topics.some(
            (item) => item.name === topic
        );

        if (!topicExists) {
            return res.status(404).json({
                error: 'Trivia topic not found.'
            });
        }

        let questions = await triviaModel.getQuestionsByTopic(
            topic,
            difficulty,
            limit
        );

        res.json(questions);
    } catch (error) {
        console.error('Error getting questions:', error.message);

        res.status(500).json({
            error: 'Could not retrieve trivia questions.'
        });
    }
}



/**
 * Gets a random trivia question without showing the answer.
 * @param {Object} req - The incoming request.
 * @param {Object} res - The server response.
 * @returns {Promise<void>} Sends a question or error.
 */
async function getRandomQuestion(req, res) {
    try {
        let question = await triviaModel.getRandomQuestion();

        if (!question) {
            return res.status(404).json({
                error: 'No trivia questions found.'
            });
        }

        res.json(question);
    } catch (error) {
        console.error('Error getting random question:', error.message);

        res.status(500).json({
            error: 'Could not retrieve a random question.'
        });
    }
}


/**
 * Checks a user's answer to a trivia question.
 * @param {Object} req - The incoming request.
 * @param {Object} res - The server response.
 * @returns {Promise<void>} Sends the answer result or error.
 */
async function checkAnswer(req, res) {
    try {
        let { id, guess } = req.body || {};

        // Make sure both required values were provided.
        if (id === undefined || id === null ||
            typeof guess !== 'string' || !guess.trim()) {
            return res.status(400).json({
                error: 'Question id and guess are required.'
            });
        }

        // Make sure the question ID is valid.
        if (!Number.isSafeInteger(Number(id)) || Number(id) <= 0 ||
            String(id).trim() === '') {
            return res.status(400).json({
                error: 'Question id must be a positive whole number.'
            });
        }

        // Find the question in the database.
        let question = await triviaModel.getQuestionById(Number(id));

        if (!question) {
            return res.status(404).json({
                error: 'Question not found.'
            });
        }

        // Ignore capitalization and extra spaces around answers.
        let userGuess = guess.trim().toLowerCase();
        let correctAnswer = question.answer.trim().toLowerCase();

        let isCorrect = userGuess === correctAnswer;

        res.json({
            correct: isCorrect,
            answer: question.answer
        });
    } catch (error) {
        console.error('Error checking answer:', error.message);

        res.status(500).json({
            error: 'Could not check the answer.'
        });
    }
}



/**
 * Adds a new trivia question to the database.
 * @param {Object} req - The incoming request.
 * @param {Object} res - The server response.
 * @returns {Promise<void>} Sends the updated questions.
 */
async function addQuestion(req, res) {
    try {
        let { topic, question, answer, difficulty } = req.body || {};

        // Make sure all required fields are provided.
        if (
            typeof topic !== 'string' || !topic.trim() ||
            typeof question !== 'string' || !question.trim() ||
            typeof answer !== 'string' || !answer.trim() ||
            typeof difficulty !== 'string' || !difficulty.trim()
        ) {
            return res.status(400).json({
                error: 'Topic, question, answer, and difficulty are required.'
            });
        }

        // Remove extra spaces and standardize the values.
        topic = topic.trim().toLowerCase();
        question = question.trim();
        answer = answer.trim();
        difficulty = difficulty.trim().toLowerCase();

        // Only allow valid difficulty levels.
        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({
                error: 'Difficulty must be easy, medium, or hard.'
            });
        }

        // Add the question to the database.
        await triviaModel.addQuestion(topic, question, answer, difficulty);

        // Return the updated questions for this topic.
        let questions = await triviaModel.getQuestionsByTopic(topic);

        return res.status(201).json(questions);
    } catch (error) {
        console.error('Error adding question:', error.message);

        return res.status(500).json({
            error: 'Could not add trivia question.'
        });
    }
}


module.exports = {
    getTopics,
    getTopicQuestions,
    getRandomQuestion,
    checkAnswer,
    addQuestion
};
