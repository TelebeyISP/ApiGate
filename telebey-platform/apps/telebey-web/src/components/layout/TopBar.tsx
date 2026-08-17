import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";

export function TopBar() {
  return (
    <div className="w-full bg-foreground text-background">
      <div className="container mx-auto px-4 h-10 flex items-center justify-between text-xs md:text-sm font-medium uppercase tracking-wide">
        {/* Left Side Links */}
        <nav className="flex items-center space-x-4 md:space-x-6">
          <Link to="/cart" className="hover:opacity-70 transition-opacity">Shop</Link>
          <Link to="/homenet" className="hover:opacity-70 transition-opacity">My HomeNet</Link>
          
          <Link to="/business" className="hidden lg:block hover:opacity-70 transition-opacity">Business</Link>
          
          <Link to="/find-store" className="hidden xl:block hover:opacity-70 transition-opacity">Find a Store</Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link to="/mail" className="flex items-center space-x-1 hover:opacity-70 transition-opacity" aria-label="Mail">
            <Mail className="h-4 w-4" />
          </Link>
          <Link to="/community" className="flex items-center space-x-1 hover:opacity-70 transition-opacity" aria-label="Chat">
            <MessageCircle className="h-4 w-4" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-2 border-l border-background/20 pl-4">
            <button className="hover:opacity-70 transition-opacity font-bold">En</button>
            <span className="opacity-50">|</span>
            <button className="hover:opacity-70 transition-opacity">Es</button>
          </div>
        </div>
      </div>
    </div>
  );
}
