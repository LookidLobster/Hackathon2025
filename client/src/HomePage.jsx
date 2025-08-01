import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="App-header2">
        <h1 className="home-title">InfraAlert</h1>
        <p className="home-description">
          Contribute to your surroundings, get problems noticed by city officials and authorities.
        </p>
        <button
          className="home-about-button"
          onClick={() => navigate("/about")}
          type="button"
          aria-label="About us"
        >
          About Us
        </button>
      </div>
    </div>
  );
}