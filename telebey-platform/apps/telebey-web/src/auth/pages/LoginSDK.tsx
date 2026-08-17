
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/auth/contexts/LanguageContext';
import { Globe, Smartphone, Info, HelpCircle, Mail, UserPlus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { EmailLoginForm } from '@/auth/components/EmailLoginForm';
import { RegisterForm } from '@/auth/components/RegisterForm';
import QRCode from 'react-qr-code';
import { useAuth } from '@/context/AuthContext';
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';

// 1. Get WalletConnect projectId
const projectId = '4e48d485a9b9b9f53882a650f6af2ff7';

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
};

// 3. Create a metadata object
const metadata = {
  name: 'MytID',
  description: 'MytID Web3 Login',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://mytid.local',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true,
});

// Generate a random token of specified length
const generateRandomToken = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Function to check if a specific app can be opened
const canOpenApp = (uri: string, callback: (opened: boolean) => void) => {
  const timeout = setTimeout(() => {
    callback(false);
  }, 2000);

  window.location.href = uri;
  
  window.addEventListener('blur', () => {
    clearTimeout(timeout);
    callback(true);
  });
};

const LoginSDK = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const params = useParams();
  const isInitialLoad = useRef(true);
  const [sessionToken, setSessionToken] = useState<string>(() => {
    return params.token || sessionStorage.getItem('verificatie_token') || "";
  });
  const [showMobileView, setShowMobileView] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [altLoginDialogOpen, setAltLoginDialogOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [altLoginView, setAltLoginView] = useState<'options' | 'email' | 'register' | 'onboarding'>('options');
  
  // Web3Modal hooks
  const { open: openWeb3Modal } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { loginWithWallet } = useAuth();

  // Onboarding state
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingAddress, setOnboardingAddress] = useState('');

  // Handle Wallet Connection
  useEffect(() => {
    if (isConnected && address && altLoginView !== 'onboarding') {
      // Here we assume if they connect, they are new and need to onboard for this demo.
      // In a real app, we'd check if `address` exists in DB.
      setAltLoginView('onboarding');
      setAltLoginDialogOpen(true);
    }
  }, [isConnected, address, altLoginView]);

  const handleWalletOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address && onboardingName) {
      // Mock an avatar using dicebear or similar
      const mockImage = `https://api.dicebear.com/7.x/avatars/svg?seed=${address}`;
      loginWithWallet(address, onboardingName, mockImage);
      setAltLoginDialogOpen(false);
    }
  };

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );
      setIsMobileDevice(isMobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Toggle language function
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'nl' : 'en');
  };

  // Generate and redirect to random token URL on initial load
  useEffect(() => {
    if (isInitialLoad.current && window.location.pathname === '/auth') {
      const token = generateRandomToken(8);
      sessionStorage.setItem('verificatie_token', token);
      isInitialLoad.current = false;
      navigate(`/auth/lservice/i/${token}`, { replace: true });
    }
  }, [navigate]);

  // Sync session token if params change
  useEffect(() => {
    if (params.token && params.token !== sessionToken) {
      sessionStorage.setItem('verificatie_token', params.token);
      setSessionToken(params.token);
    }
  }, [params.token, sessionToken]);

  const handleVerificatieAppLogin = () => {
    if (isMobileDevice) {
      const verificatieAppUri = `verificatie://login?token=${sessionToken}`;
      
      canOpenApp(verificatieAppUri, (appOpened) => {
        if (!appOpened) {
          setAltLoginDialogOpen(true);
        }
      });
    } else {
      setQrDialogOpen(true);
    }
  };

  const handleAlternativeLogin = () => {
    setAltLoginView('options');
    setAltLoginDialogOpen(true);
  };

  return (
    <>
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center shadow-lg border-2 border-blue-800 ring-4 ring-blue-50">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-blue-900">MytID</h1>
            </div>
            <button 
              onClick={toggleLanguage} 
              className="flex items-center text-sm text-blue-700 hover:text-blue-800"
            >
              <Globe className="h-4 w-4 mr-1" />
              {language === 'en' ? 'English' : 'Nederlands'}
            </button>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'nl' ? 'Authenticatie Opties' : 'Authentication Options'}:
            </h2>
            
            <div className="space-y-4">
              <button 
                className="bg-blue-900 text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-blue-800 transition-colors w-full sm:w-auto"
                onClick={handleVerificatieAppLogin}
              >
                <img 
                  src="/telebey-logo.svg" 
                  alt="Verificatie" 
                  className="h-6 w-6 object-contain brightness-0 invert" 
                />
                <span>{t('verificatieAppLogin')}</span>
              </button>
              
              <button 
                className="bg-gray-100 text-blue-900 px-6 py-3 rounded flex items-center gap-2 hover:bg-gray-200 transition-colors border border-gray-300 w-full sm:w-auto"
                onClick={handleAlternativeLogin}
              >
                <HelpCircle className="h-5 w-5" />
                <span>{t('alternativeLoginMethods')}</span>
              </button>
              
              <div className="text-sm text-gray-600 flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p>
                  {language === 'nl' 
                    ? `Uw sessie token is: ${sessionToken}. Deze token is gekoppeld aan uw IP-adres voor beveiligingsdoeleinden.` 
                    : `Your session token is: ${sessionToken}. This token is linked to your IP address for security purposes.`}
                </p>
              </div>
            </div>
            
            {!isMobileDevice && (
              <button
                className="text-blue-600 mt-6 hover:text-blue-800 transition-colors flex items-center gap-1"
                onClick={() => setShowMobileView(!showMobileView)}
              >
                <Smartphone className="h-4 w-4" />
                {showMobileView ? 
                  (language === 'nl' ? 'Verberg Mobiele Weergave' : 'Hide Mobile View') : 
                  (language === 'nl' ? 'Toon Mobiele Weergave' : 'Show Mobile View')
                }
              </button>
            )}
          </div>
          
          {showMobileView && (
            <div className="mb-10 border border-gray-200 rounded-xl overflow-hidden shadow-md max-w-xs mx-auto">
              <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b">
                <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto"></div>
              </div>
              <div className="p-4 bg-white">
                <div className="h-96 flex flex-col items-center justify-center">
                   <img 
                    src="/telebey-logo.svg" 
                    alt="Verificatie" 
                    className="w-16 h-16 mb-4"
                  />
                  <h3 className="text-lg font-semibold text-center mb-2">
                    {language === 'nl' ? 'Verificatie App' : 'Verificatie App'}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    {t('scanQrCode')}
                  </p>
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center p-2">
                    {sessionToken && (
                      <QRCode
                        value={`verificatie://login?token=${sessionToken}`}
                        size={176}
                        level="H"
                        fgColor="#231B6E"
                        bgColor="#ffffff"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{language === 'nl' ? 'Links' : 'Links'}:</h2>
            <div className="flex gap-6">
              <Link to="/terms" className="text-blue-600 hover:text-blue-800 transition-colors">
                {t('termsOfService')}
              </Link>
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800 transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link to="/support" className="text-blue-600 hover:text-blue-800 transition-colors">
                {language === 'nl' ? 'Support' : 'Support'}
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Dialog for Verificatie App login */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t('scanQrCode')}
            </DialogTitle>
          </DialogHeader>
          {isMobileDevice ? (
            <div className="flex flex-col space-y-4 p-6">
              <p className="text-center text-sm text-gray-500 mb-4">
                {language === 'nl' 
                  ? 'Kies een van de volgende inlogmethoden:' 
                  : 'Choose one of the following login methods:'}
              </p>
              <div className="space-y-4">
                <button
                  className="w-full flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
                  onClick={() => {
                    setQrDialogOpen(false);
                    const verificatieAppUri = `verificatie://login?token=${sessionToken}`;
                    window.location.href = verificatieAppUri;
                  }}
                >
                  <img 
                    src="/telebey-logo.svg" 
                    alt="Verificatie" 
                    className="h-6 w-6 object-contain brightness-0 invert"
                  />
                  <span>{t('openVerificatieApp')}</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors bg-white text-black">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center font-bold text-red-600">D</div>
                    <span className="font-semibold">{t('signInWithDigiD')}</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors bg-white text-black">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-600">EU</div>
                    <span className="font-semibold">{t('signInWithEULogin')}</span>
                  </div>
                </button>
              </div>
              <button
                onClick={() => {
                  setQrDialogOpen(false);
                  setAltLoginDialogOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm mt-4 w-full text-center"
              >
                {t('showMoreLoginOptions')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center p-6">
              <div className="w-64 h-64 bg-white p-3 border border-gray-200 rounded-md mb-4 flex items-center justify-center">
                {sessionToken && (
                  <QRCode
                    value={`verificatie://login?token=${sessionToken}`}
                    size={230}
                    level="H"
                    fgColor="#231B6E"
                    bgColor="#ffffff"
                  />
                )}
              </div>
              <p className="text-center text-sm text-gray-500 mb-4">
                {language === 'nl' 
                  ? 'Open uw Verificatie App en scan deze QR-code om in te loggen.' 
                  : 'Open your Verificatie App and scan this QR code to log in.'}
              </p>
              <button
                onClick={() => {
                  setQrDialogOpen(false);
                  setAltLoginDialogOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {t('qrCodeNotWorking')}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Alternative Login Methods Dialog */}
      <Dialog open={altLoginDialogOpen} onOpenChange={setAltLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {altLoginView === 'options' ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {t('alternativeLoginMethods')}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4 p-6">
                <p className="text-center text-sm text-gray-500 mb-4">
                  {language === 'nl' 
                    ? 'Kies een van de volgende inlogmethoden:' 
                    : 'Choose one of the following login methods:'}
                </p>
                <div className="space-y-4">
                  {isMobileDevice && (
                    <button
                      className="w-full flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
                      onClick={() => {
                        setAltLoginDialogOpen(false);
                        const verificatieAppUri = `verificatie://login?token=${sessionToken}`;
                        window.location.href = verificatieAppUri;
                      }}
                    >
                      <img 
                        src="/telebey-logo.svg" 
                        alt="Verificatie" 
                        className="h-6 w-6 object-contain brightness-0 invert"
                      />
                      <span>{t('openVerificatieApp')}</span>
                    </button>
                  )}
                  {/* These buttons are very simple and don't require heavy logic, 
                      but for consistency we use the inline approach or import if strictly needed. 
                      Since I moved them to standard UI elements in the plan, I will keep them as components or inline them.
                      Actually, I removed the imports above, so I'll render the buttons directly or re-import.
                      Let's re-import them to keep it clean.
                  */}
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center font-bold text-red-600">D</div>
                        <span className="font-semibold">{t('signInWithDigiD')}</span>
                      </div>
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-600">EU</div>
                        <span className="font-semibold">{t('signInWithEULogin')}</span>
                      </div>
                    </button>
                    <button 
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                      onClick={() => openWeb3Modal()}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-indigo-600" />
                        </div>
                        <span className="font-semibold text-left">WalletConnect</span>
                      </div>
                    </button>
                    <button 
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                      onClick={() => setAltLoginView('email')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-gray-600" />
                        </div>
                        <span className="font-semibold">{t('signInWithEmail')}</span>
                      </div>
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500 mb-3">
                      Don't have an account? Create one
                    </p>
                    <button
                      className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-900 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors font-semibold"
                      onClick={() => setAltLoginView('register')}
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>{t('signUp')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : altLoginView === 'email' ? (
            <div className="p-6">
              <button 
                onClick={() => setAltLoginView('options')}
                className="text-sm text-blue-600 mb-4 hover:underline flex items-center gap-1"
              >
                ← Back to options
              </button>
              <EmailLoginForm 
                onSuccess={() => navigate('/account')}
                onRegister={() => setAltLoginView('register')}
              />
            </div>
          ) : altLoginView === 'register' ? (
            <div className="p-6">
              <button 
                onClick={() => setAltLoginView('options')}
                className="text-sm text-blue-600 mb-4 hover:underline flex items-center gap-1"
              >
                ← Back to options
              </button>
              <RegisterForm 
                onSuccess={() => navigate('/account')}
                onLogin={() => setAltLoginView('email')}
              />
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Almost there!</h3>
              <p className="text-sm text-gray-500 mb-6">
                Please complete your profile to continue. We need your name and address.
              </p>
              <form onSubmit={handleWalletOnboardingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={onboardingName}
                    onChange={(e) => setOnboardingName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    id="address"
                    required
                    value={onboardingAddress}
                    onChange={(e) => setOnboardingAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main St, City, Country"
                  />
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-900 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition-colors"
                  >
                    Complete Registration
                  </button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginSDK;
