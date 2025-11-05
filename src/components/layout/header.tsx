import { Link } from 'react-router-dom';
import { Settings, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onAddExpense?: () => void;
}

export function Header({ onAddExpense }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-background-light/80 dark:bg-background-dark/80 px-4 py-3 backdrop-blur-sm md:px-8 lg:px-10">
      <div className="flex items-center gap-4 text-slate-800 dark:text-white">
        <Wallet className="text-primary" size={24} />
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">
          Expense Tracker
        </h2>
      </div>

      <nav className="hidden items-center gap-9 md:flex">
        <Link
          to="/"
          className="text-sm font-medium leading-normal text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/expenses"
          className="text-sm font-medium leading-normal text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
        >
          Expenses
        </Link>
        <Link
          to="/categories"
          className="text-sm font-medium leading-normal text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
        >
          Categories
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {onAddExpense && (
          <Button onClick={onAddExpense} size="md">
            Add Expense
          </Button>
        )}
        <button className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10 text-slate-600 dark:text-white hover:bg-white/20 transition-colors">
          <Settings size={20} />
        </button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          style={{
            backgroundImage:
              'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")',
          }}
        />
      </div>
    </header>
  );
}

