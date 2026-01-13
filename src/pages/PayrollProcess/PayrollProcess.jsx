import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Play, Info, FileText, Check, Eye, Users as UsersIcon, AlertCircle, Calendar, Table2, Grid3x3, CalendarDays } from 'lucide-react'
import Card from '../../components/Card/Card'
import KPICard from '../../components/KPICard/KPICard'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import Modal from '../../components/Modal/Modal'
import { Users, CheckCircle, XCircle as ErrorIcon, Clock } from 'lucide-react'
import { mockPayrollApi } from '../../services/payrollApi'
import styles from './PayrollProcess.module.css'

// Payroll process steps matching your screenshot
const initialPayrollSteps = [
  {
    id: 'incentive-validation',
    title: 'Incentive Final Type Validation for January',
    description: 'Validates incentive final types before processing',
    actionType: 'submit',
    hasCheckbox: true,
    hasInfoIcon: false,
    hasReportLink: false,
    status: 'pending',
    month: 'January',
    metadata: {
      'Processed': '0 employees',
      'Errors': '0',
      'Last Run': 'Not started',
    },
  },
  {
    id: 'incentive-calculation',
    title: 'Incentive Calculation Microsoft',
    description: 'Calculates incentives for all eligible employees',
    actionType: 'run',
    hasCheckbox: false,
    hasInfoIcon: false,
    hasReportLink: true,
    reportLinkText: 'Incentive Calculation Report',
    status: 'pending',
    month: 'January',
    metadata: {
      'Processed': '0 employees',
      'Errors': '0',
      'Last Run': 'Not started',
    },
  },
  {
    id: 'performance-incentive',
    title: 'Performance Incentive Microsoft (Push to GreytHR)',
    description: 'Pushes performance incentive data to GreytHR system',
    actionType: 'run',
    hasCheckbox: false,
    hasInfoIcon: false,
    hasReportLink: false,
    status: 'pending',
    month: 'January',
    metadata: {
      'Processed': '0 employees',
      'Errors': '0',
      'Last Run': 'Not started',
    },
  },
  {
    id: 'arrears-deductions',
    title: 'Arrears/Deductions (+/-) for January',
    description: 'Processes arrears and deductions adjustments',
    actionType: 'submit',
    hasCheckbox: true,
    hasInfoIcon: true,
    hasReportLink: false,
    status: 'pending',
    month: 'January',
    metadata: {
      'Processed': '0 employees',
      'Errors': '0',
      'Last Run': 'Not started',
    },
  },
  {
    id: 'leave-requests',
    title: 'Leave Requests reviewed on GreytHR for January',
    description: 'Reviews and processes leave requests from GreytHR',
    actionType: 'submit',
    hasCheckbox: true,
    hasInfoIcon: false,
    hasReportLink: false,
    status: 'pending',
    month: 'January',
    metadata: {
      'Processed': '0 employees',
      'Errors': '0',
      'Last Run': 'Not started',
    },
  },
  {
    id: 'lop-push',
    title: 'LOP (Push to GreytHR)',
    description: 'Pushes Loss of Pay data to GreytHR system',
    actionType: 'run',
    hasCheckbox: false,
    hasInfoIcon: true,
    hasReportLink: false,
    status: 'pending',
    month: 'January',
    metadata: {
      'Processed': '0 employees',
      'Errors': '0',
      'Last Run': 'Not started',
    },
  },
  {
    id: 'bank-transfer',
    title: 'Bank File Transfer',
    description: 'Generates and transfers bank files for salary disbursement',
    actionType: 'run',
    hasCheckbox: false,
    hasInfoIcon: false,
    hasReportLink: false,
    status: 'pending',
    month: 'January',
    metadata: {
      'Processed': '0 employees',
      'Errors': '0',
      'Last Run': 'Not started',
    },
  },
  {
    id: 'salary-statement',
    title: 'Salary Statement',
    description: 'Generates salary statements for all employees',
    actionType: 'run',
    hasCheckbox: false,
    hasInfoIcon: false,
    hasReportLink: false,
    status: 'pending',
    month: 'January',
    metadata: {
      'Processed': '0 employees',
      'Errors': '0',
      'Last Run': 'Not started',
    },
  },
]

