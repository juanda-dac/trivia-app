from pydantic import BaseModel, Field

class QuestionModel(BaseModel):
    num_question: int = Field(default="Sucesive number of the question starting from 1 like: 1, 2, 3")
    question: str = Field(description="The question about the current topic")
    possible_answers: list[str] = Field(description="A list of 4 possible answers for the question")
    correct_answer: int = Field(description="Index of the correct anwer")
    explain: str = Field(description="Explaination of the correct answer")

class QuestionValidated(BaseModel):
    explain: str
    correct: bool
    question_correct: int

class QuestionSummary(QuestionModel):
    marked_answer: int
    correct: bool
