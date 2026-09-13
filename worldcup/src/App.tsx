import { Navigate, Route, Routes } from "react-router-dom"
import { LandingPage } from "@/pages/landing"
import { MatchupPage } from "@/pages/matchup"
import { ResultPage } from "@/pages/result"
import  UploadPage  from "@/pages/upload"
import { LegalPage }  from "@/pages/legal"

export function App() {
  return <Routes>
    <Route element={<LandingPage />}>
        
      <Route path="upload" element={<UploadPage />} />
      <Route path="matchup" element={<MatchupPage />} />
      <Route path="result" element={<ResultPage />} />
      <Route path="privacy" element={<LegalPage type="privacy" />} />
      <Route path="terms" element={<LegalPage type="terms" />} />
      <Route path="*" element={<Navigate replace to="upload" />} />
    </Route>
  </Routes>
}

export default App
