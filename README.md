# 🗳️ The First Vote
### India's First AI-Powered First-Person Voter Simulation Game

> **GDG Prompt Wars 2025 · Build with AI**

![Game Screenshot](./public/screenshot.png)

## 🎮 About

"The First Vote" is an immersive, multilingual voter education game that teaches the **complete Indian election process** through gameplay. Built for the GDG Prompt Wars hackathon, powered by Google's technology stack.

### The Journey
```
Prologue → Level 0 (Register) → Level 1 (Gauntlet) → Level 2 (Documents) 
        → Level 3 (Booth) → Level 4 (EVM + VVPAT) → Level 5 (Results) → Epilogue
```

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/GDG_PROMPT_WARS

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Add your Gemini API key and Firebase config to .env

# 4. Run locally
npm run dev
```

## 🔑 Environment Variables

```
VITE_GEMINI_API_KEY=        # From https://aistudio.google.com
VITE_FIREBASE_API_KEY=      # From Firebase Console
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 🛠️ Google-Approved Tech Stack

| Tool | Usage |
|---|---|
| **Gemini 2.0 Flash** | Vivek AI companion — live answers in 3 languages |
| **Firebase Auth** | Google Sign-In for progress persistence |
| **Firestore** | Player progress & certificate storage |
| **Cloud Run** | Backend API deployment |
| **Anti-Gravity** | AI-assisted development |
| **Vite + React** | Frontend |
| **Three.js** | 3D booth, street, and EVM scenes |

## 🏆 Game Features

- **6 Fully Playable Levels** + Prologue + Epilogue
- **Integrity Points System** — 210 max, weighted by tier
- **3 Unique Endings** — Guardian / Conscious / Passive
- **Multilingual** — English, Hindi, Bengali
- **AI Quick Reflex Bonus** — Act before Vivek to score higher
- **30% Random VVPAT Tamper Event** — Tests real vigilance
- **Downloadable Certificate** — PDF badge for social sharing
- **NPC Voice Acting** — Web Speech API TTS
- **Error Boundaries** — No crashes, always graceful fallback

## 👨‍💻 Developer

**Tridibesh Sen**  
B.Tech CSE (Data Science) · Institute of Engineering and Management, Newtown  
📧 tridibeshsen2002@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/tridibesh-sen-a39218380)
