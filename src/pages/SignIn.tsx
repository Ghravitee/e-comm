/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { signIn, signInWithGoogle } from "../features/auth/api/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>

        {error && <p className="text-red-500">{error}</p>}

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 mb-4"
        >
          Continue with Google
        </button>

        <p className="text-center text-gray-400 mb-4">OR</p>

        {/* Email Login */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Sign In
        </button>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-600 hover:text-green-700">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};
