import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Search, Building2 } from 'lucide-react'
import Card from '../../components/Card/Card'
import KPICard from '../../components/KPICard/KPICard'
import { Users, ArrowLeftRight, DollarSign } from 'lucide-react'
import styles from './SalaryComparison.module.css'

// Mock data
const salaryData = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    previousSalary: 75000,
    currentSalary: 80000,
    difference: 5000,
    differencePercent: 6.67,
    status: 'increase',
    components: {
      basic: { previous: 45000, current: 48000 },
      hra: { previous: 15000, current: 16000 },
      allowances: { previous: 10000, current: 11000 },
      deductions: { previous: 5000, current: 5000 },
      net: { previous: 65000, current: 70000 },
    },
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    department: 'Sales',
    previousSalary: 60000,
    currentSalary: 55000,
    difference: -5000,
    differencePercent: -8.33,
    status: 'decrease',
    components: {
      basic: { previous: 36000, current: 33000 },
      hra: { previous: 12000, current: 11000 },
      allowances: { previous: 8000, current: 7000 },
      deductions: { previous: 4000, current: 4000 },
      net: { previous: 52000, current: 47000 },
    },
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Bob Johnson',
    department: 'HR',
    previousSalary: 70000,
    currentSalary: 70000,
    difference: 0,
    differencePercent: 0,
    status: 'no-change',
    components: {
      basic: { previous: 42000, current: 42000 },
      hra: { previous: 14000, current: 14000 },
      allowances: { previous: 10000, current: 10000 },
      deductions: { previous: 4000, current: 4000 },
      net: { previous: 62000, current: 62000 },
    },
  },
  {
    id: '4',
    employeeId: 'EMP004',
    employeeName: 'Alice Williams',
    department: 'Finance',
    previousSalary: 65000,
    currentSalary: 72000,
    difference: 7000,
    differencePercent: 10.77,
    status: 'increase',
    components: {
      basic: { previous: 39000, current: 43200 },
      hra: { previous: 13000, current: 14400 },
      allowances: { previous: 9000, current: 10000 },
      deductions: { previous: 5000, current: 5000 },
      net: { previous: 56000, current: 62600 },
    },
  },
]

