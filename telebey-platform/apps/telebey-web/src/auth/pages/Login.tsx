
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/auth/contexts/LanguageContext';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import VerificatieLogo from '@/auth/components/verificatie-logo';
import MobileNavbar from '@/auth/mobile-navbar';
import DigiDButton from '@/auth/components/digid-button';
import EULoginButton from '@/auth/components/eu-login-button';

// Generate a random token of specified length
const generateRandomToken = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const params = useParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Generate and redirect to random token URL on initial load
  useEffect(() => {
    if (isInitialLoad && window.location.pathname === '/lservice/i/#/inloggen') {
      const token = generateRandomToken(8);
      console.log('Generated token:', token);
      // Store the token in sessionStorage to persist it during the session
      sessionStorage.setItem('verificatie_token', token);
      navigate(`/lservice/i/${token}`, { replace: true });
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, navigate]);

  // If we already have a token in the URL (from params), use it
  useEffect(() => {
    if (params.token) {
      console.log('Using token from URL params:', params.token);
      sessionStorage.setItem('verificatie_token', params.token);
    }
  }, [params.token]);

  return (
    <div className="min-h-screen bg-white">
      <MobileNavbar />
      
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-sm mx-auto">
          <div className="border rounded-lg p-6 bg-white">
            <div className="flex flex-col items-center">
              <VerificatieLogo size="md" className="mb-4" />
              <h3 className="text-lg font-medium mb-6">{t('signInToAccount')}</h3>
              
              <div className="space-y-4 w-full">
                <button 
                  className="w-full flex items-center gap-2 bg-verificatie-900 text-white px-4 py-2 rounded hover:bg-verificatie-800 transition-colors"
                  onClick={() => console.log('Verificatie App login clicked')}
                >
                  <img 
                    src="/telebey-logo.svg" 
                    alt="Verificatie" 
                    className="h-6 w-6 rounded-full"
                  />
                  <span>{t('signInWithVerificatieApp')}</span>
                </button>
                
                <DigiDButton />
                <EULoginButton />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
