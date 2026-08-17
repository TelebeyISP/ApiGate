
import React from 'react';
import { useLanguage } from '@/auth/contexts/LanguageContext';
import MobileNavbar from '@/auth/mobile-navbar';

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <MobileNavbar />
      
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-verificatie-900 mb-6">
            {t('termsOfService')}
          </h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              {t('termsOfServiceContent')}
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Verificatie service, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service. If you do not agree 
              to these terms, please do not use our service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h2>
            <p>
              Verificatie provides identity verification services to users. Our service allows 
              users to verify their identity using various methods including DigiD and EU Login.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h2>
            <p>
              To use certain features of our service, you may need to create an account. You are 
              responsible for maintaining the confidentiality of your account information and for 
              all activities that occur under your account.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Privacy</h2>
            <p>
              Your privacy is important to us. Please refer to our Privacy Policy for information 
              about how we collect, use, and disclose information about you.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of 
              significant changes to our terms by placing a prominent notice on our site. Your 
              continued use of the service after such modifications will constitute your 
              acknowledgment of the modified terms.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;
