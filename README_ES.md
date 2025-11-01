# 🎯 Trivia App — README Rápido

Aplicación ligera de **trivia / cuestionarios** con un backend en **FastAPI (Python)** y un frontend en **React + Vite (TypeScript)**.
El backend almacena las Cuestionarios y las respuestas de los usuarios en **MongoDB** y utiliza una **integración con un LLM (Gemini)** para generar automáticamente las preguntas del quiz.

---

## 🧰 Stack tecnológico (vista general)

* **Backend:** Python, FastAPI, Pydantic, PyMongo
* **Frontend:** React, Vite, TypeScript
* **Base de datos:** MongoDB
* **LLM:** Gemini (a través de `utils/llms`)
* **Herramientas de desarrollo:** uvicorn, npm

---

## 🌐 Principales endpoints de la API

**Ruta base:** `/api/v1`

### `GET /api/v1/surveys/`

* Verificación simple del estado del servicio (health check).

---

### `POST /api/v1/surveys/create`

* **Body (JSON):**

  ```json
  { "num_questions": int, "topic": "string", "difficult": "string", "lang": "string" }
  ```
* Crea una nueva Cuestionario (utilizando el LLM) y la guarda en la base de datos.
* **Devuelve:** el `id` y el `title` de la Cuestionario creada.

---

### `GET /api/v1/surveys/{survey_id}/next-question`

* Devuelve la **siguiente pregunta** del quiz.
* **Nota:** no incluye los campos `correct_answer` ni `explain` en la pregunta activa.

---

### `POST /api/v1/surveys/{survey_id}/join`

* **Body (JSON):**

  ```json
  { "username": "string" }
  ```
* Registra un usuario para una Cuestionario y crea su arreglo de `responses`.

---

### `PUT /api/v1/surveys/{survey_id}/response/{num_question}/user/{user_id}`

* **Body (JSON):**

  ```json
  { "response": number }
  ```
* Guarda y valida la respuesta de un usuario para una pregunta específica.

---

### `GET /api/v1/surveys/{survey_id}/user/{user_id}/summary`

* Devuelve un **resumen de las respuestas del usuario** y su nivel de acierto.

---

🧩 **Manejo de errores:**
La API utiliza excepciones de dominio, por ejemplo:
`SurveyNotFound`, `UserExists`, `OutOfRange`, `FinishedSurvey`, entre otras.

---

## 🗂️ Datos y modelos (resumen)

* **SurveyRequest:**
  `num_questions`, `topic`, `difficult`, `lang`

* **SurveyModel:**
  `title`, `questions[]`

  * Cada pregunta contiene:
    `text`, `possible_answers`, `correct_answer`, `explain`, `num_question`

* **Documentos de usuario:**
  `username`, `survey_id`, `responses[]` (indexadas por número de pregunta)

---

## ⚙️ Variables de entorno

(Consulta `core/config.py` para los nombres exactos)

| Variable                      | Descripción                                          |
| ----------------------------- | ---------------------------------------------------- |
| `MONGODB_URI`                 | Cadena de conexión a MongoDB                         |
| `MONGODB_DB` o `MONGODB_NAME` | Nombre de la base de datos                           |
| `API_HOST` *(opcional)*       | Host del backend                                     |
| `API_PORT` *(opcional)*       | Puerto del backend                                   |
| `GEMINI_*`                    | Claves o configuración del LLM (Gemini)              |
| `VITE_API_URL`                | (Frontend) URL base del backend en el archivo `.env` |

---

## 🚀 Cómo ejecutar (Windows)

### Backend

```powershell
# Desde la raíz del proyecto
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# Variables de entorno (ejemplo)
set MONGODB_URI=mongodb://user:pass@host:27017
set MONGODB_DB=triviadb
set GEMINI_API_KEY=tu_clave_aqui

# Ejecutar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 4000
```

---

### Frontend

```powershell
cd frontend
npm install
# Crear archivo .env con:
# VITE_API_URL=http://127.0.0.1:4000
npm run dev
```

---

## 🧪 Ejemplo: crear Cuestionario (curl)

```bash
curl -X POST http://127.0.0.1:4000/api/v1/surveys/create \
  -H "Content-Type: application/json" \
  -d '{"num_questions":5,"topic":"historia","difficult":"media","lang":"es"}'
```

---

## 📝 Notas

* MongoDB debe estar disponible antes de iniciar el servidor.
* La integración con el LLM requiere credenciales válidas (API key).
* Si el LLM no está configurado, el comportamiento dependerá de `utils/llms`.
* Consulta `core/config.py` y `frontend/.env.example` para ver ejemplos y nombres exactos de las variables de entorno.

