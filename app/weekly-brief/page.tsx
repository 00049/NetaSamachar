/* eslint-disable react/no-unescaped-entities */


export default function WeeklyBriefPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center px-8 text-center">
      <div className="section-label mb-6 justify-center">Weekly Intelligence</div>
      <h1 className="font-serif font-black text-5xl mb-6">The Weekly Brief</h1>
      <p className="text-[var(--text-secondary)] max-w-2xl text-lg text-balance">
        An unvarnished summary of the week's most critical political promises and verified claims. No rhetoric, just data.
      </p>
    </div>
  );
}
