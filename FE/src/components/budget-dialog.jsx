"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import Label  from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { budgetService } from "../apis/budgetService"
import { categoryService } from "../apis/categoryService"

export function BudgetDialog({ open, onOpenChange, budget, onBudgetUpdated }) {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: new Date().getMonth() + 1, // Current month (1-12)
    year: new Date().getFullYear() // Current year
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch categories when dialog opens
  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  // Reset form when dialog opens with budget data or as a new form
  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.categoryId || budget.category || "",
        amount: budget.budget || budget.amount || "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      })
    } else {
      setFormData({
        category: "",
        amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      })
    }
    setError("")
  }, [budget, open])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      // Only fetch expense categories for budgeting
      const result = await categoryService.getExpenseCategories()
      
      if (result.success) {
        setCategories(Array.isArray(result.data) ? result.data : 
                     (result.data.categories || []))
      } else {
        setError("Failed to load categories")
      }
    } catch (err) {
      setError("Error loading categories")
      console.error("Categories fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (!formData.category) {
        setError("Please select a category")
        setIsSubmitting(false)
        return
      }

      if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) < 0) {
        setError("Please enter a valid amount")
        setIsSubmitting(false)
        return
      }

      const result = await budgetService.setBudget(
        formData.month,
        formData.year,
        formData.category,
        parseFloat(formData.amount)
      )

      if (result.success) {
        // Notify parent component about the update
        onBudgetUpdated(result.data)
        onOpenChange(false)
      } else {
        setError(result.message || "Failed to save budget")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Budget form error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isSubmitting) onOpenChange(isOpen)
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{budget ? "Edit Budget" : "Set Budget"}</DialogTitle>
            <DialogDescription>
              {budget
                ? "Adjust your budget allocation for this category."
                : "Set a monthly budget for a specific category."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm font-medium text-red-500">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {isLoading ? (
                <div className="text-sm text-gray-500">Loading categories...</div>
              ) : (
                <Select 
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                  disabled={budget !== null} // Disable category selection when editing
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Budget Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}