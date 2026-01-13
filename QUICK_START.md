# Quick Start Guide

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## Project Structure Overview

```
payroll/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Card/           # Base card component
│   │   ├── KPICard/        # Metric/KPI display cards
│   │   ├── StatusBadge/    # Status indicators
│   │   ├── Stepper/        # Process flow stepper
│   │   ├── DataTable/      # Advanced data table
│   │   ├── Drawer/         # Side drawer panel
│   │   └── Layout/         # Main app layout
│   ├── pages/              # Screen components
│   │   ├── PayrollProcess/  # Payroll process flow
│   │   ├── PayrollErrors/  # Error management
│   │   ├── LossOfPay/      # LOP tracking
│   │   └── SalaryComparison/ # Salary comparison
│   ├── styles/
│   │   └── global.css      # Global styles & variables
│   ├── App.jsx             # Main app with routes
│   └── main.jsx            # Entry point
└── package.json
```

## Key Features Implemented

### ✅ Payroll Process Flow
- Visual stepper with 5 stages
- Real-time status indicators
- KPI cards (Total Employees, Processed, Errors, Warnings)
- Progress bar showing completion percentage
- Step cards with metadata and actions

### ✅ Payroll Errors
- Error category cards (Validation, Calculation, Deduction, Approval)
- Severity-based color coding
- Advanced filtering (Month, Error Type, Status)
- Detailed error table with search
- Drawer for error details

### ✅ Loss of Pay
- Summary KPI cards
- Department and month filtering
- Comprehensive LOP table
- Employee detail drawer
- Status management (Active/Inactive)

### ✅ Salary Comparison
- Period comparison selector
- Summary metrics (Increases, Decreases, Net Difference)
- Comparison table with trend indicators
- Expandable rows for salary breakdown
- Component-wise analysis (Basic, HRA, Allowances, Deductions, Net)

## Component Usage Examples

### Using KPICard
```jsx
import KPICard from '../../components/KPICard/KPICard'
import { People } from '@mui/icons-material'

<KPICard
  title="Total Employees"
  value="1,245"
  subtitle="In current cycle"
  icon={People}
  trend="up"
  trendValue="+5.2%"
  variant="success"
/>
```

### Using DataTable
```jsx
import DataTable from '../../components/DataTable/DataTable'

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
]

<DataTable
  data={employees}
  columns={columns}
  searchable={true}
  filterable={true}
  exportable={true}
/>
```

### Using StatusBadge
```jsx
import StatusBadge from '../../components/StatusBadge/StatusBadge'

<StatusBadge status="success" label="Completed" size="md" />
<StatusBadge status="error" label="Failed" />
<StatusBadge status="warning" label="Pending" />
```

### Using Drawer
```jsx
import Drawer from '../../components/Drawer/Drawer'

<Drawer
  isOpen={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  title="Employee Details"
  width="500px"
>
  {/* Drawer content */}
</Drawer>
```

## Styling Guide

### CSS Variables
All colors, spacing, and typography use CSS variables defined in `src/styles/global.css`:

```css
--color-primary: #2563eb;
--color-success: #10b981;
--spacing-md: 1rem;
--font-size-base: 1rem;
```

### CSS Modules
Each component has its own CSS module:
```jsx
import styles from './Component.module.css'

<div className={styles.container}>
```

## Next Steps

1. **Replace Mock Data**
   - Connect to your backend API
   - Replace mock arrays with API calls
   - Add loading states

2. **Add Authentication**
   - Implement login flow
   - Add protected routes
   - Role-based access control

3. **Enhance Features**
   - Add export functionality (PDF, Excel)
   - Implement real-time updates
   - Add data visualization charts

4. **Testing**
   - Add unit tests
   - Integration tests
   - E2E tests

5. **Deployment**
   - Configure build settings
   - Set up CI/CD
   - Deploy to hosting platform

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styling Issues
- Check CSS module imports
- Verify CSS variable names
- Ensure global.css is imported in main.jsx

## Support

For questions or issues:
1. Check ARCHITECTURE.md for design decisions
2. Review component source code
3. Check README.md for detailed documentation

