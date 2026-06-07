import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getMonitorings } from '../services/api'

const AlertContext = createContext()

export function AlertProvider({ children }) {
  const [alertZones, setAlertZones] = useState([])

  const refreshAlerts = useCallback(() => {
    getMonitorings()
      .then(res => {
        const zones = {}
        res.data
          .filter(m => m.is_alert)
          .forEach(m => {
            if (!zones[m.zone_id]) {
              zones[m.zone_id] = { id: m.zone_id, name: m.zone?.name, count: 0 }
            }
            zones[m.zone_id].count++
          })
        setAlertZones(Object.values(zones))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    refreshAlerts()
  }, [refreshAlerts])

  return (
    <AlertContext.Provider value={{ alertZones, refreshAlerts }}>
      {children}
    </AlertContext.Provider>
  )
}

export const useAlerts = () => useContext(AlertContext)