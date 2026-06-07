import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Activity, AlertTriangle, ChevronDown } from 'lucide-react'
import { useAlerts } from '../context/AlertContext'

function Navbar() {
  const location = useLocation()
  const { alertZones } = useAlerts()
  const [showAlerts, setShowAlerts] = useState(false)
  const dropdownRef = useRef(null)

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? 'text-white border-b-2 border-blue-400 pb-1'
      : 'text-blue-200 hover:text-white pb-1'

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowAlerts(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <nav className="bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/20 rounded-lg">
            <Activity className="text-blue-400" size={20} />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">
            Monitoreo Industrial
          </span>
        </div>

        {/* Nav links + alertas */}
        <div className="flex items-center gap-6">
          <Link to="/zones" className={`text-sm font-medium transition-all ${isActive('/zones')}`}>
            Zonas
          </Link>
          <Link to="/sensors" className={`text-sm font-medium transition-all ${isActive('/sensors')}`}>
            Sensores
          </Link>

          {/* Campana de alertas */}
          {alertZones.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <AlertTriangle size={13} className="animate-pulse" />
                {alertZones.length} alerta{alertZones.length > 1 ? 's' : ''}
                <ChevronDown size={12} className={`transition-transform ${showAlerts ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {showAlerts && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-red-50 border-b border-red-100">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                      Zonas con alertas activas
                    </p>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                    {alertZones.map(zone => (
                      <Link
                        key={zone.id}
                        to={`/zones/${zone.id}`}
                        onClick={() => setShowAlerts(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
                          <span className="text-sm text-gray-700 font-medium">{zone.name}</span>
                        </div>
                        <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">
                          {zone.count} sensor{zone.count > 1 ? 'es' : ''}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar