
import React from 'react';
import { useLanguage } from '@/auth/contexts/LanguageContext';
import { CreditCard } from 'lucide-react';

const IDLoginButton = () => {
  const { t } = useLanguage();
  
  return (
    <button 
      className="w-full flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
      onClick={() => console.log('ID login clicked')}
    >
      <div className="bg-gray-900 p-1 rounded flex items-center justify-center w-6 h-6">
        <CreditCard className="text-white h-4 w-4" />
      </div>
      <span>{t('signInWithID')}</span>
    </button>
  );
};

export default IDLoginButton;
