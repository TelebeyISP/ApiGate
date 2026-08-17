"use client"

import { DashboardShell } from "@/components/DashboardShell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Smartphone, Plus, ShieldAlert, CheckCircle2 } from "lucide-react"

export default function SimPage() {
  const sims = [
    { id: "1", iccid: "8901410321111...", status: "active", type: "Physical SIM" },
    { id: "2", iccid: "8901410321112...", status: "active", type: "eSIM" },
  ]

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">SIM Management</h1>
            <p className="text-muted-foreground">Manage your physical SIMs and eSIMs globally.</p>
          </div>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" /> Activate New SIM
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sims.map((sim) => (
            <Card key={sim.id} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{sim.type}</CardTitle>
                  <CardDescription>ICCID: {sim.iccid}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium capitalize">{sim.status}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 flex justify-end gap-2">
                <button className="text-xs font-medium text-destructive hover:underline flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> Block SIM
                </button>
                <button className="text-xs font-medium text-primary hover:underline">
                  View Details
                </button>
              </CardFooter>
            </Card>
          ))}
          
          <Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-muted/30 transition-colors">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Add another device</p>
            <p className="text-xs text-muted-foreground">Compatible with all 5G devices</p>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
