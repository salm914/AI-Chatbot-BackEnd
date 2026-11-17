# OpenAI chat API

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
3. Optionally set `OPENAI_MODEL`, `PORT`, and comma-separated `CLIENT_ORIGIN` values.
4. Start the server with `npm run dev` or `npm start`.

The API listens on port `3001` by default. Keep the API key in this server's
environment; do not put it in the React app.

## Chat endpoint

`POST /api/chat` accepts up to 50 text messages with `user` or `assistant`
roles and returns `{ "reply": "..." }`.

```js
const response = await fetch("http://localhost:3001/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages }),
});

const data = await response.json();
if (!response.ok) throw new Error(data.error);
console.log(data.reply);
```
