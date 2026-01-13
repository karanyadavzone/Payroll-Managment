import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  LayoutDashboard,
  AlertCircle,
  DollarSign,
  ArrowLeftRight,
} from 'lucide-react'
import styles from './Layout.module.css'

const navigation = [
  { path: '/payroll-process', label: 'Payroll Process', icon: LayoutDashboard },
  { path: '/payroll-errors', label: 'Payroll Errors', icon: AlertCircle },
  { path: '/loss-of-pay', label: 'Loss of Pay', icon: DollarSign },
  { path: '/salary-comparison', label: 'Salary Comparison', icon: ArrowLeftRight },
]

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>Payroll</h1>
          <button
            className={styles.toggleButton}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu />
          </button>
        </div>
        <nav className={styles.nav}>
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon className={styles.navIcon} />
                {sidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}

export default Layout

