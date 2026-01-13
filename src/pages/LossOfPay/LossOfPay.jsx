import { useState } from 'react'
import { useMemo } from 'react'
import { Calendar, Building2, Search, Users, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react'
import Card from '../../components/Card/Card'
import KPICard from '../../components/KPICard/KPICard'
import DataTable from '../../components/DataTable/DataTable'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import Drawer from '../../components/Drawer/Drawer'
import styles from './LossOfPay.module.css'

// Mock data
const lopData = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    month: 'January 2026',
    lopDays: 3,
    status: 'active',
    reason: 'Unauthorized leave',
    lastUpdated: '2026-01-15',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    department: 'Sales',
    month: 'January 2026',
    lopDays: 5,
    status: 'active',
    reason: 'Absent without notice',
    lastUpdated: '2026-01-14',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Bob Johnson',
    department: 'HR',
    month: 'December 2025',
    lopDays: 2,
    status: 'inactive',
    reason: 'Resolved - Manager approved',
    lastUpdated: '2025-12-30',
  },
  {
    id: '4',
    employeeId: 'EMP004',
    employeeName: 'Alice Williams',
    department: 'Finance',
    month: 'January 2026',
    lopDays: 1,
    status: 'active',
    reason: 'Late arrival',
    lastUpdated: '2026-01-15',
  },
  {
    id: '5',
    employeeId: 'EMP005',
    employeeName: 'Charlie Brown',
    department: 'Engineering',
    month: 'January 2026',
    lopDays: 4,
    status: 'active',
    reason: 'No attendance record',
    lastUpdated: '2026-01-13',
  },
]

function LossOfPay() {
  // Get current month in the format used by the data (e.g., "January 2026")
  const getCurrentMonth = () => {
    const now = new Date()
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return `${monthNames[now.getMonth()]} ${now.getFullYear()}`
  }

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    month: getCurrentMonth(),
    department: '',
  })

  const filteredData = useMemo(() => {
    return lopData.filter((item) => {
      // Always filter by month (current month by default)
      if (item.month !== filters.month) return false
      if (filters.department && item.department !== filters.department) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          item.employeeName.toLowerCase().includes(query) ||
          item.employeeId.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.month.toLowerCase().includes(query) ||
          item.reason.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }
      return true
    })
  }, [filters, searchQuery])

  const summary = useMemo(() => {
    const active = filteredData.filter((item) => item.status === 'active')
    const totalDays = filteredData.reduce((sum, item) => sum + item.lopDays, 0)
    const activeDays = active.reduce((sum, item) => sum + item.lopDays, 0)
    return {
      totalEmployees: filteredData.length,
      activeEmployees: active.length,
      totalDays,
      activeDays,
    }
  }, [filteredData])

  const departments = [...new Set(lopData.map((item) => item.department))]
  const months = [...new Set(lopData.map((item) => item.month))]
  
  // Ensure current month is in the months list if not already present
  const currentMonth = getCurrentMonth()
  const availableMonths = months.includes(currentMonth) ? months : [currentMonth, ...months]

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
      accessorKey: 'department',
      header: 'Department',
    },
    {
      accessorKey: 'month',
      header: 'Month',
    },
    {
      accessorKey: 'lopDays',
      header: 'LOP Days',
      cell: (info) => (
        <span className={styles.lopDays}>{info.getValue()} days</span>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: (info) => (
        <div className={styles.reasonCell}>
          {info.getValue()}
          {info.row.original.status === 'active' && (
            <AlertTriangle size={18} className={styles.warningIcon} />
          )}
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Loss of Pay (LOP)</h1>
          <p className={styles.subtitle}>Track and manage loss of pay records</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KPICard
          title="Total LOP Employees"
          value={summary.totalEmployees}
          subtitle="All time periods"
          icon={Users}
        />
        <KPICard
          title="Active Cases"
          value={summary.activeEmployees}
          subtitle="Requiring attention"
          icon={AlertTriangle}
          variant={summary.activeEmployees > 0 ? 'warning' : 'default'}
        />
        <KPICard
          title="Total LOP Days"
          value={summary.totalDays}
          subtitle="Across all employees"
          icon={CalendarIcon}
        />
        <KPICard
          title="Active LOP Days"
          value={summary.activeDays}
          subtitle="Current period"
          icon={CalendarIcon}
          variant={summary.activeDays > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* LOP Table */}
      <Card>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Loss of Pay Records</h2>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <Building2 size={16} className={styles.filterIcon} />
                Department
              </label>
              <select
                className={styles.filterSelect}
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <DataTable
          data={filteredData}
          columns={columns}
          searchable={false}
          filterable={false}
          exportable={true}
          emptyMessage="No LOP records found"
        />
      </Card>

      {/* Employee Detail Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedEmployee(null)
        }}
        title={selectedEmployee ? `${selectedEmployee.employeeName} - LOP Details` : 'LOP Details'}
        width="500px"
      >
        {selectedEmployee && (
          <div className={styles.employeeDetail}>
            <div className={styles.employeeDetailSection}>
              <h3 className={styles.employeeDetailLabel}>Employee Information</h3>
              <div className={styles.employeeInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Name:</span>
                  <span className={styles.infoValue}>{selectedEmployee.employeeName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>ID:</span>
                  <span className={styles.infoValue}>{selectedEmployee.employeeId}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Department:</span>
                  <span className={styles.infoValue}>{selectedEmployee.department}</span>
                </div>
              </div>
            </div>

            <div className={styles.employeeDetailSection}>
              <h3 className={styles.employeeDetailLabel}>LOP Details</h3>
              <div className={styles.employeeInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Month:</span>
                  <span className={styles.infoValue}>{selectedEmployee.month}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>LOP Days:</span>
                  <span className={`${styles.infoValue} ${styles.lopDaysValue}`}>
                    {selectedEmployee.lopDays} days
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Reason:</span>
                  <span className={styles.infoValue}>{selectedEmployee.reason}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Last Updated:</span>
                  <span className={styles.infoValue}>{selectedEmployee.lastUpdated}</span>
                </div>
              </div>
            </div>

            {selectedEmployee.status === 'active' && (
              <div className={styles.employeeDetailActions}>
                <button className={styles.resolveButton}>Resolve LOP</button>
                <button className={styles.cancelButton}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default LossOfPay

