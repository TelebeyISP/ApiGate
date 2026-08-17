
import React from 'react';
import { useLanguage } from '@/auth/contexts/LanguageContext';
import MobileNavbar from '@/auth/mobile-navbar';

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <MobileNavbar />
      
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-verificatie-900 mb-6">
            {t('privacyPolicy')}
          </h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              {t('privacyPolicyContent')}
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
            <p>
              We collect several types of information from and about users of our service, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Personal identifiers such as name and email address</li>
              <li>Authentication data necessary for identity verification</li>
              <li>Usage data about how you interact with our service</li>
              <li>Device information including IP address and browser type</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete identity verification transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service providers who help us operate our business</li>
              <li>Legal authorities when required by law</li>
              <li>Other parties with your consent</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your 
              personal information against unauthorized access, loss, or alteration.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new privacy policy on this page and updating the effective date.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
