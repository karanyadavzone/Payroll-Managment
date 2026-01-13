# Payroll Process Flow Guide

## Overview

The Payroll Process Flow screen now matches your PowerApps workflow with all 8 steps that need to be executed sequentially.

## Steps Included

1. **Incentive Final Type Validation for December**
   - Has checkbox (must be checked before submitting)
   - Submit button
   - Validates incentive final types

2. **Incentive Calculation Microsoft**
   - RUN button
   - Shows "Incentive Calculation Report" link after completion
   - Calculates incentives

3. **Performance Incentive Microsoft (Push to GreytHR)**
   - RUN button
   - Pushes performance incentives to GreytHR

4. **Arrears/Deductions (+/-) for January**
   - Has checkbox (must be checked before submitting)
   - Has info icon (click for details)
   - Submit button
   - Handles arrears and deductions

5. **Leave Requests reviewed on GreytHR for January**
   - Has checkbox (must be checked before submitting)
   - Submit button
   - Reviews leave requests

6. **LOP (Push to GreytHR)**
   - Has info icon (click for details)
   - RUN button
   - Pushes LOP data to GreytHR

7. **Bank File Transfer**
   - RUN button
   - Transfers bank files

8. **Salary Statement**
   - RUN button
   - Generates salary statements

## How to Use

### Starting a New Payroll

1. Select the month from the dropdown (top right)
2. Click "Start New Payroll" button
3. All steps will reset to pending status

### Executing Steps

#### For Steps with Checkboxes (Submit buttons):
1. Check the checkbox next to the process name
2. Click the "Submit" button
3. The step will process and show status

#### For Steps with RUN buttons:
1. Simply click the "RUN" button
2. The step will execute automatically
3. Status will update when complete

#### For Steps with Info Icons:
- Click the blue info icon (ⓘ) to see additional information about the step

#### For Report Links:
- After a step completes, if it has a report, a link will appear
- Click the link to view/download the report

## Status Indicators

- **Pending** (Grey): Step not yet executed
- **Running** (Blue): Step is currently processing
- **Completed** (Green): Step finished successfully
- **Error** (Red): Step failed (check logs)

## API Integration

### Current Setup

The app currently uses **mock API functions** for development. These simulate API calls with delays.

### Connecting to Real APIs

1. **Update API Base URL**

   Edit `src/services/payrollApi.js`:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api-domain.com/api'
   ```
   
   **Note**: Vite uses `import.meta.env` instead of `process.env`. Environment variables must be prefixed with `VITE_`.

2. **Replace Mock Functions**

   In `src/pages/PayrollProcess/PayrollProcess.jsx`, change:
   ```javascript
   import { mockPayrollApi } from '../../services/payrollApi'
   ```
   
   To:
   ```javascript
   import { payrollApi } from '../../services/payrollApi'
   ```

   Then replace all `mockPayrollApi` calls with `payrollApi`.

3. **API Endpoints Expected**

   The service expects these endpoints:
   - `POST /api/payroll/incentive/validate-final-type`
   - `POST /api/payroll/incentive/calculate`
   - `GET /api/payroll/incentive/report?month={month}`
   - `POST /api/payroll/incentive/push-greythr`
   - `POST /api/payroll/arrears-deductions`
   - `POST /api/payroll/leave-requests/review`
   - `POST /api/payroll/lop/push-greythr`
   - `POST /api/payroll/bank-file-transfer`
   - `POST /api/payroll/salary-statement`

4. **API Response Format**

   All APIs should return:
   ```json
   {
     "success": true,
     "message": "Operation completed successfully",
     "reportUrl": "/reports/report.pdf" // optional
   }
   ```

   On error:
   ```json
   {
     "success": false,
     "message": "Error description"
   }
   ```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

**Important**: In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client-side code. Access them using `import.meta.env.VITE_VARIABLE_NAME`.

## Features

✅ **Checkbox Validation**: Steps with checkboxes require confirmation before submission
✅ **Status Tracking**: Real-time status updates for each step
✅ **Progress Monitoring**: KPI cards show overall progress
✅ **Error Handling**: Failed steps show error status
✅ **Report Links**: Automatic report links after completion
✅ **Info Icons**: Clickable info icons for additional details
✅ **Month Selection**: Easy month switching
✅ **Responsive Design**: Works on all screen sizes

## Testing

To test the flow:

1. Start the dev server: `npm run dev`
2. Navigate to Payroll Process screen
3. Click "Start New Payroll"
4. Execute steps one by one
5. Watch status updates in real-time

## Customization

### Adding New Steps

Edit `src/pages/PayrollProcess/PayrollProcess.jsx`:

1. Add step to `initialPayrollSteps` array
2. Add corresponding API function in `payrollApi.js`
3. Add case in `handleRunStep` or `handleSubmitStep`

### Changing Step Order

Reorder items in the `initialPayrollSteps` array.

### Modifying Step Properties

Each step can have:
- `hasCheckbox`: true/false
- `hasInfoIcon`: true/false
- `hasReportLink`: true/false
- `actionType`: 'run' or 'submit'
- `month`: Month string

## Troubleshooting

**Steps not executing?**
- Check browser console for errors
- Verify API endpoints are correct
- Ensure network requests aren't blocked

**Status not updating?**
- Check if API is returning correct response format
- Verify error handling in catch blocks

**Checkboxes not working?**
- Ensure checkbox state is properly managed
- Check if step is disabled (completed/running)

