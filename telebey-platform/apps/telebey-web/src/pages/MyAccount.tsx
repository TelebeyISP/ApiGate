import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, CreditCard, LayoutDashboard, Settings,
  Smartphone, LogOut, Shield, Loader2, Wifi, History, Server,
  Sparkles, ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Simple mock for whether the user has a subscription.
// In a real app we would check `user.subscriptions` or a `/lines` endpoint.
const useSubscription = () => {
  return { hasActiveSubscription: false }; // Set to false to demo the empty state requested
};

function Avatar({ walletImage }: { walletImage?: string }) {
  return (
    <div className="relative group">
      {walletImage ? (
        <img src={walletImage} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-background shadow-xl object-cover" />
      ) : (
        <div className="w-20 h-20 rounded-full border-4 border-background shadow-xl overflow-hidden bg-primary/10 flex items-center justify-center">
          <User className="w-10 h-10 text-primary opacity-50" />
        </div>
      )}
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-background rounded-full shadow-sm" title="Online" />
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30">
        <Shield className="w-3 h-3" /> Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30">
      <User className="w-3 h-3" /> Member
    </span>
  );
}

export function MyAccount() {
  const { user, isAuthenticated, isLoading, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { hasActiveSubscription } = useSubscription();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    username: "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: ""
  });

  // Redirect to login if not authenticated or show onboarding if no username
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    } else if (isAuthenticated && !user?.username && !isLoading) {
      setShowOnboarding(true);
    }
  }, [isAuthenticated, isLoading, navigate, user?.username]);

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await updateUser({
        ...onboardingData,
        isPublic: true // Default to public on onboarding completions
      });
      setShowOnboarding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <main className="flex-1 flex flex-col py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-6 text-center md:text-left bg-card border border-border p-8 rounded-3xl shadow-sm relative overflow-hidden group">
          {/* Background Video */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-700"
            src="/5986_Video_Generation.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 w-full">
            <Avatar walletImage={user.walletImage} />
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight">
                  {user.username || user.walletName || (user.firstName ? `${user.firstName} ${user.lastName ?? ''}` : user.email.split("@")[0])}
                </h1>
                <RoleBadge role={user.role} />
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {user.walletAddress ? `Wallet: ${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}` : user.email}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {user.phone && (
                  <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">📱 {user.phone}</p>
                )}
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">🗓️ Member since {memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col space-y-1">
              <Link to="/account" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-bold transition-colors">
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
              <Link to="/activate" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium">
                <Smartphone className="w-5 h-5" /> Activate eSIM
              </Link>
              <Link to="/billing" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium">
                <CreditCard className="w-5 h-5" /> Billing & Payments
              </Link>
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium">
                <User className="w-5 h-5" /> Profile Settings
              </Link>
              <Link to="/manage-data" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium">
                <Wifi className="w-5 h-5" /> Manage Data
              </Link>
              <Link to="/order-history" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium">
                <History className="w-5 h-5" /> Order History
              </Link>

              {/* Telebey Nett Settings (Open5GS panel) */}
              <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors font-bold border-t border-border mt-2 pt-4">
                <Server className="w-5 h-5 text-indigo-500" /> Telebey Nett Settings
              </a>

              {/* Admin-only link */}
              {user.role === "admin" && (
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors font-bold border-t border-border mt-2 pt-4">
                  <Shield className="w-5 h-5" /> Admin Panel
                </Link>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium border-t border-border mt-2 pt-4 w-full text-left"
              >
                <LogOut className="w-5 h-5" /> Log Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">

            {/* Account Info Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/40 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email / Wallet</p>
                  <p className="text-sm font-medium break-all">{user.email || user.walletAddress}</p>
                </div>
                <div className="bg-muted/40 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm font-medium">{user.phone ?? "Not set"}</p>
                </div>
                <div className="bg-muted/40 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Account ID</p>
                  <p className="text-xs font-mono text-muted-foreground break-all">{user.id}</p>
                </div>
                <div className="bg-muted/40 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Role</p>
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>

            {/* Subscription Dependent Sections */}
            {hasActiveSubscription ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Data Usage */}
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Smartphone className="w-24 h-24" />
                    </div>
                    <h2 className="text-lg font-bold mb-4 relative z-10">Data Usage</h2>
                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <span className="text-sm font-medium">12.5 GB / Unlimited</span>
                      <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">18 days left</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 mb-2 relative z-10">
                      <div className="bg-gradient-to-r from-primary/70 to-primary h-3 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground relative z-10 mt-4">Premium speed up to 50GB guaranteed.</p>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold mb-2">Current Bill</h2>
                      <div className="text-4xl font-heading font-extrabold text-foreground mb-1">$45.00</div>
                      <p className="text-sm text-red-500 font-medium mb-4">Auto-pay runs Mar 28</p>
                    </div>
                    <Link to="/billing">
                      <button className="w-full py-3 bg-foreground text-background rounded-lg font-bold hover:bg-foreground/90 transition-colors shadow-sm">
                        Manage Payment
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Manage Lines</h2>
                    <button className="text-sm text-primary font-bold hover:underline">Add a Line</button>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-foreground" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">(555) 123-4567</div>
                          <div className="text-sm text-muted-foreground border border-border inline-block px-2 py-0.5 rounded-md mt-1">Telebey 5G</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider border border-green-500/20">Active</span>
                        <button className="p-2 text-muted-foreground hover:bg-muted border border-transparent hover:border-border rounded-lg transition-all">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card border border-border rounded-xl p-8 text-center shadow-sm">
                <h2 className="text-xl font-bold mb-2">No Active Subscriptions</h2>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Get a plan to start viewing data usage, managing lines, and easily paying bills right here.
                </p>
                <Link to="/plans" className="inline-flex items-center justify-center h-10 px-6 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-all">
                  View Plans
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-card border border-border w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -ml-16 -mb-16" />

            <div className="p-10 relative z-10">
              <div className="mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-heading font-extrabold text-foreground mb-3">Welcome to Telebey</h2>
                <p className="text-muted-foreground leading-relaxed">Let's set up your digital identity on the network.</p>
              </div>

              <form onSubmit={handleOnboardingSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Choose Username</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">@</div>
                    <input 
                      required
                      type="text" 
                      placeholder="alexsmith" 
                      className="w-full h-14 bg-muted/50 border border-border rounded-2xl pl-10 pr-4 focus:ring-2 focus:ring-primary/50 outline-none font-bold"
                      value={onboardingData.username}
                      onChange={e => setOnboardingData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/\s/g, '') }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">First Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Alex" 
                      className="w-full h-14 bg-muted/50 border border-border rounded-2xl px-4 focus:ring-2 focus:ring-primary/50 outline-none font-bold"
                      value={onboardingData.firstName}
                      onChange={e => setOnboardingData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Last Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Smith" 
                      className="w-full h-14 bg-muted/50 border border-border rounded-2xl px-4 focus:ring-2 focus:ring-primary/50 outline-none font-bold"
                      value={onboardingData.lastName}
                      onChange={e => setOnboardingData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Home Address</label>
                  <input 
                    required
                    type="text" 
                    placeholder="123 Telebey Way, Tech City" 
                    className="w-full h-14 bg-muted/50 border border-border rounded-2xl px-4 focus:ring-2 focus:ring-primary/50 outline-none font-bold"
                    value={onboardingData.address}
                    onChange={e => setOnboardingData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 mt-6 bg-primary text-foreground hover:bg-primary/90 flex items-center justify-center"
                >
                  Complete Profile
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
