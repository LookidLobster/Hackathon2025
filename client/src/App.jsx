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
import { MapPage } from "./mapPagetest";
import { UserPage } from "./UserPage";
import { SignInPage } from "./SignInPage";
import { ResultPage } from "./ResultPage";
import { DataPage } from "./DatabasePage";

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
      unsub(); 
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
              <Route path="/result" element={<ResultPage />} />
              <Route path="/dataBase" element={<DataPage />} />
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


