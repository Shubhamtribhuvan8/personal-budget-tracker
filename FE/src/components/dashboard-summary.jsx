import { ArrowUpIcon, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function DashboardSummary(summaryData) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Income Card */}
      <Card className="overflow-hidden border-none transition-all duration-200 hover:shadow-md">
        <div className="absolute inset-0 from-emerald-50 to-transparent opacity-50 dark:from-emerald-950/30 dark:to-transparent pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div  style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} className="text-3xl font-bold tracking-tight text-center text-emerald-600 dark:text-emerald-400">
            ${summaryData?.summaryData?.summary?.summary.income.toLocaleString()}
          </div>
          <div className="mt-2 flex text-center items-center text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              12.5%
            </span>
            <span className="ml-1.5">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Card */}
      <Card className="overflow-hidden border-none transition-all duration-200 hover:shadow-md">
      <div className="absolute inset-0 from-emerald-50 to-transparent opacity-50 dark:from-emerald-950/30 dark:to-transparent pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
            <DollarSign className="h-4 w-4 text-rose-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            ${summaryData?.summaryData?.summary?.summary.expense.toLocaleString()}
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} className="text-center mt-2 flex items-center text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center rounded-full bg-rose-100 px-1.5 py-0.5 font-medium text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              8.2%
            </span>
            <span className="ml-1.5">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Balance Card */}
      <Card className="overflow-hidden border-none transition-all duration-200 hover:shadow-md">
      <div className="absolute inset-0 from-emerald-50 to-transparent opacity-50 dark:from-emerald-950/30 dark:to-transparent pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <DollarSign className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            ${summaryData?.summaryData?.summary?.summary.balance.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500 dark:text-slate-400" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              18.1%
            </span>
            <span className="ml-1.5">from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
