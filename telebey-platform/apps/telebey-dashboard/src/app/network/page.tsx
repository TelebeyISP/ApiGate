"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/DashboardShell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Database, Globe, Loader2, Radio } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface NetworkStatus {
  mongodb: {
    connected: boolean
    uri: string
    database: string
    collection: string
    subscriberCount: number | null
    lastError: string | null
  }
  webui: {
    url: string
    reachable: boolean
    statusCode?: number
    error?: string
  }
  core: string
  source: string
}

interface Subscriber {
  imsi: string
  subscriber_status?: number
  slice?: Array<{ session?: Array<{ name?: string }> }>
}

export default function NetworkPage() {
  const { api, user } = useAuth()
  const [status, setStatus] = useState<NetworkStatus | null>(null)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [statusRes, subRes] = await Promise.all([
          api.get<NetworkStatus>("/open5gs/status"),
          api.get<Subscriber[]>("/open5gs/subscribers"),
        ])
        setStatus(statusRes.data)
        setSubscribers(Array.isArray(subRes.data) ? subRes.data : [])
      } catch {
        setError("ApiGate could not reach the Open5GS network status endpoint.")
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      load()
    }
  }, [api, user])

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    )
  }

  const mongoOk = status?.mongodb.connected
  const webuiOk = status?.webui.reachable

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Open5GS Network</h1>
          <p className="text-muted-foreground">
            Live link between ApiGate and isp.router-dashboard (Open5GS subscriber core).
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ApiGate</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Online</div>
              <p className="text-xs text-muted-foreground">Status API responded</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open5GS MongoDB</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mongoOk ? "Connected" : "Down"}</div>
              <p className="text-xs text-muted-foreground">
                {status?.mongodb.database}/{status?.mongodb.collection} · {status?.mongodb.subscriberCount ?? 0} subscribers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Router Dashboard</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{webuiOk ? "Reachable" : "Offline"}</div>
              <p className="text-xs text-muted-foreground">{status?.webui.url}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" /> Core subscribers
            </CardTitle>
            <CardDescription>{status?.source}</CardDescription>
          </CardHeader>
          <CardContent>
            {subscribers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No IMSIs in Open5GS yet. Activate a SIM to provision one.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b">
                      <th className="py-2">IMSI</th>
                      <th>APN</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub) => (
                      <tr key={sub.imsi} className="border-b last:border-0">
                        <td className="py-2 font-mono">{sub.imsi}</td>
                        <td>{sub.slice?.[0]?.session?.[0]?.name ?? "internet"}</td>
                        <td>{sub.subscriber_status === 0 ? "Granted" : "Barred"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {status?.mongodb.lastError && (
              <p className="mt-4 text-xs text-destructive">{status.mongodb.lastError}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