function SalaryComparison() {
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [selectedPeriod, setSelectedPeriod] = useState('January 2026 vs December 2025')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  const summary = useMemo(() => {
    const increases = salaryData.filter((item) => item.status === 'increase').length
    const decreases = salaryData.filter((item) => item.status === 'decrease').length
    const totalDifference = salaryData.reduce((sum, item) => sum + item.difference, 0)
    const avgDifference = totalDifference / salaryData.length

    return {
      totalEmployees: salaryData.length,
      increases,
      decreases,
      totalDifference,
      avgDifference,
    }
  }, [])

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const departments = useMemo(() => {
    return [...new Set(salaryData.map((item) => item.department))].sort()
  }, [])

  const filteredData = useMemo(() => {
    return salaryData.filter((item) => {
      // Filter by department
      if (selectedDepartment && item.department !== selectedDepartment) return false
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          item.employeeName.toLowerCase().includes(query) ||
          item.employeeId.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }
      
      return true
    })
  }, [searchQuery, selectedDepartment])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Salary Comparison</h1>
          <p className={styles.subtitle}>Compare salary changes across periods</p>
        </div>
        <div className={styles.periodSelector}>
          <select
            className={styles.periodSelect}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option>January 2026 vs December 2025</option>
            <option>December 2025 vs November 2025</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KPICard
          title="Total Employees"
          value={summary.totalEmployees}
          subtitle="In comparison"
          icon={Users}
        />
        <KPICard
          title="Salary Increases"
          value={summary.increases}
          subtitle="Employees with raises"
          icon={TrendingUp}
          variant="success"
          trend="up"
          trendValue={`${((summary.increases / summary.totalEmployees) * 100).toFixed(1)}%`}
        />
        <KPICard
          title="Salary Decreases"
          value={summary.decreases}
          subtitle="Employees with reductions"
          icon={TrendingDown}
          variant={summary.decreases > 0 ? 'error' : 'default'}
        />
        <KPICard
          title="Net Difference"
          value={formatCurrency(summary.totalDifference)}
          subtitle={`Avg: ${formatCurrency(summary.avgDifference)}`}
          icon={DollarSign}
          variant={summary.totalDifference > 0 ? 'success' : 'default'}
        />
      </div>

      {/* Comparison Table */}
      <Card>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Salary Comparison Details</h2>
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
                <Building2 size={16} className={styles.filterIcon} />
                Department
              </label>
              <select
                className={styles.filterSelect}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
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
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '50px' }}></th>
                <th className={styles.th}>Employee</th>
                <th className={styles.th}>Department</th>
                <th className={styles.th}>Previous Salary</th>
                <th className={styles.th}>Current Salary</th>
                <th className={styles.th}>Difference</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    No salary data available
                  </td>
                </tr>
              ) : (
                filteredData.map((employee) => (
                  <>
                    <tr key={employee.id} className={styles.tr}>
                      <td className={styles.td}>
                        <button
                          className={styles.expandButton}
                          onClick={() => toggleRow(employee.id)}
                        >
                          {expandedRows.has(employee.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </td>
                      <td className={styles.td}>
                        <div>
                          <div className={styles.employeeName}>{employee.employeeName}</div>
                          <div className={styles.employeeId}>{employee.employeeId}</div>
                        </div>
                      </td>
                      <td className={styles.td}>{employee.department}</td>
                      <td className={styles.td}>{formatCurrency(employee.previousSalary)}</td>
                      <td className={styles.td}>{formatCurrency(employee.currentSalary)}</td>
                      <td className={styles.td}>
                        <div className={styles.differenceCell}>
                          {employee.difference > 0 ? (
                            <TrendingUp size={18} className={styles.trendIcon} />
                          ) : employee.difference < 0 ? (
                            <TrendingDown size={18} className={styles.trendIconDown} />
                          ) : null}
                          <span
                            className={`${styles.differenceValue} ${
                              employee.difference > 0
                                ? styles.positive
                                : employee.difference < 0
                                ? styles.negative
                                : ''
                            }`}
                          >
                            {formatCurrency(Math.abs(employee.difference))} (
                            {employee.differencePercent > 0 ? '+' : ''}
                            {employee.differencePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </td>
                    </tr>
                    {expandedRows.has(employee.id) && (
                      <tr key={`${employee.id}-details`} className={styles.accordionRow}>
                        <td colSpan={6} className={styles.accordionCell}>
                          <div className={styles.expandedRow}>
                            <div className={styles.expandedHeader}>
                              <h3 className={styles.expandedTitle}>
                                Salary Breakdown - {employee.employeeName}
                              </h3>
                            </div>
                            <div className={styles.componentsGrid}>
                              <div className={styles.componentCard}>
                                <div className={styles.componentHeader}>
                                  <span className={styles.componentLabel}>Basic Salary</span>
                                </div>
                                <div className={styles.componentValues}>
                                  <div className={styles.componentValue}>
                                    <span className={styles.valueLabel}>Previous:</span>
                                    <span className={styles.valueAmount}>
                                      {formatCurrency(employee.components.basic.previous)}
                                    </span>
                                  </div>
                                  <div className={styles.componentValue}>
                                    <span className={styles.valueLabel}>Current:</span>
                                    <span
                                      className={`${styles.valueAmount} ${
                                        employee.components.basic.current > employee.components.basic.previous
                                          ? styles.positive
                                          : employee.components.basic.current < employee.components.basic.previous
                                          ? styles.negative
                                          : ''
                                      }`}
                                    >
                                      {formatCurrency(employee.components.basic.current)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.componentCard}>
                                <div className={styles.componentHeader}>
                                  <span className={styles.componentLabel}>HRA</span>
                                </div>
                                <div className={styles.componentValues}>
                                  <div className={styles.componentValue}>
                                    <span className={styles.valueLabel}>Previous:</span>
                                    <span className={styles.valueAmount}>
                                      {formatCurrency(employee.components.hra.previous)}
                                    </span>
                                  </div>
                                  <div className={styles.componentValue}>
                                    <span className={styles.valueLabel}>Current:</span>
                                    <span
                                      className={`${styles.valueAmount} ${
                                        employee.components.hra.current > employee.components.hra.previous
                                          ? styles.positive
                                          : employee.components.hra.current < employee.components.hra.previous
                                          ? styles.negative
                                          : ''
                                      }`}
                                    >
                                      {formatCurrency(employee.components.hra.current)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.componentCard}>
                                <div className={styles.componentHeader}>
                                  <span className={styles.componentLabel}>Allowances</span>
                                </div>
                                <div className={styles.componentValues}>
                                  <div className={styles.componentValue}>
                                    <span className={styles.valueLabel}>Previous:</span>
                                    <span className={styles.valueAmount}>
                                      {formatCurrency(employee.components.allowances.previous)}
                                    </span>
                                  </div>
                                  <div className={styles.componentValue}>
                                    <span className={styles.valueLabel}>Current:</span>
                                    <span
                                      className={`${styles.valueAmount} ${
                                        employee.components.allowances.current > employee.components.allowances.previous
                                          ? styles.positive
                                          : employee.components.allowances.current < employee.components.allowances.previous
                                          ? styles.negative
                                          : ''
                                      }`}
                                    >
                                      {formatCurrency(employee.components.allowances.current)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.componentCard}>
                                <div className={styles.componentHeader}>
                                  <span className={styles.componentLabel}>Deductions</span>
                                </div>
                                <div className={styles.componentValues}>
                                  <div className={styles.componentValue}>
                                    <span className={styles.valueLabel}>Previous:</span>
                                    <span className={styles.valueAmount}>
                                      {formatCurrency(employee.components.deductions.previous)}
                                    </span>
                                  </div>
                                  <div className={styles.componentValue}>
                                    <span className={styles.valueLabel}>Current:</span>
                                    <span className={styles.valueAmount}>
                                      {formatCurrency(employee.components.deductions.current)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className={`${styles.componentCard} ${styles.netCard}`}>
                                <div className={styles.componentHeader}>
                                  <span className={styles.componentLabel}>Net Salary</span>
                                </div>
                                <div className={styles.componentValues}>
                                  <div className={styles.componentValue}>
                                    <span className={styles.valueLabel}>Previous:</span>
                                    <span className={styles.valueAmount}>
                                      {formatCurrency(employee.components.net.previous)}
                                    </span>
                                  </div>
                                  <div className={styles.componentValue}>
                                    <span className={styles.valueLabel}>Current:</span>
                                    <span
                                      className={`${styles.valueAmount} ${styles.netValue} ${
                                        employee.components.net.current > employee.components.net.previous
                                          ? styles.positive
                                          : employee.components.net.current < employee.components.net.previous
                                          ? styles.negative
                                          : ''
                                      }`}
                                    >
                                      {formatCurrency(employee.components.net.current)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default SalaryComparison

