import { TrendingUp, TrendingDown } from 'lucide-react'
import styles from './KPICard.module.css'

function KPICard({ title, value, subtitle, trend, trendValue, icon: Icon, variant = 'default' }) {
  const isPositive = trend === 'up'
  const isNegative = trend === 'down'

  return (
    <div className={`${styles.kpiCard} ${styles[variant]}`}>
      <div className={styles.kpiHeader}>
        <div className={styles.kpiTitle}>{title}</div>
        {Icon && (
          <div className={styles.kpiIcon}>
            <Icon />
          </div>
        )}
      </div>
      <div className={styles.kpiValue}>{value}</div>
      {subtitle && <div className={styles.kpiSubtitle}>{subtitle}</div>}
      {trend && trendValue && (
        <div className={`${styles.kpiTrend} ${isPositive ? styles.trendUp : isNegative ? styles.trendDown : ''}`}>
          {isPositive ? <TrendingUp size={16} /> : isNegative ? <TrendingDown size={16} /> : null}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  )
}

export default KPICard

