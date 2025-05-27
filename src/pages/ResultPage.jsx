import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/ResultPage.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const totalScore = state?.totalScore || 0;
  const userAnswers = state?.userAnswers || [];

  // 결과 저장 함수 (의존성 배열에 totalScore, userAnswers 추가)
  useEffect(() => {
    const saveResult = async () => {
      try {
        await addDoc(collection(db, "results"), {
          totalScore,
          userAnswers,
          createdAt: new Date(),
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
    saveResult();
  }, [totalScore, userAnswers]); // ← 의존성 배열에 추가

  const getResult = () => {
    if (totalScore >= 80) return { 
      type: '매우 어울림', 
      desc: '당신은 이 유형과 완벽히 조화됩니다!',
      detail: '새로운 환경이나 사람들에게도 쉽게 적응하며, 활기차고 긍정적인 에너지를 가지고 있습니다. 다양한 상황에서도 유연하게 대처할 수 있습니다.'
    };
    if (totalScore >= 60) return { 
      type: '어울림', 
      desc: '이 유형은 당신200에게 잘 맞습니다.',
      detail: '주변과의 관계에서 균형을 잘 맞추며, 충분히 소통하고 협력할 수 있습니다. 새로운 변화에도 적당히 적응할 수 있습니다.'
    };
    if (totalScore >= 40) return { 
      type: '보통', 
      desc: '평균적인 유형 특성을 보입니다.',
      detail: '대부분의 상황에서 무난하게 적응하며, 특별히 강한 특성이나 약점이 두드러지지 않습니다.'
    };
    if (totalScore >= 20) return { 
      type: '어울리지 않음', 
      desc: '이 유형과는 다소 차이가 있습니다.',
      detail: '이 유형과는 방향성이 다르거나, 생각이나 행동에 차이가 있습니다. 하지만 충분히 노력하면 조화를 이룰 수 있습니다.'
    };
    return { 
      type: '매우 어울리지 않음', 
      desc: '완전히 반대되는 유형입니다.',
      detail: '이 유형과는 근본적으로 다르다고 느껴질 수 있습니다. 하지만 다양한 경험은 언제나 도움이 됩니다.'
    };
  };

  const result = getResult();

  return (
    <div className="result-container">
      <h1>당신의 테스트 결과</h1>
      
      <div className="result-card">
        <div className="result-type">{result.type}</div>
        <div className="score-display">
          <span>총점: </span>
          <span className="score-number">{totalScore}</span>
          <span> / 100</span>
        </div>
        <p className="result-desc">{result.desc}</p>
        <div className="result-detail">
          <p>{result.detail}</p>
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
