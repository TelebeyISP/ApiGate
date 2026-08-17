import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { 
  User as UserIcon, Shield, Loader2, MapPin, 
  Calendar, MessageSquare, Heart, Share2, ArrowLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface PublicUser {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  walletImage?: string;
  bannerImage?: string;
  role: string;
  isPublic?: boolean;
  bio?: string;
  createdAt?: string;
  email?: string; // We'll hide this or show only parts
}

export function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!username) return;
      setIsLoading(true);
      try {
        const usersRef = collection(db, 'users');
        // Always query against normalized lowercase field
        const q = query(usersRef, where('usernameLowercase', '==', username.toLowerCase()), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data() as PublicUser;
          setProfile({ ...data, id: querySnapshot.docs[0].id });
        } else {
          // Fallback: Try searching original username field for legacy records
          const qLegacy = query(usersRef, where('username', '==', username), limit(1));
          const snapLegacy = await getDocs(qLegacy);
          
          if (!snapLegacy.empty) {
            const data = snapLegacy.docs[0].data() as PublicUser;
            setProfile({ ...data, id: snapLegacy.docs[0].id });
          } else {
            setError("User not found");
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse">Scanning the Telebey network...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <UserIcon className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{error || "User not found"}</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          We couldn't find a Telebey member with the username "@{username}". They might have changed it or haven't joined yet.
        </p>
        <Button onClick={() => navigate("/community")} variant="outline">
          Back to Community
        </Button>
      </div>
    );
  }

  // Privacy Check: If profile is private and viewer is not the owner
  const isOwner = currentUser?.username === profile.username;
  if (profile.isPublic === false && !isOwner) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mb-8 shadow-xl border border-border">
          <Shield className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tight">Private Profile</h1>
        <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
           This Telebey member has restricted their profile visibility. You must be on the "Allowed" network list or they must set their profile to Public to view their details.
        </p>
        <Button onClick={() => navigate("/community")} variant="outline" className="h-12 px-8 font-black rounded-xl">
          Back to Community
        </Button>
      </div>
    );
  }

  const memberSince = profile.createdAt 
    ? new Date(profile.createdAt).getFullYear() 
    : "2024";

  return (
    <main className="flex-1 flex flex-col pb-20 bg-muted/10">
      {/* Banner & Header Image */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gradient-to-r from-primary/20 via-primary/5 to-background border-b border-border">
        {profile.bannerImage ? (
          <img 
            src={profile.bannerImage} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        )}
        <div className="absolute top-6 left-6 z-10">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg hover:bg-background transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="relative -mt-20 md:-mt-24 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
          {/* Avatar */}
          <div className="relative inline-block">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl border-8 border-background bg-card shadow-2xl overflow-hidden flex items-center justify-center">
              {profile.walletImage ? (
                <img src={profile.walletImage} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 md:w-20 md:h-20 text-primary opacity-20" />
              )}
            </div>
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-background rounded-full shadow-lg" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button className="flex-1 md:flex-none h-11 px-8 font-bold rounded-xl shadow-lg shadow-primary/20">
              Message
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none h-11 px-6 font-bold rounded-xl border-border bg-background hover:bg-muted">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Profile Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight capitalize">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  {profile.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                       Member
                    </span>
                  )}
                </div>
                <p className="text-xl text-primary font-bold">@{profile.username}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-muted-foreground font-medium">
                  <div className="p-2.5 rounded-xl bg-muted/50">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>Telebey Global Network</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground font-medium">
                  <div className="p-2.5 rounded-xl bg-muted/50">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span>Joined in {memberSince}</span>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-bold mb-4">Bio</h3>
                <p className="text-muted-foreground leading-relaxed italic">
                  {profile.bio || "Telebey community member exploring the boundaries of global connectivity. Part of the 12,000+ pioneers building the most connected network on earth."}
                </p>
              </div>
            </div>

            {/* Activity or Tags */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Community Badges</h3>
              <div className="flex flex-wrap gap-3">
                {['Early Adopter', 'Network Pioneer', 'Community Expert'].map((badge) => (
                  <div key={badge} className="px-4 py-2 rounded-xl bg-muted border border-border text-sm font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                <Smartphone className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-bold mb-6 relative z-10">Network Stats</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                    <MessageSquare className="w-4 h-4" /> Threads
                  </div>
                  <span className="font-bold">48</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                    <Heart className="w-4 h-4" /> Endorsements
                  </div>
                  <span className="font-bold">1.2k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                    <UserIcon className="w-4 h-4" /> Neighbors
                  </div>
                  <span className="font-bold">482</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 shadow-sm group hover:bg-primary/10 transition-colors">
              <h4 className="font-bold mb-2">Build your own identity</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Connect your devices and start building your Telebey presence today.
              </p>
              <Button onClick={() => navigate("/auth")} className="w-full font-bold h-11">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}

function Smartphone({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>
    </svg>
  );
}
