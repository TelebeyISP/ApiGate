
import React, { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface EmailLoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

const ERRORS: Record<number, string> = {
  401: "Email or password incorrect",
  429: "Too many attempts, try again in 1 minute",
  403: "Your account has been suspended",
};

export const EmailLoginForm = ({ onSuccess, onForgotPassword, onRegister }: EmailLoginFormProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }

    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(ERRORS[status ?? 0] ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-blue-900">Sign in with Email</h3>
        <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
      </div>

      {error && (
        <div className="flex gap-2.5 items-start text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email-form" className="text-sm font-medium">Email address</label>
          <input
            id="email-form" type="email" autoComplete="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password-form" className="text-sm font-medium">Password</label>
            <button 
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-blue-600 hover:underline transition-all"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="password-form" type="password" autoComplete="current-password" required
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 text-sm transition disabled:opacity-55 disabled:cursor-not-allowed shadow-lg shadow-blue-900/10"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button 
            type="button"
            onClick={onRegister}
            className="text-blue-600 font-semibold hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};
