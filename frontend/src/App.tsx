import { Route, Routes } from "react-router"
import { ThemeProvider } from "./components/ThemeProvider"
import StartSurvey from "./pages/StartSurvey"
import { Toaster } from "./components/ui/Sonner"
import SurveyQuestion from "./pages/SurveyQuestion"
import SumarySurvey from "./pages/SumarySurvey"

function App() {

    return (
        <>
          <ThemeProvider defaultTheme="dark" storageKey="survey-theme-ui">
            <Toaster />
            <Routes>
              <Route path="/" element={<StartSurvey />} />
              <Route path="/survey" element={<SurveyQuestion />} />
              <Route path="/summary" element={<SumarySurvey />} />
            </Routes>
          </ThemeProvider>
        </>
    )
}

export default App
