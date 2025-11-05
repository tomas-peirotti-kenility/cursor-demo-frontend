import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Folder,
  BarChart3,
  Settings,
  LogOut,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Categories', href: '/categories', icon: Folder },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Log out', href: '/logout', icon: LogOut },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="flex-shrink-0 w-64 bg-[#111818] flex flex-col">
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 p-2 mb-6">
          <Wallet className="text-primary text-3xl" size={32} />
          <h1 className="text-white text-xl font-bold">Expense Tracker</h1>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col gap-4 flex-grow">
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-[#283939] text-white'
                      : 'text-white/70 hover:bg-[#283939] hover:text-white'
                  )}
                >
                  <Icon size={20} />
                  <p className="text-sm font-medium leading-normal">{item.name}</p>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col gap-1">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-[#283939] hover:text-white transition-colors duration-200"
              >
                <Icon size={20} />
                <p className="text-sm font-medium leading-normal">{item.name}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

