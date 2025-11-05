# Frontend Architecture Guidelines

## Project Structure

### Standard React + Vite Application Layout

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, cards)
│   ├── [feature]/      # Feature-specific components
│   └── layout/         # Layout components (sidebar, header, footer)
├── pages/              # Route/page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── services/           # API/data services
├── types/              # TypeScript type definitions
├── constants/          # Application constants
├── context/            # React Context providers (if using Context API)
├── store/              # State management (if using Zustand/Redux)
└── assets/             # Static assets (images, fonts, icons)
```

### Component Organization Principles

- **Feature-based grouping**: Group components by feature/domain
- **Atomic design**: Build from small (atoms) to large (organisms)
- **Separation of concerns**: Keep business logic separate from UI
- **Reusability**: Extract common patterns into shared components
- **Scalability**: Structure should support growth without major refactoring

### File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `ExpenseTable.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-expenses.ts`)
- Utilities: `kebab-case.ts` (e.g., `format-currency.ts`)
- Types: `kebab-case.ts` (e.g., `expense.ts`)
- Constants: `kebab-case.ts` (e.g., `default-categories.ts`)

## Technology Stack

### Core Technologies

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast HMR, optimized builds)
- **Styling**: Tailwind CSS (utility-first, highly customizable)
- **UI Components**: Shadcn UI (accessible, customizable, copy-paste)
- **Routing**: React Router v6 (declarative routing)

### State Management

- **Local State**: `useState`, `useReducer` for component state
- **Shared State**: Context API for simple shared state
- **Complex State**: Zustand for complex global state (lightweight, simple API)
- **Server State**: React Query/TanStack Query for API data caching

### Form Handling

- **Library**: React Hook Form (performance, minimal re-renders)
- **Validation**: Zod (type-safe schema validation)
- **Pattern**: Controlled components with validation schemas

### Data Visualization

- **Charts**: Recharts (React-friendly, composable, responsive)
- **Alternatives**: Chart.js with react-chartjs-2, Victory
- **Requirements**: Interactive tooltips, responsive design, accessibility

### Date Handling

- **Library**: date-fns (lightweight, tree-shakeable, immutable)
- **Alternatives**: Day.js (smaller), Luxon (timezone support)
- **Usage**: Formatting, parsing, date arithmetic

### Utilities

- **UUID Generation**: `crypto.randomUUID()` (native browser API)
- **Class Names**: `clsx` or `cn` utility for conditional classes
- **CSV Export**: Custom implementation or `papaparse`

## Architectural Patterns

### Component Architecture

#### Presentational vs Container Pattern

- **Presentational Components**: Pure UI, receive data via props
- **Container Components**: Handle logic, data fetching, state management
- **Benefits**: Better testability, reusability, separation of concerns

Example:
```typescript
// Container Component
function ExpenseListContainer() {
  const { expenses, loading } = useExpenses();
  return <ExpenseList expenses={expenses} loading={loading} />;
}

// Presentational Component
function ExpenseList({ expenses, loading }: Props) {
  if (loading) return <Skeleton />;
  return <table>...</table>;
}
```

#### Custom Hooks Pattern

Extract component logic into reusable hooks:

```typescript
// hooks/use-expenses.ts
export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const data = storageService.getExpenses();
    setExpenses(data);
    setLoading(false);
  }, []);
  
  const addExpense = (expense: Expense) => {
    storageService.createExpense(expense);
    setExpenses([...expenses, expense]);
  };
  
  return { expenses, loading, addExpense };
}
```

### Service Layer Pattern

Create service modules for data operations:

```typescript
// services/storage.ts
export const storageService = {
  getExpenses: (): Expense[] => {
    const data = localStorage.getItem('expenses');
    return data ? JSON.parse(data) : [];
  },
  
  createExpense: (expense: Expense): void => {
    const expenses = storageService.getExpenses();
    localStorage.setItem('expenses', JSON.stringify([...expenses, expense]));
  },
  
  // ... other CRUD operations
};
```

### Routing Architecture

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="categories" element={<Categories />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Layout Pattern

Use nested routes with shared layouts:

```typescript
// components/layout/Layout.tsx
export function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}
```

## Data Flow

### Unidirectional Data Flow

1. **User Action** → Event handler triggered
2. **State Update** → State management updates data
3. **Re-render** → Components re-render with new data
4. **UI Update** → User sees updated interface

### State Management Strategy

```typescript
// For simple shared state: Context API
const ExpenseContext = createContext<ExpenseContextType>(null);

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
}

// For complex state: Zustand
import create from 'zustand';

const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  addExpense: (expense) => set((state) => ({ 
    expenses: [...state.expenses, expense] 
  })),
}));
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Expenses = lazy(() => import('./pages/Expenses'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/expenses" element={<Expenses />} />
  </Routes>
</Suspense>
```

### Memoization Strategy

```typescript
// Memoize expensive computations
const monthlySummary = useMemo(() => 
  calculateMonthlySummary(expenses), 
  [expenses]
);

// Memoize callbacks passed to children
const handleDelete = useCallback((id: string) => {
  deleteExpense(id);
}, [deleteExpense]);

// Memoize components that receive stable props
const ExpenseRow = memo(({ expense }: Props) => {
  return <tr>...</tr>;
});
```

### Bundle Optimization

- Use dynamic imports for large dependencies
- Implement tree-shaking friendly imports
- Optimize images (WebP format, lazy loading)
- Use production builds with minification
- Analyze bundle size with `vite-bundle-visualizer`

## Type Safety

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Type Definition Strategy

```typescript
// types/expense.ts
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseInput = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
export type ExpenseUpdate = Partial<ExpenseInput> & { id: string };
```

## Error Handling

### Error Boundary Pattern

```typescript
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Try-Catch in Async Operations

```typescript
async function loadExpenses() {
  try {
    setLoading(true);
    const data = await storageService.getExpenses();
    setExpenses(data);
  } catch (error) {
    setError('Failed to load expenses');
    console.error(error);
  } finally {
    setLoading(false);
  }
}
```

## Testing Architecture

### Test Organization

```
src/
├── components/
│   ├── ExpenseTable.tsx
│   └── ExpenseTable.test.tsx
├── hooks/
│   ├── use-expenses.ts
│   └── use-expenses.test.ts
└── services/
    ├── storage.ts
    └── storage.test.ts
```

### Testing Strategy

- **Unit Tests**: Pure functions, utilities, hooks
- **Integration Tests**: Component interactions, form submissions
- **E2E Tests**: Critical user flows (add expense, export CSV)

## Build & Deployment

### Environment Configuration

```typescript
// Use Vite environment variables
const API_URL = import.meta.env.VITE_API_URL;
const IS_DEV = import.meta.env.DEV;
const IS_PROD = import.meta.env.PROD;
```

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['recharts', 'date-fns'],
        },
      },
    },
  },
});
```

