import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Textarea";
import { useAppDispatch, useAppSelector } from "@/core/hooks/storeHooks";
import SurveyService from "@/core/services/SurveyService";
import { putCurrentSurvey, updateLoading, updateUser } from "@/core/store/slices/surveySlice";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import z from 'zod';
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function FormQuiz(){

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(({ survey }) => survey)

    const formSchema = z.object({
        topic: z.string().min(10, {
            error: "El contexto debe tener 10 caracteres minimo",
        }),
        numQuestions: z.coerce.number().min(0),
        difficult: z.string().nonempty(),
        lang: z.string().nonempty(),
        username: z.string().min(5, {
            error: "El nombre de usuario debe tener minimo 5 caracteres"
        })
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            numQuestions: 1,
            topic: "",
            username: "",
            difficult: "easy",
            lang: "spanish"
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        dispatch(updateLoading(true));
        
        const repsonseSurvey = await SurveyService.createSurvey(values.numQuestions, values.topic, values.difficult, values.lang);

        if(repsonseSurvey.data) {
            dispatch(putCurrentSurvey(repsonseSurvey.data));
            
            const responseUser = await SurveyService.joinSurvey(values.username ,repsonseSurvey.data.id);
            
            if(responseUser.data) {
                dispatch(updateUser(responseUser.data));
                toast.success('Cuestionario creado');
                navigate(`/survey`);
            }

            else toast.error(responseUser.message, { duration: 3000 });
            
        }
        else if(repsonseSurvey.error) {
            toast.error(repsonseSurvey.message ?? 'Error desconocido', { duration: 3000 });
        }

        dispatch(updateLoading(false));
    }

    return (
        <>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        <h1 className="text-center font-bold text-xl">¡Descubre el conocimiento por ti mismo!</h1>
                    </CardTitle>
                    <hr />
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                            <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contexto</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Escribe el contexto o tema de lo que quieres..."  {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="numQuestions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numero de preguntas</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={field.value as number} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className="w-full grid grid-cols-12 gap-x-4">
                                <FormField
                                    control={form.control}
                                    name="difficult"
                                    render={({ field }) => (
                                        <FormItem className="col-span-6">
                                            <FormLabel>Dificultad</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Dificultad" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="easy">Facil</SelectItem>
                                                        <SelectItem value="medium">Medio</SelectItem>
                                                        <SelectItem value="hard">Dificil</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lang"
                                    render={({ field }) => (
                                        <FormItem className="col-span-6">
                                            <FormLabel>Lenguaje</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Lenguaje" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="spanish">Español</SelectItem>
                                                        <SelectItem value="english">Inglés</SelectItem>
                                                        <SelectItem value="mandarin">Mandarín</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre de usuario</FormLabel>
                                        <FormControl>
                                            <Input placeholder="User123" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                                
                            <Button type="submit" className="w-full" disabled={loading}>
                                { loading && <Spinner />}
                                Generar
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}

