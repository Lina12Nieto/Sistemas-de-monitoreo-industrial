import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ZonesPage from './pages/ZonesPage'
import ZoneDetailPage from './pages/ZoneDetailPage'
import AssignSensorPage from './pages/AssignSensorPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/zones" />} />
            <Route path="/zones" element={<ZonesPage />} />
            <Route path="/zones/:id" element={<ZoneDetailPage />} />
            <Route path="/assign" element={<AssignSensorPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App