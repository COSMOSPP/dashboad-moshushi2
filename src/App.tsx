import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardProvider } from './context/DashboardContext'
import { DashboardPage } from './pages/DashboardPage'
import { DataListPage } from './pages/DataListPage'

export default function App() {
  return (
    <DashboardProvider>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/training" element={<DashboardPage />} />
        <Route path="/dashboard/quality" element={<DashboardPage />} />
        <Route path="/dashboard/teachers" element={<DashboardPage />} />
        <Route path="/dashboard/employment" element={<DashboardPage />} />
        <Route path="/students" element={<DataListPage />} />
        <Route path="/students/:id" element={<DataListPage />} />
        <Route path="/courses" element={<DataListPage />} />
        <Route path="/courses/:id" element={<DataListPage />} />
        <Route path="/teachers" element={<DataListPage />} />
        <Route path="/teachers/:id" element={<DataListPage />} />
        <Route path="/employment" element={<DataListPage />} />
        <Route path="/employment/:id" element={<DataListPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardProvider>
  )
}
