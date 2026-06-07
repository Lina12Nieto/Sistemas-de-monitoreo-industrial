import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ZonesPage from './pages/ZonesPage'
import ZoneDetailPage from './pages/ZoneDetailPage'
import SensorsPage from './pages/SensorsPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/zones" replace />} />
          <Route path="/zones" element={<ZonesPage />} />
          <Route path="/zones/:id" element={<ZoneDetailPage />} />
          <Route path="/sensors" element={<SensorsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
