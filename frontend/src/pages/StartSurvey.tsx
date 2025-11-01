import { useState } from "react";
import Call2Action from "./components/Call2Action";
import FormQuiz from "./components/FormQuiz";
// import { useAppSelector } from "@/core/hooks/storeHooks";


export default function StartSurvey(){

    const [registerMode, setRegisterMode] = useState(false);
    // const { loading } = useAppSelector(({ survey }) => survey)

    return (
        <>
            <div className="w-full h-screen flex justify-center items-center px-4">
                {registerMode 
                    ?  <FormQuiz/>
                    :  <Call2Action onStart={() => setRegisterMode(true)} />
                }
            </div>
        </>
    )
}
