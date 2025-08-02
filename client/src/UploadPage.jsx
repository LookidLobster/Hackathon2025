import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    uploadPhoto: "UPLOAD PHOTO",
    uploadImage: "upload image",
    comments: "Comments:",
    date: "Date of the picture:",
    location: "Location of picture:",
    getLocation: "Get Location",
    upload: "Upload",
    fetching: "fetching...",
    geoNotSupported: "Geolocation is not supported by your browser",
    geoUnable: "Unable to retrieve your location",
  },
  es: {
    uploadPhoto: "SUBIR FOTO",
    uploadImage: "subir imagen",
    comments: "Comentarios:",
    date: "Fecha de la foto:",
    location: "Ubicación de la foto:",
    getLocation: "Obtener ubicación",
    upload: "Subir",
    fetching: "cargando...",
    geoNotSupported: "La geolocalización no está soportada por su navegador",
    geoUnable: "No se pudo obtener su ubicación",
  },
  fr: {
    uploadPhoto: "TÉLÉCHARGER LA PHOTO",
    uploadImage: "télécharger l'image",
    comments: "Commentaires :",
    date: "Date de la photo :",
    location: "Emplacement de la photo :",
    getLocation: "Obtenir la position",
    upload: "Télécharger",
    fetching: "chargement...",
    geoNotSupported: "La géolocalisation n'est pas prise en charge par votre navigateur",
    geoUnable: "Impossible de récupérer votre position",
  },
  de: {
    uploadPhoto: "FOTO HOCHLADEN",
    uploadImage: "Bild hochladen",
    comments: "Kommentare:",
    date: "Datum des Bildes:",
    location: "Ort des Bildes:",
    getLocation: "Standort abrufen",
    upload: "Hochladen",
    fetching: "wird geladen...",
    geoNotSupported: "Geolocation wird von Ihrem Browser nicht unterstützt",
    geoUnable: "Ihr Standort konnte nicht ermittelt werden",
  },
  zh: {
    uploadPhoto: "上传照片",
    uploadImage: "上传图片",
    comments: "评论：",
    date: "照片日期：",
    location: "拍摄地点：",
    getLocation: "获取位置",
    upload: "上传",
    fetching: "加载中...",
    geoNotSupported: "您的浏览器不支持地理定位",
    geoUnable: "无法获取您的位置",
  },
  hi: {
    uploadPhoto: "फोटो अपलोड करें",
    uploadImage: "छवि अपलोड करें",
    comments: "टिप्पणियाँ:",
    date: "फ़ोटो की तारीख:",
    location: "फ़ोटो का स्थान:",
    getLocation: "स्थान प्राप्त करें",
    upload: "अपलोड करें",
    fetching: "लाद रहा है...",
    geoNotSupported: "आपके ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है",
    geoUnable: "आपका स्थान प्राप्त करने में असमर्थ",
  }
};



export function UploadPage() {
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const [language, setLanguage] = useState("en"); // default language

  const navigate = useNavigate();

  const t = translations[language];

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
      alert(t.geoNotSupported);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setLocation(`${lat},${lng}`);
      },
      (error) => {
        alert(t.geoUnable);
        console.error(error);
      }
    );
  };

  return (
    <div className="App">
      <header className="App-header2">
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="zh">中文</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        {isLoading ? (
          <div className="loader-container">
            <div className="sandglass"></div>
            {t.fetching}
          </div>
        ) : (
          <>
            <h1 className="TitleUpload">{t.uploadPhoto}</h1>
            {file ? (
              <button className="ImageUploadButton"></button>
            ) : (
              <button className="ImageUploadButton">{t.uploadImage}</button>
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
                  {t.comments}
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
                  {t.date}
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
                  {t.location}
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
                    {t.getLocation}
                  </button>
                </label>
                <br />
                <button
                  className="ScanButton"
                  onClick={uploadScan}
                  disabled={isLoading}
                >
                  {t.upload}
                </button>
              </form>
            </div>
          </>
        )}
      </header>
    </div>
  );
}
