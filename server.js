const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const questionsRoute = require("./routes/questions");

const app = express();

app.use(cors());
app.use(express.json());

// ── Connect to MongoDB ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

app.use("/api", questionsRoute);

app.get("/", (req, res) => {
  res.send("PrepAI Backend is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
