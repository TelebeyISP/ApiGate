
import React from 'react';

interface VerificatieLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'icon-only';
}

const VerificatieLogo: React.FC<VerificatieLogoProps> = ({ 
  className = "",
  size = "md",
  variant = "default"
}) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16"
  };
  
  if (variant === "icon-only") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`text-verificatie-900 ${sizeClasses[size]}`}>
          <img 
            src="/telebey-logo.svg" 
            alt="Verificatie" 
            className={`${sizeClasses[size]} rounded-lg`}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center gap-2">
        <div className={`text-verificatie-900 ${sizeClasses[size]}`}>
          <img 
            src="/telebey-logo.svg" 
            alt="Verificatie" 
            className={`${sizeClasses[size]} rounded-lg`}
          />
        </div>
        <div className={`font-bold tracking-tight ${size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl'} text-verificatie-900`}>
          Verificatie
        </div>
      </div>
    </div>
  );
};

export default VerificatieLogo;
