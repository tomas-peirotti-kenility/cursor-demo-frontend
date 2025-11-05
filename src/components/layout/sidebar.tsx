import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, FolderOpen, BarChart3, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Categories', href: '/categories', icon: FolderOpen },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="flex-shrink-0 w-64 bg-[#111818] flex flex-col">
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 p-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-background-dark font-bold text-lg">$</span>
          </div>
          <h1 className="text-white text-xl font-bold">ExpenseTracker</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-grow">
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
                    ? 'bg-primary/20 text-primary'
                    : 'text-white/70 hover:bg-[#283939] hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <p className="text-sm font-medium leading-normal">{item.name}</p>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-[#283939] hover:text-white transition-colors duration-200"
          >
            <Settings className="w-5 h-5" />
            <p className="text-sm font-medium leading-normal">Settings</p>
          </Link>
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-[#283939] hover:text-white transition-colors duration-200"
            onClick={() => {
              // Handle logout
              console.log('Logout clicked');
            }}
          >
            <LogOut className="w-5 h-5" />
            <p className="text-sm font-medium leading-normal">Log out</p>
          </button>
        </div>
      </div>
    </aside>
  );
}

