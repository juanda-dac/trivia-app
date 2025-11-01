import type { QuestionSummary } from "./QuestionModel";

export default interface SurveyModel {
    id: string;
    title: string;
}

export interface SurveySummary {
    title: string;
    questions: QuestionSummary[];
}
