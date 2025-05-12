"use client"

// import { useState } from "react"
// import { Button } from "./ui/button"
// import { PlusIcon } from "lucide-react"
// import { TransactionDialog } from "../components/transaction-dialog"

export function TransactionsHeader() {
  // const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage and track all your financial transactions</p>
      </div>
      {/* <Button onClick={() => setOpen(true)} className="gap-1">
        <PlusIcon className="h-4 w-4" />
        Add Transaction
      </Button> */}
      {/* <TransactionDialog open={open} onOpenChange={setOpen} /> */}
    </div>
  )
}
