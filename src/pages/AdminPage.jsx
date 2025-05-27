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
        createdAt: doc.data().createdAt?.toDate() // 날짜 변환
      }));
      setResults(data);
    };
    fetchResults();
  }, []);

  // 카테고리별 점수 표시
  const categories = ["재활병원", "지역사회", "공공기관", "아동센터"];

  // 전체 응답 수
  const totalResponses = results.length;

  // 평균 점수 계산 (각 응답의 모든 카테고리 점수 합계의 평균)
  const avgScore = results.length > 0
    ? (
        results.reduce((total, result) => {
          // result.scores가 없으면 빈 객체로 대체
          const scores = result.scores || {};
          // 모든 카테고리 점수 합계
          const sum = categories.reduce((sum, category) => sum + (scores[category] || 0), 0);
          return total + sum;
        }, 0) / results.length
      ).toFixed(1)
    : 0;

  return (
    <div className="admin-container">
      <h1>관리자 페이지</h1>
      <div className="stat-container">
        <div className="stat-card">
          <h3>전체 응답 수</h3>
          <p className="stat-value">{totalResponses}</p>
        </div>
        <div className="stat-card">
          <h3>평균 점수</h3>
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
                  <td key={category}>
                    {(result.scores || {})[category] || 0}
                  </td>
                ))}
                <td>{result.createdAt?.toLocaleString() || "날짜 없음"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
