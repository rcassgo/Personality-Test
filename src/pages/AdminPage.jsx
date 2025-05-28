import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    const q = query(collection(db, "results"), orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate()
    }));
    setResults(data);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // 카테고리별 평균 계산
  const categories = ["재활병원", "지역사회", "공공기관", "아동센터"];
  const categoryAverages = categories.reduce((acc, category) => {
    const total = results.reduce((sum, result) => sum + ((result.scores || {})[category] || 0), 0);
    acc[category] = results.length > 0 ? (total / results.length).toFixed(1) : 0;
    return acc;
  }, {});

  // 개별 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "results", id));
      await fetchResults();
    } catch (e) {
      alert("삭제 실패: " + e.message);
    }
    setLoading(false);
  };

  // 전체 삭제
  const handleDeleteAll = async () => {
    if (!window.confirm("전체 데이터를 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      const batch = results.map(result => deleteDoc(doc(db, "results", result.id)));
      await Promise.all(batch);
      await fetchResults();
    } catch (e) {
      alert("전체 삭제 실패: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="admin-container">
      <h1>관리자 페이지</h1>
      
      {/* 카테고리별 평균 & 전체 응답 수 */}
      <div className="stat-container">
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

      {/* 전체 삭제 버튼 */}
      <div style={{ margin: "20px 0" }}>
        <button 
          className="clear-btn"
          onClick={handleDeleteAll}
          disabled={loading}
        >
          전체 초기화
        </button>
      </div>

      {/* 결과 테이블 */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              {categories.map(category => (
                <th key={category}>{category}</th>
              ))}
              <th>날짜</th>
              <th>관리</th>
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
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(result.id)}
                    disabled={loading}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
