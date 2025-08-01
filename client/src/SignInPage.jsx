import { useState } from "react"
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth"

export function SignInPage(props) {
    const [message, setMessage] = useState("")
    const handleSignInGoogle = async (event) => {
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
        provider.addScope("https://www.googleapis.com/auth/contacts.readonly")
        try {
            let result = await signInWithPopup(auth, provider)
            console.log("signInWithPopup result", result)
        } catch (error) {
            console.log("signInWithPopup error", error)
            setMessage(error.message)
        }
    }
    return (
        <div>
            <p className="message">{message}</p>
            <button onClick={handleSignInGoogle}>
                Sign In with Google
            </button>
        </div>
    );
}