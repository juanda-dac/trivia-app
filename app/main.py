from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from routes.api.v1.survey_routes import survey_router
from exceptions.base_exception import AppException
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(survey_router)

frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
index_file = os.path.join(frontend_dir, "index.html")

app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dir, "assets")), name="assets")

@app.exception_handler(AppException)
async def app_exception(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.__class__.__name__, "detail": exc.message }
    )

@app.get("/health")
def index():
    return {
        'active': True
    }

@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    return FileResponse(index_file)
