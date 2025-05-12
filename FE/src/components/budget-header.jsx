"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { PlusIcon } from "lucide-react"
import { BudgetDialog } from "./budget-dialog"

export function BudgetHeader() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your monthly budget and track your spending</p>
      </div>
      {/* <Button onClick={() => setOpen(true)} className="gap-1">
        <PlusIcon className="h-4 w-4" />
        Set Budget
      </Button>
      <BudgetDialog open={open} onOpenChange={setOpen} /> */}
    </div>
  )
}
