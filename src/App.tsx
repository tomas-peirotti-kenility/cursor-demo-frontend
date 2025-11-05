import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/layout'
import { Toaster } from '@/components/ui/toaster'

const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Expenses = lazy(() => import('@/pages/Expenses').then(m => ({ default: m.Expenses })))
const Categories = lazy(() => import('@/pages/Categories').then(m => ({ default: m.Categories })))

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </Suspense>
      </Layout>
      <Toaster />
    </Router>
  )
}

export default App

