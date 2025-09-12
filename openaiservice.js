require("dotenv").config();
const axios = require("axios");

async function callOpenAI(userText) {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a public health awareness assistant. Always be clear, short, and ALWAYS include a disclaimer."
          },
          { role: "user", content: userText }
        ],
        temperature: 0.4,
        max_tokens: 300
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("❌ OpenAI API error:", err.response?.data || err.message);
    return null;
  }
}

module.exports = { callOpenAI };
