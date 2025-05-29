import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, options } from '../data/questions.js';
import ProgressBar from '../components/ProgressBar';
import '../styles/QuestionPage.css';

const QuestionPage = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ 
    "창업": 0, 
    "공공기관": 0, 
    "아동센터": 0, 
    "재활병원": 0 
  });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const navigate = useNavigate();

  const handleAnswerSelect = (score) => {
    setSelectedAnswer(score);
  };

  const handleNext = () => {
  if (selectedAnswer !== null) {                         // 답이 선택 되면
    const currentCat = categories[currentCategory].name; // categories[x].name 을 불러온다
    
    const updatedScores = {
      ...scores,                                        // 기존 스코어에
      [currentCat]: scores[currentCat] + selectedAnswer // "창업" 값을 scores["창업"]값에 새로운 값을 더한다
    };

    if (currentQuestion < 4) {                          // 현재 질문 수가 < 4 이면
      setCurrentQuestion(prev => prev + 1);             // +1
    } else if (currentCategory < 3) {                   // 현재 질문수 < 4 이고, 카테고리 번호 < 3 이면
      setCurrentCategory(prev => prev + 1);             // 카테고리 번호 + 1 // 창업 -> 공공기관으로
      setCurrentQuestion(0);                            // 남은 질문 0으로
    } else {
      navigate('/result', { state: { scores: updatedScores } });
    }

    setScores(updatedScores);
    setSelectedAnswer(null);
  }
};


// 진행률
  const totalProgress = currentCategory * 5 + currentQuestion;

  return (
    <div className="question-container">
      <ProgressBar current={totalProgress + 1} total={20} />
      
      {/* <h2>{categories[currentCategory].name}</h2> */}
      {/* <h3>{currentQuestion + 1}. {categories[currentCategory].questions[currentQuestion]}</h3> */}
      <h3>{categories[currentCategory].questions[currentQuestion]}</h3>
      
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
