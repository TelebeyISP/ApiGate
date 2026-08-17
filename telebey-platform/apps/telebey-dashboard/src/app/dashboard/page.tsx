"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/DashboardShell"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Smartphone, Wifi, Activity, CreditCard, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface SimData {
  id: string;
  iccid: string;
  imsi: string;
  status: string;
  dataUsedMb: number;
  plan?: {
    name: string;
    dataLimitMb: number;
  }
}

export default function DashboardPage() {
  const { api, user } = useAuth()
  const [sims, setSims] = useState<SimData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get<SimData[]>('/sim')
        setSims(res.data)
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [api, user])

  const activeSims = sims.filter(s => s.status === 'ACTIVE').length
  const totalDataUsedGb = (sims.reduce((acc, s) => acc + s.dataUsedMb, 0) / 1024).toFixed(1)
  const totalAllowanceGb = (sims.reduce((acc, s) => acc + (s.plan?.dataLimitMb ?? 0), 0) / 1024).toFixed(0)

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}. Here's a summary of your Telebey account.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active SIMs</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSims}</div>
              <p className="text-xs text-muted-foreground">{sims.length} total registered</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDataUsedGb} GB</div>
              <p className="text-xs text-muted-foreground">Of {totalAllowanceGb || 0} GB allowance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Status</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSims > 0 ? "Excellent" : "None Active"}</div>
              <p className="text-xs text-green-500">{activeSims > 0 ? "Connected to 5G Core" : "No active subcriptions"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Health</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Good</div>
              <p className="text-xs text-muted-foreground">All invoices paid</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>SIM Usage Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sims.length === 0 && <p className="text-sm text-muted-foreground">No SIMs found. Activate one to see usage.</p>}
                {sims.map((sim) => {
                  const limit = sim.plan?.dataLimitMb ?? 1;
                  const percent = Math.min((sim.dataUsedMb / limit) * 100, 100);
                  return (
                    <div key={sim.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>SIM ({sim.iccid.slice(-4)})</span>
                        <span className="font-medium">{percent.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sims.slice(0, 3).map((sim, i) => (
                  <div key={i} className="flex justify-between items-start border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">SIM Event</p>
                      <p className="text-xs text-muted-foreground">Status changed to {sim.status}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">Recent</span>
                  </div>
                ))}
                {sims.length === 0 && <p className="text-sm text-muted-foreground">No recent activity.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
