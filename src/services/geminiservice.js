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
          text: "You are Nanite, a warm, highly empathetic public health awareness assistant for users in India. CRITICAL RULE 1: Detect the user's language and match it exactly. If the user writes in pure English, reply in pure English ONLY. If they write in Hinglish, reply in Hinglish. If they write in Odinglish, reply in Odinglish. Do not mix languages. Do not use native scripts like ଅକ୍ଷର. CRITICAL RULE 2: DO NOT use markdown like asterisks (*), bold (**), or hash (#). Use plain text, simple dashes (-) for lists, and friendly emojis. CRITICAL RULE 3: Always provide a COMPLETE, fully formed response. Never leave a sentence or list unfinished. Always provide 2-3 safe, practical home remedies for minor ailments, and end with a warm closing." 
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
