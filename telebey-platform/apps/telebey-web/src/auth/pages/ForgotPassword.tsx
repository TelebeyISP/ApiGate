
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/auth/contexts/LanguageContext';
import VerificatieLogo from '@/auth/components/verificatie-logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitted(true);
    toast({
      title: "Reset link sent",
      description: "If an account exists with this email, you will receive a password reset link.",
    });
    
    console.log('Password reset requested for:', email);
  };

  return (
    <main className="flex-1 container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <VerificatieLogo size="md" className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-blue-900">
            {t('resetPassword')}
          </h1>
        </div>
        
        {!submitted ? (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <p className="text-gray-600 mb-6 text-center">
              {t('enterEmailForReset')}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('emailAddress')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-gray-300 py-2.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-600 sm:text-sm pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 transition-colors"
                >
                  {t('sendResetLink')}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100">
            <div className="bg-blue-50 p-4 rounded-full mx-auto mb-6 inline-block">
              <Mail className="w-8 h-8 text-blue-700" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t('checkYourInbox')}</h2>
            <p className="text-gray-600 mb-6">
              {t('resetLinkSentTo')} <span className="font-medium">{email}</span>
            </p>
            <div className="text-sm text-gray-500 mb-6">
              {t('didntReceiveEmail')}
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="text-blue-700 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <ArrowLeft size={16} />
              {t('tryDifferentEmail')}
            </button>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <Link to="/auth" className="font-medium text-blue-700 hover:text-blue-800 flex items-center justify-center gap-1 transition-colors">
              <ArrowLeft size={16} />
              {t('backToLogin')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
