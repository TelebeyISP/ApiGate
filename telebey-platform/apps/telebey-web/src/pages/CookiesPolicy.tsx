import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User, Cookie, Shield, Eye, Settings } from "lucide-react";

export function CookiesPolicy() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold mb-4">Cookies Policy</h1>
          <p className="opacity-80">Effective date: March 14, 2026 &nbsp;·&nbsp; Last updated: March 14, 2026</p>
        </div>
      </section>

      <article className="container mx-auto px-4 max-w-4xl py-16 space-y-12">

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Cookie className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">1. What are Cookies?</h2>
          </div>
          <p className="opacity-80 leading-relaxed">
            Cookies are small text files that are stored on your device when you visit our website. 
            They are widely used to make websites work, or work more efficiently, as well as to provide 
            information to the owners of the site. At Telebey, we use cookies to enhance your experience, 
            secure your session, and analyze our network performance.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">2. Types of Cookies We Use</h2>
          </div>
          <div className="space-y-6 opacity-80 leading-relaxed">
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Essential Cookies
              </h3>
              <p className="text-sm">
                These are necessary for the website to function. They allow you to log in securely to 
                your <AccountLabel user={user} />, manage your eSIM, and access protected areas of the site. 
                Without these, our services cannot be provided.
              </p>
            </div>
            
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Performance & Analytics
              </h3>
              <p className="text-sm">
                We use these to understand how visitors interact with our platform. This helps us 
                optimize our network speed and identify any technical issues on specific pages.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Functional Cookies
              </h3>
              <p className="text-sm">
                These remember your preferences, such as your selected language or regional plan 
                settings, to provide a more personalized experience.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Settings className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">3. Managing Your Preferences</h2>
          </div>
          <p className="opacity-80 leading-relaxed mb-4">
            Most web browsers allow some control of most cookies through the browser settings. 
            To find out more about cookies, including how to see what cookies have been set and 
            how to manage and delete them, visit <a href="https://www.aboutcookies.org" className="text-primary hover:underline">aboutcookies.org</a>.
          </p>
          <div className="p-4 bg-muted/30 rounded-xl border border-border/50 text-sm">
            <strong>Note:</strong> Disabling essential cookies may prevent you from using certain parts of the Telebey platform, 
            including plan activation and billing management.
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">4. Third-Party Cookies</h2>
          </div>
          <p className="opacity-80 leading-relaxed">
            We use trusted third-party services like Stripe for payment processing and WalletConnect 
            for secure identity verification. These providers may set their own cookies to ensure 
            transaction security and reliability.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Contact Our Privacy Team</h2>
          <p className="opacity-80 leading-relaxed">
            If you have questions about our use of cookies, please reach out to us via the 
            <Link to="/community" className="text-primary hover:underline font-bold mx-1">Community Forum</Link> 
            or email us at cookies@telebey.com.
          </p>
        </section>

      </article>
    </main>
  );
}

const AccountLabel = ({ user }: { user: any }) => {
  if (user) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-muted/50 border border-border px-2 py-0.5 rounded-full text-foreground font-medium text-sm align-middle">
        {user.walletImage ? <img src={user.walletImage} className="w-4 h-4 rounded-full" alt="avatar" /> : <User className="w-3 h-3 text-primary" />}
        {user.username || user.walletName || user.firstName || 'Account'}
      </span>
    );
  }
  return "account";
};
