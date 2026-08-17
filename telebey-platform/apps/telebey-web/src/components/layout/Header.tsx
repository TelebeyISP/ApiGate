import { Link } from "react-router-dom";
import { ChevronDown, ShoppingCart, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/hooks/use-shop";
import { useAuth } from "@/context/AuthContext";
import { UserSearch } from "../UserSearch";

export function Header() {
  const { cart } = useShop();
  const { user } = useAuth();
  const cartItemsCount = cart?.items.length || 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img src="/telebey-logo.svg" alt="Telebey" className="h-8 md:h-10 object-contain" />
          </Link>
        </div>

        {/* Center: Main Nav (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center justify-center space-x-8 font-medium text-sm lg:text-base">
          <Link to="/plans" className="hover:text-primary transition-colors">Plans</Link>
          <a href="#" className="hover:text-primary transition-colors">Network</a>
          <a href="#" className="flex items-center hover:text-primary transition-colors group">
            Shop <ChevronDown className="ml-1 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a href="#" className="hidden lg:block hover:text-primary transition-colors text-muted-foreground hover:text-primary transition-colors">Bring Your Phone</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link to="/account" title="Account" className="p-2 rounded-full hover:bg-muted transition-colors group sm:hidden">
             <User className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
          </Link>

          <Link to={user ? "/account" : "/auth"} className="hidden sm:inline-flex">
            <Button variant="ghost" className="font-bold flex items-center gap-2">
              {user?.walletImage ? (
                <img src={user.walletImage} alt="User" className="w-5 h-5 rounded-full" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">
                  {user ? (user.walletName ? user.walletName[0].toUpperCase() : user.email[0].toUpperCase()) : 'M'}
                </div>
              )}
              {user ? (user.walletName || user.firstName || user.email.split('@')[0]) : 'MytID'}
            </Button>
          </Link>
          
          <UserSearch />

          <Link to="/wishlist" title="Wishlist" className="p-2 rounded-full hover:bg-muted transition-colors group">
            <Heart className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
          </Link>

          <Link to="/cart" className="relative p-2 rounded-full hover:bg-muted transition-colors group">
            <ShoppingCart className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in duration-300">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
