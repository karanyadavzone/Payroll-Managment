import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react'
import styles from './StatusBadge.module.css'

const statusConfig = {
  success: { icon: CheckCircle, color: 'success' },
  error: { icon: XCircle, color: 'error' },
  warning: { icon: AlertTriangle, color: 'warning' },
  pending: { icon: Clock, color: 'pending' },
  completed: { icon: CheckCircle, color: 'success' },
  failed: { icon: XCircle, color: 'error' },
  running: { icon: Clock, color: 'info' },
}

function StatusBadge({ status, label, size = 'md' }) {
  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  return (
    <span className={`${styles.badge} ${styles[config.color]} ${styles[size]}`}>
      <Icon size={14} className={styles.icon} />
      {label || status}
    </span>
  )
}

export default StatusBadge

