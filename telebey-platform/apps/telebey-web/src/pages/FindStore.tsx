import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Navigation, Phone, Clock, ChevronRight, Globe } from "lucide-react";

export function FindStore() {
  const stores = [
    {
      id: 1,
      name: "Telebey Flagship Store",
      address: "123 Innovation Drive, New York, NY 10001",
      phone: "+1 (212) 555-0198",
      hours: "9:00 AM - 8:00 PM"
    },
    {
      id: 2,
      name: "Telebey Downtown Hub",
      address: "456 Broadway Ave, Suite 200, Brooklyn, NY 11201",
      phone: "+1 (718) 555-0142",
      hours: "10:00 AM - 7:00 PM"
    },
    {
      id: 3,
      name: "Telebey Tech Point",
      address: "789 Queens Blvd, Queens, NY 11375",
      phone: "+1 (347) 555-0167",
      hours: "10:00 AM - 8:00 PM"
    }
  ];

  return (
    <main className="flex-1 bg-background pb-20">
      
      {/* Header */}
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight mb-4">Find a Store</h1>
            <p className="text-muted-foreground text-lg mb-8">Visit a Telebey expert for plan consultation, device assistance, and high-speed network testing.</p>
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Enter city or zip code" 
                className="w-full h-14 bg-muted/50 border border-border rounded-2xl pl-12 pr-4 focus:ring-2 focus:ring-primary/50 outline-none font-medium transition-all"
              />
              <Button className="absolute right-2 top-2 h-10 px-6 rounded-xl bg-primary text-foreground font-bold hover:bg-primary/90">Search</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List Section */}
          <div className="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {stores.map((store) => (
              <div key={store.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:border-primary/50 transition-all cursor-pointer group active:scale-[0.98]">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-foreground transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{store.name}</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{store.address}</p>
                
                <div className="space-y-3 pt-4 border-t border-border/50">
                   <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                      <Phone className="w-4 h-4 text-primary" />
                      {store.phone}
                   </div>
                   <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                      <Clock className="w-4 h-4 text-primary" />
                      {store.hours}
                   </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl font-bold border-border h-11 text-xs">Directions</Button>
                  <Button className="flex-1 rounded-xl font-extrabold bg-primary text-foreground h-11 text-xs">Store Info</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Map Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-[2.5rem] h-[700px] relative overflow-hidden shadow-2xl shadow-primary/5">
               {/* Simulated Map Background */}
               <div className="absolute inset-0 bg-[#f0f4f8] bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')] opacity-10 blur-[1px]"></div>
               
               {/* Map Grid Elements (UI Decoration) */}
               <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5 pointer-events-none">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-black/10"></div>
                  ))}
               </div>

               {/* Map Pins Container */}
               <div className="absolute inset-0 flex items-center justify-center p-20">
                  <div className="relative w-full h-full">
                     {/* Center Pin */}
                     <div className="absolute top-[30%] left-[25%] animate-bounce duration-[2000ms]">
                        <div className="relative">
                           <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-foreground shadow-2xl z-10 relative">
                              <MapPin className="w-5 h-5" />
                           </div>
                           <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap shadow-xl">
                              NYC Flagship
                           </div>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/20 rounded-full animate-ping" />
                        </div>
                     </div>

                     <div className="absolute top-[60%] left-[70%] opacity-60">
                        <div className="relative">
                           <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-xl">
                              <MapPin className="w-4 h-4" />
                           </div>
                        </div>
                     </div>

                     <div className="absolute top-[20%] left-[80%] opacity-60">
                        <div className="relative">
                           <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-xl">
                              <MapPin className="w-4 h-4" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Map Overlay Controls */}
               <div className="absolute bottom-8 right-8 flex flex-col gap-3">
                  <button className="w-12 h-12 bg-card border border-border rounded-2xl shadow-xl flex items-center justify-center hover:bg-muted transition-colors text-foreground">
                    <Navigation className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 bg-card border border-border rounded-2xl shadow-xl flex items-center justify-center hover:bg-muted transition-colors text-foreground font-bold text-lg">+</button>
                  <button className="w-12 h-12 bg-card border border-border rounded-2xl shadow-xl flex items-center justify-center hover:bg-muted transition-colors text-foreground font-bold text-lg">-</button>
               </div>

               <div className="absolute top-8 left-8 bg-card/80 backdrop-blur-md border border-border p-3 rounded-2xl flex items-center gap-3 shadow-xl">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Network Live in NYC Area</span>
               </div>
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}
