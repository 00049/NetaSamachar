import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { GlobalFooter } from '@/components/shared/GlobalFooter';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[var(--color-brand-primary)]/5 to-transparent blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-[120px] font-black text-white/5 tracking-tighter leading-none mb-4 select-none">
            404
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Page Not Found
          </h1>
          
          <p className="text-[#A1A1AA] text-[15px] max-w-[400px] mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Check the URL or return home to continue exploring.
          </p>
          
          <Link 
            href="/"
            className="h-[48px] px-8 bg-white text-[#090B12] text-[13px] font-bold uppercase tracking-widest flex items-center justify-center transition-all hover:bg-[#E4E4E7] rounded-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Return to Home
          </Link>
        </div>
      </div>
      
      <GlobalFooter />
    </main>
  );
}
