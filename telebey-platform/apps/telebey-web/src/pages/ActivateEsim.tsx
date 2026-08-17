import { Button } from "@/components/ui/button";

export function ActivateEsim() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-24 bg-background">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h1 className="text-4xl font-heading font-bold mb-6">Activate Your eSIM</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Ready to join the Telebey network? Enter your 20-digit ICCID or just scan the QR code we emailed you.
        </p>
        
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <div className="mb-6 text-left">
            <label className="block text-sm font-bold mb-2">Activation Code or ICCID</label>
            <input 
              type="text" 
              placeholder="e.g. 89101234567890123456" 
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button size="lg" className="w-full font-bold">
            Activate Now
          </Button>
        </div>
      </div>
    </main>
  );
}
