import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Mail, Home, Bell } from "lucide-react";

export function ComingSoon() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isMail = location.pathname.includes('/mail');
  const isHomeNet = location.pathname.includes('/home/net');
  const isWishlist = location.pathname.includes('/wishlist');

  const content = {
    title: isMail ? "Telebey Mail" : isHomeNet ? "My HomeNet" : isWishlist ? "My Wishlist" : "Coming Soon",
    description: isMail 
      ? "A secure, encrypted communication hub for the Telebey ecosystem. Experience privacy without compromise." 
      : isHomeNet 
        ? "The future of domestic connectivity is almost here. Manage your home network with gigabit speeds from anywhere."
        : isWishlist
          ? "Save your favorite plans and devices for later. Your personalized Telebey wishlist is launching soon."
          : "We're working hard to bring this feature to life. Stay tuned for updates.",
    icon: isMail ? <Mail className="w-10 h-10" /> : isHomeNet ? <Home className="w-10 h-10" /> : <Heart className="w-10 h-10 text-primary" />
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-6 relative overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-xl w-full text-center relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-10 shadow-xl shadow-primary/5">
          {content.icon}
        </div>
        
        <h1 className="text-5xl md:text-6xl font-heading font-extrabold tracking-tight mb-6">
          {content.title}
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed mb-12">
          {content.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="h-14 rounded-2xl font-bold border-border hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
          </Button>
          <Button className="h-14 rounded-2xl font-extrabold bg-primary text-foreground hover:bg-primary/90 shadow-lg shadow-primary/10">
            <Bell className="w-5 h-5 mr-2" /> Notify Me
          </Button>
        </div>

        <div className="mt-20 flex items-center justify-center gap-3 text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">
           <Sparkles className="w-4 h-4 text-primary" />
           Telebey Next Gen
        </div>
      </div>
    </main>
  );
}
