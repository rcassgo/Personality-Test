import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/ResultPage.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const scores = useMemo(() => state?.scores || {}, [state?.scores]);

  // Firebase
  useEffect(() => {
    const saveResult = async () => {
      try {
        await addDoc(collection(db, 'results'), {
          scores,
          createdAt: new Date(),
        });
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    };
    saveResult();
  }, [scores]);

  const categoryImages = {
    창업: '0.jpeg',
    공공기관: '1.jpeg',
    아동센터: '2.jpeg',
    재활병원: '3.jpeg',
  };

  const getResult = () => {
    let maxScore = -1;
    let resultCategory = '';
    Object.entries(scores).forEach(([category, score]) => {
      if (score > maxScore) {
        maxScore = score;
        resultCategory = category;
      }
    });
    return resultCategory;
  };

  const resultCategory = getResult();
  const imageSrc =
    process.env.PUBLIC_URL + '/' + categoryImages[resultCategory];

  return (
    <div className="result-container">
      <h1>테스트 결과</h1>
      <div className="result-card">
        <img
          src={imageSrc}
          alt={resultCategory}
          style={{ width: '480px', marginTop: '5px' }}
        />
      </div>
      <button className="retry-btn" onClick={() => navigate('/')}>
        다시 테스트하기
      </button>
    </div>
  );
};

export default ResultPage;
