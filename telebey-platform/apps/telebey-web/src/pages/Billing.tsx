import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Download, Plus, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// We mock the user subscription logic here since we don't have a backend endpoint available.
const useSubscription = () => {
  return { hasActiveSubscription: true }; // Assume true for testing billing displays
};

export function Billing() {
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();

  const [showAddCard, setShowAddCard] = useState(false);
  const [balance, setBalance] = useState(0); // Mock wallet balance
  const [addFundsAmount, setAddFundsAmount] = useState('');
  
  // Real-looking Mock Transactions
  const [transactions, setTransactions] = useState([
    { id: 'tx_1', date: 'Mar 15, 2026', desc: 'Wallet Deposit via Stripe', amount: 50.00, type: 'credit', status: 'completed', hash: '0x3a...f92' },
    { id: 'tx_2', date: 'Feb 28, 2026', desc: 'Telebey 5G Unlimited (Monthly)', amount: -45.00, type: 'debit', status: 'completed', hash: '0x7e...21b' },
    { id: 'tx_3', date: 'Jan 28, 2026', desc: 'Telebey 5G Unlimited (Monthly)', amount: -45.00, type: 'debit', status: 'completed', hash: '0xa1...c44' }
  ]);

  const networkTransactions = [
    { hash: "0x4f...a2e", type: "Plan Activation", fee: "0.0002 ETH", time: "2m ago" },
    { hash: "0x1b...c7d", type: "Line Top-up", fee: "0.0001 ETH", time: "1h ago" }
  ];

  // PDF Generator Logic
  const handleDownloadStatement = () => {
    if (!user) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(24, 119, 242); // Telebey Blue
    doc.text("TELEBEY", 14, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Digital Connectivity Solutions", 14, 32);
    
    doc.setTextColor(100);
    doc.text("INVOICE / RECEIPT", 140, 25);
    doc.text(`Invoice #: ${Math.floor(Math.random() * 1000000)}`, 140, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 39);
    
    // Line
    doc.setDrawColor(200);
    doc.line(14, 45, 196, 45);

    // User Data
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Billed To:`, 14, 55);
    doc.setFontSize(10);
    doc.text(`Name: ${user.walletName || user.firstName || 'Customer'}`, 14, 62);
    doc.text(`ID/Wallet: ${user.walletAddress || user.email}`, 14, 69);

    // Company Data
    doc.setFontSize(12);
    doc.text(`Vendor:`, 140, 55);
    doc.setFontSize(10);
    doc.text(`Telebey Platform B.V.`, 140, 62);
    doc.text(`Amsterdam, Netherlands`, 140, 69);
    doc.text(`support@telebey.com`, 140, 76);

    // Table
    const tableData = transactions.map(tx => [
      tx.date,
      tx.desc,
      tx.status.toUpperCase(),
      `$${Math.abs(tx.amount).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 90,
      head: [['Date', 'Description', 'Status', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [24, 119, 242], fontSize: 10 },
      styles: { fontSize: 9 }
    });

    // Save
    doc.save(`telebey_statement_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleAddFunds = () => {
    if (addFundsAmount && !isNaN(Number(addFundsAmount))) {
      // In real life, trigger Stripe Session here.
      alert(`Triggering Stripe Checkout for $${addFundsAmount}...`);
      setBalance(b => b + Number(addFundsAmount));
      setAddFundsAmount('');
      setShowAddCard(false);
    }
  };
  return (
    <main className="flex-1 flex flex-col py-8 lg:py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/account" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Billing & Payments</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleDownloadStatement}
            className="hidden sm:flex items-center gap-2 font-bold"
          >
            <Download className="w-4 h-4" /> Download Statements
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Payment Methods & Wallet */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Wallet Balance</h2>
                <div className="text-2xl font-bold font-heading text-primary">${balance.toFixed(2)}</div>
              </div>
              
              {!showAddCard ? (
                <Button 
                  onClick={() => setShowAddCard(true)}
                  className="w-full flex items-center justify-center gap-2 font-bold"
                >
                  <Plus className="w-5 h-5" /> Add Funds with Stripe
                </Button>
              ) : (
                <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-4 animate-in slide-in-from-top-2">
                  <div>
                    <label className="block font-bold mb-1.5 text-muted-foreground">Amount (USD)</label>
                    <input 
                      type="number" 
                      min="5" 
                      value={addFundsAmount}
                      onChange={(e) => setAddFundsAmount(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddFunds} className="font-bold flex-1 bg-[#635BFF] hover:bg-[#635BFF]/90 text-white">
                      Pay with Stripe
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddCard(false)} className="font-bold">Cancel</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Saved Cards</h2>
              <div className="flex items-center justify-between p-4 border border-primary/20 bg-primary/5 rounded-lg mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-white border border-border rounded flex items-center justify-center font-bold text-blue-600 text-xs shadow-sm">
                    VISA
                  </div>
                  <div>
                    <div className="font-bold text-sm">Visa ending in 4242</div>
                    <div className="text-xs text-muted-foreground">Expires 12/28 • Default</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-primary font-bold">Edit</Button>
              </div>
            </div>
          </div>

          {/* Next Bill Section */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-2">Next Bill</h2>
              {hasActiveSubscription ? (
                <>
                  <div className="text-3xl font-bold font-heading text-foreground mb-1">$45.00</div>
                  <p className="text-sm text-foreground mb-4">Due March 28</p>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-border/50 text-sm mb-4">
                    <span className="text-muted-foreground">Telebey 5G Unlimited</span>
                    <span className="font-bold">$45.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span>Total</span>
                    <span>$45.00</span>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">No active subscriptions found.</p>
                  <Link to="/plans" className="text-sm text-primary font-bold hover:underline">Get a plan</Link>
                </div>
              )}
            </div>
            
            {/* Mobile Download Statement Button */}
            <Button 
              variant="outline" 
              onClick={handleDownloadStatement}
              className="w-full flex sm:hidden items-center justify-center gap-2 font-bold bg-white"
            >
              <FileText className="w-4 h-4" /> Download PDF Statement
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Flat Transactions */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Billing History</h2>
            </div>
            <div className="divide-y divide-border/50 flex-1">
              {transactions.map((tx) => (
                <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{tx.desc}</div>
                      <div className="text-xs text-muted-foreground">{tx.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-foreground'}`}>
                      {tx.type === 'credit' ? '+' : ''}{tx.amount.toFixed(2)}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground flex items-center justify-end gap-1 uppercase">
                      {tx.status} <CheckCircle2 className="w-3 h-3 text-green-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real Network Transactions */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border bg-indigo-500/5 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold">Network Transactions</h2>
            </div>
            <div className="divide-y divide-border/50 flex-1">
              {networkTransactions.map((tx, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{tx.type}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{tx.hash}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">{tx.fee}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">{tx.time}</div>
                  </div>
                </div>
              ))}
              <div className="p-4 text-center">
                <button className="text-xs font-bold text-indigo-500 hover:underline uppercase tracking-widest">Explore On Explorer</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
