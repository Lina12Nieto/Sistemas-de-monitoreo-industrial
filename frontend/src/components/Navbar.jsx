import { Link, useLocation } from 'react-router-dom'
import { Activity, PlusCircle } from 'lucide-react'

function Navbar() {
  const location = useLocation()

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? 'text-blue-600 border-b-2 border-blue-600'
      : 'text-gray-500 hover:text-gray-800'

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Activity className="text-blue-600" size={22} />
          <span className="font-semibold text-gray-800 text-lg">
            Monitoreo Industrial
          </span>
        </div>
        <div className="flex gap-6">
          <Link to="/zones" className={`text-sm font-medium pb-1 transition-all ${isActive('/zones')}`}>
            Zonas
          </Link>
          <Link to="/sensors" className={`text-sm font-medium pb-1 transition-all ${isActive('/sensors')}`}>
            Sensores
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar