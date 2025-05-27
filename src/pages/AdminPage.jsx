// AdminPage.jsx
import React, { useState } from 'react';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      const rows = lines.slice(1).filter(Boolean).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, i) => {
          obj[header] = values[i];
          return obj;
        }, {});
      });
      setSubmissions(rows);
    };
    reader.readAsText(file);
  };

  return (
    <div className="admin-container">
      <h1>테스트 결과 관리</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <table>
        <thead>
          <tr>
            <th>IP</th>
            <th>날짜</th>
            <th>총점</th>
            <th>답변</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub, idx) => (
            <tr key={idx} onClick={() => setSelected(sub)}>
              <td>{sub['IP'] || sub['ip']}</td>
              <td>{sub['Created at'] || sub['created_at']}</td>
              <td>{sub['score']}</td>
              <td>{sub['answers']}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div className="answer-detail">
          <h3>문항별 답변</h3>
          <ul>
            {selected['answers']?.split(',').map((ans, i) => (
              <li key={i}>질문 {i+1}: {ans}점</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
