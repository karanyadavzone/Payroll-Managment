import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, Info, Calendar, Search, ArrowLeft } from 'lucide-react'
import styles from './IncentiveCalculationReport.module.css'

function IncentiveCalculationReport() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [incentivePayoutFilter, setIncentivePayoutFilter] = useState('All')
  const [variablePayFilter, setVariablePayFilter] = useState('All')
  const [isVerified, setIsVerified] = useState(false)
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)

  // Get month from location state or use default
  const month = location.state?.month || 'January 2026'

  const columns = [
    'Incentive Payout %',
    'Employee Name',
    'Employee Code',
    'Email',
    'Incentive Remarks',
    'Variable Pay',
    'productivity target incentive (For 75%)',
    'productivity target incentive (For 100%)',
    'productivity target incentive (For 125%)',
    'CVR',
    'SSAT',
    'Prod 4 Hours',
    'Prod 8 Hours',
    'consolidated prod.',
    'Huddle %',
    'NTB %',
    'Case Audit %',
    'Customer Recovery %',
    'O2O %',
  ]

  // Fetch report data when component mounts
  useEffect(() => {
    // TODO: Replace with actual API call
    // fetchIncentiveReportData(month)
  }, [month])

  const handleGoBack = () => {
    navigate('/payroll-process')
  }

  const handleSubmit = async () => {
    if (!isVerified) {
      alert('Please verify the incentive calculation before submitting.')
      return
    }

    setLoading(true)
    try {
      // TODO: Replace with actual API call
      // For now, using mock API
      const { mockPayrollApi } = await import('../../services/payrollApi')
      const result = await mockPayrollApi.runIncentiveCalculation(month)
      
      // Navigate back to payroll process after successful verification
      navigate('/payroll-process', { 
        state: { 
          message: result.message || 'Incentive Calculation Report verified successfully',
          stepId: 'incentive-calculation',
          verified: true
        },
        replace: true
      })
    } catch (error) {
      alert('Error submitting incentive calculation: ' + error.message)
      setLoading(false)
    }
  }

  const handleClose = () => {
    navigate('/payroll-process')
  }

  return (
    <div className={styles.reportPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>GOMOS</div>
        </div>
        <div className={styles.headerCenter}>
          <h1 className={styles.reportTitle}>EmplyFi Incentive Calculation Report</h1>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>Name : Name</div>
            <div className={styles.userEmail}>Email : @gigmos.com</div>
          </div>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Go Back Button */}
      <div className={styles.goBackSection}>
        <button className={styles.goBackButton} onClick={handleGoBack}>
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Search</label>
            <div className={styles.searchInputWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search By Name, Code, Mail"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Select Date:</label>
            <div className={styles.dateInputWrapper}>
              <input
                type="date"
                className={styles.dateInput}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <Calendar size={16} className={styles.calendarIcon} />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Incentive Payout %:</label>
            <select
              className={styles.filterSelect}
              value={incentivePayoutFilter}
              onChange={(e) => setIncentivePayoutFilter(e.target.value)}
            >
              <option value="All">All</option>
              {/* Add more options as needed */}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Variable Pay</label>
            <select
              className={styles.filterSelect}
              value={variablePayFilter}
              onChange={(e) => setVariablePayFilter(e.target.value)}
            >
              <option value="All">All</option>
              {/* Add more options as needed */}
            </select>
          </div>

          <button className={styles.infoButton} title="Information">
            <Info size={18} />
          </button>
        </div>

        <div className={styles.countDisplay}>
          Count of engineers: {reportData.length}
        </div>
      </div>

      {/* Table Section */}
      <div className={styles.tableSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.reportTable}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                {columns.map((column, index) => (
                  <th key={index} className={styles.tableHeader}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className={styles.emptyCell}>
                    No data available
                  </td>
                </tr>
              ) : (
                reportData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={styles.tableRow}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className={styles.tableCell}>
                        {row[column] || '-'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
            />
            <span>Incentive Calculation Verified</span>
          </label>
        </div>
        <div className={styles.footerRight}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!isVerified || loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button className={styles.closeButtonFooter} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default IncentiveCalculationReport

