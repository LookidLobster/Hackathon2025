import { useLocation, useNavigate } from "react-router-dom";

export function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="App">
        <div className="App-header2">
          <div className="no-result">
            <h2>No result found</h2>
            <button onClick={() => navigate("/")} type="button">
              Go back to Upload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="App-header2">
        <div className="result-container">
          <h3>Upload Success</h3>
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="result-row">
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
              <span>{value?.toString() || ""}</span>
            </div>
          ))}
          <button
            onClick={() => navigate("/")}
            className="button-primary"
            type="button"
          >
            Upload Another
          </button>
        </div>
      </div>
    </div>
  );
}