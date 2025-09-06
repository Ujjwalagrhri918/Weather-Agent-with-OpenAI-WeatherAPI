# Weather App 🌤️
This project demonstrates an AI agent that plans, takes actions, observes results, and produces outputs — using OpenAI’s Chat Completions API and a custom weather tool powered by WeatherAPI.

The agent follows a structured reasoning process:
  Plan – Decide which tool to call.
  Action – Call the weather function with the city name.
  Observation – Receive the weather data.
  Output – Return the final response to the user.

---

## 🚀 Features

AI-driven multi-step reasoning (PLAN → ACTION → OBSERVATION → OUTPUT).
Integration with WeatherAPI to fetch real-time weather data.
CLI-based chatbot interface with readline-sync.
Secure API key handling via dotenv.
Extendable tools framework for adding more functions.

---

---

## Installation steps:

```bash
git clone https://github.com/Ujjwalagrhri918/Weather-Agent-with-OpenAI-WeatherAPI.git
cd Weather-Agent-with-OpenAI-WeatherAPI
npm install
```

Set up the # WEATHER_API_KEY and # OPENAI_API_KEY

```bash
node index.js
```


<img width="2436" height="1005" alt="image" src="https://github.com/user-attachments/assets/ab090741-ec6c-4558-a2de-04ff83455cc1" />
