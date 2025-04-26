# Anvesha: Fact Checker

Anvesha is a truth verification web app developed for the **Truth Telling Hackathon**. The application leverages modern web technologies and AI to help users verify the authenticity of news and claims across multiple formats including text, images, and videos.

## 🚀 Features
- Intelligent fact-checking agent that analyzes claims and explains what's accurate and what's not
- Voice-controlled interface with speech recognition and text-to-speech
- Multilingual support (English and Hindi)
- Interactive conversation with our AI assistant for natural fact-checking dialogue
- Image analysis for detecting AI-generated or manipulated content
- Video deepfake detection to identify synthetic or manipulated media
- Visual representation of fact-check ratings and distribution
- User-friendly interface with responsive design
- Fast and efficient processing using Vite + React

## 🏗️ Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion
- **Backend:** 
  - FastAPI (Fact-check API)
  - Azure Speech Services (Speech recognition and synthesis)
  - Azure Container Instances (Deepfake detection)
- **Database:** PostgreSQL

## 📂 Project Structure
```
Anvesha/
│── public/           # Static assets (favicon, logo, etc.)
│── src/              # Source code
│   ├── assets/       # Images and icons
│   ├── components/   # Reusable UI components
│   │   ├── claims/   # Fact-check claim components
│   │   ├── stats/    # Data visualization components
│   │   ├── AgentResponse.js # AI agent response component
│   │   ├── SpeechButton.js  # Voice recognition component
│   │   ├── TextToSpeech.js  # Speech synthesis component
│   │   ├── VoiceAssistant.js # Voice-driven fact-checking
│   │   ├── ImageCheck.js    # Image deepfake detection
│   │   ├── VideoCheck.js    # Video deepfake detection
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   ├── App.jsx       # Main React component
│   ├── main.jsx      # Entry point
│── index.html        # Main HTML file
│── vite.config.js    # Vite configuration
│── package.json      # Project dependencies
│── .env              # Environment variables for API endpoints
│── README.md         # Project documentation
```

## 🛠️ Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/ft-prince/Anvesha.git
   cd anvesha
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file with API configuration (see project documentation)

4. Run the development server:
   ```sh
   npm run dev
   ```

5. Open in the browser:
   ```
   http://localhost:5173
   ```

## 🗣️ Voice Interface
Anvesha features a comprehensive voice interface that allows users to:
- Perform voice searches with the microphone button
- Listen to fact-check responses via text-to-speech
- Use the dedicated Voice Assistant tab for a fully voice-driven experience
- Switch between languages (English and Hindi) for both input and output

## 🤖 AI Integration
- Intelligent agent that analyzes news claims and explains what's accurate and what's not
- Interactive voice assistant for natural conversational fact-checking
- Image analysis for detecting AI-generated or manipulated images
- Video deepfake detection to identify synthetic or manipulated content
- Voice-driven interaction with natural language processing

## 🌐 Key Components
- **Fact-checking Agent**: Analyzes news articles and claims to determine accuracy
- **Voice Assistant**: Fully voice-controlled interface for hands-free fact-checking
- **Image Detector**: Identifies manipulated or AI-generated images
- **Video Analyzer**: Detects deepfakes and manipulated video content
- **Multilingual Support**: Currently supports English and Hindi interactions

## 🔮 Future Enhancements
- Enhanced multilingual support for additional languages
- Real-time social media integration for trending claim verification
- Community-driven fact-check contribution system
- Mobile app development

---
🎯 Made for the **Truth Telling Hackathon**