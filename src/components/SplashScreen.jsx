// src/components/SplashScreen.jsx
import { useNavigate } from 'react-router-dom';
import '../styles/SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="splash-container">
      <img 
        src="/splash-image.png" 
        alt="테스트 시작 화면" 
        className="splash-image"
      />
      <button
        className="enter-button"
        onClick={() => navigate('/question')}
        aria-label="테스트 시작 버튼"
      >
        테스트 시작하기
      </button>
    </div>
  );
};

export default SplashScreen;
