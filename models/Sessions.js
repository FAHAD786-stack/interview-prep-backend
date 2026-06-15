const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // links to User
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    results: [
      {
        question: String,
        score: Number,
        strengths: String,
        improvements: String,
        ideal: String,
      },
    ],
    avgScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt = session date
  },
);

module.exports = mongoose.model("Session", sessionSchema);
