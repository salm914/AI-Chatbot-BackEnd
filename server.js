import "dotenv/config";
import cors from "cors";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT) || 3001;
const allowedOrigins = (process.env.CLIENT_ORIGIN ?? "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required. Add it to your .env file.");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin is not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "1mb" }));

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body ?? {};

  if (
    !Array.isArray(messages)
    || messages.length === 0
    || messages.length > 50
    || messages.some(
      (message) =>
        !message
        || !["user", "assistant"].includes(message.role)
        || typeof message.content !== "string"
        || message.content.trim().length === 0,
    )
  ) {
    res.status(400).json({
      error: "messages must be a non-empty array of up to 50 user/assistant messages with text content.",
    });
    return;
  }

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-6-luna",
      max_completion_tokens: 1024,
      messages: [
        { role: "system", content: "You are a helpful assistant. Keep answers short." },
        ...messages,
      ],
    });

    res.json({ reply: response.choices[0]?.message?.content ?? "" });
  } catch (error) {
    console.error("OpenAI chat request failed:", error);
    res.status(500).json({ error: "Something went wrong while generating a reply." });
  }
});

app.listen(port, () => {
  console.log(`Chat API listening on http://localhost:${port}`);
});
