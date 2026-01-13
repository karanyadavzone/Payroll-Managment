import { useState } from 'react'
import { useMemo } from 'react'
import { Calendar, Search } from 'lucide-react'
import Card from '../../components/Card/Card'
import KPICard from '../../components/KPICard/KPICard'
import DataTable from '../../components/DataTable/DataTable'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import Drawer from '../../components/Drawer/Drawer'
import { XCircle as ErrorIcon, AlertTriangle, Info } from 'lucide-react'
import styles from './PayrollErrors.module.css'

// Mock data
const errorCategories = [
  {
    id: 'validation',
    title: 'Data Validation Errors',
    count: 12,
    severity: 'error',
    affectedEmployees: 8,
    lastOccurred: '2 hours ago',
    icon: ErrorIcon,
  },
  {
    id: 'calculation',
    title: 'Calculation Warnings',
    count: 5,
    severity: 'warning',
    affectedEmployees: 5,
    lastOccurred: '1 hour ago',
    icon: AlertTriangle,
  },
  {
    id: 'deduction',
    title: 'Deduction Issues',
    count: 3,
    severity: 'warning',
    affectedEmployees: 3,
    lastOccurred: '30 minutes ago',
    icon: AlertTriangle,
  },
  {
    id: 'approval',
    title: 'Approval Pending',
    count: 8,
    severity: 'pending',
    affectedEmployees: 8,
    lastOccurred: '15 minutes ago',
    icon: Info,
  },
]

const errorDetails = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    errorType: 'Data Validation',
    category: 'validation',
    severity: 'error',
    description: 'Missing attendance record for 15 days',
    affectedMonth: 'January 2026',
    status: 'open',
    createdAt: '2026-01-15T10:30:00',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    errorType: 'Calculation',
    category: 'calculation',
    severity: 'warning',
    description: 'Overtime hours exceed maximum limit',
    affectedMonth: 'January 2026',
    status: 'open',
    createdAt: '2026-01-15T09:15:00',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Bob Johnson',
    errorType: 'Deduction',
    category: 'deduction',
    severity: 'warning',
    description: 'Tax calculation mismatch',
    affectedMonth: 'January 2026',
    status: 'resolved',
    createdAt: '2026-01-15T08:00:00',
  },
  // Add more mock data as needed
]

