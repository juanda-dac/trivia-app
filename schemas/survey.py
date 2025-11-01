from pydantic import BaseModel, Field
from typing import Optional
from schemas.question import QuestionModel, QuestionSummary

class SurveyModel(BaseModel):
    title: str = Field(description="A title based on the context of the quiz")
    questions: Optional[list[QuestionModel]] = Field(description="A list of questions about current topic")
    current_question: Optional[int] = Field(description="IGNORE THIS FIELD", default=0)
    
class SurveyRequest(BaseModel):
    num_questions: int
    topic: str
    difficult: str
    lang: str

class SurveySummary(BaseModel):
    title: str
    questions: list[QuestionSummary]
