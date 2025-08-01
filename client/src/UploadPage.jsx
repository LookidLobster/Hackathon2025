import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
    const [file, setFile] = useState();
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fileURL = useMemo(() => {
        console.log("fileURL file=", file);
        return file ? URL.createObjectURL(file) : undefined;
    }, [file]);

    const handleFileChange = (event) => {
        console.log(event.target.files);
        setFile(event.target.files[0]);
    };

    const uploadScan = async () => {
        if (!file) return;
        setIsLoading(true);

        const data = new FormData();
        data.append("file", file);

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

    return (
        <div className="App">
            <header className="App-header2">
                <h1 className="TitleUpload">UPLOAD PHOTO</h1>
                {file ? <button className="ImageUploadButton"></button> : <button className="ImageUploadButton">upload image</button>}
                <img src={fileURL} className="ImageUploadButton" alt="" />
                <input className="ImageUploadButtonInput" type="file" onChange={handleFileChange} />
                <div className="pictureDetails">
                    <form method="POST" action="/submit_data">
                        <label for="comments">Comments:
                            <input type="text" className="comments" name="comments" required></input>
                        </label><br />
                        <label for="date">Date of the picture:
                            <input type="date" className="date" name="date" required></input>
                        </label><br />
                        <label for="location">Location of picture:
                            <input className="location" name="location" required></input>
                        </label><br />
                        <button className="ScanButton" onClick={uploadScan} disabled={isLoading}>
                            Upload
                        </button>
                        {isLoading && <p>fetching...</p>}
                    </form>
                </div>
            </header>
        </div>
    );
}

