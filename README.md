# Expense Tracker Dashboard

A modern, feature-rich expense tracking application built with React, TypeScript, and Tailwind CSS. Track your expenses, visualize spending patterns, and manage categories with an intuitive dark-mode interface.

## Features

- **Dashboard Overview**: View monthly spending summaries with interactive charts
- **Expense Management**: Add, edit, delete, and filter expenses with ease
- **Category Management**: Create custom categories with colors and icons
- **Data Visualization**: Interactive bar charts and pie charts using Recharts
- **CSV Export**: Export your expense data for external analysis
- **LocalStorage Persistence**: All data is saved locally in your browser
- **Dark Mode**: Beautiful dark theme optimized for extended use
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive validation using Zod and React Hook Form

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router
- **Forms**: React Hook Form + Zod
- **Date Handling**: date-fns
- **Icons**: Lucide React + Material Symbols

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── expenses/        # Expense management components
│   ├── categories/      # Category management components
│   └── layout/          # Layout components (sidebar, header)
├── pages/
│   ├── Dashboard.tsx    # Dashboard page
│   ├── Expenses.tsx     # Expenses page
│   └── Categories.tsx   # Categories page
├── hooks/
│   ├── use-expenses.ts  # Expense management hook
│   ├── use-categories.ts # Category management hook
│   ├── use-export.ts    # CSV export hook
│   └── use-toast.ts     # Toast notifications hook
├── lib/
│   ├── utils.ts         # Utility functions
│   ├── csv-export.ts    # CSV export logic
│   └── date-utils.ts    # Date formatting utilities
├── services/
│   └── storage.ts       # LocalStorage service
├── types/
│   ├── expense.ts       # Expense type definitions
│   └── category.ts      # Category type definitions
└── constants/
    └── default-categories.ts # Default category definitions
```

## Usage

### Adding an Expense

1. Navigate to the Expenses page
2. Click "Add New Expense"
3. Fill in the amount, description, category, and date
4. Click "Save Expense"

### Managing Categories

1. Navigate to the Categories page
2. Click "Create New Category"
3. Enter a name, select a color and icon
4. Click "Save Category"

### Exporting Data

1. Navigate to the Expenses page
2. Apply any filters you want
3. Click "Export to CSV"
4. Your data will be downloaded as a CSV file

## Default Categories

The app comes with 6 default categories:
- Food (Green)
- Transportation (Blue)
- Entertainment (Purple)
- Utilities (Orange)
- Healthcare (Red)
- Other (Gray)

You can add, edit, or delete categories as needed.

## Data Storage

All data is stored in your browser's LocalStorage. This means:
- Your data persists across browser sessions
- Your data is private and never leaves your device
- Clearing browser data will delete your expenses
- Data is not synced across devices

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

