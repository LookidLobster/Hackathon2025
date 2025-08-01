import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
  const [file, setFile] = useState();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [comments, setComments] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();

  const fileURL = useMemo(() => {
    return file ? URL.createObjectURL(file) : undefined;
  }, [file]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadScan = async () => {
    if (!file) return;
    setIsLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("comments", comments);
    data.append("date", date);
    data.append("location", location);

    try {
      const res = await fetch("/upload", { method: "POST", body: data });
      const json = await res.json();
      setIsLoading(false);
      navigate("/result", { state: { result: json } });
    } catch (error) {
      setIsLoading(false);
      console.error("Upload failed", error);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setLocation(`${lat},${lng}`);
      },
      (error) => {
        alert("Unable to retrieve your location");
        console.error(error);
      }
    );
  };

  return (
    <div className="App">
      <header className="App-header2">
        <h1 className="TitleUpload">UPLOAD PHOTO</h1>
        {file ? (
          <button className="ImageUploadButton"></button>
        ) : (
          <button className="ImageUploadButton">upload image</button>
        )}
        <img src={fileURL} className="ImageUploadButton" alt="" />
        <input
          className="ImageUploadButtonInput"
          type="file"
          onChange={handleFileChange}
        />
        <div className="pictureDetails">
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="comments">
              Comments:
              <br />
              <input
                type="text"
                className="comments"
                name="comments"
                required
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </label>
            <label htmlFor="date">
              Date of the picture:
              <br />
              <input
                type="date"
                className="date"
                name="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label htmlFor="location">
              Location of picture:
              <br />
              <input
                type="text"
                className="location"
                name="location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Latitude,Longitude"
              />
              <br />
              <button type="button" onClick={getLocation}>
                Get Location
              </button>
            </label>
            <br />
            <button
              className="ScanButton"
              onClick={uploadScan}
              disabled={isLoading}
            >
              Upload
            </button>
            {isLoading && <p>fetching...</p>}
          </form>
        </div>
      </header>
    </div>
  );
}
