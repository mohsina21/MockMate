import React, { useState, useEffect } from "react";
import { auth } from "../Utils/Firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const Auth = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && onAuthSuccess) onAuthSuccess();
    });
    return () => unsubscribe();
  }, [onAuthSuccess]);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert(err.message);
    }
  };

  if (user) {
    return (
      <div className="flex flex-col items-center gap-2 p-4">
        <div>Signed in as: {user.email || user.displayName}</div>
        <button onClick={handleSignOut} className="bg-fuchsia-700 px-4 py-2 rounded">Sign Out</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <input
        className="p-2 rounded bg-gray-800 text-white"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="p-2 rounded bg-gray-800 text-white"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button onClick={handleSignIn} className="bg-fuchsia-700 px-4 py-2 rounded">Sign In</button>
        <button onClick={handleSignUp} className="bg-purple-700 px-4 py-2 rounded">Sign Up</button>
      </div>
      <button onClick={handleGoogleSignIn} className="bg-blue-600 px-4 py-2 rounded mt-2">
        Sign in with Google
      </button>
    </div>
  );
};

export default Auth;