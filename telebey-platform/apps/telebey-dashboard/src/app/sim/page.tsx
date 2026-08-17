"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/DashboardShell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Smartphone, Plus, ShieldAlert, CheckCircle2, Loader2, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface SimRecord {
  id: string
  iccid: string
  imsi: string
  status: string
  dataUsedMb?: number
  plan?: { name: string; dataLimitMb: number }
}

export default function SimPage() {
  const { api, user } = useAuth()
  const [sims, setSims] = useState<SimRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [iccid, setIccid] = useState("8900101000000000001")
  const [imsi, setImsi] = useState("001010000000001")
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const res = await api.get<SimRecord[]>("/sim")
      setSims(res.data)
      setError(null)
    } catch {
      setError("Could not load SIMs from ApiGate.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      load()
    }
  }, [api, user])

  const activate = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      await api.post("/sim/activate", { iccid, imsi, apn: "internet" })
      setShowForm(false)
      await load()
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number; data?: { message?: string } } })?.response
      setError(status?.data?.message ?? "Activation failed. Check ApiGate and Open5GS MongoDB.")
    } finally {
      setSaving(false)
    }
  }

  const blockSim = async (id: string) => {
    try {
      await api.post(`/sim/block/${id}`)
      await load()
    } catch {
      setError("Could not block SIM in ApiGate / Open5GS.")
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">SIM Management</h1>
            <p className="text-muted-foreground">Activate SIMs through ApiGate into the Open5GS subscriber store.</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Plus className="mr-2 h-4 w-4" /> Activate New SIM
          </button>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {showForm && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Provision on Open5GS</CardTitle>
                <CardDescription>ApiGate writes this IMSI into the isp.router-dashboard MongoDB.</CardDescription>
              </div>
              <button onClick={() => setShowForm(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={activate} className="grid gap-4 md:grid-cols-2">
                <label className="text-sm space-y-1">
                  <span>ICCID</span>
                  <input
                    value={iccid}
                    onChange={(e) => setIccid(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2"
                    minLength={19}
                    maxLength={20}
                    required
                  />
                </label>
                <label className="text-sm space-y-1">
                  <span>IMSI</span>
                  <input
                    value={imsi}
                    onChange={(e) => setImsi(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2"
                    minLength={15}
                    maxLength={15}
                    required
                  />
                </label>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center rounded-md bg-primary text-primary-foreground h-10 px-4 text-sm font-medium disabled:opacity-60"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Activate &amp; provision
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sims.map((sim) => (
              <Card key={sim.id} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">IMSI {sim.imsi}</CardTitle>
                    <CardDescription>ICCID: {sim.iccid}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${sim.status === "blocked" ? "text-destructive" : "text-green-500"}`} />
                    <span className="text-sm font-medium capitalize">{sim.status}</span>
                  </div>
                  {sim.plan && (
                    <p className="text-xs text-muted-foreground">Plan: {sim.plan.name}</p>
                  )}
                </CardContent>
                <CardFooter className="bg-muted/50 p-4 flex justify-end gap-2">
                  <button
                    onClick={() => blockSim(sim.id)}
                    className="text-xs font-medium text-destructive hover:underline flex items-center gap-1"
                  >
                    <ShieldAlert className="h-3 w-3" /> Block SIM
                  </button>
                </CardFooter>
              </Card>
            ))}

            <Card
              onClick={() => setShowForm(true)}
              className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Add another device</p>
              <p className="text-xs text-muted-foreground">Provisions into Open5GS via ApiGate</p>
            </Card>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
