import { useState } from "react";
import { ShoppingCart, Heart, Search, Filter, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/hooks/use-shop";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

// Mock Data
const categories = ["All", "Smartphones", "Accessories", "Plans", "Routers"];

const products = [
  {
    id: "prod_1",
    name: "Telebey Phone Z1",
    description: "The ultimate 5G experience with seamless global roaming built-in.",
    price: 89900,
    category: "Smartphones",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "prod_2",
    name: "Global Data SIM - 50GB",
    description: "Prepaid 50GB data plan active in over 150 countries. No expiration.",
    price: 4500,
    category: "Plans",
    rating: 4.9,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "prod_3",
    name: "Telebey Air Router",
    description: "Portable 5G hotspot for enterprise professionals on the go.",
    price: 19900,
    category: "Routers",
    rating: 4.6,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1544473244-f6895e691d53?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "prod_4",
    name: "Magnetic Wireless Charger",
    description: "Fast-charging stand compatible with all modern Telebey devices.",
    price: 3900,
    category: "Accessories",
    rating: 4.5,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "prod_5",
    name: "Telebey Pro Earbuds",
    description: "Noise-cancelling wireless audio perfect for remote meetings.",
    price: 14900,
    category: "Accessories",
    rating: 4.7,
    reviews: 345,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "prod_6",
    name: "Unlimited Domestic Plan",
    description: "Unlimited talk, text, and 5G data within your home country.",
    price: 6000,
    category: "Plans",
    rating: 4.4,
    reviews: 1020,
    image: "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=800&auto=format&fit=crop&q=60"
  }
];

export function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, cart } = useShop();
  const { addToWishlist, wishlist } = useWishlist();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = async (product: any) => {
    try {
      // The useShop context expects a variant code, so we use the product ID for now.
      await addToCart(product.id, 1);
      
      // Visual feedback
      setAddedItems(prev => ({ ...prev, [product.id]: true }));
      toast.success(`${product.name} added to cart! Check your cart page.`);
      
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [product.id]: false }));
      }, 2000);
    } catch (err) {
      toast.error(`Failed to add ${product.name} to cart.`);
    }
  };

  const handleToggleWishlist = async (product: any) => {
    try {
      const inWishlist = wishlist?.some(item => item.id === product.id);
      if (!inWishlist) {
         await addToWishlist({
           id: product.id,
           productName: product.name,
           variantName: "Standard",
           unitPrice: product.price,
           image: product.image
         });
         toast.success(`${product.name} saved to wishlist!`);
      } else {
         toast.info(`${product.name} is already in your wishlist.`);
      }
    } catch (error) {
      toast.error("You must be logged in to use the wishlist.");
    }
  };

  return (
    <main className="flex-1 bg-background pb-24">
      
      {/* ─── Hero / Header ───────────────────────────────────────────── */}
      <section className="bg-card border-b border-border py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl flex flex-col items-start gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
              Telebey Store
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight text-foreground">
              Hardware & Plans.
            </h1>
            <p className="text-xl text-muted-foreground mt-2 max-w-xl leading-relaxed">
              Explore the latest 5G devices, essential accessories, and premium global connectivity plans tailored for you.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ─── Sidebar Filters ────────────────────────────────────────── */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" /> Categories
              </h3>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap text-left px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
                      activeCategory === category 
                        ? "bg-primary text-primary-foreground border-primary shadow-md" 
                        : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:bg-muted"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="hidden lg:block p-6 rounded-2xl bg-[#1877f2] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <h4 className="text-xl font-bold mb-2">Need an eSIM now?</h4>
              <p className="text-sm text-white/80 mb-6">Instantly activate a global data plan without physical shipping.</p>
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold">
                Browse eSIMs
              </Button>
            </div>
          </aside>

          {/* ─── Main Content ─────────────────────────────────────────── */}
          <div className="flex-1 space-y-8">
            
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center sm:h-14">
              <div className="relative w-full sm:max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 bg-card border border-border rounded-2xl pl-12 pr-4 focus:ring-2 focus:ring-primary/50 outline-none font-medium transition-all shadow-sm"
                />
              </div>
              <div className="text-sm font-bold text-muted-foreground whitespace-nowrap">
                Showing {filteredProducts.length} Results
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const inCart = cart?.items.some(i => i.id === product.id);
                  const isJustAdded = addedItems[product.id];
                  const inWishlist = wishlist?.some(i => i.id === product.id);

                  return (
                    <div key={product.id} className="group flex flex-col bg-card rounded-[2rem] border border-border overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-300">
                      
                      {/* Image Area */}
                      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <button 
                            onClick={() => handleToggleWishlist(product)}
                            className={`p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all hover:scale-110 ${
                              inWishlist 
                                ? "bg-red-500 text-white" 
                                : "bg-white/80 text-gray-700 hover:bg-white"
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-black text-xs font-bold rounded-full shadow-sm">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold">{product.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                          {product.description}
                        </p>
                        
                        <div className="flex items-end justify-between mt-auto">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Price</span>
                            <span className="text-2xl font-extrabold text-foreground">
                              ${(product.price / 100).toFixed(2)}
                            </span>
                          </div>
                          
                          <Button 
                            onClick={() => handleAddToCart(product)}
                            className={`h-12 w-12 rounded-2xl p-0 transition-all shadow-md group-hover:shadow-xl group-hover:w-32 group-hover:px-4 flex justify-center items-center gap-2 overflow-hidden ${
                              isJustAdded ? "bg-green-500 text-white hover:bg-green-600" : "bg-foreground text-background"
                            }`}
                          >
                            {isJustAdded ? (
                              <Check className="w-5 h-5 shrink-0" />
                            ) : (
                              <ShoppingCart className="w-5 h-5 shrink-0" />
                            )}
                            <span className="hidden group-hover:inline-block font-bold text-sm whitespace-nowrap ml-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                              {isJustAdded ? "Added" : "Add to Cart"}
                            </span>
                          </Button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-[2rem] p-16 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn't find anything matching "{searchQuery}" in {activeCategory}. Try adjusting your filters.
                </p>
                <Button 
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  variant="outline"
                  className="mt-8 font-bold rounded-xl h-12 px-6"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
