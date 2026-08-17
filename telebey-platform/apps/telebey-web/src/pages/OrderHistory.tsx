import { Link } from "react-router-dom";
import { ArrowLeft, History } from "lucide-react";

export function OrderHistory() {
  return (
    <main className="flex-1 container mx-auto py-12 px-4 max-w-4xl">
      <Link to="/account" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Account
      </Link>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <History className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-8 text-center shadow-sm">
        <h2 className="text-xl font-medium mb-2">No Past Orders</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You haven't placed any orders for devices or eSIM plans yet. Once you do, they will appear here.
        </p>
        <Link to="/plans" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
          Shop Now
        </Link>
      </div>
    </main>
  );
}
