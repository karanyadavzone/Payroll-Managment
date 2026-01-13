import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import PayrollProcess from './pages/PayrollProcess/PayrollProcess'
import PayrollErrors from './pages/PayrollErrors/PayrollErrors'
import LossOfPay from './pages/LossOfPay/LossOfPay'
import SalaryComparison from './pages/SalaryComparison/SalaryComparison'
import IncentiveCalculationReport from './pages/IncentiveCalculationReport/IncentiveCalculationReport'

function App() {
  return (
    <Routes>
      <Route path="/incentive-calculation-report" element={<IncentiveCalculationReport />} />
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<PayrollProcess />} />
            <Route path="/payroll-process" element={<PayrollProcess />} />
            <Route path="/payroll-errors" element={<PayrollErrors />} />
            <Route path="/loss-of-pay" element={<LossOfPay />} />
            <Route path="/salary-comparison" element={<SalaryComparison />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default App

