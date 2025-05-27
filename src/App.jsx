import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuestionPage from './pages/QuestionPage';
import ResultPage from './pages/ResultPage';
import AdminPage from './pages/AdminPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<QuestionPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
