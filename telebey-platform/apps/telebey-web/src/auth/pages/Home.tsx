
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/auth/contexts/LanguageContext';
import VerificatieLogo from '@/auth/components/verificatie-logo';

const Home = () => {
  const { t } = useLanguage();

  return (
    <main className="flex-1 container mx-auto py-12 px-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <VerificatieLogo size="lg" className="mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-blue-900 mb-6 font-display">
            {t('welcomeToVerificatie') || 'Welcome to Verificatie'}
          </h1>
        </div>
        
        <div className="mb-12 bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-xl max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {t('whatCanYouDo') || 'What can you do?'}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('introMessage') || 'Create your account here or log in. After logging in, you will be redirected to the dashboard or your service.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/auth" 
              className="inline-flex items-center justify-center py-3.5 px-8 rounded-full shadow-lg text-base font-bold text-white bg-blue-900 hover:bg-blue-800 transition-all hover:scale-105 active:scale-95"
            >
              {t('signIn') || 'Sign In'}
            </Link>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center py-3.5 px-8 rounded-full border-2 border-blue-900 text-base font-bold text-blue-900 bg-white hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
            >
              {t('signUp') || 'Sign Up'}
            </Link>
          </div>
        </div>
        
        <div className="mt-12 opacity-60 hover:opacity-100 transition-opacity">
          <Link to="/auth" className="text-blue-700 hover:text-blue-800 font-medium flex items-center justify-center gap-2">
            <span>{t('goToSdkTest') || 'Go to SDK Test Page'}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
