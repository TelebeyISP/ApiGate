import { Routes, Route, Navigate } from "react-router-dom";
import { TopBar } from "./components/layout/TopBar";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ShopProvider } from "./context/ShopContext";
import { LanguageProvider } from "./auth/contexts/LanguageContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProfileDispatcher } from "./components/ProfileDispatcher";

// Pages
import { Home } from "./pages/Home";
import { ActivateEsim } from "./pages/ActivateEsim";
import { Cart } from "./pages/Cart";
import { Plans } from "./pages/Plans";
import { Billing } from "./pages/Billing";
import { ProfileSettings } from "./pages/ProfileSettings";
import { ManageData } from "./pages/ManageData";
import { OrderHistory } from "./pages/OrderHistory";
import { Community } from "./pages/Community";
import { Business } from "./pages/Business";
import { FindStore } from "./pages/FindStore";
import { ComingSoon } from "./pages/ComingSoon";
import { Wishlist } from "./pages/Wishlist";
import { Shop } from "./pages/Shop";

// Auth Pages (Verificatie SDK)
import LoginSDK from "./auth/pages/LoginSDK";
import ForgotPassword from "./auth/pages/ForgotPassword";

// Legal Pages
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfUse } from "./pages/TermsOfUse";
import { CookiesPolicy } from "./pages/CookiesPolicy";
import { Legal } from "./pages/Legal";
import { License } from "./pages/License";

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <ShopProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col font-sans">
                <TopBar />
                <Header />

                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/activate" element={<ActivateEsim />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Navigate to="/auth" replace />} />
                    <Route path="/register" element={<Navigate to="/auth" replace />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/account" element={<ProfileDispatcher />} />
                    <Route path="/account/:username" element={<ProfileDispatcher />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/profile" element={<ProfileSettings />} />
                    <Route path="/manage-data" element={<ManageData />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/business" element={<Business />} />
                    <Route path="/find-store" element={<FindStore />} />
                    <Route path="/mail" element={<ComingSoon />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/homenet" element={<ComingSoon />} />
                    <Route path="/account/home/net/:token" element={<ComingSoon />} />
                    
                    {/* Auth Routes */}
                    <Route path="/auth" element={<LoginSDK />} />
                    <Route path="/auth/email" element={<Navigate to="/auth" replace />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/auth/lservice/i/" element={<LoginSDK />} />
                    <Route path="/auth/lservice/i/:token" element={<LoginSDK />} />
                    <Route path="/lservice/i/:token" element={<Navigate to="/auth" replace />} />

                    {/* Legal Pages */}
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfUse />} />
                    <Route path="/cookies" element={<CookiesPolicy />} />
                    <Route path="/legal" element={<Legal />} />
                    <Route path="/license" element={<License />} />

                    {/* Root Level Public Profiles - Keep at bottom */}
                    <Route path="/:username" element={<ProfileDispatcher />} />
                  </Routes>
                </main>

                <Footer />
              </div>
        </LanguageProvider>
      </ShopProvider>
    </WishlistProvider>
  </AuthProvider>
);
}

export default App;
