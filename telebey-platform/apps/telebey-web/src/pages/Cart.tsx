import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/hooks/use-shop";
import { useAuth } from "@/context/AuthContext";

export function Cart() {
  const { cart, isLoading, removeFromCart, updateQuantity } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 bg-muted/10">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-medium">Loading your cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-24 bg-muted/10">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-4 flex items-center justify-center gap-3 flex-wrap">
            {user && (
              <span className="inline-flex items-center gap-2 bg-muted border border-border px-3 py-1 rounded-full text-foreground text-xl">
                {user.walletImage ? <img src={user.walletImage} className="w-7 h-7 rounded-full" alt="avatar" /> : <UserIcon className="w-6 h-6 text-primary" />}
                {user.username || user.walletName || user.firstName || user.email.split('@')[0]}
              </span>
            )}
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-10 text-lg">
            Looks like you haven't added any Telebey plans or devices to your cart yet.
          </p>
          <Button 
            size="lg" 
            className="font-bold px-8 h-12 shadow-md shadow-primary/20"
            onClick={() => navigate("/")}
          >
            Start Shopping
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
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Your Cart</h1>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold ml-2">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => (
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
                    <span className="text-sm font-normal text-muted-foreground ml-2">per unit</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-border rounded-lg h-10 overflow-hidden bg-background shadow-xs">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 hover:bg-muted transition-colors border-r border-border disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="w-12 text-center font-bold text-sm select-none">
                      {item.quantity}
                    </div>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 hover:bg-muted transition-colors border-l border-border"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price Total */}
                  <div className="text-right sm:min-w-[100px]">
                    <div className="text-xl font-extrabold text-foreground">
                      ${((item.unitPrice * item.quantity) / 100).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm sticky top-28 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShoppingBag className="w-16 h-16" />
              </div>
              
              <h2 className="text-xl font-bold mb-8 relative z-10">Order Summary</h2>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">${(cart.total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-500 font-bold uppercase text-xs tracking-wider bg-green-500/10 px-2 py-1 rounded">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span className="font-medium text-foreground">$0.00</span>
                </div>
                <div className="pt-4 border-t border-border mt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold">Total</span>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-primary">${(cart.total / 100).toFixed(2)}</div>
                      <span className="text-xs text-muted-foreground">{cart.currencyCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <Button 
                  className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout
                </Button>
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full h-12 font-bold border-border hover:bg-muted transition-colors">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3 grayscale opacity-40">
                <div className="w-10 h-6 bg-muted rounded"></div>
                <div className="w-10 h-6 bg-muted rounded"></div>
                <div className="w-10 h-6 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

