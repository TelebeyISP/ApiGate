import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  MessageSquare, ThumbsUp, Eye, Shield, User, Clock, 
  ChevronRight, Share2, ShoppingBag, Sparkles, Megaphone, 
  Users, ExternalLink, ArrowRight, Image as ImageIcon, 
  Smile, Send, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { db, storage } from "@/lib/firebase";
import { 
  collection, query, onSnapshot, orderBy, 
  addDoc, serverTimestamp, updateDoc, doc, 
  increment, where, getDocs, Timestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  role: string;
  content: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  author: string;
  avatar?: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  views: number;
  image?: string;
}

export function Community() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sortBy, setSortBy] = useState<"trending" | "latest">("trending");
  const [totalMembers, setTotalMembers] = useState(0);
  const [onlineMembers, setOnlineMembers] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newTicket, setNewTicket] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const popularEmojis = ["❤️", "🔥", "🚀", "😂", "🙌", "💯", "✅", "✨"];

  // Real-time listener for tickets
  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          author: data.author,
          avatar: data.avatar,
          role: data.role,
          content: data.content,
          timestamp: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleDateString() : "Just now",
          likes: data.likes || 0,
          views: data.views || 0,
          comments: data.comments || [],
          image: data.image
        };
      }) as Ticket[];
      setTickets(ticketsData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Community Stats
  useEffect(() => {
    // 1. Total Members
    const totalUnsub = onSnapshot(collection(db, "users"), (snap) => {
      setTotalMembers(snap.size);
    });

    // 2. Online Members (active in last 5 minutes)
    const updateOnlineCount = async () => {
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
      const q = query(
        collection(db, "users"), 
        where("lastSeen", ">=", Timestamp.fromDate(fiveMinsAgo))
      );
      const snap = await getDocs(q);
      setOnlineMembers(snap.size);
    };

    updateOnlineCount();
    const onlineInterval = setInterval(updateOnlineCount, 30000); // Update every 30s

    return () => {
      totalUnsub();
      clearInterval(onlineInterval);
    };
  }, []);

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortBy === "trending") return b.likes - a.likes;
    return 0; // Firestore default is by date desc which is already set
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return null;
    const storageRef = ref(storage, `community/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handlePostTicket = async () => {
    if (!newTicket.trim() || !user) return;
    
    setIsUploading(true);
    let imageUrl = null;
    try {
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage);
      }

      await addDoc(collection(db, "tickets"), {
        author: user.username || user.walletName || user.firstName || 'User',
        avatar: user.walletImage || null,
        role: user.role || 'user',
        content: newTicket,
        image: imageUrl,
        timestamp: serverTimestamp(),
        likes: 0,
        views: 0,
        comments: []
      });
      setNewTicket("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error adding ticket: ", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePostComment = async (ticketId: string) => {
    if (!newComment.trim() || !user) return;
    
    try {
      const ticketRef = doc(db, "tickets", ticketId);
      await updateDoc(ticketRef, {
        comments: arrayUnion({
          id: Date.now().toString(),
          author: user.username || user.walletName || user.firstName || 'User',
          avatar: user.walletImage || null,
          role: user.role || 'user',
          content: newComment,
          timestamp: "Just now"
        })
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleLikeTicket = async (ticketId: string) => {
    try {
      const ticketRef = doc(db, "tickets", ticketId);
      await updateDoc(ticketRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.error("Error liking ticket: ", error);
    }
  };

  const RoleBadge = ({ role }: { role: string }) => {
    if (role === 'admin') return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ml-2">Admin</span>;
    if (role === 'employee') return <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ml-2">Staff</span>;
    return null;
  };

  return (
    <main className="flex-1 bg-background min-h-screen pb-20 overflow-x-hidden">
      
      {/* Premium Hero / Header */}
      <div className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex items-center text-sm font-medium text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Telebey</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-foreground font-bold">Community</span>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
              Connect & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Collaborate</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Join the global Telebey conversation. Share tips, get support, and help build the future of connectivity.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Create Post Card */}
            {user ? (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex gap-4">
                  <img 
                    src={user.walletImage || `https://ui-avatars.com/api/?name=${user.username || user.walletName || 'User'}`} 
                    className="w-12 h-12 rounded-full object-cover border border-border shadow-inner" 
                    alt="" 
                  />
                  <div className="flex-1">
                    <div className="relative group">
                      <textarea 
                        value={newTicket}
                        onChange={(e) => setNewTicket(e.target.value)}
                        placeholder={user?.isPublic === false ? "Participation disabled in Private Mode..." : "Start a discussion..."}
                        disabled={user?.isPublic === false}
                        className={`w-full bg-muted/30 border border-border rounded-xl p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all placeholder:text-muted-foreground/50 ${user?.isPublic === false ? 'cursor-not-allowed opacity-60' : ''}`}
                      />
                      {user?.isPublic === false && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border shadow-xl flex items-center gap-2">
                             <Shield className="w-4 h-4 text-primary" />
                             <span className="text-xs font-bold uppercase tracking-tight">Set profile to Public to participate</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {selectedImage && (
                      <div className="relative mt-4 w-fit group">
                         <img src={URL.createObjectURL(selectedImage)} className="h-32 rounded-xl border border-border shadow-lg" alt="Preview" />
                         <button 
                           onClick={() => setSelectedImage(null)}
                           className="absolute -top-2 -right-2 bg-foreground text-background rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                         >
                           <X className="w-3 h-3" />
                         </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="p-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-all group"
                          title="Upload Image"
                        >
                          <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        
                        <div className="relative">
                          <button 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-all group"
                            title="Add Emoji"
                          >
                            <Smile className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>
                          {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 mb-3 bg-card border border-border rounded-2xl p-2.5 shadow-2xl z-50 flex gap-2 animate-in fade-in zoom-in-95 duration-200">
                              {popularEmojis.map(emoji => (
                                <button 
                                  key={emoji} 
                                  onClick={() => {
                                    setNewTicket(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  className="hover:scale-125 transition-transform p-1.5 text-2xl active:scale-95"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <button className="p-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-all group">
                          <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                      <Button 
                        onClick={handlePostTicket} 
                        disabled={isUploading || !newTicket.trim() || user?.isPublic === false}
                        className="font-bold px-8 h-12 rounded-xl shadow-xl shadow-primary/20 bg-primary text-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
                      >
                        {isUploading ? "Uploading..." : "Publish Post"}
                        <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-primary/5 border border-dashed border-primary/20 rounded-3xl p-12 text-center animate-pulse">
                <Shield className="w-16 h-16 text-primary/30 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-2">Restricted Access</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Connect your identity to participate in world-wide discussions and share media.</p>
                <Button className="font-bold px-10 h-12 rounded-2xl">Connect Identity</Button>
              </div>
            )}

            {/* Sorting UI */}
            <div className="flex items-center gap-6 pb-2 text-sm">
              <button 
                onClick={() => setSortBy("trending")}
                className={`flex items-center gap-2 font-bold transition-all border-b-2 pb-2 ${sortBy === 'trending' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
              >
                <Sparkles className="w-4 h-4" /> Trending
              </button>
              <button 
                onClick={() => setSortBy("latest")}
                className={`flex items-center gap-2 font-bold transition-all border-b-2 pb-2 ${sortBy === 'latest' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
              >
                <Clock className="w-4 h-4" /> Latest
              </button>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {sortedTickets.map((t) => (
                <div key={t.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={t.avatar || `https://ui-avatars.com/api/?name=${t.author}`} className="w-11 h-11 rounded-full border border-border shadow-sm object-cover" alt="" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-2 text-base">
                            {t.author}
                            <RoleBadge role={t.role} />
                          </div>
                          <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                            {t.timestamp} <span className="w-1 h-1 rounded-full bg-border" /> {Math.floor(Math.random() * 50) + 1}m read
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-foreground/90 leading-relaxed mb-6 text-lg whitespace-pre-wrap">{t.content}</p>
                    
                    {t.image && (
                      <div className="rounded-2xl border border-border overflow-hidden mb-6 shadow-sm group cursor-zoom-in">
                         <img src={t.image} className="w-full h-auto max-h-[600px] object-cover group-hover:scale-105 transition-transform duration-700" alt="attachment" />
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                      <button 
                        onClick={() => handleLikeTicket(t.id)}
                        className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted/30 hover:bg-primary/10 text-muted-foreground hover:text-primary font-bold transition-all active:scale-95"
                      >
                         <ThumbsUp className="w-4 h-4" /> {t.likes}
                      </button>
                      <button className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted/30 hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-500 font-bold transition-all">
                         <MessageSquare className="w-4 h-4" /> {t.comments.length}
                      </button>
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground/60 ml-auto">
                         <Eye className="w-4 h-4" /> {t.views + 124}
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {t.comments.length > 0 && (
                    <div className="bg-muted/10 border-t border-border/50 py-4 px-6 space-y-4">
                      {t.comments.slice(0, 3).map((c) => (
                        <div key={c.id} className="flex gap-4">
                          <img src={c.avatar || `https://ui-avatars.com/api/?name=${c.author}`} className="w-8 h-8 rounded-full border border-border flex-shrink-0" alt="" />
                          <div className="flex-1 bg-background border border-border/60 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-sm text-foreground">{c.author}</span>
                              <RoleBadge role={c.role} />
                              <span className="text-[10px] text-muted-foreground ml-auto font-bold uppercase tracking-tighter opacity-70">{c.timestamp}</span>
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed font-medium">{c.content}</p>
                          </div>
                        </div>
                      ))}
                      {t.comments.length > 3 && (
                        <button className="text-xs font-bold text-primary hover:underline ml-12">View {t.comments.length - 3} more replies</button>
                      )}
                    </div>
                  )}

                  {/* Reply Input */}
                  {user && (
                    <div className="px-6 py-4 bg-background border-t border-border/30 flex gap-4">
                       <img src={user.walletImage || `https://ui-avatars.com/api/?name=${user.username || user.walletName || 'User'}`} className="w-9 h-9 rounded-full border border-border" alt="" />
                        <div className="flex-1 relative group">
                          <input 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && user?.isPublic !== false && handlePostComment(t.id)}
                            placeholder={user?.isPublic === false ? "Private Mode active" : "Speak your mind..."}
                            disabled={user?.isPublic === false}
                            className={`w-full bg-muted/20 border border-border/80 rounded-2xl px-5 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${user?.isPublic === false ? 'cursor-not-allowed opacity-50' : ''}`}
                          />
                          <button 
                            onClick={() => handlePostComment(t.id)} 
                            disabled={user?.isPublic === false}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 text-primary p-2 opacity-100 sm:opacity-0 group-focus-within:opacity-100 transition-opacity ${user?.isPublic === false ? 'hidden' : ''}`}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Community Description Card */}
            <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
              <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                About Community
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-medium">
                Welcome to the heart of Telebey. A space for developers, travelers, and tech enthusiasts to connect, support, and grow the fastest connectivity network on Earth.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                  <div className="text-2xl font-bold text-foreground">
                    {totalMembers > 1000 ? `${(totalMembers / 1000).toFixed(1)}k` : totalMembers}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Members</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                  <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
                    {onlineMembers} <span className="block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Online</div>
                </div>
              </div>

              <Button className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/10">Browse Rules</Button>
            </div>

            {/* Trending Tags/Topics */}
            <div className="bg-card border border-border rounded-[2rem] p-6 shadow-sm">
              <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4 px-2">Trending Topics</h4>
              <div className="space-y-1">
                {['#eSIMSetup', '#5GUnlimited', '#TelebeyTravel', '#IdentityKey', '#WalletConnect'].map((tag) => (
                  <button key={tag} className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all font-bold text-sm flex items-center justify-between group">
                    {tag}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Support/Links Card */}
            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
              <div className="p-6 bg-muted/20 border-b border-border/50">
                <h4 className="font-bold flex items-center gap-2">
                   <Megaphone className="w-4 h-4 text-primary" />
                   Official Support
                </h4>
              </div>
              <div className="p-2">
                 <Link to="/plans" className="flex items-center justify-between p-4 hover:bg-muted rounded-2xl transition-all font-bold text-sm group">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                       <ShoppingBag className="w-4 h-4" />
                     </div>
                     Telebey Shop
                   </div>
                   <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                 </Link>
                 <Link to="/account" className="flex items-center justify-between p-4 hover:bg-muted rounded-2xl transition-all font-bold text-sm group">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500">
                       <User className="w-4 h-4" />
                     </div>
                     My Profile
                   </div>
                   <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                 </Link>
              </div>
            </div>

            {/* Community Footer */}
            <div className="px-6 space-y-2 opacity-40 text-[10px] font-bold uppercase tracking-tighter">
              <div className="flex gap-4">
                <Link to="/privacy" className="hover:underline">Privacy</Link>
                <Link to="/terms" className="hover:underline">Terms</Link>
                <Link to="/cookies" className="hover:underline">Cookies</Link>
              </div>
              <div>© 2026 Telebey Platform B.V.</div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
