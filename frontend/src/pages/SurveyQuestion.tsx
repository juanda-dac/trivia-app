import { Button } from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Spinner } from "@/components/ui/Spinner";
import { useAppDispatch, useAppSelector } from "@/core/hooks/storeHooks";
import type {
    QuestionModel,
    QuestionValidated,
} from "@/core/models/QuestionModel";
import SurveyService from "@/core/services/SurveyService";
import { updateLoading } from "@/core/store/slices/surveySlice";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

function SurveyQuestion() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, survey, activeUser } = useAppSelector(({ survey }) => survey);
    const [currentQuestion, setCurrentQuestion] = useState<QuestionModel | null>(null);
    const [validatedQuestion, setValidatedQuestion] = useState<QuestionValidated | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    useEffect(() => {
        if (!activeUser || !survey) {
            navigate("/");
            return;
        }

        const getQuestion = async () => {
            dispatch(updateLoading(true));
            const response = await SurveyService.nextQuestion(survey.id);

            if (response.data) setCurrentQuestion(response.data);
            else if (response.error) toast.error("Error al cargar la pregunta", { duration: 3000 });
            
            dispatch(updateLoading(false));
        };

        getQuestion();
    }, []);

    const validateQuestion = async () => {
        if (selectedAnswer !== null) {
            const response = await SurveyService.validateResponse(
                survey!.id,
                currentQuestion!.numQuestion.toString(),
                activeUser!.id,
                selectedAnswer as number
            );
            if (response.data) {
                setValidatedQuestion(response.data);
            } else if (response.error)
                toast.error("Error al validar la pregunta", { duration: 3000 });
        }
    };

    const nextQuestion = async () => {
        if (validatedQuestion) {
            const response = await SurveyService.nextQuestion(survey!.id);
            if (response.data) {
                setCurrentQuestion(response.data);
                setSelectedAnswer(null);
                setValidatedQuestion(null);
            } else if (response.error) {
                if (response.code === 419) return navigate("/summary");
                toast.error("Error al traer la pregunta", { duration: 3000 });
            }
        }
    };

    const SurveyLoading = () => (
        <>
            <Card className="w-full max-w-md flex gap-3">
                <Spinner />
                <div>Cargando pregunta...</div>
            </Card>
        </>
    );

    const SurveyCardQuestion = () => (
        <>
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle className="space-y-2">
                        {validatedQuestion && (
                            <div className="w-full flex justify-center">
                                {validatedQuestion.correct ? (
                                    <span className="text-green-400 text-center">
                                        Correcto
                                    </span>
                                ) : (
                                    <span className="text-red-500 text-center">
                                        Incorrecto
                                    </span>
                                )}
                            </div>
                        )}
                        <h3 className="text-center">
                            {currentQuestion?.question}
                        </h3>
                        <hr />
                        <p className="text-current/60 font-normal text-sm">
                            {validatedQuestion && validatedQuestion.explain}
                        </p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-12 gap-3">
                        {currentQuestion?.possibleAnswers.map((answer, idx) => (
                            <Label className={
                                cn(
                                    "col-span-12 xl:col-span-6 hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-900/5",
                                    { "dark:has-[[aria-checked=true]]:text-emerald-400 dark:has-[[aria-checked=true]]:bg-emerald-900/5 dark:has-[[aria-checked=true]]:border-emerald-400": validatedQuestion && validatedQuestion.correct },
                                    { "dark:has-[[aria-checked=true]]:bg-red-900/5 dark:has-[[aria-checked=true]]:border-red-400 dark:has-[[aria-checked=true]]:text-red-400": validatedQuestion && !validatedQuestion.correct },
                                    { "dark:text-emerald-400 dark:bg-emerald-900/5 dark:border-emerald-400": validatedQuestion && !validatedQuestion.correct && validatedQuestion.questionCorrect === idx}
                                )
                            }>
                                <Checkbox
                                    id="toggle-2"
                                    checked={selectedAnswer === idx}
                                    onCheckedChange={() =>
                                        setSelectedAnswer(idx)
                                    }
                                    value={idx}
                                    disabled={validatedQuestion !== null}
                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                />
                                <div className="grid gap-1.5 font-normal">
                                    <p className="text-sm leading-none font-medium">
                                        {answer}
                                    </p>
                                </div>
                            </Label>
                        ))}
                    </div>

                    {validatedQuestion ? (
                        <Button
                            onClick={nextQuestion}
                            disabled={selectedAnswer === null}
                            className="mt-3 w-full"
                        >
                            Siguiente Pregunta
                        </Button>
                    ) : (
                        <Button
                            onClick={validateQuestion}
                            disabled={selectedAnswer === null}
                            className="mt-3 w-full"
                        >
                            Validar
                        </Button>
                    )}
                </CardContent>
            </Card>
        </>
    );

    if (!loading && !currentQuestion) {
        return (
            <>
                <Card>
                    <CardContent>
                        <h2>No se cargó correctamente la pregunta</h2>
                    </CardContent>
                </Card>
            </>
        );
    }

    return (
        <>
            <div className="w-full h-screen flex justify-center items-center p-4">
                {loading ? <SurveyLoading /> : <SurveyCardQuestion />}
            </div>
        </>
    );
}

export default SurveyQuestion;
