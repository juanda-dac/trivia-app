
export default interface UserModel {
    id: string;
    username: string;
    surveyId: string;
    responses: Array<number>;
}