# Expense Tracker Application

A complete expense tracking application built with React, TypeScript, and Vite. Features browser-based persistence using LocalStorage, providing a full-featured expense management system without requiring a backend.

## Features

- 📊 **Dashboard Overview** - View monthly summaries with interactive charts
- 💰 **Expense Management** - Add, edit, and delete expenses with validation
- 🏷️ **Category Management** - Create and manage custom expense categories with colors and icons
- 📈 **Data Visualization** - Monthly bar charts and category pie charts using Recharts
- 🔍 **Advanced Filtering** - Filter expenses by date, category, amount, and search term
- 📄 **CSV Export** - Export all expenses to CSV format
- 📱 **Responsive Design** - Mobile-friendly interface with dark mode support
- 💾 **LocalStorage Persistence** - All data stored in browser (no backend required)

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components inspired by Shadcn UI
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React

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

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── dashboard/      # Dashboard-specific components
│   ├── expenses/       # Expense management components
│   ├── categories/     # Category management components
│   └── layout/         # Layout components (Sidebar, Layout)
├── pages/              # Route/page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── services/           # LocalStorage service
├── types/              # TypeScript type definitions
└── constants/          # Application constants
```

## Features in Detail

### Dashboard
- Monthly spending summary with 4 key metrics
- Interactive bar chart showing last 6 months of spending
- Category breakdown pie chart for current month
- Trend indicators showing spending changes

### Expense Management
- Add new expenses with amount, description, category, and date
- Edit existing expenses
- Delete expenses with confirmation
- Sort expenses by date, amount, category, or description
- Filter by date range, category, or search term
- Pagination with 10 items per page
- Export all expenses to CSV

### Category Management
- Create custom categories with colors and icons
- Edit category details
- Delete categories (protected if they have expenses)
- View total spending and transaction count per category
- Visual category statistics

### Data Validation
- Amount: Positive number with max 2 decimal places
- Description: 3-200 characters required
- Category: Must exist in categories list
- Date: Cannot be in the future
- Category name: Must be unique, 2-50 characters

## LocalStorage Schema

### Expenses
```typescript
{
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Categories
```typescript
{
  id: string;
  name: string;
  color: string; // Hex color code
  icon: string;  // Icon identifier
  createdAt: Date;
}
```

## Default Categories

The app comes pre-seeded with 6 default categories:
- Food (green)
- Transportation (blue)
- Entertainment (purple)
- Utilities (orange)
- Healthcare (red)
- Other (gray)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

