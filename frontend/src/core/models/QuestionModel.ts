
export interface QuestionModel{
    numQuestion: number;
    question: string;
    possibleAnswers: Array<string>;
    correctAnswer?: number;
    explain?: string;
}

export interface QuestionValidated{
    correct: boolean;
    explain: string;
    questionCorrect: number;
}

export interface QuestionSummary {
    numQuestion: number;
    question: string;
    possibleAnswers: Array<string>;
    correctAnswer: number;
    explain: string;
    markedAnswer: number;
    correct: boolean
}
