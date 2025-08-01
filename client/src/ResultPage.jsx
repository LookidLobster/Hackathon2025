import { useLocation, useNavigate } from "react-router-dom";

export function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div>
        <h2>No result found</h2>
        <button onClick={() => navigate("/")}>Go back to Upload</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Upload Result</h3>

      {Object.entries(result).map(([key, value]) => (
        <div key={key} style={{ marginBottom: 10 }}>
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
          <span>{value?.toString() || ""}</span>
        </div>
      ))}

      <button onClick={() => navigate("/")}>Upload Another</button>
    </div>
  );
}
