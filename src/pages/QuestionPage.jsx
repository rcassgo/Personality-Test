import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, options } from '../data/questions';
import ProgressBar from '../components/ProgressBar';
import '../styles/QuestionPage.css';

const QuestionPage = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ 
    "재활병원": 0, 
    "지역사회": 0, 
    "공공기관": 0, 
    "아동센터": 0 
  });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const navigate = useNavigate();

  const handleAnswerSelect = (score) => {
    setSelectedAnswer(score);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      // 현재 카테고리 점수 업데이트
      const currentCat = categories[currentCategory].name;
      setScores(prev => ({
        ...prev,
        [currentCat]: prev[currentCat] + selectedAnswer
      }));

      // 다음 질문 또는 결과 페이지로 이동
      if (currentQuestion < 4) {
        setCurrentQuestion(prev => prev + 1);
      } else if (currentCategory < 3) {
        setCurrentCategory(prev => prev + 1);
        setCurrentQuestion(0);
      } else {
        navigate('/result', { state: { scores } });
      }
      setSelectedAnswer(null);
    }
  };

  // 전체 진행률 계산 (0~19)
  const totalProgress = currentCategory * 5 + currentQuestion;

  return (
    <div className="question-container">
      <ProgressBar current={totalProgress + 1} total={20} />
      
      <h3>{currentQuestion + 1}. {categories[currentCategory].questions[currentQuestion]}</h3>
      
      <div className="options-grid">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${selectedAnswer === option.score ? 'selected' : ''}`}
            onClick={() => handleAnswerSelect(option.score)}
          >
            {option.text}
          </button>
        ))}
      </div>

      <button 
        className="next-btn"
        onClick={handleNext}
        disabled={selectedAnswer === null}
      >
        {totalProgress === 19 ? '결과 보기' : '다음'}
      </button>
    </div>
  );
};

export default QuestionPage;
