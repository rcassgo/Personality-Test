// src/routes/SplashScreen.jsx
import { useNavigate } from 'react-router-dom';
import '../styles/SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="splash-container">
      <img 
        src="/splash-image.png" 
        alt="앱 로고" 
        className="splash-image"
      />
      <button 
        className="enter-btn"
        onClick={() => navigate('/home')}
      >
        테스트 시작하기
      </button>
    </div>
  );
};

export default SplashScreen;
