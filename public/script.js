/*
 * Triviabook Frontend
 * Connects the webpage to the Express API.
 */

// Stores the ID of the current random question.
let currentQuestionId = null;

// Sends requests to the API and handles errors.
async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
    }

    return data;
}

// 1. Display all trivia topics.
document.getElementById("load-topics").addEventListener("click", async () => {
    const list = document.getElementById("topics-list");
    list.replaceChildren();

    try {
        const topics = await apiRequest("/triviabook/topics");

        topics.forEach((topic) => {
            const item = document.createElement("li");
            item.textContent = topic.name;
            list.appendChild(item);
        });
    } catch (error) {
        list.textContent = error.message;
    }
});

// 2. Search for questions by topic.
document.getElementById("search-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const topic = document.getElementById("topic").value.trim();
    const difficulty = document.getElementById("difficulty").value;
    const limit = document.getElementById("limit").value;
    const results = document.getElementById("questions-list");

    results.replaceChildren();

    const params = new URLSearchParams();

    if (difficulty) {
        params.set("difficulty", difficulty);
    }

    if (limit) {
        params.set("limit", limit);
    }

    const query = params.toString();
    const url = `/triviabook/topic/${encodeURIComponent(topic)}` +
        (query ? `?${query}` : "");

    try {
        const questions = await apiRequest(url);

        if (questions.length === 0) {
            results.textContent = "No questions found.";
            return;
        }

        questions.forEach((question) => {
            const card = document.createElement("div");
            const heading = document.createElement("strong");
            const details = document.createElement("p");

            heading.textContent = question.question;
            details.textContent = `Difficulty: ${question.difficulty}`;

            card.append(heading, details);
            results.appendChild(card);
        });
    } catch (error) {
        results.textContent = error.message;
    }
});

// 3. Get a random trivia question.
document.getElementById("random-btn").addEventListener("click", async () => {
    const display = document.getElementById("random-question");
    const answerResult = document.getElementById("answer-result");

    display.textContent = "Loading question...";
    answerResult.textContent = "";
    currentQuestionId = null;

    try {
        const question = await apiRequest("/triviabook/random");

        currentQuestionId = question.id;
        display.textContent = `${question.question} (${question.difficulty})`;
    } catch (error) {
        display.textContent = error.message;
    }
});

// 4. Check the user's answer.
document.getElementById("answer-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const result = document.getElementById("answer-result");
    const guess = document.getElementById("guess").value.trim();

    if (currentQuestionId === null) {
        result.textContent = "Get a random question first.";
        return;
    }

    try {
        const data = await apiRequest("/triviabook/answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: currentQuestionId,
                guess: guess
            })
        });

        result.textContent = data.correct
            ? "Correct! Great job!"
            : `Incorrect. The correct answer is ${data.answer}.`;
    } catch (error) {
        result.textContent = error.message;
    }
});

// 5. Add a new trivia question.
document.getElementById("add-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const topic = document.getElementById("new-topic").value.trim();
    const question = document.getElementById("new-question").value.trim();
    const answer = document.getElementById("new-answer").value.trim();
    const difficulty = document.getElementById("new-difficulty").value;

    const result = document.getElementById("add-result");
    result.textContent = "Adding question...";

    try {
        const questions = await apiRequest("/triviabook/question/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                topic,
                question,
                answer,
                difficulty
            })
        });

        result.textContent =
            `Question added successfully! ${questions.length} question(s) in ${topic}.`;

        document.getElementById("add-form").reset();
    } catch (error) {
        result.textContent = error.message;
    }
});
