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

  const handleDelete = async (id) => {
    if (!window.confirm("정말로 이 응답을 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "results", id));
      await fetchResults(); // 삭제 후 목록 갱신
    } catch (e) {
      alert("삭제 실패: " + e.message);
    }
    setLoading(false);
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("정말로 전체 데이터를 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      // 모든 문서 순회하며 삭제 (작은 데이터셋에만 권장)
      for (const result of results) {
        await deleteDoc(doc(db, "results", result.id));
      }
      await fetchResults();
    } catch (e) {
      alert("전체 삭제 실패: " + e.message);
    }
    setLoading(false);
  };

  const categories = ["재활병원", "지역사회", "공공기관", "아동센터"];

  // ... (카테고리별 평균 계산 등 기존 코드 동일)

  return (
    <div className="admin-container">
      <h1>관리자 페이지</h1>
      <div style={{ marginBottom: 16 }}>
        <button className="clear-btn" onClick={handleDeleteAll} disabled={loading}>
          전체 초기화
        </button>
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
              <th>삭제</th>
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
