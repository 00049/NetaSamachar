import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-[80px]">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
        <h1 className="text-4xl font-bold text-white mt-8 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none text-[#A1A1AA]">
          <p className="mb-4">Last updated: August 2026</p>
          
          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            At Neta Samachar, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us (such as when you subscribe to our newsletter or report an issue), as well as automated analytics data to improve our service. 
            All data related to political figures displayed on our platform is sourced from public records and is not subject to this user privacy policy.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Use of Information</h2>
          <p className="mb-4">
            Your information is used solely to provide and improve the Neta Samachar platform, send requested communications, and maintain platform security. We do not sell your personal data to third parties.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy, please contact us via our issue reporting tools.
          </p>
        </div>
      </div>
    </div>
  );
}
