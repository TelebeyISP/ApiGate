"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/DashboardShell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface Plan {
  id: string
  name: string
  description?: string
  dataLimitMb: number
  priceCents: number
  validityDays: number
}

export default function PlansPage() {
  const { api } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Plan[]>("/plans")
        setPlans(res.data)
      } catch {
        setError("Could not load plans from ApiGate.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [api])

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">Flexible Data Bundles</h1>
          <p className="text-muted-foreground">Plans served live from ApiGate. Assign them to SIMs provisioned on Open5GS.</p>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, index) => {
              const popular = index === 1
              const gb = plan.dataLimitMb >= 1024 * 1024 ? "∞" : String(Math.round(plan.dataLimitMb / 1024))
              return (
                <Card key={plan.id} className={popular ? "border-primary shadow-lg ring-1 ring-primary/20" : ""}>
                  {popular && (
                    <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest text-center py-1">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-baseline justify-between">
                      <span>{plan.name}</span>
                      <span className="text-sm font-normal text-muted-foreground">{gb} GB</span>
                    </CardTitle>
                    <CardDescription>{plan.description || `${plan.validityDays} day validity`}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-6">
                      ${(plan.priceCents / 100).toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm gap-2">
                        <Check className="h-4 w-4 text-green-500" /> Open5GS 5G core access
                      </li>
                      <li className="flex items-center text-sm gap-2">
                        <Check className="h-4 w-4 text-green-500" /> {plan.validityDays} day validity
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <button className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-foreground hover:bg-muted/80"}`}>
                      Choose Plan
                    </button>
                  </CardFooter>
                </Card>
              )
            })}
            {plans.length === 0 && !error && (
              <p className="text-sm text-muted-foreground col-span-3 text-center">No plans seeded yet. Run `npm run seed` in the API.</p>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
