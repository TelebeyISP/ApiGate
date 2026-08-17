import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Building2, Globe, ShieldCheck, 
  ArrowRight, BarChart3, Zap, 
  Plane, CreditCard, Star, ChevronRight
} from "lucide-react";

// Data for Flags Marquee (same as Home)
const marqueeRow1 = [
  { name: 'United States', flag: '🇺🇸' }, { name: 'United Kingdom', flag: '🇬🇧' }, { name: 'Japan', flag: '🇯🇵' },
  { name: 'UAE', flag: '🇦🇪' }, { name: 'Australia', flag: '🇦🇺' }, { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Canada', flag: '🇨🇦' }, { name: 'Netherlands', flag: '🇳🇱' }, { name: 'Thailand', flag: '🇹🇭' },
  { name: 'South Korea', flag: '🇰🇷' }, { name: 'Brazil', flag: '🇧🇷' }
];

const marqueeRow2 = [
  { name: 'India', flag: '🇮🇳' }, { name: 'Italy', flag: '🇮🇹' }, { name: 'Sri Lanka', flag: '🇱🇰' },
  { name: 'South Africa', flag: '🇿🇦' }, { name: 'China', flag: '🇨🇳' }, { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'Nepal', flag: '🇳🇵' }, { name: 'Spain', flag: '🇪🇸' }, { name: 'Malta', flag: '🇲🇹' },
  { name: 'France', flag: '🇫🇷' }, { name: 'Switzerland', flag: '🇨🇭' }
];

export function Business() {
  return (
    <main className="flex-1 flex flex-col">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 40s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>

      {/* ─── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen w-full flex flex-col justify-end overflow-hidden pb-8 pt-32 bg-transparent text-white">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-[1.02] transform origin-center"
          >
            <source src="/2740_Generation_Successful.mp4" type="video/mp4" />
          </video>
          {/* Subtle gradient to ensure text readability only */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 w-full">
          <div className="max-w-4xl space-y-6 md:space-y-8 mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-bold tracking-widest text-white uppercase drop-shadow-lg">
              <Building2 className="w-4 h-4 text-blue-400" /> Telebey Business
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight leading-[1.05]">
              Global Connectivity.
              <br />
              At Scale.
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed max-w-2xl text-shadow-sm">
              Empower your international workforce with Telebey Enterprise. 
              <br className="hidden md:block" />
              Comprehensive tools for managing thousands of eSIMs, monitoring 
              <br className="hidden md:block" />
              real-time data usage, and delivering seamless global reach.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-gray-200 text-base font-medium transition-all shadow-lg">
                Contact sales
              </Button>
              <Button size="lg" variant="ghost" className="h-14 px-6 hover:bg-white/20 text-base font-medium transition-all text-white hover:text-white rounded-full bg-white/5 backdrop-blur-sm border border-white/20">
                Enterprise solutions
              </Button>
            </div>
          </div>

          <div className="w-full h-[1px] bg-white/20 mb-6"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between text-[11px] font-semibold tracking-[0.15em] text-white/90 uppercase">
            <div className="mb-4 md:mb-0 drop-shadow-md">
              ADVANCED ENTERPRISE CONNECTIVITY
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Bento Box ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white relative z-20">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Top Left: Enterprise Dashboard */}
            <div className="md:col-span-8 bg-[#f8fbff] rounded-[32px] p-10 md:p-12 relative overflow-hidden group border border-[#e5f0ff]">
              <div className="flex justify-between items-start relative z-10">
                <h3 className="text-4xl md:text-[2.75rem] font-medium tracking-tight text-gray-900 leading-[1.1] max-w-md">
                  Unified fleet
                  <br/>
                  management
                </h3>
                <div className="w-14 h-14 rounded-full bg-[#1877f2] text-white flex items-center justify-center shrink-0 shadow-xl shadow-blue-500/20 transform group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-7 h-7" />
                </div>
              </div>
              <p className="text-[#64748b] text-[1.05rem] leading-relaxed mt-6 max-w-sm relative z-10">
                Monitor data usage in real-time across your entire organization. Provision, pause, and relocate plans instantly.
              </p>
              <div className="absolute right-0 bottom-[-10%] w-[55%] pt-[55%] z-0 translate-x-12 translate-y-12 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-700 ease-out">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#93c5fd] via-[#e0f2fe] to-white shadow-[-30px_-30px_60px_rgba(255,255,255,0.9)_inset,30px_30px_60px_rgba(0,0,0,0.05)_inset]">
                  <div className="absolute inset-0 opacity-20 rounded-full overflow-hidden" style={{ background: 'radial-gradient(circle at 30% 30%, transparent 20%, rgba(24, 119, 242, 0.4) 80%)' }}></div>
                </div>
              </div>
            </div>

            {/* Top Right: Security */}
            <div className="md:col-span-4 bg-[#f8fbff] rounded-[32px] p-10 md:p-12 flex flex-col justify-between border border-[#e5f0ff] group">
              <div className="flex justify-between items-start mb-16">
                <h3 className="text-4xl md:text-[2.75rem] font-medium tracking-tight text-gray-900 leading-[1.1]">
                  Corporate
                  <br/>
                  Security
                </h3>
                <div className="w-14 h-14 rounded-full bg-[#1877f2] text-white flex items-center justify-center shrink-0 shadow-xl shadow-blue-500/20 transform group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
              </div>
              <p className="text-[#64748b] text-[1.05rem] leading-relaxed">
                Dedicated Enterprise APN options and end-to-end encrypted global roaming for absolute data integrity.
              </p>
            </div>

            {/* Bottom Left: Global Support */}
            <div className="md:col-span-4 bg-[#f8fbff] rounded-[32px] p-10 md:p-12 flex flex-col justify-between border border-[#e5f0ff] group">
              <div className="flex justify-between items-start mb-16">
                <h3 className="text-4xl md:text-[2.75rem] font-medium tracking-tight text-gray-900 leading-[1.1]">
                  24/7 Priority
                  <br/>
                  Support
                </h3>
                <div className="w-14 h-14 rounded-full bg-[#1877f2] text-white flex items-center justify-center shrink-0 shadow-xl shadow-blue-500/20 transform group-hover:scale-105 transition-transform">
                  <Zap className="w-7 h-7 fill-current" />
                </div>
              </div>
              <p className="text-[#64748b] text-[1.05rem] leading-relaxed">
                Dedicated account managers and priority technical support to ensure your business never stays offline.
              </p>
            </div>

            {/* Bottom Right: Enterprise Billing */}
            <div className="md:col-span-8 bg-[#f8fbff] rounded-[32px] p-10 md:p-12 relative overflow-hidden group flex flex-col justify-between border border-[#e5f0ff]">
              <div className="flex justify-between items-start relative z-10 w-full mb-8">
                <h3 className="text-4xl md:text-[2.75rem] font-medium tracking-tight text-gray-900 leading-[1.1]">
                  Flexible Corporate
                  <br/>
                  Billing & API
                </h3>
                <div className="w-14 h-14 rounded-full bg-[#1877f2] text-white flex items-center justify-center shrink-0 shadow-xl shadow-blue-500/20 transform group-hover:scale-105 transition-transform">
                  <CreditCard className="w-7 h-7" />
                </div>
              </div>
              
              <div className="relative z-0 mt-8 min-h-[220px] w-full flex justify-end">
                <div className="w-[360px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(24,119,242,0.15)] p-8 transform rotate-[-4deg] translate-x-12 translate-y-12 group-hover:rotate-0 group-hover:translate-x-4 group-hover:translate-y-8 transition-all duration-700 ease-out absolute bottom-[-50px] right-[-20px] border border-blue-50/50 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-8">
                    <Star className="w-6 h-6 text-[#1877f2] fill-current" />
                    <span className="bg-[#1877f2] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Enterprise Plus</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-3 text-gray-900">Custom Fleet</h4>
                  <p className="text-[#64748b] text-sm mb-8 leading-relaxed max-w-[85%]">Bulk provisioning and API integration for full automation of your connectivity needs.</p>
                  <div className="flex items-end gap-1.5">
                    <span className="text-5xl font-black tracking-tighter text-gray-900">Talk</span>
                    <span className="text-gray-400 text-sm pb-1.5 font-medium">to an expert</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Supported Countries Marquee ──────────────────────────────────────── */}
      <section className="pb-32 pt-12 bg-white overflow-hidden flex flex-col gap-6 relative z-20 mask-image-fade">
        <style>{`
          .mask-image-fade {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
        `}</style>
        
        <div className="text-center mb-4">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#1877f2] uppercase mb-2">Global Network Availability</h4>
          <p className="text-2xl font-medium text-gray-900">Enterprise connectivity in 150+ countries</p>
        </div>

        {/* Row 1 */}
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee flex gap-6 pl-6">
            {[...marqueeRow1, ...marqueeRow1].map((country, idx) => (
              <div key={`r1-${idx}`} className="inline-flex items-center gap-3 px-6 py-3.5 rounded-[100px] bg-white border border-[#f1f5f9] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-8px_rgba(24, 119, 242, 0.15)] transition-all cursor-default transform hover:-translate-y-0.5">
                <span className="text-2xl rounded-full overflow-hidden w-6 h-6 flex items-center justify-center shadow-sm">{country.flag}</span>
                <span className="text-gray-600 font-medium text-[15px]">{country.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 (Reverse) */}
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee-reverse flex gap-6 pl-6 ml-16">
            {[...marqueeRow2, ...marqueeRow2].map((country, idx) => (
              <div key={`r2-${idx}`} className="inline-flex items-center gap-3 px-6 py-3.5 rounded-[100px] bg-white border border-[#f1f5f9] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-8px_rgba(24, 119, 242, 0.15)] transition-all cursor-default transform hover:-translate-y-0.5 opacity-90">
                <span className="text-2xl rounded-full overflow-hidden w-6 h-6 flex items-center justify-center shadow-sm">{country.flag}</span>
                <span className="text-gray-600 font-medium text-[15px]">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Call to Action ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white relative z-20">
        <div className="container mx-auto px-6">
          <div className="bg-[#1877f2] rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4">
                Scale your global <br /> workforce today.
              </h2>
              <p className="text-white/80 text-xl max-w-2xl mx-auto font-light">
                Join leading global enterprises building on Telebey Nett. Get a custom solution tailored to your operational scale.
              </p>
              <Button size="lg" className="h-16 px-12 rounded-full bg-white text-black hover:bg-gray-100 text-xl font-medium shadow-xl">
                Request a Custom Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

