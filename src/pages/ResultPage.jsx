import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { questionsData } from '../data/questions';
import '../styles/ResultPage.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const userAnswers = state?.userAnswers || [];

  const categoryScores = {
    "지역사회": 0,
    "공공기관": 0,
    "아동센터": 0,
    "재활병원": 0
  };

  questionsData.forEach((group, groupIndex) => {
    group.questions.forEach((_, qIndex) => {
      const answer = userAnswers[groupIndex * 5 + qIndex];
      if (answer !== null && answer !== undefined) {
        categoryScores[group.category] += answer;
      }
    });
  });

  let maxScore = -1;
  let resultCategory = "";
  for (const [category, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      resultCategory = category;
    }
  }

  return (
    <div className="result-container">
      <h1>테스트 결과</h1>
      <div className="result-card">
        <h2>당신은 {resultCategory}에 어울리는 사람입니다!</h2>
        <div className="score-display">
          <p>각 카테고리 점수:</p>
          <ul>
            {Object.entries(categoryScores).map(([category, score]) => (
              <li key={category}>{category}: {score}점</li>
            ))}
          </ul>
        </div>
      </div>
      <button
        className="retry-btn"
        onClick={() => navigate('/')}
      >
        다시 테스트하기
      </button>
    </div>
  );
};

export default ResultPage;
