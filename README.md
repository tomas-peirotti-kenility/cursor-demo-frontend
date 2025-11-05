# Expense Tracker Dashboard

A complete frontend expense tracking application built with React, TypeScript, Vite, and Tailwind CSS. Features browser-based persistence using LocalStorage.

## Features

- 📊 **Dashboard Overview** - Monthly summary with interactive charts
- 💰 **Expense Management** - Add, edit, delete expenses with categories
- 🏷️ **Category Management** - Create custom categories with colors and icons
- 📈 **Data Visualization** - Monthly bar charts and category pie charts
- 🔍 **Advanced Filtering** - Filter by date range, category, and search
- 📥 **CSV Export** - Download expense data for external analysis
- 💾 **LocalStorage Persistence** - All data saved in browser
- 🎨 **Dark Mode** - Beautiful dark theme interface
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation
- **React Hook Form + Zod** - Form validation
- **date-fns** - Date utilities

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── expenses/        # Expense management components
│   ├── categories/      # Category management components
│   └── layout/          # Layout components (Sidebar, Header)
├── pages/
│   ├── Dashboard.tsx
│   ├── Expenses.tsx
│   └── Categories.tsx
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── services/            # LocalStorage service
├── types/               # TypeScript types
└── constants/           # App constants
```

## Default Categories

The app comes with 6 default categories:
- Food
- Transportation
- Entertainment
- Utilities
- Healthcare
- Other

You can add, edit, or delete categories as needed.

## Data Persistence

All data is stored in the browser's LocalStorage:
- `expenses` - Array of expense records
- `categories` - Array of category definitions
- `initialized` - First-time setup flag

## License

MIT

