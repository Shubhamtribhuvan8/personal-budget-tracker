"use client"
export function BudgetHeader() {

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your monthly budget and track your spending</p>
      </div>
    </div>
  )
}
