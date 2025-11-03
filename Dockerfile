# -------- Etapa 1: construir el frontend --------
FROM node:18 AS frontend-builder

# Carpeta de trabajo dentro del contenedor
WORKDIR /app/frontend

# Copiar archivos de configuración e instalar dependencias
COPY frontend/package*.json ./
RUN npm install

# Copiar el resto del código del frontend
COPY frontend/ ./

# Compilar la app React (genera /frontend/build)
RUN npm run build


# -------- Etapa 2: construir la app FastAPI --------
FROM python:3.11-slim AS backend

# Crear y entrar al directorio del proyecto
WORKDIR /app

# Instalar dependencias del sistema (opcional, por si tu backend usa librerías nativas)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código backend (app/, core/, services/, schemas/)
COPY app/ ./app
COPY core/ ./core
COPY services/ ./services
COPY schemas/ ./schemas
COPY utils/ ./utils
COPY exceptions/ ./exceptions
COPY models/ ./models
COPY routes/ ./routes

# Copiar el build del frontend (de la etapa anterior)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Exponer el puerto
EXPOSE 8000

# Comando de ejecución
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
