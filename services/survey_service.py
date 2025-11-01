from schemas.survey import SurveyModel, SurveyRequest, SurveySummary
from schemas.question import QuestionModel, QuestionValidated, QuestionSummary
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from utils.llms import GeminiModel
from pymongo.database import Database
from bson import ObjectId
from exceptions.survey_exception import UnavailableSurvey, FinishedSurvey, UserExists, UserNotFound, SurveyNotFound, OutOfRange, QuestionUnavailable
from utils.instructions import instructions

class SurveyService:
    
    @staticmethod
    async def create(request: SurveyRequest) -> SurveyModel:
        """Creating a survey based on the request calling to Gemini API"""
        
        parser = JsonOutputParser(pydantic_object=SurveyModel)
        prompt = PromptTemplate(
            template=instructions['generate_survey'],
            input_variables=["num_questions","topic","difficult","lang"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        
        chain = prompt | GeminiModel.model() | parser

        response = chain.invoke({
            "num_questions": request.num_questions,
            "topic": request.topic,
            "difficult": request.difficult,
            "lang": request.lang
        })
        
        return SurveyModel.model_validate(response)
    
    @staticmethod
    async def save(db: Database, survey: SurveyModel):
        collection_surveys = db['surveys']
        saved = collection_surveys.insert_one(survey.model_dump())
        
        doc_id = saved.inserted_id
        doc = collection_surveys.find_one({"_id": doc_id})
        
        return {"id": str(doc["_id"]), "title": doc['title']}
    
    @staticmethod
    def next_question(db: Database, survey_id: str) -> QuestionModel:
        collection_surveys = db['surveys']
        survey = collection_surveys.find_one({"_id": ObjectId(survey_id)})
        
        num_questions = len(survey['questions'])
        
        if survey['current_question'] == -1:
            raise UnavailableSurvey()
            
        elif survey['current_question'] == num_questions:
            collection_surveys.update_one({"_id": ObjectId(survey_id)},{"$set":{"current_question": -1}})
            raise FinishedSurvey()
        
        else:
            collection_surveys.update_one({"_id": ObjectId(survey_id)},{"$set": { "current_question": survey['current_question'] + 1 }})
            return QuestionModel.model_validate(survey['questions'][survey['current_question']])
    
    @staticmethod
    def join_user(db: Database, username: str, survey_id: str):
        users = db['users']
        surveys = db['surveys']
        
        user_found = users.find_one({"username": username, "survey_id": survey_id})
        survey_found = surveys.find_one({"_id": ObjectId(survey_id)})
        
        if not survey_found:
            raise SurveyNotFound()
        
        if user_found:
            raise UserExists()
        
        user_created = users.insert_one({
            "username": username, 
            "survey_id": survey_id,
            "responses": [None] * len(survey_found['questions'])
        })
        
        saved = users.find_one({"_id": user_created.inserted_id})
        if "_id" in saved and isinstance(saved["_id"], ObjectId):
            saved['_id'] = str(saved['_id'])
        
        return saved

    def update_question(db: Database, user_id: str, survey_id: str, num_question: int, question_resp: str):
        """Actualiza la pregunta y la valida"""
        users = db['users']
        surveys = db['surveys']
        
        user_found = users.find_one({"_id": ObjectId(user_id)})
        survey_found = surveys.find_one({"_id": ObjectId(survey_id)})
        
        # Valida que el cuestionario exista
        if not survey_found:
            raise SurveyNotFound()
        
        # Valida que el usuario exista
        if not user_found:
            raise UserNotFound()
        
        # Valida que la pregunta solicitada exista
        if num_question > len(survey_found['questions']):
            raise OutOfRange("La pregunta no existe")
        
        # Valida que la respuesta dada sea válida en el rango de respuestas existentes
        if question_resp >= len(survey_found['questions'][num_question - 1]['possible_answers']) or (num_question - 1) == -1:
            raise OutOfRange()
        
        # Si la pregunta ya está registrada entonces no permite modificarla
        if user_found['responses'][num_question - 1] is not None:
            raise QuestionUnavailable()
        
        user_found['responses'][num_question - 1] = question_resp
        users.update_one({"_id": ObjectId(user_id)}, {"$set": {"responses": user_found['responses']}})
        
        return QuestionValidated(
            explain=survey_found['questions'][num_question - 1]['explain'],
            correct=survey_found['questions'][num_question - 1]['correct_answer'] == question_resp,
            question_correct=survey_found['questions'][num_question - 1]['correct_answer']
        )
    
    def summary(db: Database, survey_id: str, user_id: str):
        users = db['users']
        surveys = db['surveys']
        
        survey_found = surveys.find_one({"_id": ObjectId(survey_id)})
        user_found = users.find_one({"_id": ObjectId(user_id), "survey_id": survey_id})
        
        if not survey_found:
            raise SurveyNotFound()
        
        if not user_found:
            raise UserNotFound()
        
        question_summaries: list[QuestionSummary] = []
        for (id, question) in enumerate(survey_found['questions']):
            question_summaries.append(QuestionSummary.model_validate({
                **question,
                'marked_answer': user_found['responses'][question['num_question'] - 1],
                'correct': user_found['responses'][question['num_question'] - 1] == question['correct_answer']
            }))
        
        return SurveySummary(title=survey_found['title'], questions=question_summaries)
        

    