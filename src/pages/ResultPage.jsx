import React, { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/ResultPage.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const scoresRaw = state?.scores || {};

  // useMemo: 의존성 배열에 scoresRaw만 넣음
  const scores = useMemo(() => scoresRaw, [scoresRaw]);

  useEffect(() => {
    const saveResult = async () => {
      try {
        await addDoc(collection(db, "results"), {
          scores,
          createdAt: new Date(),
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
    saveResult();
  }, [scores]);

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

  const result = getResult();

  return (
    <div className="result-container">
      <h1>테스트 결과</h1>
      <div className="result-card">
        <h2>당신은 {result}에 어울리는 사람입니다!</h2>
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
