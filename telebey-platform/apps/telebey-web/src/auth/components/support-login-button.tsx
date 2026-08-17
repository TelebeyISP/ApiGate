
import React from 'react';
import { useLanguage } from '@/auth/contexts/LanguageContext';
import { MessagesSquare } from 'lucide-react';

const SupportLoginButton = () => {
  const { t } = useLanguage();
  
  return (
    <button 
      className="w-full flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
      onClick={() => console.log('Support login clicked')}
    >
      <div className="bg-white p-1 rounded flex items-center justify-center w-6 h-6">
        <MessagesSquare className="text-green-600 h-4 w-4" />
      </div>
      <span>{t('chatWithSupport')}</span>
    </button>
  );
};

export default SupportLoginButton;
