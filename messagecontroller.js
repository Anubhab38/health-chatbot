const { callOpenAI } = require("../services/openaiservice");

async function handleMessage(req, res) {
  try {
    const { text, userId = "guest" } = req.body;

    // 1. Call OpenAI
    const response = await callOpenAI(text);

    if (!response) {
      return res.json({
        source: "openai",
        answer: "⚠️ Sorry, I could not generate a reply.",
        disclaimer: "This is awareness info only. Consult a doctor."
      });
    }

    // 2. Send response
    return res.json({
      source: "openai",
      answer: response,
      disclaimer: "This is awareness info only. Consult a doctor."
    });

  } catch (err) {
    console.error("❌ handleMessage error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { handleMessage };
