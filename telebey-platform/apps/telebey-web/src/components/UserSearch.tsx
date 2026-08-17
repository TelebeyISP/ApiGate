import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { Search, Loader2, User as UserIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserResult {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  walletImage?: string;
  isPublic?: boolean;
}

export function UserSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const searchLower = searchTerm.toLowerCase();
        const q = query(
          usersRef, 
          where('usernameLowercase', '>=', searchLower),
          where('usernameLowercase', '<=', searchLower + '\uf8ff'),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...(doc.data() as Omit<UserResult, 'id'>) }))
          .filter(u => u.isPublic !== false); // Only show public profiles
        
        setResults(usersData);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectUser = (username: string) => {
    navigate(`/${username}`);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={searchRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        title="Search Users" 
        className="p-2 rounded-full hover:bg-muted transition-colors group"
      >
        <Search className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 md:w-96 bg-white border border-border rounded-2xl shadow-2xl p-4 z-[100] animate-in slide-in-from-top-2 duration-200">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search by username..." 
              className="w-full h-11 bg-white border border-border rounded-xl pl-10 pr-10 focus:ring-2 focus:ring-primary/50 outline-none text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : results.length > 0 ? (
              results.map((user) => (
                <div 
                  key={user.id}
                  onClick={() => handleSelectUser(user.username)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-border"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {user.walletImage ? (
                      <img src={user.walletImage} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">@{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.firstName} {user.lastName}</p>
                  </div>
                </div>
              ))
            ) : searchTerm.length >= 2 ? (
              <p className="text-center py-6 text-sm text-muted-foreground">No users found matching "{searchTerm}"</p>
            ) : (
              <p className="text-center py-6 text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-50">Type to search community</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
