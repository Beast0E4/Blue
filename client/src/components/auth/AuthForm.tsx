import React from 'react';

interface Props {
  isRegistering: boolean;
  authForm: { username: string; email: string; password: string };
  authError: string;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  toggleMode: () => void;
}

export default function AuthForm({
  isRegistering,
  authForm,
  authError,
  onChange,
  onSubmit,
  toggleMode
}: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {isRegistering && (
            <input
              type="text"
              placeholder="Username"
              value={authForm.username}
              onChange={(e) => onChange('username', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) => onChange('password', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border"
            required
          />

          {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={toggleMode}
          className="w-full mt-4 text-blue-600 font-medium"
        >
          {isRegistering
            ? 'Already have an account? Sign in'
            : 'Need an account? Sign up'}
        </button>
      </div>
    </div>
  );
}
