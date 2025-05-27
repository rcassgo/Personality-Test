import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const q = query(collection(db, "results"), orderBy("createdAt", "asc"));
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

  // 카테고리별 평균 계산
  const categoryAverages = categories.reduce((acc, category) => {
    const total = results.reduce((sum, result) => {
      return sum + ((result.scores || {})[category] || 0);
    }, 0);
    acc[category] = results.length > 0 ? (total / results.length).toFixed(1) : 0;
    return acc;
  }, {});

  return (
    <div className="admin-container">
      <h1>관리자 페이지</h1>
      <div className="stat-container">
        {/* 카테고리별 평균 점수 카드 */}
        {categories.map(category => (
          <div className="stat-card" key={category}>
            <h3>{category} 평균</h3>
            <p className="stat-value">{categoryAverages[category]}</p>
          </div>
        ))}
        <div className="stat-card">
          <h3>전체 응답 수</h3>
          <p className="stat-value">{results.length}</p>
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
