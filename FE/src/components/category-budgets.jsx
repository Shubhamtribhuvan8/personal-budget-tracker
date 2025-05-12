"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"
import { EditIcon, PlusCircleIcon, PlusIcon } from "lucide-react"
import { BudgetDialog } from "./budget-dialog"
import { budgetService } from "../apis/budgetService"
import { categoryService } from "../apis/categoryService"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"

export function CategoryBudgets() {
  const [budgets, setBudgets] = useState([])
  const [editBudget, setEditBudget] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [categoryMap, setCategoryMap] = useState({})
  const [budgetToDelete, setBudgetToDelete] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Fetch budgets and categories on initial load
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      // Get all categories first to build a mapping
      const categoriesResult = await categoryService.getCategories()
      
      if (categoriesResult.success) {
        const categories = Array.isArray(categoriesResult?.data?.categories) ? 
          categoriesResult?.data?.categories : (categoriesResult.data.categories || [])
        
        // Create a mapping of category IDs to category objects
        const catMap = {}
        categories.forEach(cat => {
          catMap[cat.id] = cat
        })
        setCategoryMap(catMap)
        
        // Now fetch budgets for the current month
        const budgetsResult = await budgetService.getCurrentMonthBudgets()
        console.log("budgetsResult",budgetsResult)
        
        if (budgetsResult.success) {
          const budgetsData = Array.isArray(budgetsResult?.data?.budgets) ? 
            budgetsResult?.data?.budgets : (budgetsResult?.data?.budgets || [])
          
          // Get transactions data (or use a default value of 0 if not available)
          // Enhance budget objects with category information
          const enhancedBudgets = budgetsData.map(budget => {
            const categoryInfo = catMap[budget.category] || { name: "Unknown", color: "#cccccc" }
            return {
              id: budget.id,
              categoryId: budget.category,
              category: categoryInfo.name,
              color: categoryInfo.color.startsWith('#') ? 
                `bg-[${categoryInfo.color}]` : 
                mapColorNameToTailwind(categoryInfo.color),
              budget: parseFloat(budget.amount),
              spent: parseFloat(budget.spent || 0)
            }
          })
          
          setBudgets(enhancedBudgets)
        } else {
          setError("Failed to load budgets")
        }
      } else {
        setError("Failed to load categories")
      }
    } catch (err) {
      setError("Error loading budget data")
      console.error("Budget data fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const mapColorNameToTailwind = (colorName) => {
    const colorMap = {
      "green": "bg-emerald-500",
      "blue": "bg-blue-500",
      "indigo": "bg-indigo-500",
      "purple": "bg-purple-500",
      "pink": "bg-pink-500",
      "red": "bg-red-500",
      "orange": "bg-orange-500",
      "yellow": "bg-yellow-500",
      "#10b981": "bg-emerald-500",
      "#3b82f6": "bg-blue-500",
      "#6366f1": "bg-indigo-500",
      "#8b5cf6": "bg-purple-500",
      "#ec4899": "bg-pink-500",
      "#f43f5e": "bg-red-500",
      "#f97316": "bg-orange-500",
      "#eab308": "bg-yellow-500",
      "#4CAF50": "bg-green-500",
    }
    return colorMap[colorName] || "bg-gray-500"
  }

  const handleEdit = (budget) => {
    setEditBudget(budget)
    setDialogOpen(true)
  }

  const handleDelete = (budget) => {
    setBudgetToDelete(budget)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!budgetToDelete) return

    try {
      const result = await budgetService.deleteBudget(budgetToDelete.id)
      
      if (result.success) {
        // Remove budget from the local state
        setBudgets(prev => prev.filter(b => b.id !== budgetToDelete.id))
      } else {
        setError(`Failed to delete: ${result.message}`)
      }
    } catch (err) {
      setError("Error during deletion")
      console.error("Delete error:", err)
    } finally {
      setDeleteDialogOpen(false)
      setBudgetToDelete(null)
    }
  }

  const handleAddBudget = () => {
    setEditBudget(null)
    setDialogOpen(true)
  }

  const handleBudgetUpdated = (updatedBudget) => {
    // Refresh the data to get the updated list
    fetchData()
  }

  return (
    <>
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Category Budgets</CardTitle>
            <CardDescription>Your budget allocation by category</CardDescription>
          </div>
          <Button onClick={handleAddBudget} className="ml-auto" style={{ backgroundColor: 'gray', border: '1px solid blue' }}>
          <PlusIcon className="h-4 w-4" />
            Add Budget
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8 text-gray-500">Loading budgets...</div>
            ) : budgets.length > 0 ? (
              budgets.map((item) => {
                const percentage = Math.round((item.spent / item.budget) * 100)
                const isOverBudget = item.spent > item.budget

                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium">{item.category}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(item)}>
                          <EditIcon className="h-3 w-3" />
                          <span className="sr-only">Edit {item.category} budget</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleDelete(item)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          <span className="sr-only">Delete {item.category} budget</span>
                        </Button>
                      </div>
                    </div>
                    <Progress
                      value={percentage > 100 ? 100 : percentage}
                      className={`h-2 ${isOverBudget ? "bg-rose-200 dark:bg-rose-950" : ""}`}
                      indicatorClassName={isOverBudget ? "bg-rose-500" : item.color}
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">${item.spent.toLocaleString()} spent</span>
                      <span className={`font-medium ${isOverBudget ? "text-rose-500" : ""}`}>
                        {isOverBudget
                          ? `$${(item.spent - item.budget).toLocaleString()} over budget`
                          : `$${(item.budget - item.spent).toLocaleString()} remaining`}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <p className="mb-4">No budgets set for this month</p>
                <Button variant="outline" onClick={handleAddBudget}>
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Set your first budget
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Budget Add/Edit Dialog */}
      <BudgetDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        budget={editBudget}
        onBudgetUpdated={handleBudgetUpdated}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the budget for "{budgetToDelete?.category}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}