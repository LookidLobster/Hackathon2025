import { useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export function SignInPage(props) {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignInGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    try {
      let result = await signInWithPopup(auth, provider);
      console.log("signInWithPopup result", result);
      setMessage("Sign-in successful!");
    } catch (error) {
      console.log("signInWithPopup error", error);
      setMessage(error.message);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\+?[0-9]*$/.test(value)) {
      setPhone(value);
      setMessage("");
    } else {
      setMessage("Please enter a valid phone number.");
    }
  };

  return (
    <div className="App">
      <header className="App-header2">
        <div className="signin-box">
          <h2>Sign In</h2>
          <div className="input-group">
            <label htmlFor="phone" className="input-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+1234567890"
              maxLength={15}
              inputMode="tel"
              autoComplete="tel"
            />
          </div>

          <p className="message">{message}</p>

          <button
            className="google-signin-btn"
            onClick={handleSignInGoogle}
            type="button"
          >
            Sign In with Google
          </button>
        </div>
      </header>
    </div>
  );
}
