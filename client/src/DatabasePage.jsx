import { useEffect, useState } from "react";

export function DataPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/uploads")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="App">
        <p>Loading data...</p>
      </div>
    );

  if (error)
    return (
      <div className="App">
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );

  if (data.length === 0)
    return (
      <div className="App">
        <p>No records found.</p>
      </div>
    );

  return (
    <div className="App" style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Uploaded Data</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: "white" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Filename</th>
            <th style={thStyle}>Comments</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, filename, comments, date, location, status }) => (
            <tr key={id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{id}</td>
              <td style={tdStyle}>{filename}</td>
              <td style={tdStyle}>{comments || "-"}</td>
              <td style={tdStyle}>{date || "-"}</td>
              <td style={tdStyle}>{location || "-"}</td>
              <td style={tdStyle}>{status || "not started"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid white",
};

const tdStyle = {
  padding: "8px",
  verticalAlign: "top",
};
