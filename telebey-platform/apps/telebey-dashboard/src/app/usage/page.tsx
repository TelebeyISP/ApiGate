"use client"

import { DashboardShell } from "@/components/DashboardShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

const data = [
  { name: 'Mon', usage: 1.2 },
  { name: 'Tue', usage: 0.8 },
  { name: 'Wed', usage: 2.1 },
  { name: 'Thu', usage: 1.5 },
  { name: 'Fri', usage: 3.4 },
  { name: 'Sat', usage: 1.9 },
  { name: 'Sun', usage: 1.5 },
]

export default function UsagePage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Usage Analytics</h1>
          <p className="text-muted-foreground">Monitor your real-time data consumption across all devices.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Data Consumption (GB)</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(199, 100%, 50%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(199, 100%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}GB`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="hsl(199, 100%, 50%)" 
                    fillOpacity={1} 
                    fill="url(#colorUsage)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Avg</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.77 GB</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8:00 PM</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top App</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">YouTube</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
