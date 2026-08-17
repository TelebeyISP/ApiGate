import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

export function PrivacyPolicy() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="opacity-80">Effective date: March 14, 2026 &nbsp;·&nbsp; Last updated: March 14, 2026</p>
        </div>
      </section>

      <article className="container mx-auto px-4 max-w-4xl py-16 space-y-12">

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="opacity-80 leading-relaxed">
            Telebey LLC ("Telebey," "we," "our," or "us") is committed to protecting your personal
            information. This Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our website, mobile applications, and telecommunications
            services (collectively, the "Services").
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
          <div className="space-y-4 opacity-80 leading-relaxed">
            <div>
              <h3 className="font-semibold text-foreground mb-2">2.1 Account Information</h3>
              <p>Name, email address, phone number, billing address, and password when you create an account.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2.2 SIM & Network Data</h3>
              <p>IMSI, ICCID, device identifiers, data usage statistics, call records, and location data necessary to provide telecom services.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2.3 Payment Information</h3>
              <p>Credit/debit card details processed via PCI-DSS compliant third-party payment processors. We do not store raw card numbers.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2.4 Usage & Log Data</h3>
              <p>IP addresses, browser type, pages visited, timestamps, and other diagnostic data collected automatically.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 opacity-80 leading-relaxed">
            <li>Provision and manage your telecom services</li>
            <li>Process payments and prevent fraud</li>
            <li>Send service notifications, invoices, and security alerts</li>
            <li>Comply with legal and regulatory obligations (including GSMA standards)</li>
            <li>Analyze and improve our network performance</li>
            <li>Respond to customer support inquiries</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Sharing Your Information</h2>
          <div className="opacity-80 leading-relaxed flex items-center gap-2 flex-wrap">
            We do not sell your 
            {user ? (
              <span className="inline-flex items-center gap-1.5 bg-muted/50 border border-border px-2 py-0.5 rounded-full text-foreground font-medium text-sm">
                {user.walletImage ? <img src={user.walletImage} className="w-4 h-4 rounded-full" alt="avatar" /> : <User className="w-3 h-3 text-primary" />}
                {user.username || user.walletName || user.firstName || 'User'}
              </span>
            ) : "user"} data. We may share information with:
          </div>
          <ul className="list-disc list-inside mt-3 space-y-2 opacity-80 leading-relaxed">
            <li><strong>Service Providers:</strong> Payment processors, cloud infrastructure, and analytics vendors operating under data processing agreements.</li>
            <li><strong>Regulators & Law Enforcement:</strong> When required by applicable law, court order, or governmental authority.</li>
            <li><strong>GSMA Open Gateway Partners:</strong> For number verification and SIM swap fraud prevention under the CAMARA API framework.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
          <p className="opacity-80 leading-relaxed">
            We retain personal data for as long as your account is active or as needed to provide
            Services, comply with legal obligations, resolve disputes, and enforce our agreements.
            Telecom call detail records are retained for a minimum of 12 months per regulatory requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
          <p className="opacity-80 leading-relaxed mb-3">Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-2 opacity-80 leading-relaxed">
            <li>Access and receive a copy of your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data ("right to be forgotten")</li>
            <li>Object to or restrict certain processing activities</li>
            <li>Port your data to another provider</li>
          </ul>
          <p className="opacity-80 leading-relaxed mt-3">
            To exercise these rights, contact us at <Link to="/community" className="text-primary hover:underline font-bold">Read Community</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Security</h2>
          <p className="opacity-80 leading-relaxed">
            We implement industry-standard security measures including AES-256 encryption at rest,
            TLS 1.3 in transit, JWT token rotation, and Redis-backed session blacklisting to protect
            your data against unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
          <p className="opacity-80 leading-relaxed">
            Telebey LLC, Attn: Privacy Team<br />
            Email: <Link to="/community" className="text-primary hover:underline font-bold">Read Community</Link><br />
            Website: <a href="https://telebey.com" className="text-primary hover:underline">telebey.com</a>
          </p>
        </section>

      </article>
    </main>
  );
}
