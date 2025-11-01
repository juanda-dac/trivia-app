import { Button } from "@/components/ui/Button";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/Item";
import { Separator } from "@/components/ui/Separator";
import { useAppSelector } from "@/core/hooks/storeHooks";
import { SurveySummary } from "@/core/models/SurveyModel";
import SurveyService from "@/core/services/SurveyService";
import { cn } from "../lib/utils";
import { BadgeCheckIcon, CircleUserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";


function SumarySurvey(){

    const navigate = useNavigate();
    const { activeUser, survey } = useAppSelector(({ survey }) => survey);

    const [summary, setSummary] = useState<SurveySummary | null>(null);

    useEffect(() => {
        if(activeUser === null || survey === null){
            navigate('/');
            return;
        }

        const getSummary = async () => {
            const response = await SurveyService.summarySurvey(survey.id, activeUser.id);
            if(response.data) setSummary(response.data);
            else {}
        }

        getSummary();
    }, []);

    return (
        <>
            <div className="w-full min-h-screen p-4 flex justify-center items-center">
                <div className="w-full max-w-xl space-y-2">
                    {summary && summary.questions.map(question => (
                        <>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">{question.numQuestion}. {question.question}</h3>
                                {/* Item de respuesta seleccionada */}
                                <Item variant="outline">
                                    <ItemMedia>
                                        <BadgeCheckIcon className="size-5" />
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle>Respuesta seleccionada: {question.possibleAnswers[question.markedAnswer]}</ItemTitle>
                                    </ItemContent>
                                </Item>

                                {/* Item de respuesta correcta */}
                                <Item variant="outline" className={cn({"bg-emerald-900/5 border border-emerald-400": question.correct, "bg-red-900/5 border-red-400": !question.correct})}>
                                    <ItemMedia>
                                        <CircleUserRound className="size-5" />
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle className={cn({"text-emerald-400": question.correct, "text-red-400": !question.correct})}>Respuesta seleccionada: {question.possibleAnswers[question.correctAnswer]}</ItemTitle>
                                        <ItemDescription>
                                            <p className="text-white">
                                                {question.explain}
                                            </p>
                                        </ItemDescription>
                                    </ItemContent>
                                </Item>
                                <Separator className="my-4" />
                            </div>
                        </>
                    ))}
                    <div className="w-full flex justify-center">
                        <Button variant="outline" asChild>
                            <NavLink to="/">Ir al inicio</NavLink>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SumarySurvey;
