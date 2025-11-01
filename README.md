# Trivia App — Quick README

A lightweight trivia/quiz application with a FastAPI backend (Python) and a React + Vite frontend (TypeScript). The backend stores surveys and user responses in MongoDB and uses an LLM integration to generate surveys.

## Tech stack (at a glance)
- Backend: Python, FastAPI, Pydantic, PyMongo
- Frontend: React, Vite, TypeScript
- Database: MongoDB
- LLM: Gemini (via utils/llms)
- Dev tools: uvicorn, npm

## Main API endpoints
Base path: /api/v1

- GET /api/v1/surveys/  
  - Simple health/status.

- POST /api/v1/surveys/create  
  - Body (JSON): { num_questions: int, topic: string, difficult: string, lang: string }  
  - Creates a survey (uses LLM) and persists it. Returns saved survey id/title.

- GET /api/v1/surveys/{survey_id}/next-question  
  - Returns the next question for the survey (does not expose correct_answer/explain for the active question).

- POST /api/v1/surveys/{survey_id}/join  
  - Body (JSON): { username: string }  
  - Registers a user for a survey and creates a responses array.

- PUT /api/v1/surveys/{survey_id}/response/{num_question}/user/{user_id}  
  - Body (JSON): { response: number }  
  - Saves and validates a user response for a specific question.

- GET /api/v1/surveys/{survey_id}/user/{user_id}/summary  
  - Returns a summary of user responses and correctness.

Errors returned by the API use domain exceptions (e.g., SurveyNotFound, UserExists, OutOfRange, FinishedSurvey).

## Data (summary)
- SurveyRequest: num_questions, topic, difficult, lang
- SurveyModel: title, questions[] (each question has text, possible_answers, correct_answer, explain, num_question)
- User documents: username, survey_id, responses[] (indexed by num_question)

## Environment variables (common; check core/config.py for exact names)
- MONGODB_URI (connection string)
- MONGODB_DB or MONGODB_NAME (database name)
- API_HOST (optional)
- API_PORT (optional)
- GEMINI_* or LLM API key/config (for LLM integration)
- FRONTEND: VITE_API_URL (frontend .env for API base)

## How to run (Windows)
Backend:
```powershell
# from project root
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# set required env vars for current session (example)
set MONGODB_URI=mongodb://user:pass@host:27017
set MONGODB_DB=triviadb
set GEMINI_API_KEY=your_key_here

uvicorn app.main:app --reload --host 0.0.0.0 --port 4000
```

Frontend:
```powershell
cd frontend
npm install
# create .env with VITE_API_URL=http://127.0.0.1:4000 (or desired backend URL)
npm run dev
```

## Example: create survey (curl)
```bash
curl -X POST http://127.0.0.1:4000/api/v1/surveys/create \
  -H "Content-Type: application/json" \
  -d '{"num_questions":5,"topic":"history","difficult":"medium","lang":"en"}'
```

## Notes
- MongoDB must be reachable before starting the server.
- LLM integration requires valid credentials/config; fallback behavior depends on utils/llms.
- Check core/config.py and frontend/.env.example for exact env variable names and examples.

# Some Screens of the App

- Survey Form
![Image Screenshot Form](./screenshots/screenshot-form.png)

- Survey view
![Image Screenshot Survey](./screenshots/screenshot-survey.png)

- Summary view
![Image Screenshot Summary](./screenshots/screenshot-summary.png)


**PD:** The goal is get build a realtime multiplayer app

