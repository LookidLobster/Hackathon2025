import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
    const [file, setFile] = useState();
    const [result, setResult] = useState(null);
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
        const data = new FormData()
        data.append("file", file)

        const res = await fetch('/upload',
            { method: 'POST', body: data }
        )
        const json = await res.json()
        console.log(json)
        navigate("/result", { state: { result: json } });
    }
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
                        <button type="submit" className="submit">Submit</button>
                    </form>
                </div>
                <button className="ScanButton" onClick={uploadScan}>Upload</button>
            </header>
        </div>
    );
}

