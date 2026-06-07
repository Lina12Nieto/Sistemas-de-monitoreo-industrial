import { AlertTriangle, CheckCircle } from 'lucide-react'

function AlertIndicator({ currentValue, thresholdValue, isAlert }) {
  if (isAlert) {
    return (
      <div className="flex items-center gap-1.5 text-red-600">
        <AlertTriangle size={15} />
        <span className="text-xs font-medium">
          {currentValue} - umbral {thresholdValue}
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5 text-green-600">
      <CheckCircle size={15} />
      <span className="text-xs font-medium">
        {currentValue} - umbral {thresholdValue}
      </span>
    </div>
  )
}

export default AlertIndicator