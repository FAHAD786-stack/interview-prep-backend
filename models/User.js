const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // no two users with same email
    },
    password: {
      type: String,
      required: true, // stored as hashed (encrypted)
    },
    role: {
      type: String,
      required: true,
      enum: [
        // only these values allowed
        "Software Development Engineer",
        "Data Analyst",
        "Product Manager",
        "DevOps Engineer",
        "QA Engineer",
      ],
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
  },
);

module.exports = mongoose.model("User", userSchema);
