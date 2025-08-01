import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router';
import './App.css'
import config from "./FirebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import simpleheat from 'simpleheat';

import { UploadPage } from "./UploadPage";
import { LoadingPage } from "./LoadingPage";
import { HomePage } from "./HomePage";
import { MapPage } from "./MapPage";
import { UserPage } from "./UserPage";
import { SignInPage } from "./SignInPage";

import homeButton from "./assets/home.png"
import uploadNavButton from "./assets/uploadIcon.png"
import userButton from "./assets/Union.png"
import mapNavButton from "./assets/mapp.png"

const app = initializeApp(config);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (userObj) => {
      if (userObj) {
        let userProviderId = userObj.providerData[0].providerId;
        if (userProviderId === "password" && !userObj.emailVerified) {
          setUser(null);
          return;
        }
      }
      setUser(userObj);
    });
    return () => {
      unsub(); // cleanup by disconnect from subsciption
    };
  }, []);

  const navigate = useNavigate()
  const handleNavigation = (path) => {
    navigate(path);
  };

  if (user) {
    return (
      <div>
        <div className='App'>
          <div className="contentContainer">
            <Routes>
              <Route exact path="/" element={<LoadingPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/map" element={<MapPage />} />
            </Routes>
          </div>
          <NavBar handleNavigation={handleNavigation} />
        </div>

      </div>
    );
  } else {
    return <SignInPage />;
  }

}

function NavBar({ handleNavigation }) {
  let location = useLocation()
  console.log(location)
  return (
    <div className='NavBar'>
      <input type="image" src={homeButton} className={location.pathname == "/home" ? "Home" : "Home-inactive"} onClick={() => handleNavigation('/home')} alt='Home' />
      <input type="image" src={uploadNavButton} className='uploadNav' onClick={() => handleNavigation('/upload')} alt='Scan' />
      <input type="image" src={mapNavButton} className='mapNav' onClick={() => handleNavigation('/map')} alt='Map' />
      <input type="image" src={userButton} className='userNav' onClick={() => handleNavigation('/user')} alt='UserProfile' />
    </div>
  );
}

export default App






// export default function HeatmapCanvas() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/locations")
//       .then((res) => res.json())
//       .then((data) => {
//         if (!canvasRef.current) return;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         // Clear canvas
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         // Map lat/lng to pixel coordinates (simple projection for demo)
//         const bounds = {
//           minLat: Math.min(...data.map(p => p.lat)),
//           maxLat: Math.max(...data.map(p => p.lat)),
//           minLng: Math.min(...data.map(p => p.lng)),
//           maxLng: Math.max(...data.map(p => p.lng)),
//         };
//         const pxData = data.map(p => {
//           // Normalize to canvas size (no real map projection, just for visualization demo!)
//           const x = ((p.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * canvas.width;
//           const y = ((bounds.maxLat - p.lat) / (bounds.maxLat - bounds.minLat)) * canvas.height;
//           return [x, y, 1]; // weight = 1
//         });

//         // Create heatmap
//         const heat = simpleheat(canvas);
//         heat.data(pxData);
//         heat.radius(40, 25); // radius, blur
//         heat.max(2);
//         heat.draw();
//       });
//   }, []);

//   return (
//     <div>
//       <h2>SimpleHeat Canvas (No Google Maps)</h2>
//       <canvas
//         ref={canvasRef}
//         width={600}
//         height={400}
//         style={{ border: "1px solid #ccc" }}
//       />
//     </div>
//   );
// }

