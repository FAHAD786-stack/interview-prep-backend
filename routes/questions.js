const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ── Route 1: Generate questions ──
router.post("/questions", async (req, res) => {
  const { role = "Software Development Engineer", difficulty = "mixed" } =
    req.body;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer. Always respond with ONLY a valid JSON array. No extra text, no markdown, no backticks.",
        },
        {
          role: "user",
          content: `Generate exactly 5 unique interview questions for a ${role}.
Difficulty: ${difficulty}.
Mix of topics: DSA, JavaScript, System Design, Behavioural.

Respond ONLY with this JSON format, nothing else:
[
  { "text": "question here", "topic": "DSA", "difficulty": "medium" },
  { "text": "question here", "topic": "JavaScript", "difficulty": "easy" },
  { "text": "question here", "topic": "System Design", "difficulty": "hard" },
  { "text": "question here", "topic": "Behavioural", "difficulty": "easy" },
  { "text": "question here", "topic": "JavaScript", "difficulty": "medium" }
]`,
        },
      ],
    });

    const rawText = completion.choices[0].message.content;
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleaned);

    res.json({ success: true, questions });
  } catch (error) {
    console.error("Groq error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate questions" });
  }
});

// ── Route 2: Check answers and give feedback ──
router.post("/feedback", async (req, res) => {
  const { answers } = req.body;
  // answers = [ { question: "...", answer: "...", topic: "...", difficulty: "..." } ]

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer who evaluates answers. Always respond with ONLY a valid JSON array. No extra text, no markdown, no backticks.",
        },
        {
          role: "user",
          content: `Evaluate these interview answers and give detailed feedback.

Questions and Answers:
${answers
  .map(
    (a, i) => `
Q${i + 1} [${a.topic} - ${a.difficulty}]: ${a.question}
Answer: ${a.answer || "No answer given"}
`,
  )
  .join("\n")}

Respond ONLY with this JSON format, nothing else:
[
  {
    "question": "the question text",
    "score": 7,
    "strengths": "what was good about the answer",
    "improvements": "what was missing or could be better",
    "ideal": "the ideal answer in 2-3 sentences"
  }
]

Rules:
- score is a number from 0 to 10
- If no answer was given, score is 0
- Be specific and helpful in feedback
- Keep ideal answer concise`,
        },
      ],
    });

    const rawText = completion.choices[0].message.content;
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const feedback = JSON.parse(cleaned);

    res.json({ success: true, feedback });
  } catch (error) {
    console.error("Groq feedback error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to evaluate answers" });
  }
});

module.exports = router;
