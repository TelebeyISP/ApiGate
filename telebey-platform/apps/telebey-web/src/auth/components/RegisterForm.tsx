
import React, { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface RegisterFormProps {
  onSuccess?: () => void;
  onLogin?: () => void;
}

const REGISTRATION_ERRORS: Record<number, string> = {
  422: "This email is already registered",
  400: "Please check your information and try again",
};

export const RegisterForm = ({ onSuccess, onLogin }: RegisterFormProps) => {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await register(email, password, firstName, lastName);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(REGISTRATION_ERRORS[status ?? 0] ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-blue-900">Create Account</h3>
        <p className="text-sm text-gray-500">Join Telebey and experience next-gen connectivity</p>
      </div>

      {error && (
        <div className="flex gap-2.5 items-start text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="text-sm font-medium">First name</label>
            <input
              id="firstName" type="text" required
              value={firstName} onChange={e => setFirstName(e.target.value)}
              placeholder="John"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
            <input
              id="lastName" type="text" required
              value={lastName} onChange={e => setLastName(e.target.value)}
              placeholder="Doe"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email-reg" className="text-sm font-medium">Email address</label>
          <input
            id="email-reg" type="email" autoComplete="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password-reg" className="text-sm font-medium">Password</label>
          <input
            id="password-reg" type="password" autoComplete="new-password" required
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
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button 
            type="button"
            onClick={onLogin}
            className="text-blue-600 font-semibold hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};
