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
            <button
              className="button-primary"
              onClick={() => navigate("/")}
              type="button"
            >
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
        <div className="result-container" role="region" aria-live="polite">
          <h3>Upload Success</h3>

          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="result-row">
              <div className="result-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </div>
              <div className="result-value">{value?.toString() || ""}</div>
            </div>
          ))}

          <button
            className="button-primary"
            onClick={() => navigate("/")}
            type="button"
          >
            Upload Another
          </button>
        </div>
      </div>
    </div>
  );
}
