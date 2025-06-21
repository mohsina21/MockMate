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
import { Button } from "./button";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-teal-50 to-slate-50">
        <Card className="max-w-md w-full shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-col items-center bg-gradient-to-r from-purple-50 to-teal-50 border-b border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-900">Account</CardTitle>
            <p className="text-slate-600 text-center">
              Signed in as: {user.email || user.displayName}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <Button
              onClick={handleSignOut}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:from-fuchsia-700 hover:to-purple-800 text-white py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign Out
            </Button>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-teal-50 to-slate-50">
      <Card className="max-w-md w-full shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-col items-center bg-gradient-to-r from-purple-50 to-teal-50 border-b border-slate-100">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-slate-900">
            Login or Sign Up
          </CardTitle>
          <p className="text-slate-600 text-center">
            Access your MockMate account
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-8">
          <input
            className="p-3 rounded border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="p-3 rounded border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSignIn}
              className="flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:from-fuchsia-700 hover:to-purple-800 text-white"
            >
              Sign In
            </Button>
            <Button
              onClick={handleSignUp}
              className="flex-1 bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-700 hover:to-fuchsia-800 text-white"
            >
              Sign Up
            </Button>
          </div>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;