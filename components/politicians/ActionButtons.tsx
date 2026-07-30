'use client';

import { useState } from 'react';
import { Share2, Bookmark, BookmarkCheck, AlertTriangle, X } from 'lucide-react';

export function ActionButtons() {
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <>
      <div className="flex items-center gap-[16px]">
        <button 
          onClick={handleShare}
          className="flex items-center gap-[8px] text-[15px] font-semibold text-white px-5 py-2.5 rounded-xl border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] transition-all shadow-sm hover:shadow-md relative"
        >
          <Share2 className="w-[18px] h-[18px]" /> Share
          {showShareToast && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-top-2">
              Copied to clipboard!
            </div>
          )}
        </button>
        <button 
          onClick={handleSave}
          className={`flex items-center gap-[8px] text-[15px] font-semibold px-5 py-2.5 rounded-xl border transition-all shadow-sm hover:shadow-md ${isSaved ? 'bg-white text-black border-white' : 'text-white border-white/20 bg-white/[0.05] hover:bg-white/[0.1]'}`}
        >
          {isSaved ? <BookmarkCheck className="w-[18px] h-[18px]" /> : <Bookmark className="w-[18px] h-[18px]" />} 
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button 
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-[8px] text-[15px] font-semibold text-white px-5 py-2.5 rounded-xl border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] transition-all shadow-sm hover:shadow-md"
        >
          <AlertTriangle className="w-[18px] h-[18px] text-red-500" /> Report Issue
        </button>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#18181B] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95">
            <button 
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Report an Issue</h2>
            </div>
            <p className="text-[#A1A1AA] text-sm mb-6">
              Notice incorrect data or broken functionality on this page? Please let us know so we can fix it.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Issue Type</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#3B82F6]">
                  <option>Data Inaccuracy</option>
                  <option>Broken Link</option>
                  <option>Formatting Error</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Details</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#3B82F6] min-h-[100px] resize-none"
                  placeholder="Describe the issue..."
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 rounded-lg text-white font-medium hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
