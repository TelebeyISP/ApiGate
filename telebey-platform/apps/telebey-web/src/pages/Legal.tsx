import { Link } from "react-router-dom";

const legalDocs = [
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal data and telecom records.",
    href: "/privacy",
    icon: "🔒",
  },
  {
    title: "Terms of Use",
    description: "The rules and conditions governing your use of Telebey's services and platform.",
    href: "/terms",
    icon: "📄",
  },
  {
    title: "License Agreement",
    description: "Third-party software licenses and open-source attributions used in the platform.",
    href: "/license",
    icon: "⚖️",
  },
];

const policies = [
  { title: "Acceptable Use Policy", body: "Users may not use Telebey's network or platform for illegal activities, spam, fraud, or abuse. Violations may result in immediate account suspension and referral to law enforcement." },
  { title: "Fair Use Policy", body: "Data plans are subject to fair-use guidelines. Excessive use that degrades network quality for other users may result in temporary speed reduction during peak hours." },
  { title: "Cookie Policy", body: "We use essential cookies for session management and optional analytics cookies to improve our services. You can manage cookie preferences in your account settings." },
  { title: "DMCA Policy", body: "Telebey respects intellectual property rights. To submit a copyright infringement notice, contact dmca@telebey.com with the required information under the DMCA." },
  { title: "Refund & Cancellation Policy", body: "Unused plan data is non-refundable once activated. Cancellations take effect at the end of the billing period. Hardware returns are accepted within 30 days of purchase in original condition." },
  { title: "Regulatory Compliance", body: "Telebey complies with FCC regulations, GSMA standards, CPNI rules, CALEA requirements, and applicable state telecom regulations. We hold all required operating licenses." },
];

export function Legal() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Company</p>
          <h1 className="text-4xl font-bold mb-4">Legal Center</h1>
          <p className="opacity-80 max-w-2xl">
            Everything you need to understand your rights, our obligations, and how we operate
            as a licensed MVNO carrier under applicable telecommunications law.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl py-16 space-y-16">

        {/* Quick Links */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Core Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {legalDocs.map((doc) => (
              <Link
                key={doc.href}
                to={doc.href}
                className="group border border-border rounded-2xl p-6 hover:border-primary hover:bg-primary/5 transition-all duration-200"
              >
                <div className="text-3xl mb-4">{doc.icon}</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{doc.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{doc.description}</p>
                <span className="text-primary text-sm font-medium mt-4 inline-block">Read more →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Policy Quick Reference */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Policy Quick Reference</h2>
          <div className="space-y-6">
            {policies.map((p) => (
              <div key={p.title} className="border border-border rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="opacity-70 leading-relaxed text-sm">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-foreground text-background rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Legal Inquiries</h2>
          <p className="opacity-80 leading-relaxed mb-4">
            For legal requests, regulatory inquiries, law enforcement requests, or subpoenas,
            please contact our legal team. We respond to valid legal process within 5 business days.
          </p>
          <a
            href="mailto:legal@telebey.com"
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Legal Team
          </a>
        </section>

      </div>
    </main>
  );
}
