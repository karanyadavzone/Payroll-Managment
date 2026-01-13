// API service functions for payroll processing
// Replace these with your actual API endpoints

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Generic API call function
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Call Error:', error)
    throw error
  }
}

// Payroll Process APIs
export const payrollApi = {
  // 1. Incentive Final Type Validation
  async validateIncentiveFinalType(month, data) {
    return apiCall('/payroll/incentive/validate-final-type', 'POST', { month, ...data })
  },

  // 2. Incentive Calculation Microsoft
  async runIncentiveCalculation(month) {
    return apiCall('/payroll/incentive/calculate', 'POST', { month })
  },

  async getIncentiveCalculationReport(month) {
    return apiCall(`/payroll/incentive/report?month=${month}`, 'GET')
  },

  async getProcessLogs(processId) {
    return apiCall(`/payroll/process/${processId}/logs`, 'GET')
  },

  // 3. Performance Incentive Microsoft (Push to GreytHR)
  async pushPerformanceIncentiveToGreytHR(month) {
    return apiCall('/payroll/incentive/push-greythr', 'POST', { month })
  },

  // 4. Arrears/Deductions
  async submitArrearsDeductions(month, data) {
    return apiCall('/payroll/arrears-deductions', 'POST', { month, ...data })
  },

  // 5. Leave Requests Review
  async submitLeaveRequestsReview(month, data) {
    return apiCall('/payroll/leave-requests/review', 'POST', { month, ...data })
  },

  // 6. LOP (Push to GreytHR)
  async pushLOPToGreytHR(month) {
    return apiCall('/payroll/lop/push-greythr', 'POST', { month })
  },

  // 7. Bank File Transfer
  async runBankFileTransfer(month) {
    return apiCall('/payroll/bank-file-transfer', 'POST', { month })
  },

  // 8. Salary Statement
  async generateSalaryStatement(month) {
    return apiCall('/payroll/salary-statement', 'POST', { month })
  },

  // Get process status
  async getProcessStatus(processId) {
    return apiCall(`/payroll/process/${processId}/status`, 'GET')
  },

  // Get all processes for current payroll cycle
  async getPayrollProcesses(month) {
    return apiCall(`/payroll/processes?month=${month}`, 'GET')
  },
}

// Mock API functions for development (remove when connecting to real API)
export const mockPayrollApi = {
  async validateIncentiveFinalType(month, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Validation completed successfully' })
      }, 2000)
    })
  },

  async runIncentiveCalculation(month) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Incentive calculation completed', reportUrl: '/reports/incentive.pdf' })
      }, 3000)
    })
  },

  async pushPerformanceIncentiveToGreytHR(month) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Pushed to GreytHR successfully' })
      }, 2500)
    })
  },

  async submitArrearsDeductions(month, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Arrears/Deductions submitted' })
      }, 1500)
    })
  },

  async submitLeaveRequestsReview(month, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Leave requests review submitted' })
      }, 1500)
    })
  },

  async pushLOPToGreytHR(month) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'LOP pushed to GreytHR successfully' })
      }, 2000)
    })
  },

  async runBankFileTransfer(month) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Bank file transfer completed' })
      }, 3000)
    })
  },

  async generateSalaryStatement(month) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Salary statement generated', reportUrl: '/reports/salary-statement.pdf' })
      }, 2500)
    })
  },

  async getIncentiveCalculationReport(month) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, reportUrl: '/reports/incentive-calculation.pdf', message: 'Report generated successfully' })
      }, 1000)
    })
  },

  async getProcessLogs(processId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          logs: [
            { timestamp: new Date().toISOString(), level: 'info', message: 'Process started' },
            { timestamp: new Date().toISOString(), level: 'info', message: 'Validating data...' },
            { timestamp: new Date().toISOString(), level: 'success', message: 'Process completed successfully' },
          ],
        })
      }, 500)
    })
  },
}

