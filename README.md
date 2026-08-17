# Health-Mitra

Health-Mitra is a sleek, AI-powered public health awareness chatbot designed specifically for users in India. It provides empathetic, multilingual, and practical health information, wrapped in a premium user interface.

**🚀 Try it live:** [https://health-chatbot-m26y.onrender.com](https://health-chatbot-m26y.onrender.com)

## 🌟 Key Features

### 🎨 Premium UI/UX
- **Zero-Dependency SVGs**: Icons are hardcoded into the HTML to ensure lightning-fast loads and bypass aggressive ad-blockers and strict Content Security Policies.
- **Dynamic Interactions**: Features fluid micro-animations like "Glow Burst" ripples on button presses and smooth slide-up fades for chat bubbles.
- **Solid & Clean Aesthetics**: Uses modern, readable typography (Zalando Sans), generous spacing, and solid, high-contrast surfaces instead of messy gradients.
- **Responsive Chat Layout**: Auto-growing input areas and sticky bottom navigation designed for seamless use across mobile and desktop.

### 🧠 Advanced AI Integration (Gemini Flash)
- **Multilingual Support**: The AI auto-detects and perfectly matches the user's language—whether it's English, Hindi, Hinglish, or Odinglish.
- **Empathetic & Safe**: Instructed specifically to act as a warm health assistant. Provides 2-3 safe home remedies for minor ailments and always urges consulting a doctor.
- **Strict Formatting**: Enforces clean, markdown-free responses (no bolding or hashes) with simple lists and emojis for maximum readability.
- **Robust Error Handling**: Gracefully handles API rate limits (429 errors) and safety filtering blocks with custom, user-friendly fallback messages.

### 🛠 Backend & Security
- **Node.js & Express Monolith**: The backend handles API rate-limiting and securely serves the static frontend, avoiding complex cross-origin (CORS) setups.
- **Helmet Protection**: Hardened backend security with a strict Content Security Policy (CSP) to prevent XSS attacks while safely whitelisting our fonts and form providers.
- **Web3Forms Integration**: Features a functional "Contact Us" modal that securely forwards user messages to an email address without requiring backend mailer logic.
- **Render Ready**: Optimized for a 1-click deployment as a Web Service on Render.com.

## 📂 Directory Structure

```text
health-chatbot/
├── .env                        # Environment variables (GEMINI_API_KEY)
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies and scripts
├── README.md                   # Project documentation
├── tailwind.config.js          # Tailwind CSS configuration
│
├── public/                     # Static Frontend Files
│   ├── index.html              # Main UI, layout, and frontend JavaScript
│   ├── input.css               # Custom CSS tokens and animations
│   └── output.css              # Compiled Tailwind CSS
│
└── src/                        # Node.js Backend Code
    ├── app.js                  # Express app setup, routing, and Helmet CSP security
    ├── server.js               # Entry point (Starts the server on port 4000)
    │
    ├── controllers/
    │   └── messagecontroller.js # Handles the /api/message route
    │
    └── services/
        └── geminiservice.js    # Communicates with the Google Gemini API
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your Gemini API Key:
```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Build CSS (Optional/If changed)
```bash
npm run build:css
```

### 4. Run Locally
```bash
npm run dev
```
The application will be available at `http://localhost:4000`.

## 🚢 Deployment
This project is optimized for deployment on **Render.com** as a Web Service.
1. Connect your GitHub repository to Render.
2. Set the Build Command to `npm install`.
3. Set the Start Command to `npm start`.
4. Add `GEMINI_API_KEY` to the Environment Variables.
5. Deploy!
