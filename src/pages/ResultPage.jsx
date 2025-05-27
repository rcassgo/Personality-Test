// ResultPage.jsx (최소한의 예시)
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ResultPage.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const totalScore = state?.totalScore || 0;
  const userAnswers = state?.userAnswers || [];

  const getResult = () => {
    if (totalScore >= 80) return { type: '매우 어울림', desc: '당신은 이 유형과 완벽히 조화됩니다!' };
    if (totalScore >= 60) return { type: '어울림', desc: '이 유형은 당신에게 잘 맞습니다.' };
    if (totalScore >= 40) return { type: '보통', desc: '평균적인 유형 특성을 보입니다.' };
    if (totalScore >= 20) return { type: '어울리지 않음', desc: '이 유형과는 다소 차이가 있습니다.' };
    return { type: '매우 어울리지 않음', desc: '완전히 반대되는 유형입니다.' };
  };

  const result = getResult();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('form-name', 'test-result');
    formData.append('score', totalScore);
    formData.append('answers', userAnswers.join(','));

    fetch('/', {
      method: 'POST',
      body: formData,
    })
      .then(() => alert('결과가 저장되었습니다!'))
      .catch(() => alert('오류가 발생했습니다.'));
  };

  return (
    <div className="result-container">
      <h1>당신의 테스트 결과</h1>
      <div className="result-card">
        <div className="result-type">{result.type}</div>
        <div className="score-display">총점: {totalScore} / 100</div>
        <p className="result-desc">{result.desc}</p>
      </div>
      <form name="test-result" method="POST" data-netlify="true" onSubmit={handleSubmit}>
        <input type="hidden" name="form-name" value="test-result" />
        <input type="hidden" name="score" value={totalScore} />
        <input type="hidden" name="answers" value={userAnswers.join(',')} />
        <button type="submit" className="save-btn">결과 저장하기</button>
      </form>
      <button className="retry-btn" onClick={() => navigate('/')}>
        다시 테스트하기
      </button>
    </div>
  );
};

export default ResultPage;
