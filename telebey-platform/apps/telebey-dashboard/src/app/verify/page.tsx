"use client"

import { DashboardShell } from "@/components/DashboardShell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, Phone, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function VerifyPage() {
  const [phone, setPhone] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<null | { verified: boolean }>(null)

  const handleVerify = () => {
    setIsVerifying(true)
    // Simulate GSMA API Call
    setTimeout(() => {
      setIsVerifying(false)
      setResult({ verified: true })
    }, 2000)
  }

  return (
    <DashboardShell>
      <div className="max-w-xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Network Verification</h1>
          <p className="text-muted-foreground">Powered by GSMA Open Gateway. Verify your identity directly via the carrier network.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="bg-primary/10 p-4 rounded-full w-fit mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Phone Verification</CardTitle>
            <CardDescription>Instant verification without SMS OTP. We'll cross-check your number with the SIM active on this account.</CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  onClick={handleVerify}
                  disabled={isVerifying || !phone}
                  className="w-full h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isVerifying ? "Verifying with Network..." : "Start Secure Verification"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 duration-300">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold">Verification Successful</h3>
                <p className="text-sm text-muted-foreground mt-2">Your device identity has been confirmed by the carrier.</p>
                <button 
                  onClick={() => setResult(null)}
                  className="mt-6 text-sm text-primary hover:underline"
                >
                  Verify another number
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
