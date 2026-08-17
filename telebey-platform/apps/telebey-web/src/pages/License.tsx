const licenses = [
  {
    name: "NestJS",
    version: "10.x",
    license: "MIT",
    url: "https://github.com/nestjs/nest",
    description: "Progressive Node.js framework for building efficient server-side applications.",
  },
  {
    name: "Next.js",
    version: "14.x",
    license: "MIT",
    url: "https://github.com/vercel/next.js",
    description: "The React framework for production-grade web applications.",
  },
  {
    name: "React",
    version: "18.x",
    license: "MIT",
    url: "https://github.com/facebook/react",
    description: "A JavaScript library for building user interfaces by Meta.",
  },
  {
    name: "TypeORM",
    version: "0.3.x",
    license: "MIT",
    url: "https://github.com/typeorm/typeorm",
    description: "ORM for TypeScript and JavaScript with support for PostgreSQL.",
  },
  {
    name: "Mongoose",
    version: "8.x",
    license: "MIT",
    url: "https://github.com/Automattic/mongoose",
    description: "Elegant MongoDB object modeling for Node.js, used for Open5GS integration.",
  },
  {
    name: "Tailwind CSS",
    version: "3.x",
    license: "MIT",
    url: "https://github.com/tailwindlabs/tailwindcss",
    description: "A utility-first CSS framework for rapid UI development.",
  },
  {
    name: "shadcn/ui",
    version: "latest",
    license: "MIT",
    url: "https://github.com/shadcn-ui/ui",
    description: "Re-usable UI components built with Radix UI and Tailwind CSS.",
  },
  {
    name: "Recharts",
    version: "2.x",
    license: "MIT",
    url: "https://github.com/recharts/recharts",
    description: "A composable charting library built on React components.",
  },
  {
    name: "Lucide React",
    version: "latest",
    license: "ISC",
    url: "https://github.com/lucide-icons/lucide",
    description: "Beautiful and consistent open-source icon library.",
  },
  {
    name: "CryptoJS",
    version: "4.x",
    license: "MIT",
    url: "https://github.com/brix/crypto-js",
    description: "JavaScript library for AES-256 and SHA-256 cryptographic operations.",
  },
  {
    name: "Axios",
    version: "1.x",
    license: "MIT",
    url: "https://github.com/axios/axios",
    description: "Promise-based HTTP client for the browser and Node.js.",
  },
  {
    name: "Zustand",
    version: "4.x",
    license: "MIT",
    url: "https://github.com/pmndrs/zustand",
    description: "Small, fast, and scalable state management for React.",
  },
  {
    name: "Redis (ioredis)",
    version: "5.x",
    license: "MIT",
    url: "https://github.com/redis/ioredis",
    description: "High-performance Redis client for caching and session blacklisting.",
  },
  {
    name: "bcrypt",
    version: "5.x",
    license: "MIT",
    url: "https://github.com/kelektiv/node.bcrypt.js",
    description: "Library used for secure password hashing.",
  },
];

export function License() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold mb-4">Open Source Licenses</h1>
          <p className="opacity-80 max-w-2xl">
            The Telebey platform is built on the shoulders of the open source community.
            We gratefully acknowledge the following software packages and their licenses.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl py-16 space-y-12">

        {/* MIT License Block */}
        <section className="border border-border rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-4">Telebey Platform License</h2>
          <div className="bg-muted/30 rounded-xl p-6 font-mono text-sm opacity-80 leading-relaxed space-y-4">
            <p>MIT License</p>
            <p>Copyright © 2026 Telebey LLC</p>
            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>
            <p>
              The above copyright notice and this permission notice shall be included in
              all copies or substantial portions of the Software.
            </p>
            <p>
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </div>
        </section>

        {/* Third-Party Licenses */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Third-Party Dependencies</h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-foreground text-background">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Package</th>
                  <th className="text-left px-6 py-4 font-semibold">Version</th>
                  <th className="text-left px-6 py-4 font-semibold">License</th>
                  <th className="text-left px-6 py-4 font-semibold hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((lib, i) => (
                  <tr key={lib.name} className={`border-t border-border ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                    <td className="px-6 py-4">
                      <a
                        href={lib.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:underline"
                      >
                        {lib.name}
                      </a>
                    </td>
                    <td className="px-6 py-4 opacity-70 font-mono">{lib.version}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                        {lib.license}
                      </span>
                    </td>
                    <td className="px-6 py-4 opacity-70 hidden md:table-cell">{lib.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-sm opacity-60 text-center">
          For questions about licensing, contact{" "}
          <a href="mailto:legal@telebey.com" className="text-primary hover:underline">legal@telebey.com</a>
        </p>

      </div>
    </main>
  );
}