function PayrollProcess() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Load state from localStorage or use initial state
  const loadStateFromStorage = () => {
    try {
      const saved = localStorage.getItem('payrollSteps')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error)
    }
    return initialPayrollSteps
  }

  const [payrollSteps, setPayrollSteps] = useState(loadStateFromStorage)
  const [checkedSteps, setCheckedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('checkedSteps')
      if (saved) {
        return new Set(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading checkedSteps from localStorage:', error)
    }
    return new Set()
  })
  const [runningSteps, setRunningSteps] = useState(new Set())
  // Get current month in the format used by the data (e.g., "January 2026")
  const getCurrentMonth = () => {
    const now = new Date()
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return `${monthNames[now.getMonth()]} ${now.getFullYear()}`
  }

  const [selectedMonth, setSelectedMonth] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedMonth')
      return saved || getCurrentMonth()
    } catch (error) {
      return getCurrentMonth()
    }
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState(null) // 'success', 'error', 'logs', 'confirm', 'info'
  const [modalData, setModalData] = useState(null)
  const [selectedStepForModal, setSelectedStepForModal] = useState(null)
  const [incentiveReportVerified, setIncentiveReportVerified] = useState(() => {
    try {
      const saved = localStorage.getItem('incentiveReportVerified')
      return saved === 'true'
    } catch (error) {
      return false
    }
  })
  const [viewMode, setViewMode] = useState(() => {
    try {
      const saved = localStorage.getItem('payrollViewMode')
      return saved || 'cards'
    } catch (error) {
      return 'cards'
    }
  })

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('payrollSteps', JSON.stringify(payrollSteps))
    } catch (error) {
      console.error('Error saving payrollSteps to localStorage:', error)
    }
  }, [payrollSteps])

  useEffect(() => {
    try {
      localStorage.setItem('checkedSteps', JSON.stringify(Array.from(checkedSteps)))
    } catch (error) {
      console.error('Error saving checkedSteps to localStorage:', error)
    }
  }, [checkedSteps])

  useEffect(() => {
    try {
      localStorage.setItem('selectedMonth', selectedMonth)
    } catch (error) {
      console.error('Error saving selectedMonth to localStorage:', error)
    }
  }, [selectedMonth])

  useEffect(() => {
    try {
      localStorage.setItem('incentiveReportVerified', String(incentiveReportVerified))
    } catch (error) {
      console.error('Error saving incentiveReportVerified to localStorage:', error)
    }
  }, [incentiveReportVerified])

  useEffect(() => {
    try {
      localStorage.setItem('payrollViewMode', viewMode)
    } catch (error) {
      console.error('Error saving viewMode to localStorage:', error)
    }
  }, [viewMode])

  // Calculate payroll health metrics
  const completedSteps = payrollSteps.filter((step) => step.status === 'completed').length
  const totalSteps = payrollSteps.length
  const completionPercentage = (completedSteps / totalSteps) * 100

  const payrollHealth = {
    overallStatus: completionPercentage === 100 ? 'healthy' : completionPercentage > 50 ? 'warning' : 'error',
    totalEmployees: 1245,
    processedEmployees: Math.floor(1245 * (completionPercentage / 100)),
    errorCount: payrollSteps.filter((step) => step.status === 'error').length,
    warningCount: payrollSteps.filter((step) => step.status === 'warning').length,
    completionPercentage: Math.round(completionPercentage * 10) / 10,
  }

  const handleCheckboxChange = (stepId) => {
    const step = payrollSteps.find((s) => s.id === stepId)
    if (!step || !isStepEnabled(step)) {
      return // Prevent checking if step is not enabled
    }
    
    const newChecked = new Set(checkedSteps)
    if (newChecked.has(stepId)) {
      newChecked.delete(stepId)
    } else {
      newChecked.add(stepId)
    }
    setCheckedSteps(newChecked)
  }

  const handleStartNewPayroll = () => {
    setModalType('confirm')
    setModalData({
      title: 'Start New Payroll',
      message: 'Are you sure you want to start a new payroll cycle? This will reset all steps.',
      onConfirm: () => {
        // Reset all steps
        const resetSteps = initialPayrollSteps.map((step) => ({ ...step, status: 'pending' }))
        setPayrollSteps(resetSteps)
        setCheckedSteps(new Set())
        setRunningSteps(new Set())
        setIncentiveReportVerified(false)
        // Clear localStorage
        try {
          localStorage.removeItem('payrollSteps')
          localStorage.removeItem('checkedSteps')
          localStorage.removeItem('incentiveReportVerified')
          localStorage.setItem('payrollSteps', JSON.stringify(resetSteps))
          localStorage.setItem('checkedSteps', JSON.stringify([]))
          localStorage.setItem('incentiveReportVerified', 'false')
        } catch (error) {
          console.error('Error clearing localStorage:', error)
        }
        setModalOpen(false)
        setModalType('success')
        setModalData({
          title: 'Success',
          message: 'New payroll cycle started. All steps have been reset.',
        })
        setModalOpen(true)
      },
    })
    setModalOpen(true)
  }

  const handleRunStep = async (step) => {
    if (runningSteps.has(step.id)) return
    
    // Check if step is enabled (previous steps completed)
    if (!isStepEnabled(step)) {
      setModalType('error')
      setModalData({
        title: 'Step Not Available',
        message: 'Please complete all previous steps before running this step.',
      })
      setModalOpen(true)
      return
    }

    // Show confirmation modal before running
    setModalType('confirm')
    setModalData({
      title: 'Confirm Run Step',
      message: `Are you sure you want to run "${step.title}"?`,
      onConfirm: async () => {
        setModalOpen(false)
        await executeRunStep(step)
      },
      onCancel: () => {
        setModalOpen(false)
      }
    })
    setModalOpen(true)
  }

  const executeRunStep = async (step) => {
    setRunningSteps((prev) => new Set(prev).add(step.id))
    
    // Update step status to running
    setPayrollSteps((prev) =>
      prev.map((s) => (s.id === step.id ? { ...s, status: 'running' } : s))
    )

    try {
      let result
      
      switch (step.id) {
        case 'incentive-calculation':
          // Only run if report has been verified
          if (!incentiveReportVerified) {
            setModalType('error')
            setModalData({
              title: 'Report Not Verified',
              message: 'Please verify the Incentive Calculation Report before running this step.',
            })
            setModalOpen(true)
            setRunningSteps((prev) => {
              const newSet = new Set(prev)
              newSet.delete(step.id)
              return newSet
            })
            setPayrollSteps((prev) =>
              prev.map((s) => (s.id === step.id ? { ...s, status: 'pending' } : s))
            )
            return
          }
          // Continue with normal run flow
          result = await mockPayrollApi.runIncentiveCalculation(step.month)
          break
        default:
          // For other steps, continue with normal flow
          break
      }
      
      // Handle other steps
      if (step.id !== 'incentive-calculation') {
        switch (step.id) {
          case 'performance-incentive':
            result = await mockPayrollApi.pushPerformanceIncentiveToGreytHR(step.month)
            break
          case 'lop-push':
            result = await mockPayrollApi.pushLOPToGreytHR(step.month)
            break
          case 'bank-transfer':
            result = await mockPayrollApi.runBankFileTransfer(step.month)
            break
          case 'salary-statement':
            result = await mockPayrollApi.generateSalaryStatement(step.month)
            break
          default:
            throw new Error('Unknown step')
        }
      }

      // Update step status to completed
      const lastRunTime = new Date().toLocaleString()
      setPayrollSteps((prev) =>
        prev.map((s) =>
          s.id === step.id
            ? {
                ...s,
                status: 'completed',
                lastRun: lastRunTime,
                metadata: {
                  ...s.metadata,
                  'Last Run': lastRunTime,
                  'Processed': `${payrollHealth.totalEmployees} employees`,
                },
              }
            : s
        )
      )

      setModalType('success')
      setModalData({
        title: 'Success',
        message: result.message || 'Step completed successfully',
      })
      setModalOpen(true)
    } catch (error) {
      // Update step status to error
      setPayrollSteps((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: 'error' } : s))
      )
      setModalType('error')
      setModalData({
        title: 'Error',
        message: error.message || 'An error occurred while processing the step',
      })
      setModalOpen(true)
    } finally {
      setRunningSteps((prev) => {
        const newSet = new Set(prev)
        newSet.delete(step.id)
        return newSet
      })
    }
  }

  // Handle navigation back from incentive report with verification
  useEffect(() => {
    if (location.state?.verified && location.state?.stepId === 'incentive-calculation') {
      // Mark report as verified - this enables the Run button
      setIncentiveReportVerified(true)
      setModalType('success')
      setModalData({
        title: 'Report Verified',
        message: 'Incentive Calculation Report has been verified. You can now run this step.',
      })
      setModalOpen(true)
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleOpenIncentiveReport = (step) => {
    navigate('/incentive-calculation-report', { 
      state: { 
        month: step.month,
        stepId: step.id,
        mode: step.status === 'completed' ? 'view' : 'verify'
      } 
    })
  }

  const handleSubmitStep = async (step) => {
    if (!checkedSteps.has(step.id)) {
      setModalType('error')
      setModalData({
        title: 'Validation Required',
        message: 'Please check the checkbox to confirm before submitting.',
      })
      setModalOpen(true)
      return
    }

    if (runningSteps.has(step.id)) return
    
    // Check if step is enabled (previous steps completed)
    if (!isStepEnabled(step)) {
      setModalType('error')
      setModalData({
        title: 'Step Not Available',
        message: 'Please complete all previous steps before submitting this step.',
      })
      setModalOpen(true)
      return
    }

    // Show confirmation modal before submitting
    setModalType('confirm')
    setModalData({
      title: 'Confirm Submit Step',
      message: `Are you sure you want to submit "${step.title}"?`,
      onConfirm: async () => {
        setModalOpen(false)
        await executeSubmitStep(step)
      },
      onCancel: () => {
        setModalOpen(false)
      }
    })
    setModalOpen(true)
  }

  const executeSubmitStep = async (step) => {
    setRunningSteps((prev) => new Set(prev).add(step.id))
    
    setPayrollSteps((prev) =>
      prev.map((s) => (s.id === step.id ? { ...s, status: 'running' } : s))
    )

    try {
      let result
      
      switch (step.id) {
        case 'incentive-validation':
          result = await mockPayrollApi.validateIncentiveFinalType(step.month, {})
          break
        case 'arrears-deductions':
          result = await mockPayrollApi.submitArrearsDeductions(step.month, {})
          break
        case 'leave-requests':
          result = await mockPayrollApi.submitLeaveRequestsReview(step.month, {})
          break
        default:
          throw new Error('Unknown step')
      }

      const lastRunTime = new Date().toLocaleString()
      setPayrollSteps((prev) =>
        prev.map((s) =>
          s.id === step.id
            ? {
                ...s,
                status: 'completed',
                lastRun: lastRunTime,
                metadata: {
                  ...s.metadata,
                  'Last Run': lastRunTime,
                  'Processed': `${payrollHealth.totalEmployees} employees`,
                },
              }
            : s
        )
      )

      setModalType('success')
      setModalData({
        title: 'Success',
        message: result.message || 'Step submitted successfully',
      })
      setModalOpen(true)
    } catch (error) {
      setPayrollSteps((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: 'error' } : s))
      )
      setModalType('error')
      setModalData({
        title: 'Error',
        message: error.message || 'An error occurred while submitting the step',
      })
      setModalOpen(true)
    } finally {
      setRunningSteps((prev) => {
        const newSet = new Set(prev)
        newSet.delete(step.id)
        return newSet
      })
    }
  }

  const handleViewReport = async (step) => {
    if (step.id === 'incentive-calculation') {
      try {
        const result = await mockPayrollApi.getIncentiveCalculationReport(step.month)
        setModalType('success')
        setModalData({
          title: 'Report Ready',
          message: result.message || 'Incentive Calculation Report is ready',
          reportUrl: result.reportUrl,
          onDownload: () => {
            if (result.reportUrl) {
              window.open(result.reportUrl, '_blank')
            }
            setModalOpen(false)
          },
        })
        setModalOpen(true)
      } catch (error) {
        setModalType('error')
        setModalData({
          title: 'Error',
          message: error.message || 'Error loading report',
        })
        setModalOpen(true)
      }
    }
  }

  const handleRerun = async (step) => {
    if (step.actionType === 'run') {
      await handleRunStep(step)
    } else {
      await handleSubmitStep(step)
    }
  }

  const handleViewLogs = async (step) => {
    setSelectedStepForModal(step)
    setModalType('logs')
    setModalData({ loading: true })
    setModalOpen(true)

    try {
      const result = await mockPayrollApi.getProcessLogs(step.id)
      setModalData({
        loading: false,
        logs: result.logs || [],
        step: step,
      })
    } catch (error) {
      setModalData({
        loading: false,
        error: error.message,
        step: step,
      })
    }
  }

  const getStepStatus = (step) => {
    if (runningSteps.has(step.id)) return 'running'
    return step.status
  }

  // Check if a step can be enabled (all previous steps must be completed successfully)
  const isStepEnabled = (step) => {
    const stepIndex = payrollSteps.findIndex((s) => s.id === step.id)
    
    // First step is always enabled
    if (stepIndex === 0) {
      return true
    }
    
    // Check if all previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      const previousStep = payrollSteps[i]
      if (previousStep.status !== 'completed') {
        return false
      }
    }
    
    return true
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Payroll Process Flow</h1>
          <p className={styles.subtitle}>Execute payroll processing steps sequentially</p>
        </div>
        <div className={styles.headerActions}>
          <select
            className={styles.monthSelector}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {(() => {
              const currentMonth = getCurrentMonth()
              const currentDate = new Date()
              const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ]
              // Generate current month and next 2 months
              const months = []
              for (let i = 0; i < 3; i++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
                months.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`)
              }
              return months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))
            })()}
          </select>
          <button className={styles.primaryButton} onClick={handleStartNewPayroll}>
            <Play size={20} />
            Start New Payroll
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KPICard
          title="Total Employees"
          value={payrollHealth.totalEmployees.toLocaleString()}
          subtitle="In current payroll cycle"
          icon={Users}
        />
        <KPICard
          title="Processed"
          value={payrollHealth.processedEmployees.toLocaleString()}
          subtitle={`${payrollHealth.completionPercentage}% complete`}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Completed Steps"
          value={`${completedSteps}/${totalSteps}`}
          subtitle="Payroll processes"
          icon={CheckCircle}
          variant={completionPercentage === 100 ? 'success' : 'default'}
        />
        <KPICard
          title="Errors"
          value={payrollHealth.errorCount}
          subtitle="Requires attention"
          icon={ErrorIcon}
          variant={payrollHealth.errorCount > 0 ? 'error' : 'default'}
        />
      </div>

      {/* Overall Health Status */}
      <Card className={styles.healthCard}>
        <div className={styles.healthHeader}>
          <h2 className={styles.healthTitle}>Payroll Health</h2>
          <StatusBadge
            status={payrollHealth.overallStatus === 'healthy' ? 'success' : payrollHealth.overallStatus === 'warning' ? 'warning' : 'error'}
            label={payrollHealth.overallStatus}
            size="lg"
          />
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${payrollHealth.completionPercentage}%` }}
          />
        </div>
        <p className={styles.progressText}>
          {payrollHealth.completionPercentage}% of payroll process completed
        </p>
      </Card>

      {/* Unified Payroll Process Steps Section */}
      <div className={styles.unifiedSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Payroll Process Steps</h2>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleButton} ${viewMode === 'table' ? styles.active : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <Table2 size={18} />
              <span>Table</span>
            </button>
            <button
              className={`${styles.toggleButton} ${viewMode === 'cards' ? styles.active : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card View"
            >
              <Grid3x3 size={18} />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <Card className={styles.processTableCard}>
            <div className={styles.processTable}>
          <div className={styles.tableRowHeader}>
            <div className={styles.colProcess}>Process</div>
            <div className={styles.colAction}>Action</div>
          </div>
          {payrollSteps.map((step) => {
            const isRunning = runningSteps.has(step.id)
            const isChecked = checkedSteps.has(step.id)
            const stepStatus = getStepStatus(step)
            const isEnabled = isStepEnabled(step)

            return (
              <div key={step.id} className={styles.tableRow}>
                <div className={styles.colProcess}>
                  <div className={styles.processContent}>
                    {step.hasCheckbox && (
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(step.id)}
                        disabled={!isEnabled || isRunning || step.status === 'completed'}
                      />
                    )}
                    <span className={`${styles.processTitle} ${!isEnabled ? styles.disabledText : ''}`}>{step.title}</span>
                    {step.hasInfoIcon && (
                      <button
                        className={styles.infoButton}
                        title="Click for more information"
                        onClick={() => {
                          setModalType('info')
                          setModalData({
                            title: 'Information',
                            message: `Information about ${step.title}`,
                          })
                          setModalOpen(true)
                        }}
                      >
                        <Info size={16} />
                      </button>
                    )}
                  </div>
                  {/* Show Incentive Calculation Report button for incentive-calculation step */}
                  {step.id === 'incentive-calculation' && isEnabled && step.status !== 'completed' && (
                    <button
                      className={styles.incentiveReportButton}
                      onClick={() => handleOpenIncentiveReport(step)}
                    >
                      <FileText size={14} />
                      Incentive Calculation Report
                    </button>
                  )}
                  {/* Show report link for completed steps */}
                  {step.hasReportLink && step.status === 'completed' && (
                    <button
                      className={styles.reportLink}
                      onClick={() => handleViewReport(step)}
                    >
                      <FileText size={14} />
                      {step.reportLinkText}
                    </button>
                  )}
                </div>
                <div className={styles.colAction}>
                  {/* For incentive-calculation: only show Run button if report is verified */}
                  {step.id === 'incentive-calculation' && !incentiveReportVerified && step.status !== 'completed' ? (
                    <span className={styles.waitingText}>Verify Report First</span>
                  ) : (
                    <button
                      className={`${styles.actionButton} ${
                        step.actionType === 'run' ? styles.runButton : styles.submitButton
                      } ${!isEnabled ? styles.disabledButton : ''}`}
                      onClick={() =>
                        step.actionType === 'run'
                          ? handleRunStep(step)
                          : handleSubmitStep(step)
                      }
                      disabled={
                        !isEnabled ||
                        isRunning ||
                        step.status === 'completed' ||
                        (step.actionType === 'submit' && !isChecked) ||
                        (step.id === 'incentive-calculation' && !incentiveReportVerified)
                      }
                      title={
                        !isEnabled 
                          ? 'Complete previous steps to enable this step' 
                          : step.id === 'incentive-calculation' && !incentiveReportVerified
                          ? 'Please verify the Incentive Calculation Report first'
                          : ''
                      }
                    >
                    {isRunning ? (
                      <>
                        <Clock size={16} className={styles.spinning} />
                        Processing...
                      </>
                    ) : step.status === 'completed' ? (
                      <>
                        <Check size={16} />
                        Completed
                      </>
                    ) : (
                      step.actionType === 'run' ? 'RUN' : 'Submit'
                    )}
                  </button>
                  )}
                  {step.status !== 'pending' && (
                    <StatusBadge
                      status={
                        stepStatus === 'completed'
                          ? 'success'
                          : stepStatus === 'error'
                          ? 'error'
                          : stepStatus === 'running'
                          ? 'pending'
                          : 'warning'
                      }
                      size="sm"
                    />
                  )}
                </div>
              </div>
            )
          })}
            </div>
          </Card>
        )}

        {/* Card View */}
        {viewMode === 'cards' && (
          <div className={styles.stepsGrid}>
        {payrollSteps.map((step, index) => {
          const stepStatus = getStepStatus(step)
          const isEnabled = isStepEnabled(step)
          const stepNumber = index + 1
          
          // Get icon for metadata
          const getMetadataIcon = (key) => {
            if (key.toLowerCase().includes('processed') || key.toLowerCase().includes('employees')) {
              return <UsersIcon size={14} />
            }
            if (key.toLowerCase().includes('error')) {
              return <AlertCircle size={14} />
            }
            if (key.toLowerCase().includes('last run') || key.toLowerCase().includes('run')) {
              return <Calendar size={14} />
            }
            if (key.toLowerCase().includes('processing month') || key.toLowerCase().includes('month')) {
              return <CalendarDays size={14} />
            }
            return null
          }
          
          // Combine metadata with Processing Month (show Processing Month first)
          const displayMetadata = {
            'Processing Month': step.month || 'N/A',
            ...step.metadata
          }
          
          return (
            <Card 
              key={step.id} 
              className={`${styles.stepCard} ${!isEnabled ? styles.disabledCard : ''}`}
              data-status={stepStatus}
            >
              {/* Step Number Badge */}
              <div className={styles.stepNumberBadge}>
                {stepNumber}
              </div>
              
              <div className={styles.stepCardHeader}>
                <div style={{ flex: 1 }}>
                  <h3 className={`${styles.stepCardTitle} ${!isEnabled ? styles.disabledText : ''}`}>{step.title}</h3>
                  <StatusBadge 
                    status={stepStatus === 'completed' ? 'success' : stepStatus === 'error' ? 'error' : stepStatus === 'running' ? 'pending' : 'pending'} 
                    size="sm"
                  />
                </div>
              </div>
              
              {step.description && (
                <p className={`${styles.stepCardDescription} ${!isEnabled ? styles.disabledText : ''}`}>{step.description}</p>
              )}
              
              {displayMetadata && (
                <div className={styles.stepCardMetadata}>
                  {Object.entries(displayMetadata).map(([key, value]) => (
                    <div key={key} className={styles.metadataRow}>
                      <span className={styles.metadataKey}>
                        {getMetadataIcon(key)}
                        {key}:
                      </span>
                      <span className={styles.metadataValue}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className={styles.cardActionRow}>
                {/* Checkbox */}
                {step.hasCheckbox && (
                  <label className={`${styles.cardCheckboxLabel} ${checkedSteps.has(step.id) ? styles.checked : ''} ${!isEnabled || stepStatus === 'running' || step.status === 'completed' ? styles.disabled : ''}`}>
                    <input
                      type="checkbox"
                      className={styles.cardCheckbox}
                      checked={checkedSteps.has(step.id)}
                      onChange={() => handleCheckboxChange(step.id)}
                      disabled={!isEnabled || stepStatus === 'running' || step.status === 'completed'}
                    />
                    <span className={styles.checkboxText}>Mark</span>
                  </label>
                )}

                {/* Primary Action Button */}
                {step.id === 'incentive-calculation' && !incentiveReportVerified && step.status !== 'completed' ? (
                  <span className={styles.waitingTextCard}>Verify Report First</span>
                ) : (
                  <button
                    className={`${styles.primaryActionButton} ${
                      step.actionType === 'run' ? styles.runButtonCard : styles.submitButtonCard
                    } ${!isEnabled ? styles.disabledButton : ''}`}
                    onClick={() =>
                      step.actionType === 'run'
                        ? handleRunStep(step)
                        : handleSubmitStep(step)
                    }
                    disabled={
                      !isEnabled ||
                      stepStatus === 'running' ||
                      step.status === 'completed' ||
                      (step.actionType === 'submit' && !checkedSteps.has(step.id)) ||
                      (step.id === 'incentive-calculation' && !incentiveReportVerified)
                    }
                    title={
                      !isEnabled 
                        ? 'Complete previous steps to enable this step' 
                        : step.id === 'incentive-calculation' && !incentiveReportVerified
                        ? 'Please verify the Incentive Calculation Report first'
                        : ''
                    }
                  >
                    {stepStatus === 'running' ? (
                      <>
                        <Clock size={16} className={styles.spinning} />
                        Processing...
                      </>
                    ) : step.status === 'completed' ? (
                      <>
                        <Check size={16} />
                        Completed
                      </>
                    ) : (
                      <>
                        {step.actionType === 'run' ? <Play size={16} /> : <Check size={16} />}
                        {step.actionType === 'run' ? 'Run' : 'Submit'}
                      </>
                    )}
                  </button>
                )}

                {/* Info Icon Button */}
                {step.hasInfoIcon && (
                  <button
                    className={styles.cardInfoButton}
                    title="Click for more information"
                    onClick={() => {
                      setModalType('info')
                      setModalData({
                        title: 'Information',
                        message: `Information about ${step.title}`,
                      })
                      setModalOpen(true)
                    }}
                  >
                    <Info size={16} />
                  </button>
                )}

                {/* Incentive Calculation Report Button */}
                {step.id === 'incentive-calculation' && isEnabled && step.status !== 'completed' && (
                  <button
                    className={styles.incentiveReportButtonCard}
                    onClick={() => handleOpenIncentiveReport(step)}
                  >
                    <FileText size={14} />
                    Report
                  </button>
                )}

                {/* Report Link for Completed Steps */}
                {step.hasReportLink && step.status === 'completed' && (
                  <button
                    className={styles.reportLinkCard}
                    onClick={() => handleViewReport(step)}
                  >
                    <FileText size={14} />
                    Report
                  </button>
                )}

                {/* View Logs Button */}
                <button
                  className={styles.secondaryActionButton}
                  onClick={() => handleViewLogs(step)}
                >
                  <Eye size={16} />
                  Logs
                </button>
              </div>
            </Card>
          )
        })}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setModalType(null)
          setModalData(null)
          setSelectedStepForModal(null)
        }}
        title={modalData?.title || 'Information'}
        size={modalType === 'logs' ? 'large' : 'medium'}
      >
        {modalType === 'confirm' && (
          <div className={styles.modalContentWrapper}>
            <p className={styles.modalMessage}>{modalData?.message}</p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalButtonSecondary}
                onClick={modalData?.onCancel || (() => setModalOpen(false))}
              >
                Cancel
              </button>
              <button
                className={styles.modalButtonPrimary}
                onClick={modalData?.onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {modalType === 'success' && (
          <div className={styles.modalContentWrapper}>
            <div className={styles.successIcon}>
              <CheckCircle size={48} color="var(--color-success)" />
            </div>
            <p className={styles.modalMessage}>{modalData?.message}</p>
            {modalData?.reportUrl && (
              <button
                className={styles.modalButtonPrimary}
                onClick={modalData?.onDownload || (() => window.open(modalData.reportUrl, '_blank'))}
              >
                <FileText size={18} />
                Download Report
              </button>
            )}
            <div className={styles.modalActions}>
              <button
                className={styles.modalButtonPrimary}
                onClick={() => setModalOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {modalType === 'error' && (
          <div className={styles.modalContentWrapper}>
            <div className={styles.errorIcon}>
              <ErrorIcon size={48} color="var(--color-error)" />
            </div>
            <p className={styles.modalMessage}>{modalData?.message}</p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalButtonPrimary}
                onClick={() => setModalOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {modalType === 'info' && (
          <div className={styles.modalContentWrapper}>
            <div className={styles.infoIcon}>
              <Info size={48} color="var(--color-info)" />
            </div>
            <p className={styles.modalMessage}>{modalData?.message}</p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalButtonPrimary}
                onClick={() => setModalOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {modalType === 'logs' && (
          <div className={styles.modalContentWrapper}>
            <h3 className={styles.logsTitle}>
              Logs for: {modalData?.step?.title || 'Process'}
            </h3>
            {modalData?.loading ? (
              <div className={styles.loadingState}>
                <Clock size={24} className={styles.spinning} />
                <p>Loading logs...</p>
              </div>
            ) : modalData?.error ? (
              <div className={styles.errorState}>
                <ErrorIcon size={24} />
                <p>{modalData.error}</p>
              </div>
            ) : (
              <div className={styles.logsContainer}>
                {modalData?.logs && modalData.logs.length > 0 ? (
                  modalData.logs.map((log, index) => (
                    <div key={index} className={styles.logEntry}>
                      <span className={styles.logTimestamp}>
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span className={`${styles.logLevel} ${styles[log.level]}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className={styles.logMessage}>{log.message}</span>
                    </div>
                  ))
                ) : (
                  <p className={styles.noLogs}>No logs available</p>
                )}
                <div className={styles.logMetadata}>
                  <div className={styles.metadataRow}>
                    <span className={styles.metadataKey}>Status:</span>
                    <StatusBadge
                      status={modalData?.step?.status === 'completed' ? 'success' : modalData?.step?.status === 'error' ? 'error' : 'pending'}
                      label={modalData?.step?.status || 'pending'}
                    />
                  </div>
                  <div className={styles.metadataRow}>
                    <span className={styles.metadataKey}>Last Run:</span>
                    <span className={styles.metadataValue}>
                      {modalData?.step?.metadata?.['Last Run'] || 'Not started'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.modalActions}>
              <button
                className={styles.modalButtonPrimary}
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PayrollProcess
