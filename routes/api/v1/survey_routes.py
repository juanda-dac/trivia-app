from fastapi import APIRouter, Depends, Body
from pymongo.database import Database
from schemas.survey import SurveyRequest
from services.survey_service import SurveyService
from core.database import get_db

survey_router = APIRouter(
    prefix="/api/v1/surveys",
    tags=["Surveys"]
)

@survey_router.get("/")
def index():
    return {'status': True}

@survey_router.post("/create")
async def create(survey_request: SurveyRequest, db: Database = Depends(get_db)):
    response = await SurveyService.create(survey_request)
    return await SurveyService.save(db, response)

@survey_router.get("/{survey_id}/next-question")
def next_question(survey_id: str, db: Database = Depends(get_db)):
    response = SurveyService.next_question(db, survey_id).model_dump()
    del response['explain']
    del response['correct_answer']
    
    return response

@survey_router.post("/{survey_id}/join")
def join_user(survey_id: str, username: str = Body(..., embed=True), db: Database = Depends(get_db)):
    return SurveyService.join_user(db, username, survey_id)

@survey_router.put("/{survey_id}/response/{num_question}/user/{user_id}")
def push_question_response(survey_id: str, num_question: int, user_id: str, response: int = Body(..., embed=True), db: Database = Depends(get_db)):
    return SurveyService.update_question(db, user_id, survey_id, num_question, response)

@survey_router.get('/{survey_id}/user/{user_id}/summary')
def summary(survey_id: str, user_id: str, db: Database = Depends(get_db)):
    return SurveyService.summary(db, survey_id, user_id)