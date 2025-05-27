import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from '../data/questions.js';
import { options } from '../data/questions.js';

const QuestionPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState(Array(20).fill(null));
  const navigate = useNavigate();

  // 모든 질문을 1차원 배열로 펼치기
  const allQuestions = questionsData.flatMap(group =>
    group.questions.map(q => ({ text: q, category: group.category }))
  );

  const handleAnswerSelect = (score) => {
    setSelectedAnswer(score);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentIndex] = selectedAnswer;
      setUserAnswers(newAnswers);

      if (currentIndex < allQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
      } else {
        navigate('/result', { state: { userAnswers: newAnswers } });
      }
    }
  };

  return (
    <div className="question-container">
      <h2>{allQuestions[currentIndex].category}</h2>
      <h3>{currentIndex + 1}. {allQuestions[currentIndex].text}</h3>
      <div className="options-grid">
        {options.map(option => (
          <button
            key={option.score}
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
        {currentIndex === allQuestions.length - 1 ? '결과 보기' : '다음'}
      </button>
    </div>
  );
};

export default QuestionPage;
