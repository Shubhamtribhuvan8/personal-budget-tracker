import { ReportsHeader } from "../../../components/reports-header"
import { IncomeVsExpenses } from "../../../components/income-vs-expenses"
import { ExpensesByCategory } from "../../../components/expenses-by-category"
import { MonthlyTrends } from "../../../components/monthly-trends"

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen w-full p-6">
      <div className="w-full space-y-6 px-4">
      <ReportsHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IncomeVsExpenses />
        <ExpensesByCategory />
      </div>
      <MonthlyTrends />
      </div>
    </div>
  )
}
