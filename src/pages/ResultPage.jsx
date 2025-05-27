import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/ResultPage.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const scores = state?.scores || {};

  // Firebase 저장 로직
  useEffect(() => {
    const saveResult = async () => {
      try {
        await addDoc(collection(db, "results"), {
          scores, // 카테고리별 점수 전체 저장
          createdAt: new Date()
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
    saveResult();
  }, [scores]);

  // 최고 점수 카테고리 찾기
  const getResult = () => {
    let maxScore = -1;
    let resultCategory = "";
    Object.entries(scores).forEach(([category, score]) => {
      if (score > maxScore) {
        maxScore = score;
        resultCategory = category;
      }
    });
    return resultCategory;
  };

  return (
  <div className="result-container">
    <h1>테스트 결과</h1>
    <div className="result-card">
      <div className="result-type">{getResult()}</div>
      <div className="score-display">
        <span>당신은 </span>
        <span className="score-number">{getResult()}</span>
        <span>에 어울리는 사람입니다!</span>
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
