import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { ProblemDetailPage } from './pages/ProblemDetailPage';
import { AttemptWorkspacePage } from './pages/AttemptWorkspacePage';
import { AttemptsHistoryPage } from './pages/AttemptsHistoryPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:id" element={<ProblemDetailPage />} />
        <Route path="/attempts" element={<AttemptsHistoryPage />} />
        <Route path="/attempts/:id" element={<AttemptWorkspacePage />} />
      </Routes>
    </BrowserRouter>
  );
};
