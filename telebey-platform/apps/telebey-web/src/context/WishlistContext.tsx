import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, setDoc 
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

export interface WishlistItem {
  id: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  image?: string;
}

interface WishlistContextValue {
  wishlist: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLocalWishlist = () => {
       const local = localStorage.getItem('local_wishlist');
       if (local) {
          try {
            setWishlist(JSON.parse(local));
          } catch (e) {
            setWishlist([]);
          }
       } else {
          setWishlist([]);
       }
    };

    if (!isAuthenticated || !user?.id) {
      loadLocalWishlist();
      setIsLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, 'users', user.id), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWishlist(data.wishlist || []);
      }
      setIsLoading(false);
    }, (error) => {
      console.warn("Firebase snapshot failed, falling back to local wishlist.", error);
      loadLocalWishlist();
      setIsLoading(false);
    });

    return () => unsub();
  }, [isAuthenticated, user?.id]);

  const addToWishlist = async (item: WishlistItem) => {
    if (!user?.id) {
       // Local fallback
       const newWishlist = [...wishlist, item];
       localStorage.setItem('local_wishlist', JSON.stringify(newWishlist));
       setWishlist(newWishlist);
       return;
    }
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        wishlist: arrayUnion(item)
      });
    } catch (e) {
      console.error("Error adding to wishlist:", e);
      // Local fallback on error
      const newWishlist = [...wishlist, item];
      localStorage.setItem('local_wishlist', JSON.stringify(newWishlist));
      setWishlist(newWishlist);
    }
  };

  const removeFromWishlist = async (id: string) => {
    if (!user?.id) {
       // Local fallback
       const newWishlist = wishlist.filter(i => i.id !== id);
       localStorage.setItem('local_wishlist', JSON.stringify(newWishlist));
       setWishlist(newWishlist);
       return;
    }
    try {
      const userRef = doc(db, 'users', user.id);
      const itemToRemove = wishlist.find(i => i.id === id);
      if (itemToRemove) {
        await updateDoc(userRef, {
          wishlist: arrayRemove(itemToRemove)
        });
      }
    } catch (e) {
      console.error("Error removing from wishlist:", e);
      // Local fallback on error
      const newWishlist = wishlist.filter(i => i.id !== id);
      localStorage.setItem('local_wishlist', JSON.stringify(newWishlist));
      setWishlist(newWishlist);
    }
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isLoading, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}
