// QuestionPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import ProgressBar from '../components/ProgressBar';
import '../styles/QuestionPage.css';

const QuestionPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const navigate = useNavigate();

  const handleAnswerSelect = (score) => {
    setSelectedAnswer(score);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      setTotalScore(prev => prev + selectedAnswer);
      setUserAnswers(prev => [...prev, selectedAnswer]);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        navigate('/admin', { 
          state: { 
            totalScore: totalScore + selectedAnswer,
            userAnswers: [...userAnswers, selectedAnswer]
          } 
        });
      }
    }
  };

  return (
    <div className="question-container">
      <ProgressBar current={currentIndex + 1} total={questions.length} />
      
      <h2>{questions[currentIndex].text}</h2>
      
      <div className="options-grid">
        {questions[currentIndex].options.map((option, index) => (
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
        {currentIndex === questions.length - 1 ? '결과 보기' : '다음 질문'}
      </button>
    </div>
  );
};

export default QuestionPage;
