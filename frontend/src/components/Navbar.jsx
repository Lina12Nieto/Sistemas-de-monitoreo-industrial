import { Link, useLocation } from 'react-router-dom'
import { Activity } from 'lucide-react'

function Navbar() {
  const location = useLocation()

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? 'text-white border-b-2 border-blue-400 pb-1'
      : 'text-blue-200 hover:text-white pb-1'

  return (
    <nav className="bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/20 rounded-lg">
            <Activity className="text-blue-400" size={20} />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">
            Monitoreo Industrial
          </span>
        </div>
        <div className="flex gap-6">
          <Link to="/zones" className={`text-sm font-medium transition-all ${isActive('/zones')}`}>
            Zonas
          </Link>
          <Link to="/sensors" className={`text-sm font-medium transition-all ${isActive('/sensors')}`}>
            Sensores
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar