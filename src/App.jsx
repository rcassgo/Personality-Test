import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuestionPage from './pages/QuestionPage';
import ResultPage from './pages/ResultPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<QuestionPage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
