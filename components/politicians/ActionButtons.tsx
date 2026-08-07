'use client';

import { useState, useEffect } from 'react';
import { Share2, Bookmark, BookmarkCheck, AlertTriangle, X, Check, Loader2 } from 'lucide-react';

export function ActionButtons({ politicianId }: { politicianId?: string }) {
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showShareErrorToast, setShowShareErrorToast] = useState(false);
  
  // Report Issue state
  const [showReportModal, setShowReportModal] = useState(false);
  const [issueType, setIssueType] = useState('Data Inaccuracy');
  const [issueDetails, setIssueDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportError, setReportError] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);

  // Initialize saved state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && politicianId) {
      const savedList = JSON.parse(localStorage.getItem('saved_politicians') || '[]');
      setIsSaved(savedList.includes(politicianId));
    }
  }, [politicianId]);

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        setShowShareErrorToast(true);
        setTimeout(() => setShowShareErrorToast(false), 3000);
      }
    }
  };

  const handleSave = () => {
    if (!politicianId) return;
    
    setIsSaved(prev => {
      const next = !prev;
      const savedList = JSON.parse(localStorage.getItem('saved_politicians') || '[]');
      if (next) {
        localStorage.setItem('saved_politicians', JSON.stringify([...new Set([...savedList, politicianId])]));
      } else {
        localStorage.setItem('saved_politicians', JSON.stringify(savedList.filter((id: string) => id !== politicianId)));
      }
      return next;
    });
  };

  const submitReport = async () => {
    if (!issueDetails.trim()) {
      setReportError(true);
      return;
    }
    setReportError(false);
    setIsSubmittingReport(true);
    
    try {
      const res = await fetch('/api/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueType, details: issueDetails, politicianId }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      
      setShowReportModal(false);
      setIssueDetails('');
      setShowReportSuccess(true);
      setTimeout(() => setShowReportSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      setReportError(true);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-[16px]">
        <button
          onClick={handleShare}
          className="btn-ghost relative w-[100px] flex justify-center"
        >
          {showShareToast ? (
            <span className="flex items-center gap-[6px] animate-in fade-in zoom-in-95 duration-200">
              <Check className="w-[18px] h-[18px] text-[var(--color-accent-positive)]" /> 
              <span className="text-[var(--color-accent-positive)]">Copied</span>
            </span>
          ) : (
            <span className="flex items-center gap-[6px] animate-in fade-in zoom-in-95 duration-200">
              <Share2 className="w-[18px] h-[18px]" /> Share
            </span>
          )}
          {showShareToast && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-top-2">
              Copied to clipboard!
            </div>
          )}
          {showShareErrorToast && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-top-2">
              Copy failed. Link: {typeof window !== 'undefined' ? window.location.href : ''}
            </div>
          )}
        </button>

        <button
          onClick={handleSave}
          className={isSaved ? 'btn-primary' : 'btn-ghost'}
        >
          {isSaved ? <BookmarkCheck className="w-[18px] h-[18px]" /> : <Bookmark className="w-[18px] h-[18px]" />}
          {isSaved ? 'Saved' : 'Save'}
        </button>

        <button
          onClick={() => setShowReportModal(true)}
          className="btn-ghost relative"
        >
          {showReportSuccess ? (
            <span className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 text-emerald-400">
              <Check className="w-[18px] h-[18px]" /> Sent
            </span>
          ) : (
            <>
              <AlertTriangle className="w-[18px] h-[18px] text-red-400" /> Report Issue
            </>
          )}
        </button>
      </div>

      {showReportModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowReportModal(false);
          }}
        >
          {/* Focus Trap & Modal Content */}
          <div 
            className="bg-[var(--color-panel)] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 outline-none"
            tabIndex={-1}
            ref={(el) => el?.focus()}
          >
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Report an Issue</h2>
            </div>
            <p className="text-[#A1A1AA] text-sm mb-6">
              Notice incorrect data or broken functionality on this page? Please let us know so we can fix it.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Issue Type</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#3B82F6]"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  disabled={isSubmittingReport}
                >
                  <option>Data Inaccuracy</option>
                  <option>Broken Link</option>
                  <option>Formatting Error</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Details</label>
                <textarea
                  className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#3B82F6] min-h-[100px] resize-none ${
                    reportError && !issueDetails.trim() ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="Describe the issue..."
                  value={issueDetails}
                  onChange={(e) => {
                    setIssueDetails(e.target.value);
                    if (reportError) setReportError(false);
                  }}
                  disabled={isSubmittingReport}
                ></textarea>
                {reportError && !issueDetails.trim() && (
                  <p className="text-red-400 text-xs mt-1">Please provide details about the issue.</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="btn-ghost"
                disabled={isSubmittingReport}
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                className="btn-destructive flex items-center gap-2"
                disabled={isSubmittingReport}
              >
                {isSubmittingReport && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
