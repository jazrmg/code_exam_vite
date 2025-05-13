// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/send-to-slack", async (req, res) => {
  const { hookUrl, message } = req.body;

  try {
    const response = await fetch(hookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });

    const result = await response.text();
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send message");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
