import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          
          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-white mb-4">Products &amp; Services</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li><a href="#" className="hover:text-primary transition-colors">5G Network</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Prepaid Plans</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">International Pass</a></li>
              <li><Link to="/activate" className="hover:text-primary transition-colors">eSIM Activation</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mobile Hotspot</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Check Coverage</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
              <li><Link to="/find-store" className="hover:text-primary transition-colors">Store Locator</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li><a href="#" className="hover:text-primary transition-colors">About Telebey</a></li>
              <li><Link to="/business" className="hover:text-primary transition-colors">Telebey for Business</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Newsroom</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Investor Relations</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Developer Portal</a></li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h4 className="font-bold text-white mb-4">Account</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li><Link to="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              <li><Link to="/billing" className="hover:text-primary transition-colors">Pay Bill</Link></li>
              <li><Link to="/account" className="hover:text-primary transition-colors">Manage Data</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Order History</a></li>
            </ul>
          </div>

          {/* Column 6 */}
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li><Link to="/legal" className="hover:text-primary transition-colors">Legal Center</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link></li>
              <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookies Policy</Link></li>
              <li><Link to="/license" className="hover:text-primary transition-colors">License</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Device Unlock Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Section */}
        <div className="border-t border-background/20 pt-8 mb-8 max-w-4xl">
          <p className="text-sm opacity-80 leading-relaxed">
            * 5G coverage not available in some areas. Requires capable device. Capable device required for standalone 5G. 
            Speeds vary and may be affected by network, signal, and environmental conditions. 
            Telebey Network Management Policies apply. Services provided by Telebey LLC.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 opacity-90">
            <span>© 2026 Telebey. All rights reserved.</span>
            <div className="flex space-x-4">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
              <Link to="/legal" className="hover:text-primary transition-colors">Legal</Link>
              <Link to="/license" className="hover:text-primary transition-colors">License</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-white font-medium">
            <span role="img" aria-label="US Flag">🇺🇸</span>
            <span>United States</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
