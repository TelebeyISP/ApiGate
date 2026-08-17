import { useNavigate } from "react-router-dom";
import { Check, ShieldCheck, Zap, Globe, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/hooks/use-shop";
import { useState } from "react";

const PLANS = [
  {
    id: "plan-starter",
    code: "starter_plan",
    variantCode: "STARTER_PLAN_VARIANT",
    name: "Starter Plan",
    price: 15.00,
    data: "5GB",
    description: "Perfect for light users who need high-speed connectivity.",
    features: ["5GB 5G priority data", "Unlimited talk & text", "eSIM included", "4G LTE fallback"],
    color: "blue"
  },
  {
    id: "plan-unlimited",
    code: "unlimited_pro",
    variantCode: "UNLIMITED_PRO_VARIANT",
    name: "Unlimited Pro",
    price: 45.00,
    data: "Unlimited",
    description: "The ultimate power plan for unlimited freedom.",
    features: ["Truly unlimited 5G data", "International roaming", "Priority engineering support", "Free hotspot"],
    color: "indigo",
    popular: true
  },
  {
    id: "plan-explorer",
    code: "explorer_plus",
    variantCode: "EXPLORER_PLUS_VARIANT",
    name: "Global Explorer",
    price: 30.00,
    data: "20GB",
    description: "Designed for travelers who need reliable global data.",
    features: ["20GB international data", "Multi-country support", "Instant eSIM swap", "Data rollover"],
    color: "teal"
  }
];

export function Plans() {
  const { addToCart } = useShop();
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAddToCart = async (plan: typeof PLANS[0]) => {
    setAddingId(plan.id);
    try {
      // In a real setup, variant codes are fetched from Sylius API
      await addToCart(plan.variantCode, 1);
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <main className="flex-1 flex flex-col py-16 bg-muted/10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight">
            Choose Your <span className="text-primary italic">Telebey</span> Plan
          </h1>
          <p className="text-lg text-muted-foreground">
            No contracts. No hidden fees. Just premium 5G connectivity tailored to your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-card border ${plan.popular ? 'border-primary ring-1 ring-primary/20' : 'border-border'} rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-xl transition-all hover:translate-y-[-4px] active:scale-[0.99] group`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 translate-y-[-10px] bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg z-10">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-primary/10 text-primary`}>
                  {plan.data === "Unlimited" ? <Zap className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                </div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{plan.name}</h2>
                <p className="text-muted-foreground text-sm h-10 overflow-hidden line-clamp-2 italic">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-foreground tracking-tight">${plan.price}</span>
                  <span className="text-muted-foreground font-medium text-sm">/mo</span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 p-0.5 rounded-full bg-green-500/10 text-green-500">
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => handleAddToCart(plan)}
                disabled={addingId === plan.id}
                className={`w-full h-12 font-bold text-lg rounded-xl shadow-md transition-all ${plan.popular ? 'bg-primary hover:bg-primary-dark shadow-primary/20' : 'bg-foreground hover:bg-foreground/90'}`}
              >
                {addingId === plan.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Select Plan"
                )}
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Secure Checkout
              </div>
            </div>
          ))}
        </div>

        {/* Global Features Banner */}
        <div className="mt-20 p-10 bg-primary/5 border border-primary/10 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <Globe className="w-8 h-8 text-primary opacity-50" />
            <span className="font-bold text-lg leading-tight">Global Connectivity in 140+ countries</span>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-primary opacity-50" />
            <span className="font-bold text-lg leading-tight">No credit check </span>
          </div>
          <div className="flex items-center gap-4">
            <Zap className="w-8 h-8 text-primary opacity-50" />
            <span className="font-bold text-lg leading-tight">Instant activation via eSIM</span>
          </div>
        </div>
      </div>
    </main>
  );
}
