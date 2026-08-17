require("dotenv").config();
const axios = require("axios");

const SYSTEM_INSTRUCTION = "You are Health-Mitra, a warm, highly empathetic public health awareness assistant for users in India. CRITICAL RULE 1: Detect the user's language and match it exactly. If the user writes in English (even if it's broken, informal, or contains typos like 'couphing'), reply in pure English ONLY. If they write in Hinglish, reply in Hinglish. If they write in Odinglish, reply in Odinglish. Do not mix languages. Do not use native scripts like ଅକ୍ଷର. CRITICAL RULE 2: DO NOT use markdown like asterisks (*), bold (**), or hash (#). Use plain text, simple dashes (-) for lists, and friendly emojis. CRITICAL RULE 3: Always provide a highly detailed, comprehensive response. Provide at least 3-4 bullet points of safe, actionable first aid steps or practical home remedies, and explain them clearly so the user doesn't have to ask follow-up questions. End with a warm closing.";

async function callGemini(userText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error("GEMINI_API_KEY is not set or invalid");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: { parts: { text: SYSTEM_INSTRUCTION } },
    contents: [ { parts: [{ text: userText }] } ],
    generationConfig: { temperature: 0.6, maxOutputTokens: 4000 },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ]
  };

  const res = await axios.post(url, payload, { headers: { "Content-Type": "application/json" } });

  const candidates = res.data.candidates;
  if (candidates && candidates.length > 0) {
    const first = candidates[0];
    if (first.finishReason === 'SAFETY') {
      return "I'm sorry, I cannot provide details on this specific topic due to safety filters. Please consult a healthcare professional.";
    }
    return first.content?.parts?.[0]?.text || null;
  }
  
  throw new Error("Gemini returned empty candidates");
}

async function callGroq(userText) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const url = "https://api.groq.com/openai/v1/chat/completions";

  const payload = {
    model: "openai/gpt-oss-120b",
    messages: [
      { role: "system", content: SYSTEM_INSTRUCTION },
      { role: "user", content: userText }
    ],
    temperature: 0.6,
    max_tokens: 4000
  };

  const res = await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    }
  });

  return res.data.choices[0]?.message?.content || null;
}

// Master Fallback Function
async function callAI(userText) {
  try {
    console.log("➡️ Attempting Primary AI (Groq)...");
    const reply = await callGroq(userText);
    if (reply) return reply;
    throw new Error("Primary returned null");
  } catch (err) {
    console.error(`❌ Primary AI (Groq) failed: ${err.response?.data?.error?.message || err.message}`);
    console.log("⚠️ Instantly falling back to Secondary AI (Gemini)...");
    
    try {
      const reply = await callGemini(userText);
      return reply;
    } catch (fallbackErr) {
      console.error(`❌ Secondary AI (Gemini) also failed: ${fallbackErr.response?.data?.error?.message || fallbackErr.message}`);
      return null;
    }
  }
}

// Export as callGemini to maintain compatibility with the message controller
module.exports = { callGemini: callAI };
