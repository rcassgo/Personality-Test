import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import questionsData from '../data/questions.json';

const ResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const userAnswers = state?.userAnswers || [];

  // 카테고리별 점수 계산
  const categoryScores = {
    "지역사회": 0,
    "공공기관": 0,
    "아동센터": 0,
    "재활병원": 0
  };

  // 각 카테고리별로 질문 5개씩이므로, 인덱스를 잘 맞춰야 함
  questionsData.forEach((group, groupIndex) => {
    for (let qIndex = 0; qIndex < group.questions.length; qIndex++) {
      const answer = userAnswers[groupIndex * 5 + qIndex];
      if (answer !== null && answer !== undefined) {
        categoryScores[group.category] += answer;
      }
    }
  });

  // 가장 높은 점수의 카테고리 찾기
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
