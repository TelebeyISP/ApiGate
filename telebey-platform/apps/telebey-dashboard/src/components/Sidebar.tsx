"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart3, 
  Home, 
  Settings, 
  ShieldCheck, 
  Radio,
  Smartphone, 
  Wifi 
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'SIM Management', href: '/sim', icon: Smartphone },
  { name: 'Open5GS Network', href: '/network', icon: Radio },
  { name: 'Data Plans', href: '/plans', icon: Wifi },
  { name: 'Usage Analytics', href: '/usage', icon: BarChart3 },
  { name: 'Verification', href: '/verify', icon: ShieldCheck },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center px-6">
        <span className="text-2xl font-heading font-bold text-primary">Telebey</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
        <Link 
          href="/settings"
          className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-muted hover:text-foreground"
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Link>
      </div>
    </div>
  )
}
