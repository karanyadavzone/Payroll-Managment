import { CheckCircle, XCircle, Clock } from 'lucide-react'
import styles from './Stepper.module.css'

const stepStatuses = {
  completed: { icon: CheckCircle, className: styles.completed },
  error: { icon: XCircle, className: styles.error },
  pending: { icon: Clock, className: styles.pending },
  active: { icon: Clock, className: styles.active },
}

function Stepper({ steps, orientation = 'horizontal' }) {
  return (
    <div className={`${styles.stepper} ${styles[orientation]}`}>
      {steps.map((step, index) => {
        const statusConfig = stepStatuses[step.status] || stepStatuses.pending
        const Icon = statusConfig.icon
        const isLast = index === steps.length - 1

        return (
          <div key={step.id || index} className={styles.stepContainer}>
            <div className={styles.stepContent}>
              <div className={`${styles.stepCircle} ${statusConfig.className}`}>
                <Icon size={24} />
              </div>
              <div className={styles.stepInfo}>
                <div className={styles.stepTitle}>{step.title}</div>
                {step.description && (
                  <div className={styles.stepDescription}>{step.description}</div>
                )}
                {step.metadata && (
                  <div className={styles.stepMetadata}>
                    {Object.entries(step.metadata).map(([key, value]) => (
                      <span key={key} className={styles.metadataItem}>
                        <strong>{key}:</strong> {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {!isLast && <div className={`${styles.stepConnector} ${statusConfig.className}`} />}
          </div>
        )
      })}
    </div>
  )
}

export default Stepper

