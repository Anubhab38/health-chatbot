require("dotenv").config();
const axios = require("axios");

async function callGemini(userText) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      console.error("❌ GEMINI_API_KEY is not set in .env");
      return null;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      system_instruction: {
        parts: { 
          text: "You are a public health awareness assistant for local users in India. CRITICAL RULE: You must always reply in the EXACT SAME LANGUAGE AND SCRIPT as the user. If the user writes Hindi in English letters (Hinglish), reply in Hinglish. If the user writes Odia in English letters (Odinglish), reply in Odia using English letters (DO NOT use Odia script like ଅକ୍ଷର). Be helpful, clear, and relatively concise." 
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
      }
    };

    const res = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const candidates = res.data.candidates;
    if (candidates && candidates.length > 0) {
      return candidates[0].content.parts[0].text;
    }
    
    return null;
  } catch (err) {
    console.error("❌ Gemini API error:", err.response?.data || err.message);
    return null;
  }
}

module.exports = { callGemini };
