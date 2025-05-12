"use client"

// import { useState } from "react"

export function CategoriesHeader() {
  // const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your income and expense categories</p>
      </div>
      {/* <Button onClick={() => setOpen(true)} className="gap-1">
        <PlusIcon className="h-4 w-4" />
        Add Category
      </Button> */}
      {/* <CategoryDialog open={open} onOpenChange={setOpen} /> */}
    </div>
  )
}
