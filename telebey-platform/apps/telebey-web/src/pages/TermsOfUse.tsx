import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

interface UserProfile {
  username?: string;
  walletName?: string;
  walletImage?: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

const AccountLabel = ({ user }: { user: UserProfile | null }) => {
  if (user) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-muted/50 border border-border px-3 py-1 rounded-full text-foreground font-medium text-sm mx-1 align-middle animate-in fade-in zoom-in-95 duration-200">
        {user.walletImage ? (
          <img src={user.walletImage} className="w-4 h-4 rounded-full object-cover" alt="" />
        ) : (
          <User className="w-3.5 h-3.5 text-primary" />
        )}
        {user.username || user.walletName || user.firstName || user.email.split('@')[0]}
      </span>
    );
  }
  return null;
};

const AccountLabelCapital = ({ user }: { user: UserProfile | null }) => {
  if (user) return <AccountLabel user={user} />;
  return <span>Account</span>;
};

export function TermsOfUse() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>
          <p className="opacity-80">Effective date: March 14, 2026 &nbsp;·&nbsp; Last updated: March 14, 2026</p>
        </div>
      </section>

      <article className="container mx-auto px-4 max-w-4xl py-16 space-y-12">

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="opacity-80 leading-relaxed">
            By accessing or using the Telebey website, mobile applications, or telecommunications
            services ("Services"), you agree to be bound by these Terms of Use and our Privacy Policy.
            If you do not agree, you must not use our Services. These Terms constitute a binding
            legal agreement between you and Telebey LLC.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
          <p className="opacity-80 leading-relaxed">
            You must be at least 18 years of age to create an <AccountLabel user={user} /> and purchase Services.
            By using Telebey, you represent that you are legally capable of entering into
            binding contracts and that all information provided is accurate and complete.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. <AccountLabelCapital user={user} /> Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 opacity-80 leading-relaxed">
            <li>Maintain the confidentiality of your <AccountLabel user={user} /> credentials.</li>
            <li>You are responsible for all activity that occurs under your <AccountLabel user={user} />.</li>
            <li>Notify us immediately at <Link to="/community" className="text-primary hover:underline font-bold">Read Community</Link> of any unauthorized use.</li>
            <li>One <AccountLabel user={user} /> per person; shared or transferred accounts are prohibited.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
          <p className="opacity-80 leading-relaxed mb-3">You agree not to use the Services to:</p>
          <ul className="list-disc list-inside space-y-2 opacity-80 leading-relaxed">
            <li>Transmit spam, malware, or any unlawful communications.</li>
            <li>Attempt to hack, disrupt, or interfere with network infrastructure.</li>
            <li>Circumvent SIM verification or commit telecommunications fraud.</li>
            <li>Violate any applicable local, national, or international law.</li>
            <li>Abuse or resell data plans in violation of fair-use policies.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Billing & Payments</h2>
          <p className="opacity-80 leading-relaxed">
            By purchasing a plan, you authorize Telebey to charge the payment method on file.
            All fees are in USD unless otherwise stated. Plans auto-renew unless cancelled 24 hours
            before the renewal date. Refunds are issued at Telebey's discretion as described in
            our Refund Policy. We reserve the right to suspend service for non-payment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Network & SIM Management</h2>
          <p className="opacity-80 leading-relaxed">
            Telebey may throttle, prioritize, or temporarily suspend network access to maintain
            quality for all users. SIM cards remain the property of Telebey and must be
            returned upon cancellation when physically requested. eSIMs are non-transferable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
          <p className="opacity-80 leading-relaxed">
            To the maximum extent permitted by law, Telebey and its affiliates shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages,
            or any loss of profits, revenues, or data. Our total liability shall not exceed
            the amount you paid to Telebey in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
          <p className="opacity-80 leading-relaxed">
            We may suspend or terminate your <AccountLabel user={user} /> at any time for violation of these Terms
            without prior notice. You may cancel your <AccountLabel user={user} /> through the Account Settings page
            at any time. Outstanding charges remain payable upon termination.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Governing Law</h2>
          <p className="opacity-80 leading-relaxed">
            These Terms are governed by the laws of the State of Delaware, United States,
            without regard to conflict of law principles. Any disputes shall be resolved
            through binding arbitration in accordance with the AAA Consumer Arbitration Rules.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">10. Changes to These Terms</h2>
          <p className="opacity-80 leading-relaxed">
            We may update these Terms at any time. We will notify you of material changes
            via email or in-app notification at least 30 days before the changes take effect.
            Continued use of the Services constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">11. Contact</h2>
          <p className="opacity-80 leading-relaxed">
            Telebey LLC, Legal Department<br />
            Email: <Link to="/community" className="text-primary hover:underline font-bold">Read Community</Link>
          </p>
        </section>

      </article>
    </main>
  );
}
