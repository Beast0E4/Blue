import React, { useState } from "react";
import type { User, AuthTokens } from "../../types";

const API_URL = import.meta.env.VITE_BASE_URL;

interface Props {
  isRegistering: boolean;
  toggleMode: () => void;
  onAuthSuccess: (user: User, tokens: AuthTokens) => void;
}

export default function AuthForm({
  isRegistering,
  toggleMode,
  onAuthSuccess,
}: Props) {
  const [authForm, setAuthForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      const endpoint = isRegistering
        ? "/api/auth/register"
        : "/api/auth/login";

      const body = isRegistering
        ? authForm
        : { email: authForm.email, password: authForm.password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || "Authentication failed");
        return;
      }

      onAuthSuccess(data.user, data.tokens);
    } catch (err) {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <input
              type="text"
              placeholder="Username"
              value={authForm.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border"
            required
          />

          {authError && (
            <p className="text-red-500 text-sm text-center">{authError}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isRegistering
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>

        <button
          onClick={toggleMode}
          className="w-full mt-4 text-blue-600 font-medium"
        >
          {isRegistering
            ? "Already have an account? Sign in"
            : "Need an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
