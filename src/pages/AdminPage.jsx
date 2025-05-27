import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

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

  return (
    <div>
      <h1>결과 목록</h1>
      <ul>
        {results.map(result => (
          <li key={result.id}>
            <p>총점: {result.totalScore}</p>
            <p>답변: {result.userAnswers.join(', ')}</p>
            <p>날짜: {result.createdAt?.toDate().toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;