
import React from 'react';
import { useLanguage } from '@/auth/contexts/LanguageContext';

const DigiDButton = () => {
  const { t } = useLanguage();
  
  return (
    <button 
      className="w-full flex items-center gap-2 bg-[#FC5F00] text-white px-4 py-2 rounded hover:bg-[#e85600] transition-colors"
      onClick={() => console.log('DigiD login clicked')}
    >
      <div className="bg-black p-1 rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm">DigiD</span>
      </div>
      <span>{t('signInWithDigiD')}</span>
    </button>
  );
};

export default DigiDButton;
