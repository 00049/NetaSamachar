import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronLeft, CheckCircle2, Download, Share2, FileText, Calendar, 
  Landmark, BookOpen, AlertCircle, TrendingUp, Info, Scale, Target, ListChecks, Building2, Gavel
} from 'lucide-react';
import { BILLS } from '@/data/bills';

export default async function BillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const bill = BILLS.find(b => b.id === id);
  if (!bill) {
    notFound();
  }

  // Helper to format dates
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'in_committee': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'rejected':
      case 'withdrawn': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0E14] overflow-x-clip relative">
      {/* ===== PREMIUM HERO ===== */}
      <div className="relative w-full pt-[80px]">
        {/* Background Hero Image */}
        <div className="absolute top-0 left-0 right-0 h-[600px] z-0">
          {bill.imageUrl ? (
            <Image
              src={bill.imageUrl}
              alt={bill.title}
              fill
              className="object-cover object-center opacity-40"
              priority
            />
          ) : (
            <div className="w-full h-full bg-[#11131A]" />
          )}
          {/* Gradients to fade out the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-[40px] pt-[40px] pb-[60px] max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-[40px] justify-between">
          
          {/* Left Hero Content */}
          <div className="flex-1 max-w-[800px]">
            <Link href="/bills" className="inline-flex items-center gap-[6px] text-[#A1A1AA] hover:text-white transition-colors mb-[24px] text-[14px] font-medium">
              <ChevronLeft className="w-[16px] h-[16px]" /> Back to Bills
            </Link>

            <div className="flex items-center gap-[12px] mb-[20px]">
              {bill.type && (
                <div className="px-[12px] py-[4px] rounded-full border border-white/20 bg-white/5 text-[12px] font-bold text-white tracking-wider uppercase backdrop-blur-md">
                  {bill.type}
                </div>
              )}
              {bill.isGovernmentBill && (
                <div className="px-[12px] py-[4px] rounded-full border border-white/20 bg-white/5 text-[12px] font-bold text-white tracking-wider uppercase backdrop-blur-md">
                  GOVERNMENT BILL
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.2] tracking-tight mb-[16px] drop-shadow-lg">
              {bill.title}
            </h1>
            <p className="text-[18px] text-[#A1A1AA] font-medium mb-[32px]">
              Bill No. {bill.id.replace('b-hp-', '')} of {bill.introducedDate?.substring(0, 4)}
            </p>

            {/* Badges Row */}
            <div className="flex items-center gap-[12px] mb-[40px]">
              <div className={`flex items-center gap-[6px] px-[16px] py-[6px] rounded-full border ${getStatusColor(bill.status)} text-[13px] font-bold tracking-wide uppercase backdrop-blur-md`}>
                <CheckCircle2 className="w-[16px] h-[16px]" />
                {bill.status}
              </div>
              {bill.assentDate && (
                <div className="flex items-center gap-[6px] px-[16px] py-[6px] rounded-full border border-green-400/30 bg-green-400/10 text-green-400 text-[13px] font-bold tracking-wide uppercase backdrop-blur-md">
                  <CheckCircle2 className="w-[16px] h-[16px]" />
                  Assented
                </div>
              )}
              <div className="flex items-center gap-[6px] px-[16px] py-[6px] rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#60A5FA] text-[13px] font-bold tracking-wide backdrop-blur-md">
                <CheckCircle2 className="w-[16px] h-[16px]" />
                100% Complete
              </div>
            </div>

            {/* Dates Bar */}
            <div className="flex flex-wrap items-center gap-x-[40px] gap-y-[24px]">
              <div className="flex items-start gap-[12px]">
                <Calendar className="w-[20px] h-[20px] text-[var(--color-accent-positive)] mt-[2px]" />
                <div>
                  <div className="text-[13px] text-[#A1A1AA] font-medium mb-[4px]">Introduced On</div>
                  <div className="text-white font-bold">{formatDate(bill.introducedDate)}</div>
                </div>
              </div>
              <div className="flex items-start gap-[12px]">
                <Gavel className="w-[20px] h-[20px] text-[var(--color-accent-positive)] mt-[2px]" />
                <div>
                  <div className="text-[13px] text-[#A1A1AA] font-medium mb-[4px]">Passed On</div>
                  <div className="text-white font-bold">{formatDate(bill.passedDate)}</div>
                </div>
              </div>
              <div className="flex items-start gap-[12px]">
                <BookOpen className="w-[20px] h-[20px] text-[var(--color-accent-positive)] mt-[2px]" />
                <div>
                  <div className="text-[13px] text-[#A1A1AA] font-medium mb-[4px]">Governor Assent On</div>
                  <div className="text-white font-bold">{formatDate(bill.assentDate)}</div>
                </div>
              </div>
              <div className="flex items-start gap-[12px]">
                <FileText className="w-[20px] h-[20px] text-[var(--color-accent-positive)] mt-[2px]" />
                <div>
                  <div className="text-[13px] text-[#A1A1AA] font-medium mb-[4px]">Gazette Notification</div>
                  <div className="text-white font-bold">{formatDate(bill.gazetteDate)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Content: Floating Summary Card */}
          <div className="w-full xl:w-[400px] shrink-0 xl:-mt-[16px]">
            <div className="bg-[#11131A]/80 backdrop-blur-2xl border border-white/10 rounded-[24px] p-[32px] shadow-2xl">
              <h3 className="text-white font-bold text-[18px] mb-[16px]">Bill Summary</h3>
              <p className="text-[#A1A1AA] text-[15px] leading-relaxed mb-[32px]">
                {bill.summary}
              </p>
              
              <button className="w-full flex items-center justify-center gap-[8px] bg-[var(--color-accent-warning)] hover:bg-[#D97706]/90 text-black font-bold py-[14px] rounded-xl mb-[16px] transition-colors">
                <Download className="w-[18px] h-[18px]" />
                Download Bill PDF
              </button>
              
              <div className="grid grid-cols-2 gap-[16px]">
                <button className="flex items-center justify-center gap-[8px] bg-white/5 hover:bg-white/10 text-white font-semibold py-[12px] rounded-xl border border-white/10 transition-colors">
                  <Share2 className="w-[16px] h-[16px]" />
                  Share
                </button>
                <Link href={bill.gazetteUrl || '#'} className="flex items-center justify-center gap-[8px] bg-white/5 hover:bg-white/10 text-white font-semibold py-[12px] rounded-xl border border-white/10 transition-colors">
                  <FileText className="w-[16px] h-[16px]" />
                  Official Gazette
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ===== STICKY NAVBAR ===== */}
      <div className="sticky top-[80px] z-40 w-full border-b border-white/10 bg-[#0B0E14]/90 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-[40px] flex items-center overflow-x-auto hide-scrollbar">
          {['Overview', 'Timeline', 'Key Provisions', 'Clauses', 'Documents', 'Related Bills', 'Sources'].map((tab, i) => (
            <button key={tab} className={`whitespace-nowrap px-[16px] py-[20px] text-[14px] font-semibold border-b-2 transition-colors ${i === 0 ? 'text-[var(--color-accent-positive)] border-[var(--color-accent-positive)]' : 'text-[#A1A1AA] border-transparent hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ===== CONTENT GRID ===== */}
      <div className="max-w-[1400px] mx-auto px-[40px] py-[48px] grid grid-cols-1 lg:grid-cols-4 gap-[24px]">
        
        {/* ROW 1 */}
        {/* Legislative Journey (Span 2) */}
        <div className="lg:col-span-2 premium-card p-[32px]">
          <h2 className="text-white text-[20px] font-bold mb-[8px]">Legislative Journey</h2>
          <p className="text-[#A1A1AA] text-[14px] mb-[32px]">Track the progress of this bill through the legislative process.</p>
          
          <div className="relative flex justify-between">
            {/* Connecting Line */}
            <div className="absolute top-[24px] left-[24px] right-[24px] h-[3px] bg-[var(--color-accent-positive)] rounded-full -z-0" />
            
            {/* Steps */}
            {[
              { label: 'Introduced', date: bill.introducedDate, desc: `Bill introduced in ${bill.house}` },
              { label: 'Passed by Assembly', date: bill.passedDate, desc: `Bill passed by the ${bill.house}` },
              { label: 'Governor Assent', date: bill.assentDate, desc: 'Received assent from the Governor of Himachal Pradesh' },
              { label: 'Gazette Notification', date: bill.gazetteDate, desc: 'Published in the Official Gazette and came into force' }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col w-[120px]">
                <div className="w-[48px] h-[48px] rounded-full bg-[var(--color-accent-positive)] flex items-center justify-center mb-[16px] border-[4px] border-[#0B0E14] shadow-lg">
                  <CheckCircle2 className="w-[24px] h-[24px] text-black" />
                </div>
                <h4 className="text-white font-bold text-[14px] mb-[4px] leading-tight">{step.label}</h4>
                <div className="text-[#A1A1AA] text-[12px] font-medium mb-[6px]">{formatDate(step.date)}</div>
                <p className="text-[#52525B] text-[11px] leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Facts (Span 1) */}
        <div className="lg:col-span-1 premium-card p-[32px] flex flex-col justify-center">
          <h2 className="text-white text-[20px] font-bold mb-[24px]">Quick Facts</h2>
          <div className="flex flex-col gap-[16px]">
            {[
              { label: 'Bill Type', value: bill.type },
              { label: 'Government Bill', value: bill.isGovernmentBill ? 'Yes' : 'No' },
              { label: 'Legislative Session', value: bill.legislativeSession },
              { label: 'House', value: bill.house },
              { label: 'Minister In-Charge', value: bill.ministerInCharge },
              { label: 'Language', value: bill.language },
              { label: 'Current Status', value: <span className="text-[var(--color-accent-positive)]">{bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}</span> }
            ].map((fact, idx) => (
              <div key={idx} className="flex justify-between items-start border-b border-white/5 pb-[12px] last:border-0 last:pb-0">
                <span className="text-[#A1A1AA] text-[13px]">{fact.label}</span>
                <span className="text-white font-medium text-[13px] text-right ml-2">{fact.value || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Overview (Span 1) */}
        <div className="lg:col-span-1 premium-card p-[32px] flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-[32px]">
            <h2 className="text-white text-[20px] font-bold">Status Overview</h2>
            <div className="px-[8px] py-[4px] rounded-md bg-[var(--color-accent-positive)]/10 text-[var(--color-accent-positive)] text-[11px] font-bold tracking-widest uppercase">
              COMPLETED
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center mb-[24px]">
            {/* Fake Donut Chart */}
            <div className="relative w-[140px] h-[140px] rounded-full border-[12px] border-[var(--color-accent-positive)] flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <div className="text-center">
                <div className="text-white text-[32px] font-bold leading-none mb-[4px]">100%</div>
                <div className="text-[#A1A1AA] text-[12px]">Overall Progress</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[12px]">
            {[
              { label: 'Introduced', val: '1 (25%)' },
              { label: 'Passed', val: '1 (25%)' },
              { label: 'Assented', val: '1 (25%)' },
              { label: 'Gazette', val: '1 (25%)' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-[6px]">
                <div className="w-[6px] h-[6px] rounded-full bg-[var(--color-accent-positive)]" />
                <div>
                  <div className="text-white text-[12px] font-medium">{item.label}</div>
                  <div className="text-[#A1A1AA] text-[11px]">{item.val}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-[16px] text-[#52525B] text-[12px] text-center border-t border-white/5 pt-[16px]">
            4 of 4 milestones completed
          </div>
        </div>

        {/* ROW 2 */}
        {/* About This Bill (Span 2) */}
        <div className="lg:col-span-2 premium-card p-[32px] flex flex-col">
          <h2 className="text-white text-[20px] font-bold mb-[16px]">About This Bill</h2>
          <p className="text-[#A1A1AA] text-[15px] leading-relaxed mb-[32px]">
            {bill.title} proposes to levy a water cess on every unit of electricity generated from hydropower projects using water resources in the State. It aims to enhance state revenue, ensure fair compensation for natural resource utilization, and promote sustainable management of water resources.
          </p>
          <div className="mt-auto bg-[#D97706]/10 border border-[#D97706]/20 rounded-xl p-[20px]">
            <h4 className="text-[#FBBF24] font-bold text-[14px] mb-[8px]">In simple words</h4>
            <p className="text-[#FDE68A] text-[14px] leading-relaxed flex items-start gap-[8px]">
              A levy (water cess) will be charged on every unit of electricity generated from hydropower projects using water resources in Himachal Pradesh.
              <Info className="w-[16px] h-[16px] mt-1 shrink-0" />
            </p>
          </div>
        </div>

        {/* Objectives (Span 1) */}
        <div className="lg:col-span-1 premium-card p-[32px]">
          <h2 className="text-white text-[20px] font-bold mb-[24px]">Objectives of the Bill</h2>
          <div className="flex flex-col gap-[20px]">
            {bill.objectives?.map((obj, idx) => (
              <div key={idx} className="flex gap-[16px]">
                <div className="w-[32px] h-[32px] rounded-full bg-[var(--color-accent-positive)]/10 flex items-center justify-center shrink-0">
                  <Target className="w-[16px] h-[16px] text-[var(--color-accent-positive)]" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-[14px] mb-[4px]">{obj.title}</h4>
                  <p className="text-[#A1A1AA] text-[12px] leading-relaxed">{obj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Provisions (Span 1) */}
        <div className="lg:col-span-1 premium-card p-[32px]">
          <h2 className="text-white text-[20px] font-bold mb-[24px]">Key Provisions</h2>
          <div className="flex flex-col gap-[16px]">
            {bill.keyProvisions?.map((prov, idx) => (
              <div key={idx} className="flex gap-[12px] items-start group cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors">
                <div className="w-[28px] h-[28px] rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[var(--color-accent-positive)]/30 group-hover:text-[var(--color-accent-positive)] transition-colors">
                  <ListChecks className="w-[14px] h-[14px] text-[#A1A1AA] group-hover:text-[var(--color-accent-positive)] transition-colors" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-[13px] mb-[2px]">{prov.title}</h4>
                  <p className="text-[#A1A1AA] text-[12px] leading-snug mb-[4px]">{prov.description}</p>
                </div>
                <ChevronLeft className="w-[14px] h-[14px] text-[#52525B] group-hover:text-white rotate-180 transition-colors mt-[2px]" />
              </div>
            ))}
          </div>
          <button className="mt-[24px] text-[var(--color-accent-positive)] font-semibold text-[13px] hover:underline flex items-center gap-[4px]">
            View all provisions <ChevronLeft className="w-[14px] h-[14px] rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
}
