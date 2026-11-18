/*
 * Name: Ronald Hester Jr.
 * Date: 11.18.2026
 * CSC 372-01
 *
 * Handles database queries for my Triviabook API.
 */

let pool = require('../db/database');

/**
 * Gets all trivia topics from the database.
 * @returns {Promise<Array>} List of trivia topics.
 */
async function getAllTopics() {
    let result = await pool.query(
        'SELECT name FROM topics ORDER BY id'
    );

    return result.rows;
}



/**
 * Gets questions for a topic with optional filters.
 * @param {string} topic - Name of the trivia topic.
 * @param {string|null} difficulty - Optional difficulty.
 * @param {number|null} limit - Optional question limit.
 * @returns {Promise<Array>} Matching questions.
 */
async function getQuestionsByTopic(topic, difficulty, limit) {
    let query = `
    SELECT questions.id, questions.question,
           questions.answer, questions.difficulty
    FROM questions
    JOIN topics ON questions.topic_id = topics.id
    WHERE topics.name = $1
  `;

    let values = [topic];

    if (difficulty) {
        values.push(difficulty);
        query += ` AND questions.difficulty = $${values.length}`;
    }

    query += ' ORDER BY questions.id';

    if (limit !== null) {
        values.push(limit);
        query += ` LIMIT $${values.length}`;
    }

    let result = await pool.query(query, values);

    return result.rows;
}


/**
 * Gets one random trivia question from the database.
 * The answer is not included.
 * @returns {Promise<Object|null>} A random question or null.
 */
async function getRandomQuestion() {
    let result = await pool.query(`
    SELECT questions.id,
           topics.name AS topic,
           questions.question,
           questions.difficulty
    FROM questions
    JOIN topics ON questions.topic_id = topics.id
    ORDER BY RANDOM()
    LIMIT 1
  `);

    return result.rows[0] || null;
}


/**
 * Finds a trivia question using its ID.
 * @param {number} id - The question ID.
 * @returns {Promise<Object|null>} The question or null.
 */
async function getQuestionById(id) {
    let result = await pool.query(
        'SELECT id, question, answer FROM questions WHERE id = $1',
        [id]
    );

    return result.rows[0] || null;
}


module.exports = {
    getAllTopics,
    getQuestionsByTopic,
    getRandomQuestion,
    getQuestionById
};
