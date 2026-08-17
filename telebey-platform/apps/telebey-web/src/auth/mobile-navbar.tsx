
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Globe } from 'lucide-react';
import { useLanguage } from '@/auth/contexts/LanguageContext';

const MobileNavbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array of user profile images with different background colors
  const profileImages = [
    '/telebey-logo.svg',
    '/telebey-logo.svg',
    '/telebey-logo.svg',
    '/telebey-logo.svg'
  ];

  // Rotate through the images every 0.5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % profileImages.length);
    }, 500); // 500ms = 0.5 seconds

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'nl' : 'en');
  };

  return (
    <div className="bg-white shadow-sm py-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center text-verificatie-900 hover:text-verificatie-800">
              <ChevronLeft className="h-5 w-5" />
              <span>{t('backToHome')}</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-white">
              <img 
                src={profileImages[currentImageIndex]} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            </div>
            <button 
              onClick={toggleLanguage} 
              className="ml-4 flex items-center text-sm text-verificatie-700 hover:text-verificatie-800 verificatie-transition"
            >
              <Globe className="h-4 w-4 mr-1" />
              {language === 'en' ? 'Nederlands' : 'English'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
