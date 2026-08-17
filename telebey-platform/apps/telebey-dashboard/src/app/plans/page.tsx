"use client"

import { DashboardShell } from "@/components/DashboardShell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Wifi, Zap, Globe, Check } from "lucide-react"

export default function PlansPage() {
  const plans = [
    { title: "Lite", gb: "5", price: "$9.99", features: ["5G Access", "EU Roaming", "No Contract"] },
    { title: "Standard", gb: "20", price: "$24.99", features: ["5G Access", "World Roaming", "Priority Support"], popular: true },
    { title: "Unlimited", gb: "∞", price: "$49.99", features: ["5G Ultrawide", "Global Data", "Family Sharing"] },
  ]

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">Flexible Data Bundles</h1>
          <p className="text-muted-foreground">High-speed 5G connectivity tailored to your lifestyle. No hidden fees, cancel anytime.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.title} className={plan.popular ? "border-primary shadow-lg ring-1 ring-primary/20" : ""}>
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest text-center py-1">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between">
                  <span>{plan.title}</span>
                  <span className="text-sm font-normal text-muted-foreground">{plan.gb} GB</span>
                </CardTitle>
                <CardDescription>Perfect for basic usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-6">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                <ul className="space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center text-sm gap-2">
                      <Check className="h-4 w-4 text-green-500" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <button className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-foreground hover:bg-muted/80"}`}>
                  Choose Plan
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
