import type { AxiosError } from "axios";
import type { QuestionModel, QuestionSummary, QuestionValidated } from "../models/QuestionModel";
import type ResponseModel from "../models/ResponseModel";
import type SurveyModel from "../models/SurveyModel";
import type UserModel from "../models/UserModel";
import axiosInstance from "../utils/axiosInstance";
import type { SurveySummary } from "../models/SurveyModel";

class SurveyService {
    
    static async createSurvey(num_questions: number, topic: string, difficult: string, lang: string = "spanish"): Promise<ResponseModel<SurveyModel>>
    {
        try {
            const path = '/api/v1/surveys/create';
            const response = await axiosInstance.post(path, {
                num_questions,
                topic,
                difficult,
                lang
            });

            return { data: response.data }
        } catch (error) {
            console.log(error);
            return { error: true, message: "Error desconocido" }
        }
    }

    static async joinSurvey(username: string, surveyId: string): Promise<ResponseModel<UserModel>> {
        try {
            const path = `/api/v1/surveys/${surveyId}/join`;
            const response = await axiosInstance.post(path, { username });
            
            return {
                data: {
                    id: response.data._id,
                    username: response.data.username, 
                    surveyId: response.data.survey_id,
                    responses: response.data.responses
                }
            }
        } catch (error) {
            return { error: true, message: "Error desconocido" }
        }
    }

    static async nextQuestion(surveyId: string): Promise<ResponseModel<QuestionModel>>{
        try {
            const path = `/api/v1/surveys/${surveyId}/next-question`;
            const response = await axiosInstance.get(path);

            return {
                data: {
                    numQuestion: response.data.num_question,
                    question: response.data.question,
                    possibleAnswers: response.data.possible_answers
                }
            }
        } catch (e: any) {
            const error = e as AxiosError;
            if(error.status === 419) {
                return { error: true, message: "Se ha finalizado el cuestionario", code: error.status }
            }
            return { error: true, message: "Error desconocido" }
        }
    }

    static async validateResponse(surveyId: string, numQuestion: string, userId: string, response: number): Promise<ResponseModel<QuestionValidated>> {
        try {
            const path = `/api/v1/surveys/${surveyId}/response/${numQuestion}/user/${userId}`;
            const responseApi = await axiosInstance.put(path, { response });
            return {
                data: {
                    correct: responseApi.data.correct,
                    explain: responseApi.data.explain,
                    questionCorrect: responseApi.data.question_correct
                }
            }
        } catch (error) {
            return { error: true, message: "Error desconocido" }
        }
    }

    static async summarySurvey(surveyId: string, userId: string): Promise<ResponseModel<SurveySummary>> {
        try {
            const path = `/api/v1/surveys/${surveyId}/user/${userId}/summary`;
            const response = await axiosInstance.get(path);

            const questions: QuestionSummary[] = response.data.questions.map((question: any) => ({
                numQuestion: question.num_question,
                question: question.question,
                possibleAnswers: question.possible_answers,
                correctAnswer: question.correct_answer,
                explain: question.explain,
                markedAnswer: question.marked_answer,
                correct: question.correct
            }))

            return {
                data: {
                    title: response.data.title,
                    questions
                }
            }

        } catch (e: any) {
            const error = e as AxiosError;
            return { error: true, message: error.response?.data as string };
        }
    }

}

export default SurveyService;
