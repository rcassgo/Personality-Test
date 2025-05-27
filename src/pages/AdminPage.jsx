import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const querySnapshot = await getDocs(collection(db, "results"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() // Firestore 타임스탬프 변환
      }));
      setResults(data);
    };
    fetchResults();
  }, []);

  // 전체 평균 점수 계산 (모든 카테고리 점수 합산)
  const avgScore = results.length > 0
    ? (results.reduce((sum, result) => {
        const total = Object.values(result.scores).reduce((a, b) => a + b, 0);
        return sum + total;
      }, 0) / results.length).toFixed(1)
    : "데이터 없음";

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    if (!date) return "날짜 없음";
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // 카테고리 목록
  const categories = ["재활병원", "지역사회", "공공기관", "아동센터"];

  return (
    <div className="admin-container">
      <h1>관리자 페이지</h1>
      
      <div className="stat-container">
        <div className="stat-card">
          <h3>전체 응답 수</h3>
          <p className="stat-value">{results.length}</p>
        </div>
        <div className="stat-card">
          <h3>평균 총점</h3>
          <p className="stat-value">{avgScore}</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              {categories.map(category => (
                <th key={category}>{category}</th>
              ))}
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={result.id}>
                <td>{idx + 1}</td>
                {categories.map(category => (
                  <td key={category}>{result.scores[category] || 0}</td>
                ))}
                <td>{formatDate(result.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
