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
        ...doc.data()
      }));
      setResults(data);
    };
    fetchResults();
  }, []);


  const avgScore = results.length > 0
    ? (results.reduce((sum, result) => sum + result.totalScore, 0) / results.length).toFixed(1)
    : "데이터 없음";


  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "날짜 없음";
    return timestamp.toDate().toLocaleString();
  };

  return (
    <div className="admin-container">
      <h1>관리자 페이지</h1>
      <div className="stat-container">
        <div className="stat-card">
          <h3>전체 응답 수</h3>
          <p className="stat-value">{results.length}</p>
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
              <th>총점</th>
              <th>답변</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={result.id}>
                <td>{idx + 1}</td>
                <td>{result.totalScore}</td>
                <td>{result.userAnswers.join(', ')}</td>
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
