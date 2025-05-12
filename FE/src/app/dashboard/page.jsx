import { DashboardHeader } from "../../components/dashboard-header"
import { DashboardSummary } from "../../components/dashboard-summary"
import { RecentTransactions } from "../../components/recent-transactions"
import { BudgetOverview } from "../../components/budget-overview"
import { SpendingByCategory } from "../../components/spending-by-category"
import {dashboardService} from '../../apis/dashboardApi'
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [summaryData,setsummaryData]=useState();
  const [recentTransactions,setrecentTransactions]=useState();

  const dashboard =async()=>{
    const res= await dashboardService.getAllDashboardData();
    setsummaryData(res?.data)
    setrecentTransactions(res?.data?.summary?.recentTransactions)
    console.log(res?.data?.summary?.recentTransactions,"res")
  }

  useEffect(()=>{
    dashboard()
  },[])

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-7xl space-y-6 px-4 ml-4">
        <DashboardHeader />
        <DashboardSummary summaryData={summaryData} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BudgetOverview />
          <SpendingByCategory />
        </div>
        <RecentTransactions recentTransactions={recentTransactions} />
      </div>
    </div>
  )
}
