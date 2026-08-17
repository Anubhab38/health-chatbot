require("dotenv").config();
const axios = require("axios");

async function callGemini(userText) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      console.error("❌ GEMINI_API_KEY is not set in .env");
      return null;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const payload = {
      system_instruction: {
        parts: { 
          text: "You are Health-Mitra, a warm, highly empathetic public health awareness assistant for users in India. CRITICAL RULE 1: Detect the user's language and match it exactly. If the user writes in English (even if it's broken, informal, or contains typos like 'couphing'), reply in pure English ONLY. If they write in Hinglish, reply in Hinglish. If they write in Odinglish, reply in Odinglish. Do not mix languages. Do not use native scripts like ଅକ୍ଷର. CRITICAL RULE 2: DO NOT use markdown like asterisks (*), bold (**), or hash (#). Use plain text, simple dashes (-) for lists, and friendly emojis. CRITICAL RULE 3: Always provide a COMPLETE, fully formed response. Never leave a sentence or list unfinished. Always provide 2-3 safe, practical home remedies for minor ailments, and end with a warm closing."
        }
      },
      contents: [
        {
          parts: [{ text: userText }]
        }
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 800
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    };

    const res = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const candidates = res.data.candidates;
    if (candidates && candidates.length > 0) {
      const first = candidates[0];
      if (first.finishReason === 'SAFETY') {
        return "I'm sorry, I cannot provide details on this specific topic due to safety filters. Please consult a healthcare professional.";
      }
      return first.content?.parts?.[0]?.text || null;
    }
    
    return null;
  } catch (err) {
    if (err.response?.status === 429) {
      console.warn("⚠️ Gemini API Rate Limit Exceeded.");
      return "⚠️ I'm currently receiving too many requests (API rate limit). Please wait about 30 seconds and try again.";
    }
    console.error("❌ Gemini API error:", err.response?.data || err.message);
    return null;
  }
}

module.exports = { callGemini };
