import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Receipt, Folder, HelpCircle, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Categories', href: '/categories', icon: Folder },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="flex-shrink-0 w-64 bg-[#1c2727] dark:bg-[#111818] p-4 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 p-2">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Alex")'
            }}
          />
          <div className="flex flex-col">
            <h1 className="text-white text-base font-medium leading-normal">Alex Doe</h1>
            <p className="text-[#9db9b9] text-sm font-normal leading-normal">alex.doe@email.com</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium leading-normal transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white text-sm font-medium leading-normal transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span>Help Center</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white text-sm font-medium leading-normal transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

