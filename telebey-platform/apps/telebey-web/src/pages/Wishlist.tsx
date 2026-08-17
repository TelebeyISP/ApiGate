import { useNavigate, Link } from "react-router-dom";
import { Trash2, Heart, ShoppingBag, ArrowLeft, Loader2, User as UserIcon, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useShop } from "@/hooks/use-shop";
import { useAuth } from "@/context/AuthContext";

export function Wishlist() {
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMoveToCart = async (item: any) => {
    // Note: addToCart expects a variantCode. We'll use the item.id or handle mapping.
    // For this implementation, we assume wishlist item ID is the product variant code.
    await addToCart(item.id, 1);
    await removeFromWishlist(item.id);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 bg-muted/10">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-medium">Loading your wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-24 bg-muted/10">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <Heart className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-4 flex items-center justify-center gap-3 flex-wrap">
            {user && (
              <span className="inline-flex items-center gap-2 bg-muted border border-border px-3 py-1 rounded-full text-foreground text-xl">
                {user.walletImage ? <img src={user.walletImage} className="w-7 h-7 rounded-full" alt="avatar" /> : <UserIcon className="w-6 h-6 text-primary" />}
                {user.username || user.walletName || user.firstName || user.email.split('@')[0]}
              </span>
            )}
            is feeling empty
          </h1>
          <p className="text-muted-foreground mb-10 text-lg">
            Save your favorite Telebey plans and devices here to keep track of what you love.
          </p>
          <Button 
            size="lg" 
            className="font-bold px-8 h-12 shadow-md shadow-primary/20"
            onClick={() => navigate("/")}
          >
            Explore Plans
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col py-16 bg-muted/10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-heading font-bold tracking-tight">My Wishlist</h1>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold ml-2">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Wishlist Items */}
          <div className="lg:col-span-2 space-y-6">
            {wishlist.map((item) => (
              <div 
                key={item.id} 
                className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-md transition-shadow group"
              >
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer capitalize">
                    {item.productName}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{item.variantName}</p>
                  <div className="mt-4 flex items-center text-lg font-bold text-foreground">
                    ${(item.unitPrice / 100).toFixed(2)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Button 
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 sm:flex-none h-10 px-6 font-bold bg-primary text-foreground hover:bg-primary/90 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Move to Cart
                  </Button>
                  
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar / Teaser */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm h-fit sticky top-28 overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                <Heart className="w-16 h-16" />
              </div>
              <h2 className="text-xl font-bold mb-6 relative z-10">Wishlist Summary</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 relative z-10">
                Found something you love? Telebey ensures your favorite connectivity tools are just one click away from being yours.
              </p>
              
              <div className="space-y-3 relative z-10">
                <Link to="/plans" className="block">
                  <Button className="w-full h-12 font-bold bg-foreground text-background hover:bg-foreground/90 transition-all">
                    Browse More Plans
                  </Button>
                </Link>
                <Link to="/cart" className="block">
                  <Button variant="outline" className="w-full h-12 font-bold border-border hover:bg-muted transition-all flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    View Shopping Cart
                  </Button>
                </Link>
              </div>

               <div className="mt-8 pt-8 border-t border-border flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Ready to buy?</h4>
                    <p className="text-xs text-muted-foreground">Free shipping on all physical SIMs.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
