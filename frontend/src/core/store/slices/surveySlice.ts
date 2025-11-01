import type { QuestionModel } from '@/core/models/QuestionModel';
import type SurveyModel from '@/core/models/SurveyModel';
import type UserModel from '@/core/models/UserModel';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SurveyStateModel {
    currentQuestion: QuestionModel | null;
    survey: SurveyModel | null;
    loading: boolean;
    activeUser: UserModel | null;
}

const initialState: SurveyStateModel = {
    currentQuestion: null,
    survey: null,
    loading: false,
    activeUser: null,
}

export const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        putCurrentQuestion: (state: SurveyStateModel, action: PayloadAction<QuestionModel>) => {
            state.currentQuestion = action.payload;
        },
        putCurrentSurvey: (state: SurveyStateModel, action: PayloadAction<SurveyModel>) => {
            state.survey = action.payload;
        },
        updateLoading: (state: SurveyStateModel, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        updateUser: (state: SurveyStateModel, action: PayloadAction<UserModel>) => {
            state.activeUser = action.payload;
        },
        updateUserNull: (state: SurveyStateModel) => {
            state.activeUser = null;
        }
    }
});

export const {
    putCurrentQuestion,
    putCurrentSurvey,
    updateLoading,
    updateUser,
    updateUserNull
} = surveySlice.actions;


export default surveySlice.reducer;



