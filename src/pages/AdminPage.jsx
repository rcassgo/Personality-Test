import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      // 쿼리에 정렬 조건 추가 (createdAt 기준 내림차순)
      const q = query(collection(db, "results"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setResults(data);
    };
    fetchResults();
  }, []);

  const categories = ["재활병원", "지역사회", "공공기관", "아동센터"];

  const totalResponses = results.length;

  const avgScore = results.length > 0
    ? (
        results.reduce((total, result) => {
          const scores = result.scores || {};
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
                {/* 전체 응답 수 - 현재 인덱스로 역순 번호 매기기 */}
                <td>{totalResponses - idx}</td>
                {categories.map(category => (
                  <td key={category}>{(result.scores || {})[category] || 0}</td>
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
