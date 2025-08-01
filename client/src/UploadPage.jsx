import { useState, useMemo } from "react";

export function UploadPage() {
    const [file, setFile] = useState();

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

        const res = await fetch('http://localhost:3000/upload',
            { method: 'POST', body: data }
        )
        const json = await res.json()
        console.log(json)
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
                            <input type="text" id="comments" name="comments" required></input>
                        </label><br />
                        <label for="date">Date of the picture:
                            <input type="date" id="date" name="date" required></input>
                        </label><br />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <button className="ScanButton" onClick={uploadScan}>Upload</button>
            </header>
        </div>
    );
}