function PayrollErrors() {
  // Get current month in the format used by the data (e.g., "January 2026")
  const getCurrentMonth = () => {
    const now = new Date()
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return `${monthNames[now.getMonth()]} ${now.getFullYear()}`
  }

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedError, setSelectedError] = useState(null)
  const [filters, setFilters] = useState({
    month: getCurrentMonth(),
    errorType: '',
    search: '',
  })

  const filteredErrors = useMemo(() => {
    return errorDetails.filter((error) => {
      if (selectedCategory && error.category !== selectedCategory) return false
      // Always filter by month (current month by default)
      if (error.affectedMonth !== filters.month) return false
      if (filters.errorType && error.errorType !== filters.errorType) return false
      // Filter by search query
      if (filters.search) {
        const query = filters.search.toLowerCase()
        const matchesSearch =
          error.employeeName.toLowerCase().includes(query) ||
          error.employeeId.toLowerCase().includes(query) ||
          error.description.toLowerCase().includes(query) ||
          error.errorType.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }
      return true
    })
  }, [selectedCategory, filters])

  const totalErrors = errorCategories.reduce((sum, cat) => sum + cat.count, 0)
  const totalAffected = errorCategories.reduce((sum, cat) => sum + cat.affectedEmployees, 0)
  const criticalErrors = errorCategories.filter((cat) => cat.severity === 'error').length

  const columns = [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: (info) => (
        <div>
          <div className={styles.employeeName}>{info.getValue()}</div>
          <div className={styles.employeeId}>{info.row.original.employeeId}</div>
        </div>
      ),
    },
    {
      accessorKey: 'errorType',
      header: 'Error Type',
      cell: (info) => (
        <StatusBadge
          status={info.row.original.severity}
          label={info.getValue()}
        />
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'affectedMonth',
      header: 'Month',
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Payroll Errors</h1>
          <p className={styles.subtitle}>Monitor and resolve payroll processing errors</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KPICard
          title="Total Errors"
          value={totalErrors}
          subtitle="Across all categories"
          icon={ErrorIcon}
          variant={totalErrors > 0 ? 'error' : 'default'}
        />
        <KPICard
          title="Affected Employees"
          value={totalAffected}
          subtitle="Requiring attention"
          icon={ErrorIcon}
          variant={totalAffected > 0 ? 'warning' : 'default'}
        />
        <KPICard
          title="Critical Errors"
          value={criticalErrors}
          subtitle="High priority"
          icon={ErrorIcon}
          variant={criticalErrors > 0 ? 'error' : 'default'}
        />
        <KPICard
          title="Resolved"
          value={errorDetails.filter((e) => e.status === 'resolved').length}
          subtitle="This month"
          icon={ErrorIcon}
          variant="success"
        />
      </div>

      {/* Error Categories */}
      <div className={styles.categoriesGrid}>
        {errorCategories.map((category) => {
          const Icon = category.icon
          return (
            <Card
              key={category.id}
              className={`${styles.categoryCard} ${
                selectedCategory === category.id ? styles.categoryCardSelected : ''
              }`}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
            >
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIcon}>
                  <Icon />
                </div>
                <StatusBadge status={category.severity} size="sm" />
              </div>
              <h3 className={styles.categoryTitle}>{category.title}</h3>
              <div className={styles.categoryStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Errors:</span>
                  <span className={styles.statValue}>{category.count}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Employees:</span>
                  <span className={styles.statValue}>{category.affectedEmployees}</span>
                </div>
              </div>
              <div className={styles.categoryFooter}>
                <span className={styles.lastOccurred}>
                  Last: {category.lastOccurred}
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Error Details Table */}
      <Card>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            Error Details
            {selectedCategory && (
              <span className={styles.selectedCategory}>
                - {errorCategories.find((c) => c.id === selectedCategory)?.title}
              </span>
            )}
          </h2>
          <div className={styles.filtersRow}>
            <div className={styles.searchGroup}>
              <label className={styles.filterLabel}>
                <Search size={16} className={styles.filterIcon} />
                Search
              </label>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className={styles.searchInput}
                />
              </div>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <Calendar size={16} className={styles.filterIcon} />
                Month
              </label>
              <select
                className={styles.filterSelect}
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              >
                {(() => {
                  const months = [...new Set(errorDetails.map((error) => error.affectedMonth))]
                  const currentMonth = getCurrentMonth()
                  const availableMonths = months.includes(currentMonth) ? months : [currentMonth, ...months]
                  return availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))
                })()}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Error Type</label>
              <select
                className={styles.filterSelect}
                value={filters.errorType}
                onChange={(e) => setFilters({ ...filters, errorType: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="Data Validation">Data Validation</option>
                <option value="Calculation">Calculation</option>
                <option value="Deduction">Deduction</option>
              </select>
            </div>
          </div>
        </div>
        <DataTable
          data={filteredErrors}
          columns={columns}
          searchable={false}
          filterable={false}
          emptyMessage="No errors found"
          onRowClick={(row) => {
            setSelectedError(row.original)
            setDrawerOpen(true)
          }}
        />
      </Card>

      {/* Error Detail Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedError(null)
        }}
        title="Error Details"
        width="500px"
      >
        {selectedError && (
          <div className={styles.errorDetail}>
            <div className={styles.errorDetailSection}>
              <h3 className={styles.errorDetailLabel}>Employee</h3>
              <p className={styles.errorDetailValue}>
                {selectedError.employeeName} ({selectedError.employeeId})
              </p>
            </div>
            <div className={styles.errorDetailSection}>
              <h3 className={styles.errorDetailLabel}>Error Type</h3>
              <StatusBadge
                status={selectedError.severity}
                label={selectedError.errorType}
              />
            </div>
            <div className={styles.errorDetailSection}>
              <h3 className={styles.errorDetailLabel}>Description</h3>
              <p className={styles.errorDetailValue}>{selectedError.description}</p>
            </div>
            <div className={styles.errorDetailSection}>
              <h3 className={styles.errorDetailLabel}>Affected Month</h3>
              <p className={styles.errorDetailValue}>{selectedError.affectedMonth}</p>
            </div>
            <div className={styles.errorDetailActions}>
              <button className={styles.resolveButton}>Mark as Resolved</button>
              <button className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default PayrollErrors

