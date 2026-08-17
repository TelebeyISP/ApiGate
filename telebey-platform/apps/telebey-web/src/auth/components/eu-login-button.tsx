
import React from 'react';
import { useLanguage } from '@/auth/contexts/LanguageContext';

const EULoginButton = () => {
  const { t } = useLanguage();
  
  return (
    <button 
      className="w-full flex items-center gap-2 bg-white border border-gray-300 text-blue-800 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
      onClick={() => console.log('EU Login clicked')}
    >
      <div className="bg-[#21798D] p-1 rounded flex items-center justify-center w-6 h-6">
        <span className="text-white">🌐</span>
      </div>
      <span>{t('signInWithEULogin')}</span>
    </button>
  );
};

export default EULoginButton;
