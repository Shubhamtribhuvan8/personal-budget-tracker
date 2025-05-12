import { BudgetHeader } from "../../../components/budget-header"
import { BudgetManagement } from "../../../components/budget-management"
import { CategoryBudgets } from "../../../components/category-budgets"

export default function BudgetPage() {
  return (
    <div className="flex min-h-screen w-full p-6">
      <div className="w-full space-y-6 px-4">
      <BudgetHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BudgetManagement />
        <CategoryBudgets />
        </div>
      </div>
    </div>
  )
}
