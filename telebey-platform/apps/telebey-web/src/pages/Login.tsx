import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ERRORS: Record<number, string> = {
  401: "Email or password incorrect",
  429: "Too many attempts, try again in 1 minute",
  403: "Your account has been suspended",
};

export function Login() {
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
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(ERRORS[status ?? 0] ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-16 bg-background px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Left Side: Hero Image */}
        <div className="hidden md:block h-full relative">
          <img 
            src="/assets/login-hero.png" 
            alt="Login Hero" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
            <div className="text-white space-y-2">
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-white/80">Manage your Telebey account seamlessly from any device.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 space-y-6">
          <div className="text-center md:text-left space-y-1">
            <div className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold">Telebey ID</span>
            </div>
            <p className="text-muted-foreground text-sm pt-1">Enter your credentials to continue</p>
          </div>

          <div className="space-y-5">
            {error && (
              <div className="flex gap-2.5 items-start text-sm text-red-600 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">Email address</label>
                <input
                  id="email" type="email" autoComplete="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <a href="#" className="text-xs text-primary hover:underline transition-all">Forgot password?</a>
                </div>
                <input
                  id="password" type="password" autoComplete="current-password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold py-3 text-sm transition disabled:opacity-55 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </div>
            </form>

            <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-[11px] text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground uppercase tracking-wider">Demo Access</p>
              <div className="flex justify-between">
                <span>👤 user@test.com</span>
                <span className="font-mono">Test1234!</span>
              </div>
              <div className="flex justify-between">
                <span>🛡️ admin@telebey.com</span>
                <span className="font-mono">Admin1234!</span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
