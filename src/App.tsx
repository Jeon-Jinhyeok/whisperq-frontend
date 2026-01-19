import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { JoinPage } from '@/pages/JoinPage';
import { AudiencePage } from '@/pages/AudiencePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AnalysisPage } from '@/pages/AnalysisPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<JoinPage />} />
        <Route path="/join" element={<JoinPage />} />

        {/* Audience Route */}
        <Route path="/s/:sessionCode" element={<AudiencePage />} />

        {/* Facilitator Routes (TODO: Add auth protection) */}
        <Route path="/dashboard/:sessionId" element={<DashboardPage />} />
        <Route path="/analysis/:sessionId" element={<AnalysisPage />} />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-muted-foreground">페이지를 찾을 수 없습니다</p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
